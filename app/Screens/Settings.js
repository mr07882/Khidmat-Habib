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

const FAMILY_STORAGE_KEY = 'family_jcics';

const Settings = () => {
  const [topicData, setTopicData] = useState({});
  const [topicKey, setTopicKey] = useState('');
  const [permission, setPermissions] = useState(true);
  const [loading, setLoading] = useState(true);
  const {width} = useWindowDimensions();
  const toggleStyle = {...settingStyles.toggle, width: width - 40};
  const navigation = useNavigation();

  const [familyModalVisible, setFamilyModalVisible] = useState(false);
  const [familyJCICInput, setFamilyJCICInput] = useState('');
  const [familyOtpModal, setFamilyOtpModal] = useState(false);
  const [familyOtp, setFamilyOtp] = useState('');
  const [familyApiError, setFamilyApiError] = useState('');
  const [familyOtpError, setFamilyOtpError] = useState('');
  const [pendingFamilyJCIC, setPendingFamilyJCIC] = useState('');
  const [isFamilyLoading, setIsFamilyLoading] = useState(false);

  const [userJCIC, setUserJCIC] = useState('');
  useEffect(() => {
    AsyncStorage.getItem('JCIC').then(jcic => setUserJCIC(jcic || ''));
  }, []);

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
    await AsyncStorage.removeItem('userToken');
    navigation.replace('Login');
  };

  const handleAddFamilyMember = async () => {
    setFamilyApiError('');
    if (!familyJCICInput) {
      setFamilyApiError('Please enter JCIC number');
      return;
    }
    // Check if already added
    try {
      let stored = await AsyncStorage.getItem(FAMILY_STORAGE_KEY);
      let arr = stored ? JSON.parse(stored) : [];
      if (arr.includes(familyJCICInput)) {
        setFamilyApiError('Family Member Already Added');
        return;
      }
    } catch {}
    setIsFamilyLoading(true);
    try {
      const res = await fetch('http://10.0.2.2:5000/family/add/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userJCIC, familyJCIC: familyJCICInput }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setFamilyApiError(data.error || 'Member Not In Relationship');
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
      const res = await fetch('http://10.0.2.2:5000/family/add/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ familyJCIC: pendingFamilyJCIC, otp: familyOtp }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setFamilyOtpError(data.error || 'Incorrect otp');
        setIsFamilyLoading(false);
        return;
      }
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
            <Text style={styles.modalTitle}>Enter OTP sent to family member</Text>
            <TextInput
              style={styles.input}
              placeholder="OTP"
              value={familyOtp}
              onChangeText={setFamilyOtp}
              keyboardType="numeric"
              maxLength={6}
            />
            {familyOtpError ? <Text style={styles.error}>{familyOtpError}</Text> : null}
            <TouchableOpacity style={styles.modalButton} onPress={handleVerifyFamilyOtp} disabled={isFamilyLoading}>
              <Text style={styles.modalButtonText}>{isFamilyLoading ? 'Please wait...' : 'Verify'}</Text>
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
      <Text style={settingStyles.deviceId}>Key: {topicKey}</Text>
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
});

export default Settings;
