import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { colors } from '../Config/AppConfigData';
import {
  InputField,
  RadioGroup,
  PhotoUpload,
  SubmitButton,
  AttachmentField,
  Checkbox,
} from '../Components/FormElements';
import { submitDuplicateCardForm } from '../Api/Firebase';
import { validateRequired, validatePhone, validateEmail } from '../Api/Firebase/FormValidation';
import { uploadImageToCloudinary } from '../Api/Firebase/CloudinaryService';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux'; // Import useSelector to access Redux state

const reasonOptions = [
  { label: 'My Card is lost', value: 'lost' },
  { label: 'My Card is damaged', value: 'damaged' },
  { label: 'My Card is expired', value: 'expired' },
  { label: 'I want to update my data', value: 'update' },
  { label: 'Add My Blood Group', value: 'blood' },
  { label: 'Wrong information printed on my card', value: 'wrong' },
  { label: 'Disability', value: 'disability' },
];

const maritalStatusOptions = [
  { label: 'Married', value: 'married' },
  { label: 'Divorced', value: 'divorced' },
  { label: 'Widow/Widower', value: 'widow' },
];

const DuplicateCardForm = () => {
  const navigation = useNavigation();
  const [errors, setErrors] = useState({});

  // Retrieve the logged-in user's JCIC from Redux state
  const userJCIC = useSelector((state) => state.reducer.userId);

  // Section 1
  const [name, setName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [fatherAlive, setFatherAlive] = useState(null);
  const [surname, setSurname] = useState('');
  const [motherName, setMotherName] = useState('');
  const [motherAlive, setMotherAlive] = useState(null);
  const [husbandName, setHusbandName] = useState('');
  const [husbandAlive, setHusbandAlive] = useState(null);
  const [husbandKhoja, setHusbandKhoja] = useState(null);
  const [husbandSurname, setHusbandSurname] = useState('');
  const [cnic, setCnic] = useState('');
  const [jcic, setJcic] = useState(''); // JCIC field is not prefilled

  // Section 2
  const [reason, setReason] = useState('');
  const [damagedCardAttachment, setDamagedCardAttachment] = useState(null);
  const [latestPhoto, setLatestPhoto] = useState(null);
  const [maritalStatus, setMaritalStatus] = useState('');
  const [nikahnamaAttachment, setNikahnamaAttachment] = useState(null);
  const [divorceAttachment, setDivorceAttachment] = useState(null);
  const [deathCertAttachment, setDeathCertAttachment] = useState(null);
  const [cellNumber, setCellNumber] = useState('');
  const [telRes, setTelRes] = useState('');
  const [telOffice, setTelOffice] = useState('');
  const [email, setEmail] = useState('');
  const [utilityBillAttachment, setUtilityBillAttachment] = useState(null);
  const [houseNo, setHouseNo] = useState('');
  const [flatNo, setFlatNo] = useState('');
  const [floorNo, setFloorNo] = useState('');
  const [buildingName, setBuildingName] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [bloodGroupAttachment, setBloodGroupAttachment] = useState(null);
  const [wrongInfo, setWrongInfo] = useState('');
  const [disabilityAttachment, setDisabilityAttachment] = useState(null);

  // Section 3
  const [cnicAttachment, setCnicAttachment] = useState(null);
  const [passportPhotoAttachment, setPassportPhotoAttachment] = useState(null);
  const [jcicCardAttachment, setJcicCardAttachment] = useState(null);

  // Section 4
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [transactionSlip, setTransactionSlip] = useState(null);

  const handleSubmit = async () => {
    const newErrors = {};

    // Section 1: Validate Personal Details
    if (!validateRequired(name).isValid) newErrors.name = 'Name is required';
    if (!validateRequired(fatherName).isValid) newErrors.fatherName = 'Father Name is required';
    if (fatherAlive === null) newErrors.fatherAlive = 'Please select if father is alive';
    if (!validateRequired(surname).isValid) newErrors.surname = 'Surname is required';
    if (!validateRequired(motherName).isValid) newErrors.motherName = 'Mother Name is required';
    if (motherAlive === null) newErrors.motherAlive = 'Please select if mother is alive';
    if (!validateRequired(cnic).isValid) {
      newErrors.cnic = 'CNIC is required';
    } else if (!/^\d{5}-\d{7}-\d{1}$/.test(cnic)) {
      newErrors.cnic = 'CNIC must be in Pakistani format (XXXXX-XXXXXXX-X)';
    }
    if (!validateRequired(jcic).isValid) {
      newErrors.jcic = 'JCIC is required';
    } else if (!/^\d{16}$/.test(jcic)) {
      newErrors.jcic = 'JCIC must be a 16-digit numeric value';
    }

    // Section 2: Validate Reason for New Card
    if (!reason) {
      newErrors.reason = 'Please select at least one reason';
    } else {
      if (reason === 'damaged' && !validateRequired(damagedCardAttachment).isValid) {
        newErrors.damagedCardAttachment = 'Damaged Card Attachment is required';
      }
      if (reason === 'blood' && !validateRequired(bloodGroupAttachment).isValid) {
        newErrors.bloodGroupAttachment = 'Blood Group Attachment is required';
      }
      if (reason === 'wrong' && !validateRequired(wrongInfo).isValid) {
        newErrors.wrongInfo = 'Details about the wrong information are required';
      }
      if (reason === 'disability' && !validateRequired(disabilityAttachment).isValid) {
        newErrors.disabilityAttachment = 'Disability Attachment is required';
      }
    }

    // Section 3: Validate Additional Attachments
    if (!validateRequired(cnicAttachment).isValid) {
      newErrors.cnicAttachment = 'CNIC/NICOP/PASSPORT/BFORM is required';
    }
    if (!validateRequired(passportPhotoAttachment).isValid) {
      newErrors.passportPhoto = 'Passport size photograph is required';
    }
    if (!validateRequired(jcicCardAttachment).isValid) {
      newErrors.jcicCardAttachment = 'JCIC Card attachment is required';
    }

    // Section 4: Validate Payment
    if (paymentMethod === 'online' && !validateRequired(transactionSlip).isValid) {
      newErrors.transactionSlip = 'Transaction Slip is required for online payment';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    // Upload attachments to Cloudinary
    const uploadAttachment = async (file, folder) => {
      const result = await uploadImageToCloudinary(file, folder);
      if (result.success) {
        return result.url;
      } else {
        throw new Error(result.error);
      }
    };

    try {
      const damagedCardUrl = reason === 'damaged' ? await uploadAttachment(damagedCardAttachment, 'forms/duplicateCard') : null;
      const bloodGroupUrl = reason === 'blood' ? await uploadAttachment(bloodGroupAttachment, 'forms/duplicateCard') : null;
      const transactionSlipUrl = paymentMethod === 'online' ? await uploadAttachment(transactionSlip, 'forms/duplicateCard') : null;

      const formData = {
        name,
        fatherName,
        surname,
        cnic,
        jcic: userJCIC, // Always use the logged-in user's JCIC for storage
        reason,
        damagedCardUrl,
        bloodGroupUrl,
        wrongInfo,
        disabilityAttachment,
        cnicAttachment,
        passportPhotoAttachment,
        jcicCardAttachment,
        transactionSlipUrl,
        submittedAt: new Date().toISOString(),
      };

      const response = await submitDuplicateCardForm(userJCIC, formData); // Pass logged-in user's JCIC
      if (response.success) {
        Alert.alert(
          'Success',
          'Duplicate Card form submitted successfully! You will be notified about the status of your application.',
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
    } catch (error) {
      Alert.alert('Error', `Failed to upload attachments: ${error.message}`, [{ text: 'OK' }]);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      <Text style={styles.title}>Duplicate/Renewal Membership Card Form</Text>
      <Text style={styles.infoText}>
        This form is for candidates who want to request for issuance of renewal/duplicate membership card.
      </Text>

      {/* Section 1: Personal Details */}
      <Text style={styles.section}>Section 1: Personal Details</Text>
      <InputField
        label="Name"
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
        error={errors.name}
      />
      <View style={styles.rowAlign}>
        <View style={{ flex: 1 }}>
          <InputField
            label="Father Name"
            value={fatherName}
            onChangeText={setFatherName}
            placeholder="Enter your father's name"
            error={errors.fatherName}
          />
        </View>
        <RadioGroup
          options={[
            { label: <Text style={{ color: colors.secondryColor }}>Alive</Text>, value: true },
            { label: <Text style={{ color: colors.secondryColor }}>Deceased</Text>, value: false },
          ]}
          value={fatherAlive}
          onChange={setFatherAlive}
          radioColor={colors.secondryColor}
          style={styles.radioInline}
        />
      </View>
      <InputField
        label="Surname"
        value={surname}
        onChangeText={setSurname}
        placeholder="Enter your surname"
        error={errors.surname}
      />
      <View style={styles.rowAlign}>
        <View style={{ flex: 1 }}>
          <InputField
            label="Mother Name"
            value={motherName}
            onChangeText={setMotherName}
            placeholder="Enter your mother's name"
            error={errors.motherName}
          />
        </View>
        <RadioGroup
          options={[
            { label: <Text style={{ color: colors.secondryColor }}>Alive</Text>, value: true },
            { label: <Text style={{ color: colors.secondryColor }}>Deceased</Text>, value: false },
          ]}
          value={motherAlive}
          onChange={setMotherAlive}
          radioColor={colors.secondryColor}
          style={styles.radioInline}
        />
      </View>
      <View style={{ marginBottom: 8 }}>
        <InputField
          label="Husband Name"
          value={husbandName}
          onChangeText={setHusbandName}
          placeholder="Husband Name"
          error={errors.husbandName}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginTop: 4 }}>
          <RadioGroup
            options={[
              { label: <Text style={{ color: colors.secondryColor }}>Alive</Text>, value: true },
              { label: <Text style={{ color: colors.secondryColor }}>Deceased</Text>, value: false },
            ]}
            value={husbandAlive}
            onChange={setHusbandAlive}
            radioColor={colors.secondryColor}
            style={{ marginRight: 16 }}
          />
          <RadioGroup
            options={[
              { label: <Text style={{ color: colors.secondryColor }}>Khoja</Text>, value: 'khoja' },
              { label: <Text style={{ color: colors.secondryColor }}>Non-Khoja</Text>, value: 'nonkhoja' },
            ]}
            value={husbandKhoja}
            onChange={setHusbandKhoja}
            radioColor={colors.secondryColor}
          />
        </View>
      </View>
      <InputField
        label="Husband Surname"
        value={husbandSurname}
        onChangeText={setHusbandSurname}
        placeholder="Husband Surname"
        error={errors.husbandSurname}
      />
      <InputField
        label="CNIC Number"
        value={cnic}
        onChangeText={setCnic}
        placeholder="CNIC Number"
        error={errors.cnic}
      />
      <InputField
        label="JCIC Number"
        value={jcic}
        onChangeText={setJcic}
        placeholder="JCIC Number"
        error={errors.jcic}
      />

      {/* Section 2: Reason For New Card */}
      <Text style={styles.section}>Section 2: Reason For New Card</Text>
      <Checkbox
        options={reasonOptions}
        value={reason}
        onChange={setReason}
        multiple={false}
        selectedColor={colors.secondryColor}
        unselectedColor={colors.secondryColor}
        selectedBackgroundColor={colors.secondryColor + '22'}
        checkboxSize={20}
        labelFontSize={15}
        labelFontWeight="normal"
        selectedLabelFontWeight="bold"
        spacing={8}
        padding={8}
        borderRadius={6}
        error={errors.reason}
      />
      {/* Conditional fields for reasons */}
      {reason === 'damaged' && (
        <View style={{ marginBottom: 12 }}>
          <Text style={styles.inputLabel}>Attach Damaged Card</Text>
          <PhotoUpload photo={damagedCardAttachment} setPhoto={setDamagedCardAttachment} boxColor={colors.secondryColor} labelColor={colors.secondryColor} />
          {errors.damagedCardAttachment && <Text style={styles.errorText}>{errors.damagedCardAttachment}</Text>}
        </View>
      )}
      {reason === 'update' && (
        <View style={{ marginBottom: 12 }}>
          <Text style={styles.inputLabel}>Upload Latest Photo <Text style={{ fontSize: 12, color: colors.secondryColor }}>(For females, photograph should be in hijab)</Text></Text>
          <PhotoUpload photo={latestPhoto} setPhoto={setLatestPhoto} boxColor={colors.secondryColor} labelColor={colors.secondryColor} />
          {errors.latestPhoto && <Text style={styles.errorText}>{errors.latestPhoto}</Text>}
          <Text style={[styles.inputLabel, { marginTop: 10 }]}>Change Marital Status</Text>
          <RadioGroup
            options={maritalStatusOptions.map(opt => ({ label: <Text style={{ color: colors.secondryColor }}>{opt.label}</Text>, value: opt.value }))}
            value={maritalStatus}
            onChange={setMaritalStatus}
            radioColor={colors.secondryColor}
          />
          {maritalStatus === 'married' && (
            <View style={{ marginTop: 6 }}>
              <Text style={styles.inputLabel}>Attach Nikahnama</Text>
              <PhotoUpload photo={nikahnamaAttachment} setPhoto={setNikahnamaAttachment} boxColor={colors.secondryColor} labelColor={colors.secondryColor} />
              {errors.nikahnamaAttachment && <Text style={styles.errorText}>{errors.nikahnamaAttachment}</Text>}
            </View>
          )}
          {maritalStatus === 'divorced' && (
            <View style={{ marginTop: 6 }}>
              <Text style={styles.inputLabel}>Attach Divorce Certificate</Text>
              <PhotoUpload photo={divorceAttachment} setPhoto={setDivorceAttachment} boxColor={colors.secondryColor} labelColor={colors.secondryColor} />
              {errors.divorceAttachment && <Text style={styles.errorText}>{errors.divorceAttachment}</Text>}
            </View>
          )}
          {maritalStatus === 'widow' && (
            <View style={{ marginTop: 6 }}>
              <Text style={styles.inputLabel}>Attach Spouse's Death Certificate</Text>
              <PhotoUpload photo={deathCertAttachment} setPhoto={setDeathCertAttachment} boxColor={colors.secondryColor} labelColor={colors.secondryColor} />
              {errors.deathCertAttachment && <Text style={styles.errorText}>{errors.deathCertAttachment}</Text>}
            </View>
          )}
          <Text style={[styles.inputLabel, { marginTop: 10 }]}>Change/Add Contact Information</Text>
          <InputField label="Cell Number" value={cellNumber} onChangeText={setCellNumber} placeholder="Cell Number" error={errors.cellNumber} />
          <InputField label="Tel No (Res)" value={telRes} onChangeText={setTelRes} placeholder="Tel No (Res)" error={errors.telRes} />
          <InputField label="Tel No (Office)" value={telOffice} onChangeText={setTelOffice} placeholder="Tel No (Office)" error={errors.telOffice} />
          <InputField label="Email ID" value={email} onChangeText={setEmail} placeholder="Email ID" error={errors.email} />
          <Text style={[styles.inputLabel, { marginTop: 10 }]}>Change of Address</Text>
          <Text style={styles.inputLabel}>Attach Utility Bill</Text>
          <PhotoUpload photo={utilityBillAttachment} setPhoto={setUtilityBillAttachment} boxColor={colors.secondryColor} labelColor={colors.secondryColor} />
          {errors.utilityBillAttachment && <Text style={styles.errorText}>{errors.utilityBillAttachment}</Text>}
          <InputField label="House/Plot No" value={houseNo} onChangeText={setHouseNo} placeholder="House/Plot No" error={errors.houseNo} />
          <InputField label="Flat No" value={flatNo} onChangeText={setFlatNo} placeholder="Flat No" error={errors.flatNo} />
          <InputField label="Floor No" value={floorNo} onChangeText={setFloorNo} placeholder="Floor No" error={errors.floorNo} />
          <InputField label="Building Name" value={buildingName} onChangeText={setBuildingName} placeholder="Building Name" error={errors.buildingName} />
          <InputField label="Area" value={area} onChangeText={setArea} placeholder="Area" error={errors.area} />
          <InputField label="City" value={city} onChangeText={setCity} placeholder="City" error={errors.city} />
          <InputField label="Country" value={country} onChangeText={setCountry} placeholder="Country" error={errors.country} />
        </View>
      )}
      {reason === 'blood' && (
        <View style={{ marginBottom: 12 }}>
          <Text style={styles.inputLabel}>Attach Blood Group Test</Text>
          <PhotoUpload photo={bloodGroupAttachment} setPhoto={setBloodGroupAttachment} boxColor={colors.secondryColor} labelColor={colors.secondryColor} />
          {errors.bloodGroupAttachment && <Text style={styles.errorText}>{errors.bloodGroupAttachment}</Text>}
        </View>
      )}
      {reason === 'wrong' && (
        <InputField label="Specify which information is wrong" value={wrongInfo} onChangeText={setWrongInfo} placeholder="Specify details" error={errors.wrongInfo} />
      )}
      {reason === 'disability' && (
        <View style={{ marginBottom: 12 }}>
          <Text style={styles.inputLabel}>Attach Disability Certificate</Text>
          <PhotoUpload photo={disabilityAttachment} setPhoto={setDisabilityAttachment} boxColor={colors.secondryColor} labelColor={colors.secondryColor} />
          {errors.disabilityAttachment && <Text style={styles.errorText}>{errors.disabilityAttachment}</Text>}
        </View>
      )}

      {/* Section 3: Additional Attachments */}
      <Text style={styles.section}>Section 3: Additional Attachments</Text>
      <AttachmentField
        label="Attach CNIC/NICOP/PASSPORT/BFORM"
        file={cnicAttachment}
        onPick={setCnicAttachment}
        error={errors.cnicAttachment}
      />
      <AttachmentField
        label="Attach Passport Size Photograph"
        file={passportPhotoAttachment}
        onPick={setPassportPhotoAttachment}
        error={errors.passportPhoto}
      />
      <AttachmentField
        label="Attach JCIC Card"
        file={jcicCardAttachment}
        onPick={setJcicCardAttachment}
        error={errors.jcicCardAttachment}
      />

      {/* Section 4: Payment */}
      <Text style={styles.section}>Section 4: Payment</Text>
      <Text style={styles.infoText}>Card fee is Rupees 200.</Text>
      <RadioGroup
        options={[
          { label: <Text style={{ color: colors.secondryColor }}>Cash</Text>, value: 'cash' },
          { label: <Text style={{ color: colors.secondryColor }}>Online Transfer</Text>, value: 'online' },
        ]}
        value={paymentMethod}
        onChange={setPaymentMethod}
        radioColor={colors.secondryColor}
      />
      {paymentMethod === 'online' && (
        <View style={{ marginTop: 8, marginBottom: 12 }}>
          <Text style={styles.onlineTransferLabel}>Bank: Habib Metropolitan Bank Limited, IBB - Soldier Bazar Branch, Karachi.</Text>
          <Text style={styles.onlineTransferLabel}>Title of Account: KHOJA (PIRHAI) SHIA ISNA ASHERI JAMAAT</Text>
          <Text style={styles.onlineTransferLabel}>Account No: 6-99-98-29319-714-100261</Text>
          <Text style={styles.onlineTransferLabel}>IBAN: PK85 MPBL 9998 7371 4010 0261</Text>
          <Text style={[styles.onlineTransferLabel, { marginTop: 8 }]}>Attach Transaction Slip</Text>
          <PhotoUpload photo={transactionSlip} setPhoto={setTransactionSlip} boxColor={colors.secondryColor} labelColor={colors.secondryColor} />
          {errors.transactionSlip && <Text style={styles.errorText}>{errors.transactionSlip}</Text>}
        </View>
      )}
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
  rowAlign: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  radioInline: {
    marginLeft: 10,
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
  onlineTransferLabel: {
    fontSize: 15,
    color: '#000',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
});

export default DuplicateCardForm;
