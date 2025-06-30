import React, {useEffect, useState} from 'react';
import {View, useWindowDimensions, TouchableOpacity} from 'react-native';
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

const Settings = () => {
  const [topicData, setTopicData] = useState({});
  const [topicKey, setTopicKey] = useState('');
  const [permission, setPermissions] = useState(true);
  const [loading, setLoading] = useState(true);
  const {width} = useWindowDimensions();
  const toggleStyle = {...settingStyles.toggle, width: width - 40};
  const navigation = useNavigation();

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

  if (loading) {
    return <Loader bgColor="#F2F2F2" />;
  }

  return (
    <View style={settingStyles.mainView}>
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

export default Settings;
