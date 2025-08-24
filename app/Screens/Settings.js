import React, {useEffect, useState} from 'react';
import {View, useWindowDimensions, TouchableOpacity, TextInput, Alert, StyleSheet} from 'react-native';
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
import { getMemberByJCIC } from '../Api/Firebase/MemberInformation';
import { generateOTP, storeOTP, verifyOTP } from '../Api/Firebase/auth';
import { db } from '../Config/firebase';
import { ref, update, get } from 'firebase/database';
import { sendOTPEmail } from '../Api/Firebase/emailService';
import {logoutUser} from '../Functions/Functions';
import {setUserId} from '../Redux/actions/authAction';
import { useDispatch } from 'react-redux';

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
  const loadFamilyMembers = async () => {
    // Implement the logic to load family members if needed
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

  if (loading) {
    return <Loader bgColor="#F2F2F2" />;
  }

  return (
    <View style={settingStyles.mainView}>
      {/* Notification Subscription Section */}
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
});

export default Settings;
