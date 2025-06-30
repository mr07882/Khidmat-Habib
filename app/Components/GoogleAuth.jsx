import React from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import {Text} from './core';

const QuizAuth = ({confirmUserLogin}) => {
  const {height} = useWindowDimensions();

  const signIn = async () => {
    GoogleSignin.configure({
      webClientId:
        '780690874879-pbi3vr91rein2es42n9hlpjedlvfo3vq.apps.googleusercontent.com',
    });
    try {
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      const userInfo = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(
        userInfo.data.idToken,
      );
      const authRes = auth().signInWithCredential(googleCredential);
      let email = userInfo.data.user.email;

      let emailAddress = email.replaceAll('.', '');
      confirmUserLogin({emailAddress, email});
    } catch (error) {
      console.log('Auth Error:', error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('user cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('signin is already in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('playservices not available or outdated');
      } else {
        console.log('some other error happened');
      }
    }
  };

  return (
    <View style={styles.mainView}>
      <View style={[styles.innerView, {height: height / 2}]}>
        <Image
          source={require('../../assets/logo.webp')}
          style={styles.kpsiajLogo}
        />
        <TouchableOpacity onPress={signIn} style={styles.loginBtn}>
          <Image
            source={require('../../assets/google-logo.png')}
            style={styles.googleLogo}
          />
          <Text style={styles.loginBtnText}>Sign in with Google</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: '#ECEAE4',
    margin: 20,
    elevation: 3,
    padding: 20,
    flex: 1,
  },
  innerView: {
    justifyContent: 'flex-end',
    gap: 100,
  },
  kpsiajLogo: {
    height: 120,
    width: 120,
    alignSelf: 'center',
  },
  loginBtn: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    gap: 15,
    height: 50,
    borderWidth: 1,
    borderColor: '#a9a9a9',
    borderStyle: 'solid',
    borderRadius: 25,
    elevation: 5,
  },
  googleLogo: {
    width: 25,
    height: 25,
  },
  loginBtnText: {
    fontWeight: '500',
    fontSize: 16,
  },
});

export default QuizAuth;
