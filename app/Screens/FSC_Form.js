import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { colors } from '../Config/AppConfigData';
import {
  InputField,
  SubmitButton,
  PhotoUpload,
  RadioGroup,
  Checkbox,
} from '../Components/FormElements';
import { submitFSCForm } from '../Api/Firebase/FormAPI';
import { validateRequired, validateJCIC, validateEmail, validatePhone } from '../Api/Firebase/FormValidation';
import { uploadImageToCloudinary } from '../Api/Firebase/CloudinaryService';
import { getMemberByJCIC } from '../Api/Firebase/MemberInformation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const facilitiesList = [
  { label: 'Swimming', value: 'swimming' },
  { label: 'Gymnasium', value: 'gymnasium' },
  { label: 'Indoor Games', value: 'indoor' },
  { label: 'Squash', value: 'squash' },
];

const terms = [
  'Entry in Sports Complex will only be allowed on presentation of Original JCIC.',
  'No Membership fee.',
  'Locker Facility will be charged. Wet clothes not to be kept in lockers.',
  'For any facility maximum 40 members can avail in any specific hour on first come first served basis.',
  'Children less than 3 feet 6 inch height will not be allowed on swimming pool floor.',
  'Boys over 5 year will not be allowed during ladies timing & Girls over 5 year will not be allowed during gents timing.',
  'Photography is not allowed at any place in the Sports Complex.',
  'Nobody will be allowed to carry Mobile phone or Camera in the facilities.',
  'Sports Complex Building is NO SMOKING area, Cigarettes, Pan, Chalia, Gutka, Mainpuri etc. will not be allowed.',
  'Members are not allowed to use abusive language in Sports Complex.',
  'Necessary disciplinary action will be taken against those who will misbehave with any staff or any other member.',
  'Management reserves the right to cancel membership of Sports Complex any time without giving any reason.',
];

const FSC_Form = () => {
  // Section 1: Applicant Details
  const [name, setName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [surname, setSurname] = useState('');
  const [address, setAddress] = useState('');
  const [cnic, setCnic] = useState('');
  const [jcic, setJcic] = useState('');
  const [cellNo, setCellNo] = useState('');
  const [telNo, setTelNo] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [photo, setPhoto] = useState(null);

  // Section 2: Facilities
  const [selectedFacilities, setSelectedFacilities] = useState([]);

  // Section 3: Family Members
  const [familyMembers, setFamilyMembers] = useState([]);
  const addFamilyMember = () => {
    setFamilyMembers([...familyMembers, { name: '', jcic: '', relation: '' }]);
  };
  const updateFamilyMember = (idx, field, value) => {
    const updated = familyMembers.map((m, i) =>
      i === idx ? { ...m, [field]: value } : m
    );
    setFamilyMembers(updated);
  };
  const removeFamilyMember = (idx) => {
    setFamilyMembers(familyMembers.filter((_, i) => i !== idx));
  };

  // Section 4: Terms
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});
  const [userJCIC, setUserJCIC] = useState(null);
  const navigation = useNavigation();
  const scrollRef = useRef();

  useEffect(() => {
    const getUserJCIC = async () => {
      try {
        const storedJCIC = await AsyncStorage.getItem('JCIC');
        setUserJCIC(storedJCIC);
      } catch (error) {
        console.error('Failed to retrieve JCIC:', error);
      }
    };
    getUserJCIC();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!validateRequired(name).isValid) newErrors.name = 'Name is required';
    if (!validateRequired(fatherName).isValid) newErrors.fatherName = "Father's name is required";
    if (!validateRequired(surname).isValid) newErrors.surname = 'Surname is required';
    if (!validateRequired(address).isValid) newErrors.address = 'Address is required';
    if (!validateJCIC(jcic).isValid) newErrors.jcic = 'Invalid JCIC number';
    if (!validatePhone(cellNo).isValid) newErrors.cellNo = 'Invalid cell number';
    if (email && !validateEmail(email).isValid) newErrors.email = 'Invalid email address';
    if (!photo) newErrors.photo = 'Photo is required';
    if (selectedFacilities.length === 0) newErrors.facilities = 'At least one facility must be selected';
    if (!validateRequired(cnic).isValid) newErrors.cnic = 'CNIC number is required';
    if (!validateRequired(email).isValid) {
      newErrors.email = 'Email is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const scrollToError = (errors, scrollRef) => {
    const errorKeys = Object.keys(errors);
    if (errorKeys.length > 0) {
      const firstErrorKey = errorKeys[0];
      const errorPositions = {
        name: 0,
        fatherName: 1,
        surname: 2,
        address: 3,
        cnic: 4,
        jcic: 5,
        cellNo: 6,
        email: 7,
        photo: 8,
        facilities: 9,
      };
      const position = errorPositions[firstErrorKey];
      if (position !== undefined) {
        scrollRef.current.scrollTo({ y: position * 100, animated: true });
      }
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      scrollToError(errors, scrollRef);
      return;
    }

    if (!userJCIC) {
      alert('User not authenticated. Please login again.');
      return;
    }

    const uploadedPhoto = await uploadImageToCloudinary(photo);
    if (!uploadedPhoto.success) {
      setErrors((prev) => ({ ...prev, photo: 'Failed to upload photo' }));
      return;
    }

    const formData = {
      name,
      fatherName,
      surname,
      address,
      cnic,
      jcic: userJCIC, // Use logged-in member's JCIC
      cellNo,
      telNo,
      email,
      gender,
      photo: uploadedPhoto.url,
      facilities: selectedFacilities,
      familyMembers: familyMembers.length > 0 ? familyMembers : null, // Save family members if provided
      agreed,
    };

    const response = await submitFSCForm(userJCIC, formData);
    if (!response.success) {
      alert('Failed to submit form. Please try again.');
    } else {
      Alert.alert(
        'Success',
        'Nomination form submitted successfully! You will be notified about the status of your application.',
        [
          { text: 'OK', onPress: () => navigation.navigate('FormsScreen') },
        ]
      );
    }
  };

  const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
  ];

  return (
    <ScrollView ref={scrollRef} style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      <Text style={styles.title}>Fatimiyah Sports Complex Membership Form</Text>
      <Text style={styles.infoText}>
        This form is used to register individuals and their families for membership at the Fatimiyah Sports Complex, which is owned and managed by Khoja (Pirhai) Shia Isna Asheri Jamaat, Karachi.
      </Text>

      {/* Section 1: Applicant Details */}
      <Text style={styles.section}>Section 1: Applicant Details</Text>
      <InputField label="Name" value={name} onChangeText={setName} placeholder="Enter your full name" error={errors.name} />
      <RadioGroup
        options={genderOptions.map(opt => ({
          label: <Text style={{ color: colors.secondryColor }}>{opt.label}</Text>,
          value: opt.value,
        }))}
        value={gender}
        onChange={setGender}
        radioColor={colors.secondryColor}
      />
      <InputField label="Father/Husband's Name" value={fatherName} onChangeText={setFatherName} placeholder="Enter the name of your father/husband" error={errors.fatherName} />
      <InputField label="Surname" value={surname} onChangeText={setSurname} placeholder="Enter your surname" error={errors.surname} />
      <InputField label="Address" value={address} onChangeText={setAddress} placeholder="Enter your complete address" multiline error={errors.address} />
      <InputField
        label="CNIC No"
        value={cnic}
        onChangeText={setCnic}
        placeholder="XXXXX-XXXXXXX-X"
        keyboardType="numeric"
        error={errors.cnic} // Display validation error
      />
      <InputField label="JCIC No" value={jcic} onChangeText={setJcic} placeholder="Enter your 16-digit JCIC number" error={errors.jcic} />
      <InputField label="Cell No" value={cellNo} onChangeText={setCellNo} placeholder="03XXXXXXXXX" keyboardType="phone-pad" error={errors.cellNo} />
      <InputField label="Tel No" value={telNo} onChangeText={setTelNo} placeholder="021XXXXXXX" keyboardType="phone-pad" />
      <InputField label="Email" value={email} onChangeText={setEmail} placeholder="Email Address" keyboardType="email-address" error={errors.email} />
      <PhotoUpload photo={photo} setPhoto={setPhoto} error={errors.photo} />

      {/* Section 2: Facilities */}
      <Text style={styles.section}>Section 2: Facilities</Text>
      <Text style={styles.subsection}>Which Facilities Are You Interested In:</Text>
      <Checkbox
        options={facilitiesList}
        value={selectedFacilities}
        onChange={setSelectedFacilities}
        multiple={true}
        selectedColor={colors.secondryColor}
        unselectedColor={colors.secondryColor}
        selectedBackgroundColor={colors.secondryColor + '22'}
        checkboxSize={20}
        labelFontSize={14}
        labelFontWeight="normal"
        selectedLabelFontWeight="bold"
        spacing={8}
        padding={4}
        borderRadius={4}
        style={styles.facilitiesCheckbox}
      />
      <View style={styles.pointersBox}>
        <Text style={styles.pointer}>• Hourly prepaid system for all the facilities except gymnasium.</Text>
        <Text style={styles.pointer}>• For Gymnasium monthly fee will be charged.</Text>
        <Text style={styles.pointer}>• Payment will be for whole family.</Text>
        <Text style={styles.pointer}>• Minimum recharge for prepaid card is fixed at Rs. 200/‐</Text>
      </View>
      {errors.facilities && <Text style={styles.errorText}>{errors.facilities}</Text>}

      {/* Section 3: Family Members */}
      <Text style={styles.section}>Section 3: Details Of Family Members</Text>
      {familyMembers.map((member, idx) => (
        <View key={idx} style={styles.familyMemberBox}>
          <InputField
            label="Name"
            value={member.name}
            onChangeText={(v) => updateFamilyMember(idx, 'name', v)}
            placeholder="Family Member Name"
          />
          <InputField
            label="JCIC No"
            value={member.jcic}
            onChangeText={(v) => updateFamilyMember(idx, 'jcic', v)}
            placeholder="JCIC Number"
          />
          <InputField
            label="Relation"
            value={member.relation}
            onChangeText={(v) => updateFamilyMember(idx, 'relation', v)}
            placeholder="Relation"
          />
          <TouchableOpacity onPress={() => removeFamilyMember(idx)} style={styles.removeBtn}>
            <Text style={styles.removeBtnText}>Remove</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity onPress={addFamilyMember} style={styles.addBtn}>
        <Text style={styles.addBtnText}>+ Add Family Member</Text>
      </TouchableOpacity>

      {/* Section 4: Terms and Conditions */}
      <Text style={styles.section}>Section 4: Terms and Conditions</Text>
      <View style={styles.termsBox}>
        {terms.map((term, idx) => (
          <Text key={idx} style={styles.termText}>{`${String.fromCharCode(97 + idx)}) ${term}`}</Text>
        ))}
      </View>
      <Checkbox
        options={[
          {
            label: 'I hereby agree and undertake to comply with the above mentioned terms and conditions laid by the Management.',
            value: 'agreed'
          }
        ]}
        value={agreed ? ['agreed'] : []}
        onChange={(value) => setAgreed(value.includes('agreed'))}
        multiple={false}
        selectedColor={colors.secondryColor}
        unselectedColor={colors.secondryColor}
        selectedBackgroundColor={colors.secondryColor + '22'}
        checkboxSize={20}
        labelFontSize={13}
        labelFontWeight="normal"
        selectedLabelFontWeight="bold"
        spacing={0}
        padding={8}
        borderRadius={6}
        style={styles.termsCheckbox}
      />

      <SubmitButton onPress={handleSubmit} disabled={!agreed} />
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
    fontSize: 22,
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
    fontSize: 15,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 6,
    color: colors.secondryColor,
  },
  facilitiesCheckbox: {
    marginBottom: 10,
  },
  termsCheckbox: {
    marginBottom: 16,
  },
  pointersBox: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
    borderColor: colors.secondryColor,
    borderWidth: 1,
    marginBottom: 16,
  },
  pointer: {
    fontSize: 13,
    color: '#444',
    marginBottom: 4,
  },
  familyMemberBox: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    borderColor: colors.secondryColor,
    borderWidth: 1,
  },
  addBtn: {
    backgroundColor: colors.secondryColor,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  removeBtn: {
    backgroundColor: '#e57373',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  removeBtnText: {
    color: '#fff',
    fontSize: 12,
  },
  termsBox: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
    borderColor: colors.secondryColor,
    borderWidth: 1,
    marginBottom: 12,
  },
  termText: {
    fontSize: 13,
    color: '#444',
    marginBottom: 4,
    lineHeight: 18,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  },
});

export default FSC_Form;