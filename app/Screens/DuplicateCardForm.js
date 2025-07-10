import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../Config/AppConfigData';
import InputField from '../Components/FormElements/InputField';
import RadioGroup from '../Components/FormElements/RadioGroup';
import PhotoUpload from '../Components/FormElements/PhotoUpload';
import SubmitButton from '../Components/FormElements/SubmitButton';
import AttachmentField from '../Components/FormElements/AttachmentField';

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
  const [jcic, setJcic] = useState('');

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

  // Helper for single-select reason
  const selectReason = (val) => {
    setReason(val);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      <Text style={styles.title}>Duplicate/Renewal Membership Card Form</Text>
      <Text style={styles.infoText}>
        This form is for candidates who want to request for issuance of renewal/duplicate membership card.
      </Text>

      {/* Section 1: Personal Details */}
      <Text style={styles.section}>Section 1: Personal Details</Text>
      <InputField label="Name" value={name} onChangeText={setName} placeholder="Name" />
      <View style={styles.rowAlign}>
        <View style={{ flex: 1 }}>
          <InputField label="Father Name" value={fatherName} onChangeText={setFatherName} placeholder="Father Name" />
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
      <InputField label="Surname" value={surname} onChangeText={setSurname} placeholder="Surname" />
      <View style={styles.rowAlign}>
        <View style={{ flex: 1 }}>
          <InputField label="Mother Name" value={motherName} onChangeText={setMotherName} placeholder="Mother Name" />
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
        <InputField label="Husband Name" value={husbandName} onChangeText={setHusbandName} placeholder="Husband Name" />
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
      <InputField label="Husband Surname" value={husbandSurname} onChangeText={setHusbandSurname} placeholder="Husband Surname" />
      <InputField label="CNIC Number" value={cnic} onChangeText={setCnic} placeholder="CNIC Number" />
      <InputField label="JCIC Number" value={jcic} onChangeText={setJcic} placeholder="JCIC Number" />

      {/* Section 2: Reason For New Card */}
      <Text style={styles.section}>Section 2: Reason For New Card</Text>
      {reasonOptions.map(opt => (
        <TouchableOpacity
          key={opt.value}
          style={[
            styles.checkboxRow,
            reason === opt.value && { backgroundColor: colors.secondryColor + '22' },
          ]}
          onPress={() => selectReason(opt.value)}
        >
          <View style={[
            styles.checkbox,
            reason === opt.value && { backgroundColor: colors.secondryColor, borderColor: colors.secondryColor },
          ]} />
          <Text style={[
            styles.checkboxLabel,
            { color: colors.secondryColor },
            reason === opt.value && { fontWeight: 'bold' },
          ]}>{opt.label}</Text>
        </TouchableOpacity>
      ))}
      {/* Conditional fields for reasons */}
      {reason === 'damaged' && (
        <View style={{ marginBottom: 12 }}>
          <Text style={styles.inputLabel}>Attach Damaged Card</Text>
          <PhotoUpload photo={damagedCardAttachment} setPhoto={setDamagedCardAttachment} boxColor={colors.secondryColor} labelColor={colors.secondryColor} />
        </View>
      )}
      {reason === 'update' && (
        <View style={{ marginBottom: 12 }}>
          <Text style={styles.inputLabel}>Upload Latest Photo <Text style={{ fontSize: 12, color: colors.secondryColor }}>(For females, photograph should be in hijab)</Text></Text>
          <PhotoUpload photo={latestPhoto} setPhoto={setLatestPhoto} boxColor={colors.secondryColor} labelColor={colors.secondryColor} />
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
            </View>
          )}
          {maritalStatus === 'divorced' && (
            <View style={{ marginTop: 6 }}>
              <Text style={styles.inputLabel}>Attach Divorce Certificate</Text>
              <PhotoUpload photo={divorceAttachment} setPhoto={setDivorceAttachment} boxColor={colors.secondryColor} labelColor={colors.secondryColor} />
            </View>
          )}
          {maritalStatus === 'widow' && (
            <View style={{ marginTop: 6 }}>
              <Text style={styles.inputLabel}>Attach Spouse's Death Certificate</Text>
              <PhotoUpload photo={deathCertAttachment} setPhoto={setDeathCertAttachment} boxColor={colors.secondryColor} labelColor={colors.secondryColor} />
            </View>
          )}
          <Text style={[styles.inputLabel, { marginTop: 10 }]}>Change/Add Contact Information</Text>
          <InputField label="Cell Number" value={cellNumber} onChangeText={setCellNumber} placeholder="Cell Number" />
          <InputField label="Tel No (Res)" value={telRes} onChangeText={setTelRes} placeholder="Tel No (Res)" />
          <InputField label="Tel No (Office)" value={telOffice} onChangeText={setTelOffice} placeholder="Tel No (Office)" />
          <InputField label="Email ID" value={email} onChangeText={setEmail} placeholder="Email ID" />
          <Text style={[styles.inputLabel, { marginTop: 10 }]}>Change of Address</Text>
          <Text style={styles.inputLabel}>Attach Utility Bill</Text>
          <PhotoUpload photo={utilityBillAttachment} setPhoto={setUtilityBillAttachment} boxColor={colors.secondryColor} labelColor={colors.secondryColor} />
          <InputField label="House/Plot No" value={houseNo} onChangeText={setHouseNo} placeholder="House/Plot No" />
          <InputField label="Flat No" value={flatNo} onChangeText={setFlatNo} placeholder="Flat No" />
          <InputField label="Floor No" value={floorNo} onChangeText={setFloorNo} placeholder="Floor No" />
          <InputField label="Building Name" value={buildingName} onChangeText={setBuildingName} placeholder="Building Name" />
          <InputField label="Area" value={area} onChangeText={setArea} placeholder="Area" />
          <InputField label="City" value={city} onChangeText={setCity} placeholder="City" />
          <InputField label="Country" value={country} onChangeText={setCountry} placeholder="Country" />
        </View>
      )}
      {reason === 'blood' && (
        <View style={{ marginBottom: 12 }}>
          <Text style={styles.inputLabel}>Attach Blood Group Test</Text>
          <PhotoUpload photo={bloodGroupAttachment} setPhoto={setBloodGroupAttachment} boxColor={colors.secondryColor} labelColor={colors.secondryColor} />
        </View>
      )}
      {reason === 'wrong' && (
        <InputField label="Specify which information is wrong" value={wrongInfo} onChangeText={setWrongInfo} placeholder="Specify details" />
      )}
      {reason === 'disability' && (
        <View style={{ marginBottom: 12 }}>
          <Text style={styles.inputLabel}>Attach Disability Certificate</Text>
          <PhotoUpload photo={disabilityAttachment} setPhoto={setDisabilityAttachment} boxColor={colors.secondryColor} labelColor={colors.secondryColor} />
        </View>
      )}

      {/* Section 3: Additional Attachments */}
      <Text style={styles.section}>Section 3: Additional Attachments</Text>
      <AttachmentField
        label="Attach CNIC/NICOP/PASSPORT/BFORM"
        file={cnicAttachment}
        onPick={setCnicAttachment}
      />
      <AttachmentField
        label="Attach Passport Size Photograph"
        file={passportPhotoAttachment}
        onPick={setPassportPhotoAttachment}
      />
      <AttachmentField
        label="Attach JCIC Card"
        file={jcicCardAttachment}
        onPick={setJcicCardAttachment}
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
        </View>
      )}
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
  rowAlign: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  radioInline: {
    marginLeft: 10,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: colors.secondryColor,
    borderRadius: 4,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  checkboxLabel: {
    fontSize: 15,
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
});

export default DuplicateCardForm;
