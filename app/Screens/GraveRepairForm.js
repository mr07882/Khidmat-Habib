import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import InputField from '../Components/FormElements/InputField';
import RadioGroup from '../Components/FormElements/RadioGroup';
import SubmitButton from '../Components/FormElements/SubmitButton';
import { colors } from '../Config/AppConfigData';
import { submitGraveRepairForm } from '../Api/Firebase';
import { validateRequired, validateJCIC, validatePhone } from '../Api/Firebase/FormValidation';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

const graveyardOptions = [
  { label: 'Hussaini Bagh 1', value: 'hussaini_bagh_1' },
  { label: 'Hussaini Bagh 2', value: 'hussaini_bagh_2' },
  { label: 'Wadi e Zainab', value: 'wadi_e_zainab' },
];

const GraveRepairForm = () => {
  const navigation = useNavigation();

  // Section 1: Applicant Details
  const [applicantName, setApplicantName] = useState('');
  const [applicantFatherHusbandName, setApplicantFatherHusbandName] = useState('');
  const [membershipNo, setMembershipNo] = useState('');
  const [telNo, setTelNo] = useState('');
  const [cellNo, setCellNo] = useState('');

  // Section 2: Deceased Person Details
  const [deceasedName, setDeceasedName] = useState('');
  const [deceasedFatherHusbandName, setDeceasedFatherHusbandName] = useState('');
  const [deceasedSurname, setDeceasedSurname] = useState('');
  const [graveNo, setGraveNo] = useState('');
  const [graveyard, setGraveyard] = useState('');

  // Section 3: Repair Details
  const [repairDescription, setRepairDescription] = useState('');

  // Validation errors
  const [errors, setErrors] = useState({});

  // Get logged-in member's JCIC
  const userJCIC = useSelector((state) => state.reducer.userId);

  const validateForm = () => {
    const newErrors = {};

    // Validate applicant fields
    if (!validateRequired(applicantName).isValid) newErrors.applicantName = 'Name is required';
    if (!validateRequired(applicantFatherHusbandName).isValid) newErrors.applicantFatherHusbandName = 'Father/Husband Name is required';
    if (!validateJCIC(membershipNo).isValid) newErrors.membershipNo = 'Invalid Membership No';
    if (!validatePhone(cellNo).isValid) newErrors.cellNo = 'Invalid Cell No';

    // Validate deceased fields
    if (!validateRequired(deceasedName).isValid) newErrors.deceasedName = 'Name is required';
    if (!validateRequired(deceasedFatherHusbandName).isValid) newErrors.deceasedFatherHusbandName = 'Father/Husband Name is required';
    if (!validateRequired(deceasedSurname).isValid) newErrors.deceasedSurname = 'Surname is required';
    if (!validateRequired(graveNo).isValid) newErrors.graveNo = 'Grave No is required';
    if (!validateRequired(graveyard).isValid) newErrors.graveyard = 'Graveyard is required';

    // Validate repair details
    if (!validateRequired(repairDescription).isValid) newErrors.repairDescription = 'Repair description is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const formData = {
      applicant: {
        name: applicantName,
        fatherHusbandName: applicantFatherHusbandName,
        membershipNo,
        telNo,
        cellNo,
      },
      deceased: {
        name: deceasedName,
        fatherHusbandName: deceasedFatherHusbandName,
        surname: deceasedSurname,
        graveNo,
        graveyard,
      },
      repair: {
        description: repairDescription,
      },
    };

    const response = await submitGraveRepairForm(userJCIC, formData);
    if (response.success) {
      Alert.alert(
        'Success',
        'Grave Repair form submitted successfully! You will be notified about the status of your application.',
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
      <Text style={styles.title}>Grave Repair Form</Text>
      <Text style={styles.infoText}>
        This form is used to request the repair of a grave of a loved one.
      </Text>

      {/* Section 1: Applicant Details */}
      <Text style={styles.section}>Section 1: Applicant Details</Text>
      <InputField 
        label="Name" 
        value={applicantName} 
        onChangeText={setApplicantName} 
        placeholder="Enter your full name" 
        error={errors.applicantName}
      />
      <InputField 
        label="Father's/Husband's Name" 
        value={applicantFatherHusbandName} 
        onChangeText={setApplicantFatherHusbandName} 
        placeholder="Enter your father's or husband's name" 
        error={errors.applicantFatherHusbandName}
      />
      <InputField 
        label="Membership No" 
        value={membershipNo} 
        onChangeText={setMembershipNo} 
        placeholder="XXXXXXXXXXXXXXXX" 
        error={errors.membershipNo}
      />
      <InputField 
        label="Tel No" 
        value={telNo} 
        onChangeText={setTelNo} 
        placeholder="021XXXXXXXX" 
        keyboardType="phone-pad"
      />
      <InputField 
        label="Cell No" 
        value={cellNo} 
        onChangeText={setCellNo} 
        placeholder="03XXXXXXXXX" 
        keyboardType="phone-pad"
        error={errors.cellNo}
      />

      {/* Section 2: Deceased Person Details */}
      <Text style={styles.section}>Section 2: Details of the Person Whose Grave is to be Repaired</Text>
      <InputField 
        label="Name" 
        value={deceasedName} 
        onChangeText={setDeceasedName} 
        placeholder="Full Name of Deceased" 
        error={errors.deceasedName}
      />
      <InputField 
        label="Father's/Husband's Name" 
        value={deceasedFatherHusbandName} 
        onChangeText={setDeceasedFatherHusbandName} 
        placeholder="Father's or Husband's Name of Deceased" 
        error={errors.deceasedFatherHusbandName}
      />
      <InputField 
        label="Surname" 
        value={deceasedSurname} 
        onChangeText={setDeceasedSurname} 
        placeholder="Surname of Deceased" 
        error={errors.deceasedSurname}
      />
      <InputField 
        label="Grave No" 
        value={graveNo} 
        onChangeText={setGraveNo} 
        placeholder="Grave Number" 
        error={errors.graveNo}
      />

      <Text style={styles.subsection}>Graveyard Location</Text>
      <RadioGroup
        options={graveyardOptions.map(opt => ({
          label: <Text style={{ color: colors.secondryColor }}>{opt.label}</Text>,
          value: opt.value,
        }))}
        value={graveyard}
        onChange={setGraveyard}
        radioColor={colors.secondryColor}
        direction="column"
        error={errors.graveyard}
      />

      {/* Section 3: Repair Details */}
      <Text style={styles.section}>Section 3: Repair Work Details</Text>
      <InputField 
        label="Type of Repair Work Required" 
        value={repairDescription} 
        onChangeText={setRepairDescription} 
        placeholder="Please describe in detail the type of repair work required for the grave..." 
        multiline={true}
        style={styles.textAreaContainer}
        inputStyle={styles.textArea}
        error={errors.repairDescription}
      />

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
  },
  subsection: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
    color: colors.secondryColor,
  },
  textAreaContainer: {
    marginBottom: 16,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
    paddingTop: 12,
    paddingBottom: 12,
  },
});

export default GraveRepairForm;