import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import InputField from '../Components/FormElements/InputField';
import SubmitButton from '../Components/FormElements/SubmitButton';
import { colors } from '../Config/AppConfigData';
import { submitWadiEZainabForm } from '../Api/Firebase';
import { validateRequired, validateJCIC, validatePhone } from '../Api/Firebase/FormValidation';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

const TakhtiRepairForm = () => {
  const navigation = useNavigation();

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

  // Validation errors
  const [errors, setErrors] = useState({});

  // Get logged-in member's JCIC
  const userJCIC = useSelector((state) => state.reducer.userId);

  const validateForm = () => {
    const newErrors = {};

    // Validate deceased fields
    if (!validateRequired(deceasedName).isValid) newErrors.deceasedName = 'Name is required';
    if (!validateRequired(deceasedSurname).isValid) newErrors.deceasedSurname = 'Surname is required';
    if (!validateRequired(deceasedFatherName).isValid) newErrors.deceasedFatherName = 'Father/Husband Name is required';
    if (!validateJCIC(deceasedMembership).isValid) newErrors.deceasedMembership = 'Invalid JCIC number';
    if (!validateRequired(deceasedGraveNo).isValid) newErrors.deceasedGraveNo = 'Grave Number is required';

    // Validate applicant fields
    if (!validateRequired(applicantName).isValid) newErrors.applicantName = 'Name is required';
    if (!validateRequired(applicantSurname).isValid) newErrors.applicantSurname = 'Surname is required';
    if (!validateRequired(applicantFatherHusband).isValid) newErrors.applicantFatherHusband = 'Father/Husband Name is required';
    if (!validateJCIC(applicantMembership).isValid) newErrors.applicantMembership = 'Invalid JCIC number';
    if (!validatePhone(applicantTel).isValid) newErrors.applicantTel = 'Invalid phone number';
    if (!validateRequired(applicantRelation).isValid) newErrors.applicantRelation = 'Relationship is required';
    if (!validateRequired(applicantAddress).isValid) newErrors.applicantAddress = 'Address is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const formData = {
      deceased: {
        name: deceasedName,
        surname: deceasedSurname,
        fatherHusbandName: deceasedFatherName,
        jcic: deceasedMembership,
        graveNo: deceasedGraveNo,
      },
      applicant: {
        name: applicantName,
        surname: applicantSurname,
        fatherHusbandName: applicantFatherHusband,
        jcic: applicantMembership,
        phone: applicantTel,
        relation: applicantRelation,
        address: applicantAddress,
      },
    };

    const response = await submitWadiEZainabForm(userJCIC, formData);
    if (response.success) {
      Alert.alert(
        'Success',
        'Wadi E Zainab form submitted successfully! You will be notified about the status of your application.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } else {
      Alert.alert('Error', `Submission failed: ${response.error}`, [{ text: 'OK' }]);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      <Text style={styles.title}>Wadi E Zainab Authority Form</Text>
      <Text style={styles.infoText}>
        This form is to be completed by individuals requesting future burial in the upper grave of an existing lower grave in Wadi-e-Zainab (S.A.)
      </Text>

      {/* Section 1: Deceased */}
      <Text style={styles.section}>Section 1: Details of the Deceased</Text>
      <InputField label="Name" value={deceasedName} onChangeText={setDeceasedName} placeholder="Enter name of deceased" error={errors.deceasedName} />
      <InputField label="Surname" value={deceasedSurname} onChangeText={setDeceasedSurname} placeholder="Enter surname of deceased" error={errors.deceasedSurname} />
      <InputField label="Father/Husband Name" value={deceasedFatherName} onChangeText={setDeceasedFatherName} placeholder="Enter name of deceased's father/husband" error={errors.deceasedFatherName} />
      <InputField label="JCIC Number" value={deceasedMembership} onChangeText={setDeceasedMembership} placeholder="Enter 16-digit JCIC number" error={errors.deceasedMembership} />
      <InputField label="Grave Number" value={deceasedGraveNo} onChangeText={setDeceasedGraveNo} placeholder="Grave Number" error={errors.deceasedGraveNo} />

      {/* Section 2: Applicant */}
      <Text style={styles.section}>Section 2: Details of the Applicant</Text>
      <InputField label="Name" value={applicantName} onChangeText={setApplicantName} placeholder="Enter your name" error={errors.applicantName} />
      <InputField label="Surname" value={applicantSurname} onChangeText={setApplicantSurname} placeholder="Enter your surname" error={errors.applicantSurname} />
      <InputField label="Father/Husband Name" value={applicantFatherHusband} onChangeText={setApplicantFatherHusband} placeholder="Enter your father/husband name" error={errors.applicantFatherHusband} />
      <InputField label="JCIC Number" value={applicantMembership} onChangeText={setApplicantMembership} placeholder="Enter 16-digit JCIC number" error={errors.applicantMembership} />
      <InputField label="Cel No" value={applicantTel} onChangeText={setApplicantTel} placeholder="03XXXXXXXXX" error={errors.applicantTel} />
      <InputField label="Relationship with the relative" value={applicantRelation} onChangeText={setApplicantRelation} placeholder="e.g. Son, Daughter, Brother, Sister" error={errors.applicantRelation} />
      <InputField label="Address" value={applicantAddress} onChangeText={setApplicantAddress} placeholder="Enter your complete address" error={errors.applicantAddress} />

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
  inputLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.secondryColor,
  },
});

export default TakhtiRepairForm;
