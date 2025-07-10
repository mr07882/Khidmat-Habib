import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import InputField from '../Components/FormElements/InputField';
import SubmitButton from '../Components/FormElements/SubmitButton';
import { colors } from '../Config/AppConfigData';

const EducationDonationBoxForm = () => {
  const [name, setName] = useState('');
  const [fatherOrHusband, setFatherOrHusband] = useState('');
  const [address, setAddress] = useState('');
  const [cnic, setCnic] = useState('');
  const [jcic, setJcic] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = () => {
    const formData = {
      name,
      fatherOrHusband,
      address,
      cnic,
      jcic,
      email,
      date,
    };

    console.log("Submitted Data:", formData);
    // TODO: Replace with actual submit logic (API call or local storage)
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      <Text style={styles.title}>Education Donation Box Request Form</Text>
      <Text style={styles.infoText}>
        By filling this form, you are requesting a donation box to be delivered to your home address. 
        This box will allow you to contribute towards the Jamaat's education fund by collecting donations conveniently at your home.
      </Text>

      <Text style={styles.section}>Personal Details</Text>
      <InputField label="Full Name" value={name} onChangeText={setName} placeholder="Full Name" />
      <InputField label="Father's / Husband's Name" value={fatherOrHusband} onChangeText={setFatherOrHusband} placeholder="Father's / Husband's Name" />
      <InputField label="Address" value={address} onChangeText={setAddress} placeholder="Home Address" />
      <InputField label="CNIC Number" value={cnic} onChangeText={setCnic} placeholder="XXXXX-XXXXXXX-X" keyboardType="numeric" />
      <InputField label="JCIC Number" value={jcic} onChangeText={setJcic} placeholder="JCIC Number" />
      <InputField label="Email Address" value={email} onChangeText={setEmail} placeholder="example@email.com" keyboardType="email-address" />
      <InputField label="Date" value={date} onChangeText={setDate} placeholder="DD-MM-YYYY" />

      <SubmitButton onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgColor || '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: colors.secondryColor,
    alignSelf: 'center',
    opacity: 1,
  },
  infoText: {
    fontSize: 14,
    color: '#000',
    marginBottom: 16,
    textAlign: 'center',
  },
  section: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 18,
    marginBottom: 8,
    color: colors.secondryColor,
    opacity: 1,
  },
});

export default EducationDonationBoxForm;
