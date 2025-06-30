import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import database from '@react-native-firebase/database';
import firebase from '@react-native-firebase/app';
import Loader from '../Components/Loader';
import {departmentsForFeedBack} from '../Config/AppConfigData';
import axios from 'axios';
import {feedbackStyles} from '../Styles';
import {Dropdown, Text} from './core';

const FeedbackComp = () => {
  const [credentials, setCredentials] = useState({
    fullName: '',
    fatherName: '',
    email: '',
    feedbackText: '',
    phoneNumber: '',
    isLoader: false,
    departmentsForFeedBack: null,
    departmentsForFeedBackText: '',
  });
  const [value, setValue] = useState('');
  const [items, setItems] = useState(departmentsForFeedBack);

  const sendToFirebase = async () => {
    const {
      fullName,
      fatherName,
      email,
      feedbackText,
      departmentsForFeedBack,
      departmentsForFeedBackText,
      phoneNumber,
    } = credentials;

    try {
      database()
        .ref(`appKey`)
        .once('value', async x => {
          let appKey = x.val();
          let obj = {
            fullName,
            fatherName,
            email,
            feedbackText,
            departmentsForFeedBack:
              departmentsForFeedBack === 'Other'
                ? departmentsForFeedBackText
                : departmentsForFeedBack,
            phoneNumber,
            uid: '',
            key: appKey,
          };

          try {
            const response = await axios.post(
              'https://nodejsbackend-xi.vercel.app/api/sendmail',
              obj,
            );
            if (response.data.message === 'Email sent successfully') {
              try {
                database()
                  .ref('setTimeStampFromApp')
                  .set(firebase.database.ServerValue.TIMESTAMP)
                  .then(() => {
                    database()
                      .ref('setTimeStampFromApp')
                      .once('value', e => {
                        let timeStamp = e.val();
                        obj.uid = timeStamp;
                        database()
                          .ref(`feedback/${timeStamp}`)
                          .set(obj)
                          .then(() => {
                            setCredentials({
                              phoneNumber: '',
                              feedbackText: '',
                              email: '',
                              fatherName: '',
                              fullName: '',
                              isLoader: false,
                              departmentsForFeedBackText: '',
                              departmentsForFeedBack: null,
                            });
                            alert(
                              `Dear ${obj.fullName}, Your feedback for ${obj.departmentsForFeedBack} has been received and will be shared with relevant personnel.`,
                            );
                          });
                      });
                  });
              } catch (e) {
                alert('Please check your network connection & try again');
                setCredentials({...credentials, isLoader: false});
              }
            }
          } catch (error) {
            alert(error.response.data.message);
            setCredentials({...credentials, isLoader: false});
          }
        });
    } catch (error) {
      alert(error.response.data.message);
      setCredentials({...credentials, isLoader: false});
    }
  };

  function verifyData() {
    setCredentials({...credentials, isLoader: true});
    const {feedbackText, departmentsForFeedBack} = credentials;

    const inputs = {
      fullName: 'Full name',
      fatherName: 'Father name or Husband name',
      phoneNumber: 'Phone number',
    };

    for (const key in inputs) {
      if (credentials[key] === '') {
        setCredentials({...credentials, isLoader: false});
        alert(`${inputs[key]} is required.`);
        return false;
      }
    }

    if (
      departmentsForFeedBack === null ||
      departmentsForFeedBack === 'Select Category'
    ) {
      setCredentials({...credentials, isLoader: false});
      alert('Please select the category for which feedback is being sent.');
    } else if (feedbackText.length < 15) {
      setCredentials({...credentials, isLoader: false});
      alert('Feedback text too short.');
    } else if (departmentsForFeedBack === 'Other') {
      departmentInput();
    } else {
      sendToFirebase();
    }
  }

  function departmentInput() {
    if (
      credentials.departmentsForFeedBackText === '' ||
      credentials.departmentsForFeedBackText === ' '
    ) {
      setCredentials({...credentials, isLoader: false});
      alert(
        'Please specify the department / category for which you want to share your feedback.',
      );
    } else {
      sendToFirebase();
    }
  }

  useEffect(() => {
    if (value !== '') {
      setCredentials({...credentials, departmentsForFeedBack: value});
    }
  }, [value]);

  const renderForm = () => {
    const {fullName, fatherName, email, feedbackText, phoneNumber} =
      credentials;
    return (
      <KeyboardAvoidingView behavior="height" style={{flex: 1}}>
        <ScrollView style={feedbackStyles.mainContainer}>
          <View style={feedbackStyles.container}>
            <Text style={feedbackStyles.heading}>Share your feedback</Text>
            <TextInput
              placeholderTextColor="#5e5e5e"
              style={feedbackStyles.textInputs}
              placeholder="Full Name"
              autoCompleteType="name"
              value={fullName}
              onChangeText={text =>
                setCredentials({...credentials, fullName: text})
              }
            />
            <TextInput
              placeholderTextColor="#5e5e5e"
              style={feedbackStyles.textInputs}
              placeholder="Father / Husband Name"
              value={fatherName}
              onChangeText={text =>
                setCredentials({...credentials, fatherName: text})
              }
            />
            <TextInput
              placeholderTextColor="#5e5e5e"
              style={feedbackStyles.textInputs}
              placeholder="Email Address"
              value={email}
              autoCompleteType="email"
              keyboardType="email-address"
              onChangeText={text =>
                setCredentials({...credentials, email: text})
              }
            />
            <TextInput
              placeholderTextColor="#5e5e5e"
              style={feedbackStyles.textInputs}
              placeholder="Phone Number"
              value={phoneNumber}
              autoCompleteType="tel"
              keyboardType="phone-pad"
              onChangeText={text =>
                setCredentials({...credentials, phoneNumber: text})
              }
            />
            <Dropdown
              value={value}
              items={items}
              setValue={setValue}
              setItems={setItems}
              title="Select Category"
            />
            {credentials.departmentsForFeedBack === 'Other' && (
              <TextInput
                placeholderTextColor="#5e5e5e"
                style={feedbackStyles.textInputs}
                placeholder="Related to"
                value={credentials.departmentsForFeedBackText}
                onChangeText={text =>
                  setCredentials({
                    ...credentials,
                    departmentsForFeedBackText: text,
                  })
                }
              />
            )}
            <TextInput
              placeholderTextColor="#5e5e5e"
              style={feedbackStyles.textArea}
              placeholder="Description"
              onChangeText={text =>
                setCredentials({...credentials, feedbackText: text})
              }
              value={feedbackText}
              multiline={true}
              maxLength={500}
            />
            <View style={feedbackStyles.btnWrapper}>
              <TouchableOpacity
                onPress={() => verifyData()}
                style={feedbackStyles.submitBtn}>
                <Text style={feedbackStyles.submitBtnTxt}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  };

  if (credentials.isLoader) {
    return <Loader />;
  } else {
    return renderForm();
  }
};

export default FeedbackComp;
