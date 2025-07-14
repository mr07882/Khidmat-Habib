import React, {useEffect, useState} from 'react';
import {View, useWindowDimensions, TouchableOpacity, Modal, TextInput, Alert, StyleSheet} from 'react-native';
import database from '@react-native-firebase/database';
import ToggleSwitch from 'toggle-switch-react-native';
import Loader from '../Components/Loader';
import {
  notificationPermission,
  subscribeTopic,
  topic,
  unSubscribeTopic,
} from '../../FCM';
import {Text} from '../Components/core';
import {isNotNullOrEmpty, Storage} from '../Functions/Functions';
import {settingStyles} from '../Styles';
import {colors} from '../Config/AppConfigData';
import switches from '../../FCM/switch.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import { API_URL } from '../config';
import {logoutUser} from '../Functions/Functions';
import {setUserId} from '../Redux/actions/authAction';
import { useDispatch } from 'react-redux';

const FAMILY_STORAGE_KEY = 'family_jcics';

const Settings = () => {
  const [topicData, setTopicData] = useState({});
  const [topicKey, setTopicKey] = useState('');
  const [permission, setPermissions] = useState(true);
  const [loading, setLoading] = useState(true);
  const {width} = useWindowDimensions();
  const toggleStyle = {...settingStyles.toggle, width: width - 40};
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [familyModalVisible, setFamilyModalVisible] = useState(false);
  const [familyJCICInput, setFamilyJCICInput] = useState('');
  const [familyOtp, setFamilyOtp] = useState('');
  const [pendingFamilyJCIC, setPendingFamilyJCIC] = useState('');
  const [familyApiError, setFamilyApiError] = useState('');
  const [familyOtpError, setFamilyOtpError] = useState('');
  const [isFamilyLoading, setIsFamilyLoading] = useState(false);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [isLoadingFamilyMembers, setIsLoadingFamilyMembers] = useState(false);
  const [familyOtpModal, setFamilyOtpModal] = useState(false);

  const [userJCIC, setUserJCIC] = useState('');
  useEffect(() => {
    AsyncStorage.getItem('JCIC').then(jcic => setUserJCIC(jcic || ''));
  }, []);

  // Load family members on component mount
  useEffect(() => {
    loadFamilyMembers();
  }, []);

  const loadFamilyMembers = async () => {
    setIsLoadingFamilyMembers(true);
    try {
      const res = await fetch(`${API_URL}/family/${userJCIC}`);
      if (res.ok) {
        const data = await res.json();
        setFamilyMembers(data.familyMembers || []);
      }
    } catch (e) {
      console.log('Error loading family members:', e);
    } finally {
      setIsLoadingFamilyMembers(false);
    }
  };

  const removeFamilyMember = async (familyJCIC) => {
    try {
      const res = await fetch(`${API_URL}/family/${userJCIC}/remove/${familyJCIC}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (res.ok) {
        // Remove from local storage
        let stored = await AsyncStorage.getItem(FAMILY_STORAGE_KEY);
        let arr = stored ? JSON.parse(stored) : [];
        arr = arr.filter(j => j !== familyJCIC);
        await AsyncStorage.setItem(FAMILY_STORAGE_KEY, JSON.stringify(arr));
        
        // Reload family members
        await loadFamilyMembers();
        Alert.alert('Success', 'Family member removed successfully');
      } else {
        const data = await res.json();
        Alert.alert('Error', data.error || 'Failed to remove family member');
      }
    } catch (e) {
      Alert.alert('Error', 'Network error');
    }
  };

  const getTopics = async key => {
    try {
      await database()
        .ref('/topicSubscriptions/' + key)
        .on('value', snapshot => {
          setTopicData(snapshot.val());
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
      alert('An Error has occurred, please try again');
    }
  };

  const checkNotificationPermission = async () => {
    const response = await notificationPermission();
    if (response === 'granted') {
      await topic();
      getTopicKey();
    } else {
      setPermissions(false);
      setLoading(false);
    }
  };

  const getTopicKey = async () => {
    const key = await Storage.getData('topic-key', false);

    if (isNotNullOrEmpty(key)) {
      setTopicKey(key);
      getTopics(key);
    } else {
      checkNotificationPermission();
    }
  };

  useEffect(() => {
    getTopicKey();
  }, []);

  const updateDatabase = async obj => {
    try {
      await database()
        .ref('/topicSubscriptions/' + topicKey)
        .update(obj)
        .then(() => console.log('Database updated'));
    } catch (error) {
      console.log(error);
      alert('An Error has occurred while updating the subscription');
    }
  };

  const getTopicName = type => {
    switch (type) {
      case 'events':
        return 'Events';
      case 'deathNews':
        return 'Death_News';
      case 'deathAnniversaries':
        return 'Death_Anniversaries';
      default:
        return '';
    }
  };

  const changeSubcription = async (type, subscription) => {
    let obj = {
      ...topicData,
      [type]: subscription,
    };
    setTopicData(obj);

    if (subscription) {
      await subscribeTopic(getTopicName(type));
    } else {
      await unSubscribeTopic(getTopicName(type));
    }

    if (obj.deathNews && obj.events && obj.deathAnniversaries) {
      obj.all = true;
      await subscribeTopic('All');
    } else {
      if (obj.all) {
        obj.all = false;
        await unSubscribeTopic('All');
      }
    }

    await updateDatabase(obj);
  };

  const subscribeTesting = async (type, subscription) => {
    let obj = {
      ...topicData,
      [type]: subscription,
    };
    setTopicData(obj);

    if (subscription) {
      await subscribeTopic('testing');
    } else {
      await unSubscribeTopic('testing');
    }
    await updateDatabase(obj);
  };

  const handleLogout = async () => {
    try {
      // Clear user data from storage
      await logoutUser();
      
      // Clear Redux state
      dispatch(setUserId(null));
      
      // Navigate to login
      navigation.replace('Login');
    } catch (error) {
      console.log('Error during logout:', error);
      // Still navigate to login even if there's an error
      navigation.replace('Login');
    }
  };

  const handleAddFamilyMember = async () => {
    setFamilyApiError('');
    if (!familyJCICInput) {
      setFamilyApiError('Please enter JCIC number');
      return;
    }

    // Check if already added (local check)
    try {
      const stored = await AsyncStorage.getItem(FAMILY_STORAGE_KEY);
      let arr = stored ? JSON.parse(stored) : [];
      if (arr.includes(familyJCICInput)) {
        setFamilyApiError('Family member already added');
        return;
      }
    } catch (e) {
      // ignore
    }

    setIsFamilyLoading(true);
    try {
      // First verify the family member exists
      const verifyRes = await fetch(API_URL + '/family/add/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userJCIC, familyJCIC: familyJCICInput }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok || !verifyData.success) {
        setFamilyApiError(verifyData.error || 'Member Not In Relationship');
        setIsFamilyLoading(false);
        return;
      }

      setPendingFamilyJCIC(familyJCICInput);
      setFamilyModalVisible(false);
      setFamilyOtpModal(true);
      setIsFamilyLoading(false);
    } catch (e) {
      setFamilyApiError('Network error');
      setIsFamilyLoading(false);
    }
  };

  const handleVerifyFamilyOtp = async () => {
    setFamilyOtpError('');
    if (!familyOtp) {
      setFamilyOtpError('Please enter OTP');
      return;
    }
    setIsFamilyLoading(true);
    try {
      // Verify OTP
      const verifyRes = await fetch(API_URL + '/family/add/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ familyJCIC: pendingFamilyJCIC, otp: familyOtp }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok || !verifyData.success) {
        setFamilyOtpError(verifyData.error || 'Incorrect otp');
        setIsFamilyLoading(false);
        return;
      }
      
      // Add to database
      const addRes = await fetch(`${API_URL}/family/${userJCIC}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ familyJCIC: pendingFamilyJCIC }),
      });
      const addData = await addRes.json();
      if (!addRes.ok) {
        setFamilyOtpError(addData.error || 'Failed to add family member');
        setIsFamilyLoading(false);
        return;
      }
      
      // Update local storage for offline support
      let stored = await AsyncStorage.getItem(FAMILY_STORAGE_KEY);
      let arr = stored ? JSON.parse(stored) : [];
      if (!arr.includes(pendingFamilyJCIC)) arr.push(pendingFamilyJCIC);
      await AsyncStorage.setItem(FAMILY_STORAGE_KEY, JSON.stringify(arr));
      
      setFamilyOtpModal(false);
      setFamilyOtp('');
      setFamilyJCICInput('');
      setPendingFamilyJCIC('');
      Alert.alert('Family member added!');
      setIsFamilyLoading(false);
      
      // Reload family members
      await loadFamilyMembers();
    } catch (e) {
      setFamilyOtpError('Network error');
      setIsFamilyLoading(false);
    }
  };

  if (loading) {
    return <Loader bgColor="#F2F2F2" />;
  }

  return (
    <View style={settingStyles.mainView}>
      {/* Add Family Member Card */}
      <TouchableOpacity
        style={styles.familyCard}
        onPress={() => setFamilyModalVisible(true)}>
        <Text style={styles.familyCardTitle}>Add Family Member</Text>
        <Text style={styles.familyCardDesc}>Add a family member to your account and access their membership card.</Text>
      </TouchableOpacity>

      {/* Modal for JCIC input */}
      <Modal
        visible={familyModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFamilyModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Family Member JCIC</Text>
            <TextInput
              style={styles.input}
              placeholder="JCIC Number"
              value={familyJCICInput}
              onChangeText={setFamilyJCICInput}
              keyboardType="numeric"
            />
            {familyApiError ? <Text style={styles.error}>{familyApiError}</Text> : null}
            <TouchableOpacity style={styles.modalButton} onPress={handleAddFamilyMember} disabled={isFamilyLoading}>
              <Text style={styles.modalButtonText}>{isFamilyLoading ? 'Please wait...' : 'Okay'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setFamilyModalVisible(false)} style={styles.modalCancel}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal for OTP input */}
      <Modal
        visible={familyOtpModal}
        transparent
        animationType="slide"
        onRequestClose={() => setFamilyOtpModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter OTP</Text>
            <Text style={styles.modalSubtitle}>
              Please enter the OTP sent to the family member's email/phone
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter OTP"
              value={familyOtp}
              onChangeText={setFamilyOtp}
              keyboardType="numeric"
              maxLength={6}
            />
            {familyOtpError ? <Text style={styles.error}>{familyOtpError}</Text> : null}
            <TouchableOpacity style={styles.modalButton} onPress={handleVerifyFamilyOtp} disabled={isFamilyLoading}>
              <Text style={styles.modalButtonText}>{isFamilyLoading ? 'Verifying...' : 'Verify OTP'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setFamilyOtpModal(false)} style={styles.modalCancel}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={settingStyles.subView}>
        <Text style={settingStyles.heading}>Notification Subscription</Text>
        {!permission && (
          <Text style={settingStyles.noPermissions}>
            No Permissions Granted
          </Text>
        )}
        {switches.map((ele, ind) => {
          let isSubscribed = topicData[ele.dbName];

          if (isNotNullOrEmpty(isSubscribed)) {
            let styles = {
              ...toggleStyle,
              borderBottomWidth: ele.dbName === 'events' ? 0 : 1,
            };
            return (
              <ToggleSwitch
                key={ind}
                style={{...toggleStyle, ...styles}}
                isOn={isSubscribed}
                onColor={colors.secondryColor}
                offColor="grey"
                label={ele.subscriptionName}
                labelStyle={settingStyles.toggleLabel}
                trackOnStyle={settingStyles.trackStyle}
                trackOffStyle={settingStyles.trackStyle}
                onToggle={isOn => changeSubcription(ele.dbName, isOn)}
              />
            );
          }
        })}
        {topicData?.deviceInfo?.allowTesting && (
          <ToggleSwitch
            style={{...toggleStyle, borderBottomWidth: 0}}
            isOn={topicData.testing}
            onColor={colors.secondryColor}
            offColor="grey"
            label={'Testing'}
            labelStyle={settingStyles.toggleLabel}
            trackOnStyle={settingStyles.trackStyle}
            trackOffStyle={settingStyles.trackStyle}
            onToggle={isOn => subscribeTesting('testing', isOn)}
          />
        )}
      </View>
      <TouchableOpacity
        style={settingStyles.logoutButton}
        onPress={handleLogout}>
        <Text style={settingStyles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  familyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    margin: 16,
    marginBottom: 0,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  familyCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#715054',
    marginBottom: 4,
  },
  familyCardDesc: {
    fontSize: 14,
    color: '#444',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 24,
    width: 320,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#715054',
    marginBottom: 16,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#444',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 48,
    borderColor: '#715054',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    marginBottom: 12,
    color: '#000',
    backgroundColor: '#f9f9f9',
  },
  modalButton: {
    backgroundColor: '#715054',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 32,
    marginTop: 4,
    marginBottom: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalCancel: {
    marginTop: 2,
  },
  modalCancelText: {
    color: '#715054',
    fontSize: 15,
  },
  error: {
    color: 'red',
    marginBottom: 6,
  },
  familyMembersSection: {
    marginTop: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#715054',
    marginBottom: 8,
  },
  loadingText: {
    textAlign: 'center',
    color: '#444',
    fontStyle: 'italic',
  },
  noFamilyText: {
    textAlign: 'center',
    color: '#444',
    fontStyle: 'italic',
  },
  familyMemberItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  familyMemberInfo: {
    flex: 1,
  },
  familyMemberName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  familyMemberJCIC: {
    fontSize: 14,
    color: '#666',
  },
  removeButton: {
    backgroundColor: '#ff6b6b',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default Settings;
