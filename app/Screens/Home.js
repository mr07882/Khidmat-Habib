import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  LogBox,
  StyleSheet,
  FlatList,
  Dimensions
} from 'react-native';
import {connect, useDispatch} from 'react-redux';
import * as Components from '../Components';
import {text, colors} from '../Config/AppConfigData';
import * as Icn from '../Helpers/icons';
import database from '@react-native-firebase/database';
import messaging from '@react-native-firebase/messaging';
import {Text} from '../Components/core';
import {updateDonationCart} from '../Redux/actions/donationAction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

const FAMILY_STORAGE_KEY = 'family_jcics';

function Home(props) {
  const [year, setYear] = useState('');
  const [jcicList, setJcicList] = useState([]);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  LogBox.ignoreAllLogs();

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
          console.log(
            'Notification caused app to open from quit state:' + data,
          );
          if (data.id && data.type) {
            props.navigation.navigate(data.type, {id: data.id});
          }
        }
      });
  };

  // Fetch all JCICs (own + family)
  useEffect(() => {
    const fetchJcics = async () => {
      let arr = [];
      const userJCIC = props.userId;
      if (userJCIC) arr.push(userJCIC);
      try {
        const stored = await AsyncStorage.getItem(FAMILY_STORAGE_KEY);
        if (stored) {
          const famArr = JSON.parse(stored);
          famArr.forEach(j => { if (j && !arr.includes(j)) arr.push(j); });
        }
      } catch {}
      setJcicList(arr);
    };
    fetchJcics();
  }, [props.userId, isFocused]);

  useEffect(() => {
    messageOpenOnKillMode();
    getYearFromDB();
    dispatch(updateDonationCart([]));
  }, []);

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
                contentContainerStyle={{ paddingVertical: 10 }}
                renderItem={({ item }) => (
                  <View style={{ width: Dimensions.get('window').width, alignItems: 'center', justifyContent: 'center' }}>
                    <Components.MembershipCard userId={item} />
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
