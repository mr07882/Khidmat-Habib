import React, {useState, useEffect, useRef} from 'react';
import {connect} from 'react-redux';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  useWindowDimensions,
} from 'react-native';
import {userDetailForQuiz} from '../Redux/actions/authAction';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Picker} from '@react-native-picker/picker';
import {
  countryObjInArray,
  dedicatedForValues,
  donationTypeValues,
  currencyValues,
} from '../Config/AppConfigData';
import database from '@react-native-firebase/database';
import Loader from '../Components/Loader';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import PhoneInput from 'react-native-phone-number-input';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import {Text} from './core';

const phoneNumberObj = {
  phoneNoWithCode: '',
  phoneNoWithoutCode: '',
};

function TelethonForm(props) {
  const [userInfo, setUserInfo] = useState('');
  const [fullName, setFullName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(phoneNumberObj);
  const [amount, setAmount] = useState('');
  const [dedicatedForOtherText, setDedicatedForOtherText] = useState('');
  const [currency, setCurrency] = useState('');
  const [countryName, setCountryName] = useState('');
  const [donationType, setDonationType] = useState('Donation');
  const [dedicatedFor, setDedicatedFor] = useState('');
  const [radioButton, setRadioButton] = useState('Donation');
  const [isLoader, setIsLoader] = useState(false);
  const {width} = useWindowDimensions();
  const phoneInput = useRef();

  let radio_props = [
    {label: 'Donation', value: 'Donation'},
    {label: 'Khums', value: 'Khums'},
  ];

  useEffect(() => {
    if (props.userInfo && props.userInfo.userDetail) {
      setUserInfo(props.userInfo.userDetail);
    }
  }, [props.userInfo]);

  const sendToFirebase = () => {
    setIsLoader(true);
    let timeStamp = new Date().getTime();
    let obj = {
      fullName,
      fatherName,
      email: props.userInfo.userDetail.email,
      phoneNoWithCode: phoneNumber.phoneNoWithCode,
      phoneNoWithoutCode: phoneNumber.phoneNoWithoutCode,
      countryName,
      dedicatedFor:
        dedicatedFor === 'Other' ? dedicatedForOtherText : dedicatedFor,
      amount,
      donationType,
      currency,
      phoneNumber: userInfo.phoneNumber,
      mainUserUid: userInfo.emailAddress,
      uid: timeStamp,
    };
    try {
      database()
        .ref(`telethon/forms/${userInfo.emailAddress}/${timeStamp}`)
        .set(obj)
        .then(() => {
          setIsLoader(false);
          setFullName('');
          setFatherName('');
          setAmount('');
          setDedicatedFor(null);
          setDonationType('Donation');
          setCountryName('');
          setPhoneNumber(phoneNumberObj);
          setCurrency('');
          setDedicatedFor('');
          setDedicatedForOtherText('');
          alert(
            'Your pledge for KPSIAJ Telethon has been noted. Our representative will contact you soon. JazakAllah.',
          );
        });
    } catch (e) {
      setIsLoader(false);
      alert('Please check your network connection & try again');
    }
  };

  const verifyData = () => {
    const {phoneNoWithCode} = phoneNumber;
    let phoneNo = phoneNoWithCode.slice(0, 3);

    if (fullName === '' || fullName === ' ') {
      alert('Please Enter Full Name');
    } else if (fatherName === '' || fatherName === ' ') {
      alert('Please Enter Father / Husband Name');
    } else if (
      phoneNoWithCode === '' ||
      (phoneNo === '+92' && phoneNoWithCode.length !== 13)
    ) {
      alert('Please Enter Valid Phone Number');
    } else if (radioButton === 'Khums' && donationType === 'Donation') {
      alert('Please Select Marja');
    } else if (dedicatedFor === '') {
      alert('Please Select Donation Purpose');
    } else if (dedicatedFor === 'Other' && dedicatedForOtherText === '') {
      alert('Please Enter Donation Purpose');
    } else if (countryName === '') {
      alert('Please Select Country');
    } else if (currency === '') {
      alert('Please Select Currency');
    } else if (amount === '' || amount === ' ' || amount === 0) {
      alert('Please Enter Amount');
    } else {
      sendToFirebase();
    }
  };
  const logOutUser = async () => {
    console.log('Onpress is working');
    try {
      await GoogleSignin.signOut();
      await auth().signOut();
      alert('User SignOut');
      props.userDetailForQuiz(false, {});
      props.setIsUserLogin(false);
    } catch (e) {
      alert('User SignOut');
      props.userDetailForQuiz(false, {});
      props.setIsUserLogin(false);
    }
  };

  const onPressRadioButton = value => {
    setRadioButton(value);
  };

  const renderForm = () => {
    return (
      <React.Fragment>
        <View style={{alignItems: 'center', marginTop: -70, marginBottom: 10}}>
          <Image
            style={{
              height: 140,
              width: 250,
              resizeMode: 'contain',
            }}
            source={{
              uri: 'https://kpsiaj.org/kpsiajapp/appimages/telethon.png',
            }}
          />
        </View>
        <View style={{paddingLeft: 20, paddingRight: 30}}>
          <TextInput
            style={styles.textInputs}
            placeholder="Full Name"
            autoCompleteType="name"
            value={fullName}
            onChangeText={text => setFullName(text)}
          />
          <TextInput
            style={styles.textInputs}
            placeholder="Father / Husband Name"
            value={fatherName}
            onChangeText={text => setFatherName(text)}
          />
          <PhoneInput
            ref={phoneInput}
            defaultValue={phoneNumber.phoneNoWithoutCode}
            onChangeText={text =>
              setPhoneNumber({...phoneNumber, phoneNoWithoutCode: text})
            }
            defaultCode="PK"
            layout="first"
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
              width: '100%',
              borderBottomWidth: 3,
              borderBottomColor: '#725054',
              height: 55,
              borderWidth: 0.5,
              borderColor: 'grey',
              padding: 0,
              backgroundColor: 'white',
              borderRadius: 5,
              marginBottom: 10,
              fontSize: 18,
              elevation: 5,
            }}
            onChangeFormattedText={text =>
              setPhoneNumber({...phoneNumber, phoneNoWithCode: text})
            }
            withShadow
          />
          <RadioForm formHorizontal={true} animation={true}>
            <View style={[styles.radioButton, {width: width - 55}]}>
              {radio_props.map((obj, i) => (
                <RadioButton labelHorizontal={true} key={i}>
                  <RadioButtonInput
                    obj={obj}
                    index={i}
                    isSelected={obj.value === radioButton}
                    onPress={onPressRadioButton}
                    borderWidth={2}
                    buttonInnerColor={'#725054'}
                    buttonOuterColor={'#725054'}
                    buttonSize={16}
                    buttonOuterSize={23}
                  />
                  <RadioButtonLabel
                    obj={obj}
                    index={i}
                    labelHorizontal={true}
                    onPress={onPressRadioButton}
                    labelStyle={{
                      fontSize: 18,
                      color: '#725054',
                      fontWeight: '500',
                    }}
                  />
                </RadioButton>
              ))}
            </View>
          </RadioForm>
          {radioButton === 'Khums' && (
            <View style={styles.picker}>
              <Picker
                selectedValue={donationType}
                onValueChange={value => setDonationType(value)}>
                <Picker.Item label="Select Marja" value="Donation" />
                {donationTypeValues.map((ele, ind) => (
                  <Picker.Item key={ind} label={ele.label} value={ele.value} />
                ))}
              </Picker>
            </View>
          )}
          <View style={styles.picker}>
            <Picker
              selectedValue={dedicatedFor}
              onValueChange={value => setDedicatedFor(value)}>
              <Picker.Item label="Select Donation Purpose" value="" />
              {dedicatedForValues.map((ele, ind) => (
                <Picker.Item key={ind} label={ele.label} value={ele.value} />
              ))}
            </Picker>
          </View>
          {dedicatedFor === 'Other' && (
            <TextInput
              style={styles.textInputs}
              placeholder="Dedicated For"
              value={dedicatedForOtherText}
              onChangeText={text => setDedicatedForOtherText(text)}
            />
          )}
          {!!countryObjInArray.length && (
            <View style={styles.picker}>
              <Picker
                selectedValue={countryName}
                onValueChange={value => setCountryName(value)}>
                <Picker.Item label="Select Country" value="" />
                {countryObjInArray.map((ele, ind) => (
                  <Picker.Item key={ind} label={ele.label} value={ele.value} />
                ))}
              </Picker>
            </View>
          )}
          <View style={styles.picker}>
            <Picker
              selectedValue={currency}
              onValueChange={value => setCurrency(value)}>
              <Picker.Item label="Select Currency" value="" />
              {currencyValues.map((ele, ind) => (
                <Picker.Item key={ind} label={ele.label} value={ele.value} />
              ))}
            </Picker>
          </View>
          <TextInput
            style={styles.textInputs}
            placeholder="Amount"
            value={amount}
            keyboardType="numeric"
            onChangeText={text => setAmount(text)}
          />
          <TouchableOpacity
            onPress={() => verifyData()}
            style={{
              backgroundColor: '#725054',
              height: 40,
              width: 100,
              borderRadius: 6,
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: 10,
              elevation: 3,
            }}>
            <Text style={{color: 'white', fontSize: 16}}>Submit</Text>
          </TouchableOpacity>
        </View>
      </React.Fragment>
    );
  };
  return (
    <View style={{flex: 1}}>
      {isLoader ? (
        <Loader />
      ) : (
        <ScrollView>
          <View style={{zIndex: 1, alignItems: 'flex-end'}}>
            <TouchableOpacity
              onPress={logOutUser}
              style={{
                backgroundColor: '#725054',
                height: 50,
                width: 60,
                borderRadius: 10,
                borderBottomLeftRadius: 30,
                justifyContent: 'center',
                alignItems: 'center',
                margin: 10,
                elevation: 3,
              }}>
              <Text style={{color: 'white'}}>LogOut</Text>
              <FontAwesome
                name="power-off"
                style={{color: 'white', fontSize: 20}}
              />
            </TouchableOpacity>
          </View>
          {renderForm()}
        </ScrollView>
      )}
    </View>
  );
}
const mapDispatchToProps = dispatch => {
  return {
    userDetailForQuiz: (isLogin, param) =>
      dispatch(userDetailForQuiz(isLogin, param)),
  };
};
const mapStateToProps = state => {
  return {userInfo: state.reducer.user};
};
export default connect(mapStateToProps, mapDispatchToProps)(TelethonForm);

const styles = StyleSheet.create({
  container: {backgroundColor: 'white', flex: 1},
  scroll: {
    backgroundColor: '#ECEAE4',
    margin: 20,
    elevation: 3,
    padding: 20,
    flex: 1,
  },
  textInputs: {
    borderWidth: 0.5,
    borderColor: 'grey',
    borderBottomWidth: 3,
    borderBottomColor: '#725054',
    height: 50,
    padding: 0,
    paddingLeft: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    marginBottom: 10,
    fontSize: 18,
  },
  radioButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    marginBottom: 14,
    marginTop: 10,
  },
  picker: {
    backgroundColor: 'white',
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: 'grey',
    borderBottomWidth: 3,
    borderBottomColor: '#725054',
  },
});
