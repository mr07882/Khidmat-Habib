import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import InputField from '../Components/FormElements/InputField';
import DropDownMenu from '../Components/FormElements/DropDownMenu';
import SubmitButton from '../Components/FormElements/SubmitButton';
import { colors } from '../Config/AppConfigData';
import { submitTakhtiRequestForm } from '../Api/Firebase';
import { validateTakhtiRequestForm } from '../Api/Firebase/FormValidation';
import { useSelector } from 'react-redux';

const graveyardOptions = [
  { label: 'Hussaini Bagh 1', value: 'hussaini1' },
  { label: 'Hussaini Bagh 2', value: 'hussaini2' },
  { label: 'Wadi e Zainab', value: 'wadi' },
];

const TakhtiRepairForm = () => {
  const userJCIC = useSelector(state => state.reducer.userId); // Retrieve JCIC of logged-in user

  // Section 1: Applicant
  const [applicantName, setApplicantName] = useState('');
  const [applicantSurname, setApplicantSurname] = useState('');
  const [applicantFatherHusband, setApplicantFatherHusband] = useState('');
  const [applicantMembership, setApplicantMembership] = useState('');
  const [applicantTel, setApplicantTel] = useState('');
  const [applicantMobile, setApplicantMobile] = useState('');
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

  // Automatically fetch the current date
  const currentDate = new Date().toISOString();

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    const cnicRegex = /^[0-9]{5}-[0-9]{7}-[0-9]$/;
    const jcicRegex = /^[0-9]{16}$/;
    const phoneRegex = /^03[0-9]{9}$/;

    if (!applicantName) newErrors.applicantName = 'Applicant name is required.';
    if (!applicantSurname) newErrors.applicantSurname = 'Applicant surname is required.';
    if (!applicantFatherHusband) newErrors.applicantFatherHusband = 'Father/Husband name is required.';
    if (!applicantMembership) {
      newErrors.applicantMembership = 'JCIC is required.';
    } else if (!jcicRegex.test(applicantMembership)) {
      newErrors.applicantMembership = 'Invalid JCIC format. It must be a 16-digit numeric value.';
    }
    if (!applicantMobile) {
      newErrors.applicantMobile = 'Mobile number is required.';
    } else if (!phoneRegex.test(applicantMobile)) {
      newErrors.applicantMobile = 'Invalid mobile number format. Use 03XXXXXXXXX.';
    }
    if (!applicantRelation) newErrors.applicantRelation = 'Relationship is required.';

    if (!deceasedName) newErrors.deceasedName = 'Deceased name is required.';
    if (!deceasedSurname) newErrors.deceasedSurname = 'Deceased surname is required.';
    if (!deceasedFatherName) newErrors.deceasedFatherName = 'Deceased father name is required.';
    if (!deceasedMembership) {
      newErrors.deceasedMembership = 'JCIC of deceased is required.';
    } else if (!jcicRegex.test(deceasedMembership)) {
      newErrors.deceasedMembership = 'Invalid JCIC format. It must be a 16-digit numeric value.';
    }
    if (!deceasedAge) newErrors.deceasedAge = 'Deceased age is required.';
    if (!deceasedDeathDate) newErrors.deceasedDeathDate = 'Date of death is required.';
    if (!deceasedGraveNo) newErrors.deceasedGraveNo = 'Grave number is required.';

    if (!graveyard) newErrors.graveyard = 'Graveyard location is required.';

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const formData = {
      applicantName,
      applicantSurname,
      applicantFatherHusband,
      jcic: applicantMembership, // Renamed and validated as JCIC
      applicantTel,
      applicantMobile,
      applicantRelation,
      deceasedName,
      deceasedSurname,
      deceasedFatherName,
      deceasedHusbandName,
      deceasedHusbandSurname,
      deceasedMembership,
      deceasedAge,
      deceasedDeathDate,
      deceasedGraveNo,
      graveyard,
      applicantDate: currentDate, // Automatically set the current date
    };

    const validation = validateTakhtiRequestForm(formData);
    if (!validation.isValid) {
      alert(`Validation Errors: \n${validation.errors.join('\n')}`);
      return;
    }

    try {
      const response = await submitTakhtiRequestForm(formData.jcic, formData);
      if (response.success) {
        alert('Form submitted successfully!');
      } else {
        alert(`Submission failed: ${response.error}`);
      }
    } catch (error) {
      alert(`An error occurred: ${error.message}`);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      <Text style={styles.title}>Takhti (Grave Stone) Installation Form</Text>
      <Text style={styles.infoText}>
        This form is for individuals who want to request to install a Grave Stone (Takhti) on the grave of their family relative.
      </Text>

      {/* Section 1: Applicant */}
      <Text style={styles.section}>Section 1: Details of the Applicant</Text>
      <InputField
        label="Name"
        value={applicantName}
        onChangeText={setApplicantName}
        placeholder="Enter your name"
        textStyle={{ color: 'black' }} // Set input text color to black
      />
      {errors.applicantName && <Text style={styles.error}>{errors.applicantName}</Text>}
      <InputField
        label="Surname"
        value={applicantSurname}
        onChangeText={setApplicantSurname}
        placeholder="Enter your surname"
        textStyle={{ color: 'black' }} // Set input text color to black
      />
      {errors.applicantSurname && <Text style={styles.error}>{errors.applicantSurname}</Text>}
      <InputField
        label="Father's/Husband's Name"
        value={applicantFatherHusband}
        onChangeText={setApplicantFatherHusband}
        placeholder="Enter name of father/husband"
        textStyle={{ color: 'black' }} // Set input text color to black
      />
      {errors.applicantFatherHusband && <Text style={styles.error}>{errors.applicantFatherHusband}</Text>}
      <InputField
        label="JCIC Number"
        value={applicantMembership}
        onChangeText={setApplicantMembership}
        placeholder="Enter your 16-digit JCIC Number"
        textStyle={{ color: 'black' }} // Set input text color to black
      />
      {errors.applicantMembership && <Text style={styles.error}>{errors.applicantMembership}</Text>}
      <InputField
        label="Tel No"
        value={applicantTel}
        onChangeText={setApplicantTel}
        placeholder="021XXXXXXXX"
        textStyle={{ color: 'black' }} // Set input text color to black
      />
      <InputField
        label="Mobile No"
        value={applicantMobile}
        onChangeText={setApplicantMobile}
        placeholder="03XXXXXXXXX"
        textStyle={{ color: 'black' }} // Set input text color to black
      />
      {errors.applicantMobile && <Text style={styles.error}>{errors.applicantMobile}</Text>}
      <InputField
        label="Relationship with the relative"
        value={applicantRelation}
        onChangeText={setApplicantRelation}
        placeholder="e.g. Son, Daughter, etc."
        textStyle={{ color: 'black' }} // Set input text color to black
      />
      {errors.applicantRelation && <Text style={styles.error}>{errors.applicantRelation}</Text>}

      {/* Section 2: Deceased */}
      <Text style={styles.section}>Section 2: Details of the Deceased</Text>
      <InputField
        label="Enter name of the deceased"
        value={deceasedName}
        onChangeText={setDeceasedName}
        placeholder="Name"
        textStyle={{ color: 'black' }} // Set input text color to black
      />
      {errors.deceasedName && <Text style={styles.error}>{errors.deceasedName}</Text>}
      <InputField
        label="Surname"
        value={deceasedSurname}
        onChangeText={setDeceasedSurname}
        placeholder="Enter surname of the deceased"
        textStyle={{ color: 'black' }} // Set input text color to black
      />
      {errors.deceasedSurname && <Text style={styles.error}>{errors.deceasedSurname}</Text>}
      <InputField
        label="Father's Name"
        value={deceasedFatherName}
        onChangeText={setDeceasedFatherName}
        placeholder="Enter name of deceased's father"
        textStyle={{ color: 'black' }} // Set input text color to black
      />
      {errors.deceasedFatherName && <Text style={styles.error}>{errors.deceasedFatherName}</Text>}
      <InputField
        label="Husband's Name"
        value={deceasedHusbandName}
        onChangeText={setDeceasedHusbandName}
        placeholder="Enter name of deceased's husband"
        textStyle={{ color: 'black' }} // Set input text color to black
      />
      {errors.deceasedHusbandName && <Text style={styles.error}>{errors.deceasedHusbandName}</Text>}
      <InputField
        label="Husband's Surname"
        value={deceasedHusbandSurname}
        onChangeText={setDeceasedHusbandSurname}
        placeholder="Enter surname of deceased's husband"
        textStyle={{ color: 'black' }} // Set input text color to black
      />
      {errors.deceasedHusbandSurname && <Text style={styles.error}>{errors.deceasedHusbandSurname}</Text>}
      <InputField
        label="JCIC Number"
        value={deceasedMembership}
        onChangeText={setDeceasedMembership}
        placeholder="Enterr 16-digit JCIC Number of the deceased"
        textStyle={{ color: 'black' }} // Set input text color to black
      />
      {errors.deceasedMembership && <Text style={styles.error}>{errors.deceasedMembership}</Text>}
      <InputField
        label="Age"
        value={deceasedAge}
        onChangeText={setDeceasedAge}
        placeholder="Enter age of the deceased"
        textStyle={{ color: 'black' }} // Set input text color to black
      />
      {errors.deceasedAge && <Text style={styles.error}>{errors.deceasedAge}</Text>}
      <InputField
        label="Date Of Death"
        value={deceasedDeathDate}
        onChangeText={setDeceasedDeathDate}
        placeholder="DD-MM-YYYY"
        textStyle={{ color: 'black' }} // Set input text color to black
      />
      {errors.deceasedDeathDate && <Text style={styles.error}>{errors.deceasedDeathDate}</Text>}
      <InputField
        label="Grave Number"
        value={deceasedGraveNo}
        onChangeText={setDeceasedGraveNo}
        placeholder="Enter grave number"
        textStyle={{ color: 'black' }} // Set input text color to black
      />
      {errors.deceasedGraveNo && <Text style={styles.error}>{errors.deceasedGraveNo}</Text>}

      {/* Section 3: Graveyard location */}
      <Text style={styles.section}>Section 3: Graveyard Location</Text>
      <DropDownMenu
        label="Graveyard Location"
        options={graveyardOptions.map(opt => ({ label: opt.label, value: opt.value }))}
        selectedValue={graveyard}
        onValueChange={setGraveyard}
      />
      {errors.graveyard && <Text style={styles.error}>{errors.graveyard}</Text>}

      <SubmitButton label="Submit" onPress={handleSubmit} />
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
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  },
});

export default TakhtiRepairForm;
