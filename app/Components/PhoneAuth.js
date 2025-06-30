import React, {useState, useRef, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import PhoneInput from 'react-native-phone-number-input';
import {
  TextInput,
  View,
  TouchableOpacity,
  Text,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  StyleSheet,
  LogBox,
} from 'react-native';
import Loader from './Loader';
import axios from 'axios';

LogBox.ignoreLogs(['new NativeEventEmitter']);

function PhoneAuth(props) {
  // If null, no SMS has been sent
  const [confirm, setConfirm] = useState(null);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState('');
  const [formattedValue, setFormattedValue] = useState('');
  const [user, setUser] = useState({phoneNumber: '', uid: ''});
  const phoneInput = useRef();
  let num;

  const sendLog = async (logName, logDesc) => {
    try {
      const response = await axios.post(
        'https://nodejsbackend-xi.vercel.app/api/sendLog',
        {
          logName: logName,
          logDesc: logDesc,
          date: new Date().toLocaleString(),
        },
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const authStateChange = async () => {
    try {
      await auth().onAuthStateChanged(user => {
        // if user data exist
        if (user) {
          console.log('user stored');
          setUser({
            phoneNumber: user.phoneNumber,
            uid: user.uid,
          });
        }
      });
    } catch (error) {
      console.log(error);
      sendLog('authStateChange Error', error.message);
    }
  };

  useEffect(() => {
    authStateChange();
  }, []);

  // Handle the button press
  async function signInWithPhoneNumber(valid) {
    if (!value) {
      alert('please enter your number then click on submit');
      return;
    }
    if (!valid) {
      alert('Invalid Number');
      return;
    }
    if (value[0] === '0') {
      num = '+92' + value.replace('0', '');
    } else {
      num = formattedValue;
    }
    setIsLoading(true);
    try {
      const confirmation = await auth().signInWithPhoneNumber(num);
      alert(`Verification code has been sent on your provided number`);
      setConfirm(confirmation);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      // sendLog('Error from Mobile Number', error.message);
      setIsLoading(false);
      alert('error from number');
    }
  }

  async function confirmCode() {
    setIsLoading(true);

    if (user.phoneNumber === '' && user.uid === '') {
      console.log('confirm chala');
      if (otp === '') {
        alert('please enter verification code');
        setIsLoading(false);
        return;
      }

      try {
        // alert('number=============>', number)
        let responce = await confirm.confirm(otp);
        let userDetails = {
          uid: responce.user.uid,
          phoneNumber: responce.user.phoneNumber,
        };
        setIsLoading(false);
        setConfirm(null);
        alert(
          `Mobile number ${responce.user.phoneNumber} is verified successfully. You are now logged in with this number`,
        );
        props.confirmUserLogin(userDetails);
      } catch (error) {
        sendLog('Error from Verification Code', error.message);
        props.confirmUserLogin(false);
        setIsLoading(false);
        alert('error from code verification');
      }
    } else {
      setIsLoading(false);
      setConfirm(null);
      alert(
        `Mobile number ${user.phoneNumber} is verified successfully. You are now logged in with this number`,
      );
      props.confirmUserLogin({
        phoneNumber: user.phoneNumber,
        uid: user.uid,
      });
    }
  }

  const renderButton = () => {
    if (!confirm) {
      return (
        <View style={{width: '100%', alignItems: 'center'}}>
          <Text
            style={{
              color: '#725054',
              fontWeight: 'bold',
              fontSize: 18,
              padding: 20,
              textAlign: 'center',
              marginBottom: 5,
              marginTop: 25,
            }}>
            Please enter your mobile number
          </Text>
          <PhoneInput
            ref={phoneInput}
            defaultValue={value}
            defaultCode="PK"
            layout="first"
            onChangeText={text => {
              setValue(text);
            }}
            flagButtonStyle={{
              width: 65,
            }}
            textContainerStyle={{
              borderTopRightRadius: 10,
              borderBottomRightRadius: 10,
              height: 50,
            }}
            codeTextStyle={{
              height: 23,
              marginLeft: -10,
            }}
            textInputStyle={{
              height: 50,
            }}
            containerStyle={{
              textAlign: 'center',
              borderWidth: 0.5,
              width: '100%',
              borderBottomWidth: 4,
              borderBottomColor: '#725054',
              height: 55,
              padding: 0,
              backgroundColor: 'white',
              borderRadius: 10,
              marginBottom: 20,
              fontSize: 18,
              elevation: 5,
            }}
            onChangeFormattedText={text => {
              setFormattedValue(text);
            }}
            withShadow
            autoFocus
          />
          <TouchableOpacity
            onPress={() => {
              const checkValid = phoneInput.current?.isValidNumber(value);
              signInWithPhoneNumber(checkValid);
            }}
            style={{
              margin: 5,
              backgroundColor: '#725054',
              height: 40,
              borderRadius: 5,
              justifyContent: 'center',
              alignItems: 'center',
              elevation: 5,
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: 16,
                paddingHorizontal: 15,
                paddingVertical: 5,
              }}>
              Submit
            </Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={{width: '100%', alignItems: 'center'}}>
          <Text
            style={{
              color: '#725054',
              fontWeight: 'bold',
              fontSize: 18,
              padding: 20,
              textAlign: 'center',
              marginBottom: 25,
              marginTop: 25,
            }}>
            A verification code has been sent via SMS on {num}
          </Text>
          <TextInput
            keyboardType="phone-pad"
            textContentType="oneTimeCode"
            autoComplete="sms-otp"
            autoFocus
            style={{
              textAlign: 'center',
              borderWidth: 0.5,
              width: '90%',
              borderBottomWidth: 4,
              borderBottomColor: '#725054',
              height: 40,
              padding: 10,
              backgroundColor: 'white',
              borderRadius: 10,
              marginBottom: 20,
              fontSize: 18,
              elevation: 5,
            }}
            placeholder={'######'}
            value={otp}
            onChangeText={text => setOtp(text)}
          />
          <TouchableOpacity
            onPress={() => confirmCode()}
            style={{
              margin: 5,
              backgroundColor: '#725054',
              height: 40,
              borderRadius: 5,
              justifyContent: 'center',
              alignItems: 'center',
              elevation: 5,
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: 16,
                paddingHorizontal: 15,
                paddingVertical: 5,
              }}>
              Confirm
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <KeyboardAvoidingView style={{flex: 1}}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              style={{
                backgroundColor: '#ECEAE4',
                margin: 20,
                elevation: 3,
                padding: 20,
                flex: 1,
              }}>
              <View style={{alignItems: 'center', paddingBottom: 40}}>
                <Image
                  source={require('../../assets/logo.webp')}
                  style={{height: 120, width: 120, marginTop: 20}}
                />
                {renderButton()}
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  borderStyleBase: {
    width: 30,
    height: 45,
  },

  borderStyleHighLighted: {
    borderColor: '#725054',
  },

  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 2,
    borderColor: '#2b2b2b',
    color: '#2b2b2b',
  },

  underlineStyleHighLighted: {
    borderColor: '#725054',
  },
});

export default PhoneAuth;
