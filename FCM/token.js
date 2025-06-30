import messaging from '@react-native-firebase/messaging';
import database from '@react-native-firebase/database';

const token = async () => {
  await messaging()
    .getToken()
    .then(e => {
      let FCMToken = e;
      console.log(FCMToken);
      database()
        .ref(`FCMTokens/${FCMToken}`)
        .once('value', i => {
          let tokenforFCM = i.val();
          if (tokenforFCM) {
            console.log('FCM Token allready uploaded');
          } else {
            database()
              .ref('setTimeStampFromApp')
              .set(firebase.database.ServerValue.TIMESTAMP)
              .then(() => {
                database()
                  .ref('setTimeStampFromApp')
                  .once('value', x => {
                    let timeStamp = x.val();
                    let obj = {
                      FCMToken,
                      timeStamp,
                      subscription: {
                        deathNews: true,
                        newsEvents: true,
                        testing: false,
                      },
                    };
                    database()
                      .ref(`FCMTokens/${FCMToken}`)
                      .set(obj)
                      .then(() => {
                        console.log('FCM Token uploaded');
                      });
                  });
              });
          }
        });
    });
};

export default token;
