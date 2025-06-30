import messaging from '@react-native-firebase/messaging';
import database from '@react-native-firebase/database';
import {
  getBrand,
  getDeviceId,
  getModel,
  getSystemVersion,
} from 'react-native-device-info';
import {isNotNullOrEmpty, Storage} from '../app/Functions/Functions';

const checkTopicSubscribed = (ele, topicsSubscribed) => {
  switch (ele) {
    case 'Events':
      topicsSubscribed.events = true;
      break;
    case 'Death_News':
      topicsSubscribed.deathNews = true;
      break;
    case 'Death_Anniversaries':
      topicsSubscribed.deathAnniversaries = true;
      break;
    case 'All':
      topicsSubscribed.all = true;
      break;
    case 'testing':
      topicsSubscribed.testing = true;
      break;
  }
};

const unSubscribeTopic = async value => {
  await messaging()
    .unsubscribeFromTopic(value)
    .then(() => console.log('unSubscribed to topic: ' + value))
    .catch(err => console.log('Topic unSubscription Failed', err));
};

const subscribeTopic = async (value, onSuccessFunc = () => {}) => {
  await messaging()
    .subscribeToTopic(value)
    .then(() => {
      console.log('Subscribed to topic: ' + value);
      onSuccessFunc();
    })
    .catch(err => console.log('Topic Subscription Failed', err));
};

const subscribeToTopics = async () => {
  const topics = ['Events', 'Death_News', 'Death_Anniversaries', 'All'];
  let topicsSubscribed = {
    events: false,
    deathNews: false,
    deathAnniversaries: false,
    all: false,
    testing: false,
  };

  topics.map(async topic => {
    await subscribeTopic(topic, checkTopicSubscribed(topic, topicsSubscribed));
  });

  return topicsSubscribed;
};

const topic = async () => {
  try {
    const topicKey = await Storage.getData('topic-key', false);
    const flag = await Storage.getData('subscribed', false);

    let deviceInfo = {
      brand: getBrand(),
      model: getModel(),
      androidVersion: getSystemVersion(),
      timestamp: database.ServerValue.TIMESTAMP,
      allowTesting: false,
    };

    if (!isNotNullOrEmpty(topicKey)) {
      const topicsSubscribed = await subscribeToTopics();
      console.log(topicsSubscribed);

      const reference = database().ref('/topicSubscriptions').push();

      let obj = {
        ...topicsSubscribed,
        deviceInfo: {
          ...deviceInfo,
          key: reference.key,
        },
      };

      await reference
        .set(obj)
        .then(async () => {
          await Storage.storeData('topic-key', reference.key, false);
          await Storage.storeData('subscribed', 'topic', false);
          console.log('Data Uploaded');
        })
        .catch(err => console.log('Data Upload Failed', err));
    } else {
      if (!flag && flag !== 'topic') {
        await Storage.storeData('topic-key', '', false);
        topic();
      } else {
        await database()
          .ref(`/topicSubscriptions/${topicKey}/deviceInfo`)
          .update({
            ...deviceInfo,
            key: topicKey,
          })
          .then(() => console.log('Database updated'));
        console.log('Already Subscribed');
      }
    }
  } catch (e) {
    console.log(e);
  }
};

export {topic, subscribeTopic, unSubscribeTopic};
