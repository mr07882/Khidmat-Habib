import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  LogBox,
  StyleSheet,
  FlatList,
  Dimensions,
  Alert
} from 'react-native';
import {connect, useDispatch} from 'react-redux';
import {useRoute} from '@react-navigation/native';
import * as Components from '../Components';
import {text, colors} from '../Config/AppConfigData';
import * as Icn from '../Helpers/icons';
import database from '@react-native-firebase/database';
import messaging from '@react-native-firebase/messaging';
import {Text} from '../Components/core';
import {updateDonationCart} from '../Redux/actions/donationAction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import { syncMembershipCards, getFamilyMembers, getMemberDetails } from '../Functions/Functions';
import { API_URL } from '../config';

const FAMILY_STORAGE_KEY = 'family_jcics';

function Home(props) {
  const [year, setYear] = useState('');
  const [jcicList, setJcicList] = useState([]);
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [localUserId, setLocalUserId] = useState(null); // fallback JCIC
  const [jcicLoading, setJcicLoading] = useState(true); // loading state for JCIC
  const [removalMode, setRemovalMode] = useState({}); // { [jcic]: true }
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const route = useRoute();
  LogBox.ignoreAllLogs();

  // Get userId from Redux state, route params, or local fallback
  const userId = props.userId || route.params?.JCIC || localUserId;

  // On mount, if userId is missing, try to get JCIC from AsyncStorage and set in Redux
  useEffect(() => {
    const ensureJCIC = async () => {
      setJcicLoading(true);
      const storedJCIC = await AsyncStorage.getItem('JCIC');
      if (!props.userId && storedJCIC) {
        setLocalUserId(storedJCIC);
        dispatch({ type: 'SET_USER_ID', userId: storedJCIC });
        loadJcics(storedJCIC);
      }
      setJcicLoading(false);
    };
    ensureJCIC();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.userId]);

  const getYearFromDB = () => {
    try {
      database()
        .ref(`year`)
        .once('value', x => {
          let data = x.val();
          setYear(data);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const messageOpenOnKillMode = () => {
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          const {data} = remoteMessage;
          if (data.id && data.type) {
            props.navigation.navigate(data.type, {id: data.id});
          }
        }
      });
  };

  // Sync membership cards when online
  const syncCards = async () => {
    if (!userId || !isOnline) return;
    
    setIsSyncing(true);
    try {
      const success = await syncMembershipCards(userId);
      if (success) {
        loadJcics();
      }
    } catch (e) {
      console.log('Error syncing cards:', e);
    } finally {
      setIsSyncing(false);
    }
  };

  // Modified loadJcics to always add userJCIC if present
  const loadJcics = async (overrideJCIC) => {
    const userJCIC = overrideJCIC || userId;
    let arr = [];
    if (userJCIC) {
      arr = [userJCIC];
      setJcicList(arr);
    }
    try {
      const stored = await AsyncStorage.getItem(FAMILY_STORAGE_KEY);
      if (stored) {
        const famArr = JSON.parse(stored);
        famArr.forEach(j => { 
          if (j && !arr.includes(j)) arr.push(j); 
        });
      }
      if (isOnline && userJCIC) {
        try {
          const familyMembers = await getFamilyMembers(userJCIC);
          const freshJcics = familyMembers.map(m => String(m.jcic)).filter(j => j);
          await AsyncStorage.setItem(FAMILY_STORAGE_KEY, JSON.stringify(freshJcics));
          for (const jcic of freshJcics) {
            await cacheFamilyMemberData(jcic);
          }
          arr = [userJCIC, ...freshJcics];
        } catch (dbError) {
          // ignore
        }
      }
    } catch (e) {
      // ignore
    }
    if (userJCIC && !arr.includes(userJCIC)) {
      arr.push(userJCIC);
    }
    setJcicList(arr);
  };

  // Cache family member data for each family JCIC
  const cacheFamilyMemberData = async (familyJCIC) => {
    try {
      // Get family member data from database
      const familyData = await getMemberDetails(familyJCIC);
      if (familyData) {
        await AsyncStorage.setItem(`membership_card_${familyJCIC}`, JSON.stringify(familyData));
        return true;
      } else {
        return false;
      }
    } catch (error) {
      // Silently ignore errors, do not log
      return false;
    }
  };

  // Cache all family member data
  const cacheAllFamilyMembers = async () => {
    try {
      const stored = await AsyncStorage.getItem('family_jcics');
      if (stored) {
        const familyJCICs = JSON.parse(stored);
        
        for (const jcic of familyJCICs) {
          await cacheFamilyMemberData(jcic);
        }
        
        // Reload JCICs to pick up newly cached data
        await loadJcics();
      }
    } catch (error) {
      console.log('Error caching all family members', error);
    }
  };

  // Remove family member handler (with confirmation)
  const confirmAndRemoveFamilyMember = (familyJCIC) => {
    Alert.alert(
      'Remove Family Member',
      'Are you sure you want to remove this family member? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel', onPress: () => setRemovalMode(prev => ({ ...prev, [familyJCIC]: false })) },
        { text: 'Remove', style: 'destructive', onPress: () => handleRemoveFamilyMember(familyJCIC) },
      ]
    );
  };

  // Remove family member handler
  const handleRemoveFamilyMember = async (familyJCIC) => {
    // Remove from AsyncStorage
    try {
      const stored = await AsyncStorage.getItem(FAMILY_STORAGE_KEY);
      let arr = stored ? JSON.parse(stored) : [];
      arr = arr.filter(j => j !== familyJCIC);
      await AsyncStorage.setItem(FAMILY_STORAGE_KEY, JSON.stringify(arr));
      await AsyncStorage.removeItem(`membership_card_${familyJCIC}`);
    } catch (e) {}
    // Remove from backend
    try {
      await fetch(`${API_URL}/family/${userId}/remove/${familyJCIC}`, { method: 'DELETE' });
    } catch (e) {}
    // Refresh list
    loadJcics();
    setRemovalMode(prev => ({ ...prev, [familyJCIC]: false }));
  };

  // Monitor network connectivity
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const wasOnline = isOnline;
      const nowOnline = state.isConnected;
      setIsOnline(nowOnline);
      
      // If just came online, sync cards
      if (!wasOnline && nowOnline && userId) {
        syncCards();
      }
      
      // Always reload JCICs when network state changes
      loadJcics();
    });
    
    // Initial network check and load
    NetInfo.fetch().then(state => {
      setIsOnline(state.isConnected);
      if (state.isConnected && userId) {
        syncCards();
      }
      // Always load JCICs regardless of network state
      loadJcics();
    });
    
    return () => unsubscribe && unsubscribe();
  }, [userId]);

  // Only load cards when userId is available
  useEffect(() => {
    if (userId) {
      loadJcics();
    }
  }, [userId, isFocused, isOnline]);

  useEffect(() => {
    messageOpenOnKillMode();
    getYearFromDB();
    dispatch(updateDonationCart([]));
  }, []);

  // In the render, show loading indicator if JCIC is loading or not available
  if (jcicLoading || !userId) {
    return (
      <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#fff'}}>
        {/* No debug messages, just a clean loading state */}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Settings Icon */}
      {!!props.allFlags && !!props.allFlags.settingsFlag && (
        <TouchableOpacity
          onPress={() => props.navigation.navigate('Settings')}
          style={{position: 'absolute', top: 8, right: 15, zIndex: 500}}>
          <Icn.SettingsIcn />
        </TouchableOpacity>
      )}
      {/* Profile Icon */}
      <TouchableOpacity
        onPress={() => props.navigation.navigate('Profile')}
        style={{position: 'absolute', top: 8, left: 15, zIndex: 500}}>
        <Icn.ProfileIcn/>
      </TouchableOpacity>
      
      <View style={styles.container}>
        <Components.HomePopUp navigateProp={props.navigation} />
        {!!props.allFlags && !!props.allFlags.logoFlag && (
          <Components.Logoline />
        )}
        <SafeAreaView style={styles.mainscreen}>
          <ScrollView>
            {!!props.allFlags && !!props.allFlags.mainPageBannerFlag && (
              // One-card-per-swipe carousel using FlatList
              <FlatList
                data={jcicList}
                keyExtractor={item => String(item)}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                snapToAlignment="center"
                contentContainerStyle={{ 
                  paddingVertical: 10,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                style={{ width: '100%' }}
                renderItem={({ item }) => {
                  const isFamilyMember = item !== userId;
                  return (
                    <View style={{ 
                      width: Dimensions.get('window').width, 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      paddingHorizontal: 10
                    }}>
                      <Components.MembershipCard 
                        userId={item} 
                        isFamilyMember={isFamilyMember} 
                        removalMode={removalMode[item]} 
                        onLongPress={() => setRemovalMode({ [item]: true })} 
                        onRemoveCrossPress={() => confirmAndRemoveFamilyMember(item)} 
                      />
                    </View>
                  );
                }}
                ListEmptyComponent={() => (
                  <View style={{ 
                    width: Dimensions.get('window').width, 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    paddingHorizontal: 10
                  }}>
                    <Text style={{color: '#666', textAlign: 'center'}}>
                      No membership cards available. JCIC List: {jcicList.length}
                    </Text>
                  </View>
                )}
              />
            )}
            <Components.Buttons
              navigateProp={props.navigation}
              flags={props.allFlags}
              extraBtns={props.extraBtns}
              donation={props.donation}
              telethon={props.buttonStyles?.telethon}
              quiz={props.buttonStyles?.quiz}
            />
            <Text style={styles.footerTxt}>
              {'© ' + year + text.mainFooterText}
            </Text>
          </ScrollView>
        </SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondryColor,
    paddingTop: 5,
  },
  mainscreen: {
    zIndex: -1,
    elevation: 5,
    backgroundColor: colors.primaryColor,
    marginTop: -35,
    flex: 1,
    borderRadius: 10,
    margin: 10,
    padding: 5,
    paddingTop: 40,
    paddingBottom: 10,
    marginBottom: 5,
  },
  footerTxt: {
    color: colors.secondryColor,
    fontSize: 12,
    textAlign: 'center',
    padding: 15,
  },
});

const mapStateToProps = state => {
  return {
    mainPageBanners: state.reducer.mainPageBanners,
    allFlags: state.reducer.allFlags,
    extraBtns: state.reducer.extraBtns,
    donation: state.reducer.donation,
    buttonStyles: state.reducer.telethonButton,
    userId: state.reducer.userId, // Add userId from reducer (ensure this is set in your auth flow)
  };
};
export default connect(mapStateToProps)(Home);
