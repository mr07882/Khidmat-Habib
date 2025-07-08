import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import InputField from '../Components/FormElements/InputField';
import { colors } from '../Config/AppConfigData';
import SubmitButton from '../Components/FormElements/SubmitButton';

const NominationWithdrawal = ({ navigation }) => {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [candidateName, setCandidateName] = useState('');
  const [fatherOrHusband, setFatherOrHusband] = useState('');
  const [post, setPost] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [jcic, setJcic] = useState('');
  const [signature, setSignature] = useState('');

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const handleSubmit = () => {
    if (!candidateName || !fatherOrHusband || !post || !serialNumber || !jcic || !signature) {
      Alert.alert('Incomplete', 'Please fill all fields.');
      return;
    }
    Alert.alert('Submitted', 'Your withdrawal request has been submitted.');
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Information Section */}
      <Text style={styles.sectionTitle}>Nomination Withdrawal Form</Text>
      <Text style={styles.infoText}>
        This form is for candidates who wish to withdraw their nomination from the Jamaat election. Please fill in your details below to submit your withdrawal request.
      </Text>

      {/* Personal Details Section */}
      <Text style={styles.sectionHeader}>Personal Details</Text>
      <InputField
        label="Candidate Name"
        value={candidateName}
        onChangeText={setCandidateName}
        placeholder="Enter your name"
      />
      <InputField
        label="S/o (Father/Husband Name)"
        value={fatherOrHusband}
        onChangeText={setFatherOrHusband}
        placeholder="Enter father/husband name"
      />
      <InputField
        label="Post"
        value={post}
        onChangeText={setPost}
        placeholder="Enter post name"
      />
      <InputField
        label="Serial Number"
        value={serialNumber}
        onChangeText={setSerialNumber}
        placeholder="Enter serial number"
        keyboardType="numeric"
      />
      <InputField
        label="JCIC / JID No."
        value={jcic}
        onChangeText={setJcic}
        placeholder="Enter JCIC/JID number"
      />

      {/* Declaration Section */}
      <Text style={styles.sectionHeader}>Declaration</Text>
      <Text style={styles.bodyText}>I would like to inform you that I want to withdraw my nomination from the post mentioned above in the forthcoming Jamaat Election. Please ensure my name does not appear on the <Text style={{fontWeight:'bold'}}>final list of candidates</Text>.</Text>
      <Text style={styles.bodyText}>Thanking you for your co-operation, I remain.</Text>
      <Text style={styles.bodyText}>Yours truly,</Text>
      <InputField
        label="Signature (Type your name)"
        value={signature}
        onChangeText={setSignature}
        placeholder="Signature"
      />
      <SubmitButton onPress={handleSubmit} label="Submit" style={{ marginTop: 24 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bgColor || '#fff',
    padding: 18,
    flexGrow: 1,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.secondryColor,
    alignSelf: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  infoText: {
    fontSize: 15,
    color: '#000',
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.secondryColor,
    marginTop: 20,
    marginBottom: 10,
  },
  inputLabel: {
    fontWeight: 'bold',
    color: colors.secondryColor,
  },
  toText: {
    fontSize: 15,
    color: colors.primaryColor,
    marginTop: 10,
    marginBottom: 2,
  },
  address: {
    fontSize: 14,
    color: colors.primaryColor,
    marginBottom: 10,
    lineHeight: 18,
  },
  subject: {
    fontSize: 15,
    color: colors.primaryColor,
    marginBottom: 10,
  },
  bodyText: {
    fontSize: 15,
    color: '#000',
    marginBottom: 6,
  },
  submitButton: {
    backgroundColor: colors.secondryColor,
    borderRadius: 8,
    marginTop: 24,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default NominationWithdrawal;
