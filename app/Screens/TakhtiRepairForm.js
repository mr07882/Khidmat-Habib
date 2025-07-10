import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import InputField from '../Components/FormElements/InputField';
import RadioGroup from '../Components/FormElements/RadioGroup';
import SubmitButton from '../Components/FormElements/SubmitButton';
import { colors } from '../Config/AppConfigData';

const graveyardOptions = [
  { label: 'Hussaini Bagh 1', value: 'hussaini1' },
  { label: 'Hussaini Bagh 2', value: 'hussaini2' },
  { label: 'Wadi e Zainab', value: 'wadi' },
];

const TakhtiRepairForm = () => {
  // Section 1: Applicant
  const [applicantName, setApplicantName] = useState('');
  const [applicantSurname, setApplicantSurname] = useState('');
  const [applicantFatherHusband, setApplicantFatherHusband] = useState('');
  const [applicantMembership, setApplicantMembership] = useState('');
  const [applicantTel, setApplicantTel] = useState('');
  const [applicantMobile, setApplicantMobile] = useState('');
  const [applicantDate, setApplicantDate] = useState('');
  const [applicantRelation, setApplicantRelation] = useState('');

  // Section 2: Deceased
  const [deceasedName, setDeceasedName] = useState('');
  const [deceasedSurname, setDeceasedSurname] = useState('');
  const [deceasedFatherName, setDeceasedFatherName] = useState('');
  const [deceasedHusbandName, setDeceasedHusbandName] = useState('');
  const [deceasedHusbandSurname, setDeceasedHusbandSurname] = useState('');
  const [deceasedMembership, setDeceasedMembership] = useState('');
  const [deceasedAge, setDeceasedAge] = useState('');
  const [deceasedDeathDate, setDeceasedDeathDate] = useState('');
  const [deceasedGraveNo, setDeceasedGraveNo] = useState('');

  // Section 3: Graveyard location
  const [graveyard, setGraveyard] = useState('');

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      <Text style={styles.title}>Takhti (Grave Stone) Installation Form</Text>
      <Text style={styles.infoText}>
        This form is for individuals who want to request to install a Grave Stone (Takhti) on the grave of their family relative.
      </Text>

      {/* Section 1: Applicant */}
      <Text style={styles.section}>Section 1: Details of the Applicant</Text>
      <InputField label="Name" value={applicantName} onChangeText={setApplicantName} placeholder="Name" />
      <InputField label="Surname" value={applicantSurname} onChangeText={setApplicantSurname} placeholder="Surname" />
      <InputField label="Father's/Husband's Name" value={applicantFatherHusband} onChangeText={setApplicantFatherHusband} placeholder="Father's/Husband's Name" />
      <InputField label="Jamaat Membership Number" value={applicantMembership} onChangeText={setApplicantMembership} placeholder="Membership Number" />
      <InputField label="Tel No" value={applicantTel} onChangeText={setApplicantTel} placeholder="Tel No" />
      <InputField label="Mobile No" value={applicantMobile} onChangeText={setApplicantMobile} placeholder="Mobile No" />
      <InputField label="Date of filling the form" value={applicantDate} onChangeText={setApplicantDate} placeholder="Date" />
      <InputField label="Relationship with the relative" value={applicantRelation} onChangeText={setApplicantRelation} placeholder="Relationship" />

      {/* Section 2: Deceased */}
      <Text style={styles.section}>Section 2: Details of the Deceased</Text>
      <InputField label="Name" value={deceasedName} onChangeText={setDeceasedName} placeholder="Name" />
      <InputField label="Surname" value={deceasedSurname} onChangeText={setDeceasedSurname} placeholder="Surname" />
      <InputField label="Father's Name" value={deceasedFatherName} onChangeText={setDeceasedFatherName} placeholder="Father's Name" />
      <InputField label="Husband's Name" value={deceasedHusbandName} onChangeText={setDeceasedHusbandName} placeholder="Husband's Name" />
      <InputField label="Husband's Surname" value={deceasedHusbandSurname} onChangeText={setDeceasedHusbandSurname} placeholder="Husband's Surname" />
      <InputField label="Jamaat Membership Number" value={deceasedMembership} onChangeText={setDeceasedMembership} placeholder="Membership Number" />
      <InputField label="Age" value={deceasedAge} onChangeText={setDeceasedAge} placeholder="Age" />
      <InputField label="Date Of Death" value={deceasedDeathDate} onChangeText={setDeceasedDeathDate} placeholder="Date Of Death" />
      <InputField label="Grave Number" value={deceasedGraveNo} onChangeText={setDeceasedGraveNo} placeholder="Grave Number" />

      {/* Section 3: Graveyard location */}
      <Text style={styles.section}>Section 3: Graveyard Location</Text>
      <RadioGroup
        options={graveyardOptions.map(opt => ({ label: <Text style={{ color: colors.secondryColor }}>{opt.label}</Text>, value: opt.value }))}
        value={graveyard}
        onChange={setGraveyard}
        radioColor={colors.secondryColor}
      />

      

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
