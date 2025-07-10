import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import InputField from '../Components/FormElements/InputField';
import SubmitButton from '../Components/FormElements/SubmitButton';
import { colors } from '../Config/AppConfigData';



const TakhtiRepairForm = () => {
  // Section 1: Applicant
  const [applicantName, setApplicantName] = useState('');
  const [applicantSurname, setApplicantSurname] = useState('');
  const [applicantFatherHusband, setApplicantFatherHusband] = useState('');
  const [applicantMembership, setApplicantMembership] = useState('');
  const [applicantTel, setApplicantTel] = useState('');
  const [applicantRelation, setApplicantRelation] = useState('');
  const [applicantAddress, setApplicantAddress] = useState('');

  // Section 2: Deceased
  const [deceasedName, setDeceasedName] = useState('');
  const [deceasedSurname, setDeceasedSurname] = useState('');
  const [deceasedFatherName, setDeceasedFatherName] = useState('');
  const [deceasedMembership, setDeceasedMembership] = useState('');
  const [deceasedGraveNo, setDeceasedGraveNo] = useState('');

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      <Text style={styles.title}>Wadi E Zainab Authority Form</Text>
      <Text style={styles.infoText}>
        This form is to be completed by individuals requesting future burial in the upper grave of an existing lower grave in Wadi-e-Zainab (S.A.)
      </Text>

    
      {/* Section 1: Deceased */}
      <Text style={styles.section}>Section 1: Details of the Deceased</Text>
      <InputField label="Name" value={deceasedName} onChangeText={setDeceasedName} placeholder="Name" />
      <InputField label="Surname" value={deceasedSurname} onChangeText={setDeceasedSurname} placeholder="Surname" />
      <InputField label="Father/Husband Name" value={deceasedFatherName} onChangeText={setDeceasedFatherName} placeholder="Father/Husband Full Name" />
      <InputField label="Jamaat Membership Number" value={deceasedMembership} onChangeText={setDeceasedMembership} placeholder="Membership Number" />
      <InputField label="Grave Number" value={deceasedGraveNo} onChangeText={setDeceasedGraveNo} placeholder="Grave Number" />

      {/* Section 2: Applicant */}
      <Text style={styles.section}>Section 2: Details of the Applicant</Text>
      <InputField label="Name" value={applicantName} onChangeText={setApplicantName} placeholder="Name" />
      <InputField label="Surname" value={applicantSurname} onChangeText={setApplicantSurname} placeholder="Surname" />
      <InputField label="Father/Husband Name" value={applicantFatherHusband} onChangeText={setApplicantFatherHusband} placeholder="Father/Husband Full Name" />
      <InputField label="Jamaat Membership Number" value={applicantMembership} onChangeText={setApplicantMembership} placeholder="Membership Number" />
      <InputField label="Cel No" value={applicantTel} onChangeText={setApplicantTel} placeholder="Cel No" />
      <InputField label="Relationship with the relative" value={applicantRelation} onChangeText={setApplicantRelation} placeholder="Relationship" />
      <InputField label="Address" value={applicantAddress} onChangeText={setApplicantAddress} placeholder="Complete Address" />

      <SubmitButton onPress={() => { /* handle submit logic here */ }} />
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
  inputLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.secondryColor,
  },
});

export default TakhtiRepairForm;
