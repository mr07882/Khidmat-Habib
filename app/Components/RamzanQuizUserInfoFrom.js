import * as React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Keyboard,
  Platform,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  TouchableOpacity,
  Button,
} from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import DateTimePicker from '@react-native-community/datetimepicker';
import RadioForm from 'react-native-simple-radio-button';
import Event from 'react-native-vector-icons/AntDesign';
import database from '@react-native-firebase/database';
import Loader from '../Components/Loader';
import {Picker} from '@react-native-picker/picker';
import {countryObjInArray} from '../Config/AppConfigData';
import {Text} from './core';

export default class RamzanQuizUserInfoForm extends React.Component {
  constructor() {
    super();
    this.phoneInput = React.createRef();
    this.state = {
      fullName: '',
      fatherName: '',
      countryName: 'Pakistan',
      cnicNo: '',
      phoneNoWithCode: '',
      phoneNoWithoutCode: '',
      dateOfBirth: '',
      show: false,
      gender: '',
      isLoader: true,
      isUpdate: false,
      currentUserForUpdate: '',
      isDeletUiOpen: false,
    };
  }
  componentDidMount() {
    let {isUpdate, childUsers} = this.props;
    if (!this.state.isUpdate) {
      if (isUpdate) {
        let currentUserForUpdate = '';
        for (let key in childUsers) {
          if (childUsers[key].perFormUid === isUpdate) {
            currentUserForUpdate = childUsers[key];
          }
        }
        this.setState({
          isLoader: false,
          fullName: currentUserForUpdate.fullName,
          fatherName: currentUserForUpdate.fatherName,
          countryName: currentUserForUpdate.countryName,
          dateOfBirth: currentUserForUpdate.dateOfBirth,
          cnicNo: currentUserForUpdate?.cnicNo,
          phoneNoWithCode: currentUserForUpdate?.phoneNoWithCode,
          phoneNoWithoutCode: currentUserForUpdate?.phoneNoWithoutCode,
          gender: currentUserForUpdate.gender,
          isUpdate: isUpdate,
          currentUserForUpdate: currentUserForUpdate,
        });
      } else {
        this.setState({isLoader: false});
      }
    }
  }
  clearForm() {
    this.props.closeUserForm();
  }
  onDeleteUserForm() {
    this.setState({isLoader: true});
    try {
      database()
        .ref(
          `userData/${this.props.userInfo.emailAddress}/${this.state.currentUserForUpdate.perFormUid}`,
        )
        .remove();
      this.setState({isLoader: false, isDeletUiOpen: false});
      alert('User Deleted');
      this.props.closeUserForm();
    } catch (error) {
      this.setState({isLoader: false, isDeletUiOpen: false});
      alert('There some network issue user not created please try later');
      this.props.closeUserForm();
    }
  }
  submitFormToFirebase() {
    const {
      fullName,
      fatherName,
      countryName,
      cnicNo,
      dateOfBirth,
      phoneNoWithCode,
      phoneNoWithoutCode,
      gender,
      isUpdate,
      currentUserForUpdate,
    } = this.state;
    let timeStamp = !!isUpdate ? isUpdate : new Date().getTime();
    let user = {
      fullName,
      fatherName,
      countryName,
      phoneNoWithCode,
      phoneNoWithoutCode,
      cnicNo,
      dateOfBirth: dateOfBirth.toString(),
      gender,
      perFormUid: timeStamp,
      mainUserInfo: this.props.userInfo,
    };
    if (isUpdate) {
      let count = 0;
      if (user.fullName !== currentUserForUpdate.fullName) {
        count = count + 1;
      }
      if (user.fatherName !== currentUserForUpdate.fatherName) {
        count = count + 1;
      }
      if (user.countryName !== currentUserForUpdate.countryName) {
        count = count + 1;
      }
      if (user.dateOfBirth !== currentUserForUpdate.dateOfBirth) {
        count = count + 1;
      }
      if (user.gender !== currentUserForUpdate.gender) {
        count = count + 1;
      }
      if (user.phoneNoWithCode !== currentUserForUpdate.phoneNoWithCode) {
        count = count + 1;
      }
      if (user.cnicNo !== currentUserForUpdate.cnicNo) {
        count = count + 1;
      }
      if (!count) {
        this.setState({isLoader: false});
        alert('Please update something');
        return;
      }
    }
    if (isUpdate) {
      if (currentUserForUpdate.resultArray) {
        user.resultArray = currentUserForUpdate.resultArray;
      }
    }
    try {
      database()
        .ref(`userData/${this.props.userInfo.emailAddress}/${user.perFormUid}`)
        .set(user);
      this.setState({isLoader: false});
      !!isUpdate
        ? alert('User Updated Succesfully')
        : alert('User added succesfully');
      this.props.closeUserForm();
    } catch (error) {
      this.setState({isLoader: false});
      alert('There some network issue user not created please try later');
      this.props.closeUserForm();
    }
  }
  submitForm() {
    const {
      fullName,
      fatherName,
      countryName,
      cnicNo,
      dateOfBirth,
      gender,
      phoneNoWithCode,
    } = this.state;
    this.setState({isLoader: true});
    if (fullName === '' || fullName.length < 3) {
      this.setState({isLoader: false});
      alert('Please fill Full Name field with proper name');
      return;
    }

    if (cnicNo === '' || (cnicNo.length !== 13 && countryName === 'Pakistan')) {
      this.setState({isLoader: false});
      alert('Please enter valid CNIC #');
      return;
    }

    if (
      phoneNoWithCode === '' ||
      (phoneNoWithCode.length !== 13 && countryName === 'Pakistan')
    ) {
      this.setState({isLoader: false});
      alert('Please enter valid Phone Number');
      return;
    }
    if (this.props.childUsers.length) {
      for (let key in this.props.childUsers) {
        if (
          this.props.childUsers[key].fullName.toLowerCase() ===
          fullName.toLowerCase()
        ) {
          if (this.state.isUpdate) {
            if (this.props.childUsers[key].perFormUid !== this.state.isUpdate) {
              this.setState({isLoader: false});
              alert('This user name is already added');
              return;
            }
          } else {
            this.setState({isLoader: false});
            alert('This user name is already added');
            return;
          }
        }
      }
    }
    if (fatherName === '' || fatherName.length < 3) {
      this.setState({isLoader: false});
      alert('Please fill Father / Husband Name field with proper name');
      return;
    }
    if (countryName === null) {
      this.setState({isLoader: false});
      alert('Please select country name');
      return;
    }
    if (dateOfBirth === '') {
      this.setState({isLoader: false});
      alert('Please select date of birth');
      return;
    }
    if (gender === '') {
      this.setState({isLoader: false});
      alert('Pleas select gender');
      return;
    }
    this.submitFormToFirebase();
  }
  showDate(param) {
    var mS = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'June',
      'July',
      'Aug',
      'Sept',
      'Oct',
      'Nov',
      'Dec',
    ];
    let format = new Date(param);
    let year = format.getFullYear();
    let date = format.getDate();
    let monthNmbr = format.getMonth();
    return <Text>{`${date}-${mS[monthNmbr]}-${year}`}</Text>;
  }

  onDateChange(date) {
    if (date.type === 'set') {
      let selectedDate = new Date(date.nativeEvent.timestamp);
      this.setState({dateOfBirth: selectedDate, show: false});
    } else {
      this.setState({show: false});
    }
  }

  render() {
    const {
      fullName,
      fatherName,
      countryName,
      phoneNoWithoutCode,
      dateOfBirth,
      cnicNo,
      show,
      currentUserForUpdate,
    } = this.state;
    let radio_props = [
      {label: 'Male', value: 'male'},
      {label: 'Female', value: 'female'},
    ];

    return (
      <KeyboardAvoidingView style={styles.container}>
        {this.state.isLoader ? (
          <Loader />
        ) : (
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            {this.state.isDeletUiOpen ? (
              <ScrollView style={styles.scroll}>
                <View style={{paddingBottom: 20}}>
                  <Text
                    style={{
                      color: '#725054',
                      fontSize: 20,
                      fontWeight: 'bold',
                      marginBottom: 10,
                    }}>
                    Note:
                  </Text>
                  <Text
                    style={{
                      color: '#725054',
                      fontSize: 18,
                      fontWeight: 'bold',
                      marginBottom: 10,
                      textAlign: 'justify',
                    }}>{`All user data along with answers given for different quizzes will also be permanently deleted. Are you sure you want to delete user "${currentUserForUpdate.fullName}"`}</Text>
                </View>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'space-evenly',
                    alignItems: 'flex-end',
                  }}>
                  <TouchableOpacity
                    onPress={() => this.onDeleteUserForm()}
                    style={{
                      margin: 5,
                      backgroundColor: '#725054',
                      height: 40,
                      width: 80,
                      borderRadius: 5,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={{color: 'white', fontSize: 18}}>Delete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this.setState({isDeletUiOpen: false})}
                    style={{
                      margin: 5,
                      backgroundColor: '#725054',
                      height: 40,
                      width: 80,
                      borderRadius: 5,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={{color: 'white', fontSize: 18}}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            ) : (
              <ScrollView style={styles.scroll}>
                <View style={{paddingBottom: 20}}>
                  <Text
                    style={{
                      color: '#725054',
                      fontSize: 24,
                      marginBottom: 10,
                    }}>
                    Enter user details
                  </Text>
                  <TextInput
                    style={styles.textInputs}
                    placeholder="Full Name"
                    value={fullName}
                    onChangeText={text => this.setState({fullName: text})}
                  />
                  <TextInput
                    style={styles.textInputs}
                    placeholder="Father / Husband Name"
                    value={fatherName}
                    onChangeText={text => this.setState({fatherName: text})}
                  />
                  <TextInput
                    style={styles.textInputs}
                    placeholder="CNIC #"
                    value={cnicNo}
                    onChangeText={text => this.setState({cnicNo: text})}
                  />
                  <PhoneInput
                    ref={this.phoneInput}
                    defaultValue={phoneNoWithoutCode}
                    onChangeText={text =>
                      this.setState({phoneNoWithoutCode: text})
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
                      borderBottomWidth: 2,
                      borderBottomColor: '#725054',
                      height: 55,
                      padding: 0,
                      backgroundColor: 'white',
                      borderRadius: 10,
                      marginBottom: 20,
                      fontSize: 18,
                      elevation: 5,
                    }}
                    onChangeFormattedText={text =>
                      this.setState({phoneNoWithCode: text})
                    }
                    withShadow
                  />
                  {!!countryObjInArray.length && (
                    <Picker
                      selectedValue={this.state.countryName}
                      onValueChange={value =>
                        this.setState({countryName: value})
                      }>
                      {countryObjInArray.map((ele, ind) => {
                        return (
                          <Picker.Item
                            key={ind}
                            label={ele.label}
                            value={ele.value}
                          />
                        );
                      })}
                    </Picker>
                  )}
                  {countryName && (
                    <TextInput
                      style={styles.textInputs}
                      value={countryName}
                      editable={false}
                    />
                  )}
                  <Text
                    style={{
                      color: '#725054',
                      fontSize: 16,
                      textAlign: 'center',
                    }}>
                    Select Date of Birth and Gender
                  </Text>
                  <View
                    style={{
                      margin: 20,
                      marginTop: 10,
                      display: 'flex',
                      flexDirection: 'row',
                      width: '100%',
                      justifyContent: 'space-evenly',
                      alignItems: 'flex-start',
                    }}>
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Event
                        name="calendar"
                        style={{fontSize: 30, color: '#725054'}}
                        onPress={() => this.setState({show: true})}
                      />
                      <Text style={{color: '#725054'}}>
                        {dateOfBirth === ''
                          ? 'Not Selected'
                          : this.showDate(dateOfBirth)}
                      </Text>
                    </TouchableOpacity>
                    <View style={{flex: 1}}>
                      {!!this.state.isUpdate && (
                        <RadioForm
                          radio_props={radio_props}
                          initial={this.state.gender === 'male' ? 0 : 1}
                          onPress={value => {
                            this.setState({gender: value});
                          }}
                          formHorizontal={true}
                          labelHorizontal={false}
                          buttonColor={'#725054'}
                          animation={true}
                          labelColor={'#725054'}
                        />
                      )}
                      {!!!this.state.isUpdate && (
                        <RadioForm
                          radio_props={radio_props}
                          initial={false}
                          onPress={value => {
                            this.setState({gender: value});
                          }}
                          formHorizontal={true}
                          labelHorizontal={false}
                          buttonColor={'#725054'}
                          animation={true}
                          labelColor={'#725054'}
                        />
                      )}
                    </View>
                  </View>
                  {show && (
                    <DateTimePicker
                      value={new Date()}
                      mode={'date'}
                      onChange={e => {
                        this.onDateChange(e);
                      }}
                      // display="spinner"
                      maximumDate={new Date()}
                    />
                  )}
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      width: '100%',
                      justifyContent: !!this.state.isUpdate
                        ? 'space-evenly'
                        : 'flex-end',
                      alignItems: 'flex-end',
                    }}>
                    {!!this.state.isUpdate && (
                      <TouchableOpacity
                        onPress={() => this.setState({isDeletUiOpen: true})}
                        style={{
                          margin: 5,
                          backgroundColor: '#725054',
                          height: 40,
                          width: 80,
                          borderRadius: 5,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text style={{color: 'white', fontSize: 18}}>
                          Delete
                        </Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      onPress={() => this.clearForm()}
                      style={{
                        margin: 5,
                        backgroundColor: '#725054',
                        height: 40,
                        width: 80,
                        borderRadius: 5,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text style={{color: 'white', fontSize: 18}}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        this.submitForm();
                      }}
                      style={{
                        margin: 5,
                        backgroundColor: '#725054',
                        height: 40,
                        width: 80,
                        borderRadius: 5,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text style={{color: 'white', fontSize: 18}}>{`${
                        !!this.state.isUpdate ? 'Update' : 'Submit'
                      }`}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            )}
          </TouchableWithoutFeedback>
        )}
      </KeyboardAvoidingView>
    );
  }
}
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
    color: 'black',
    borderBottomWidth: 2,
    borderBottomColor: '#725054',
    height: 40,
    padding: 0,
    paddingLeft: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    marginBottom: 10,
    fontSize: 18,
  },
});
