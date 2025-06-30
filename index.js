/**
 * @format
 */

import {AppRegistry, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import PushNotification, {Importance} from 'react-native-push-notification';
import {notificationPermission, topic} from './FCM';

PushNotification.configure({
  onNotification: function (notification) {
    console.log('NOTIFICATION in index.js:', notification);
  },

  onAction: function (notification) {
    console.log('ACTION:', notification.action);
    console.log('NOTIFICATION:', notification);
  },

  onRegistrationError: function (err) {
    console.error(err.message, err);
  },
});

const checkNotificationPermission = async () => {
  const response = await notificationPermission();
  if (response === 'granted') {
    await topic();
  }
};

const onMessageReceived = async remoteMessage => {
  console.log('Foreground State Notification:', remoteMessage.notification);
  console.log('Foreground State Data:', remoteMessage.data);

  PushNotification.localNotification({
    channelId: remoteMessage.notification.android.channelId,
    title: remoteMessage.notification.title,
    message: remoteMessage.notification.body,
    bigPictureUrl: remoteMessage.notification.android.imageUrl,
    largeIcon: '',
  });
};

const onBackgroundMessageReceived = async remoteMessage => {
  console.log('Background Notification State', remoteMessage.notification);
};

const createChannelID = () => {
  PushNotification.createChannel(
    {
      channelId: 'kpsiaj-channel-1', // (required)
      channelName: 'kpsiaj-channel', // (required)
      importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
    },
    created => console.log(`createChannel returned ${created}`),
  );
};

if (Platform.OS === 'android') {
  messaging().onMessage(onMessageReceived);
  messaging().setBackgroundMessageHandler(onBackgroundMessageReceived);

  PushNotification.channelExists('kpsiaj-channel-1', function (exists) {
    if (!exists) {
      createChannelID();
    }
    console.log(exists);
  });

  if (Platform.Version >= 33) {
    checkNotificationPermission();
  } else {
    topic();
  }
}

AppRegistry.registerComponent(appName, () => App);
