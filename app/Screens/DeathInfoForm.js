import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';
import { colors } from '../Config/AppConfigData';
import PhotoUpload from '../Components/FormElements/PhotoUpload';
import SubmitButton from '../Components/FormElements/SubmitButton';

const DeathInfoForm = () => {
  // Deceased Section
  const [deceasedName, setDeceasedName] = useState('');
  const [deceasedAge, setDeceasedAge] = useState('');
  const [deceasedMembership, setDeceasedMembership] = useState('');
  const [deceasedCnic, setDeceasedCnic] = useState('');
  const [deceasedAddress, setDeceasedAddress] = useState('');
  const [causeOfDeath, setCauseOfDeath] = useState('');
  const [doctorName, setDoctorName] = useState('');

  // Father Section
  const [fatherName, setFatherName] = useState('');
  const [fatherSurname, setFatherSurname] = useState('');
  const [fatherMembership, setFatherMembership] = useState('');
  const [fatherCnic, setFatherCnic] = useState('');

  // Husband Section
  const [husbandName, setHusbandName] = useState('');
  const [husbandSurname, setHusbandSurname] = useState('');
  const [husbandMembership, setHusbandMembership] = useState('');
  const [husbandCnic, setHusbandCnic] = useState('');

  // Informer 1 Section
  const [informer1Name, setInformer1Name] = useState('');
  const [informer1Surname, setInformer1Surname] = useState('');
  const [informer1Membership, setInformer1Membership] = useState('');
  const [informer1Cnic, setInformer1Cnic] = useState('');
  const [informer1Address, setInformer1Address] = useState('');
  const [informer1Phone, setInformer1Phone] = useState('');

  // Informer 2 Section
  const [informer2Name, setInformer2Name] = useState('');
  const [informer2Surname, setInformer2Surname] = useState('');
  const [informer2Membership, setInformer2Membership] = useState('');
  const [informer2Cnic, setInformer2Cnic] = useState('');
  const [informer2Address, setInformer2Address] = useState('');
  const [informer2Phone, setInformer2Phone] = useState('');

  // Attachments
  const [deathCertAttachment, setDeathCertAttachment] = useState(null);
  const [deceasedJcicAttachment, setDeceasedJcicAttachment] = useState(null);
  const [deceasedCnicAttachment, setDeceasedCnicAttachment] = useState(null);
  const [informer1JcicAttachment, setInformer1JcicAttachment] = useState(null);
  const [informer1CnicAttachment, setInformer1CnicAttachment] = useState(null);
  const [informer2JcicAttachment, setInformer2JcicAttachment] = useState(null);
  const [informer2CnicAttachment, setInformer2CnicAttachment] = useState(null);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 32}}>
      <Text style={styles.title}>Death Information Form</Text>

      {/* Deceased Section */}
      <Text style={styles.sectionHeader}>Deceased Information</Text>
      <FormInput label="Name" value={deceasedName} onChangeText={setDeceasedName} />
      <FormInput label="Age" value={deceasedAge} onChangeText={setDeceasedAge} keyboardType="numeric" />
      <FormInput label="Membership Number" value={deceasedMembership} onChangeText={setDeceasedMembership} />
      <FormInput label="CNIC Number" value={deceasedCnic} onChangeText={setDeceasedCnic} />
      <FormInput label="Address" value={deceasedAddress} onChangeText={setDeceasedAddress} multiline />
      <FormInput label="Cause of Death" value={causeOfDeath} onChangeText={setCauseOfDeath} />
      <FormInput label="Doctor's Name" value={doctorName} onChangeText={setDoctorName} />

      {/* Father Section */}
      <Text style={styles.sectionHeader}>Father of the Deceased</Text>
      <FormInput label="Father Name" value={fatherName} onChangeText={setFatherName} />
      <FormInput label="Surname" value={fatherSurname} onChangeText={setFatherSurname} />
      <FormInput label="Membership Number" value={fatherMembership} onChangeText={setFatherMembership} />
      <FormInput label="CNIC Number" value={fatherCnic} onChangeText={setFatherCnic} />

      {/* Husband Section */}
      <Text style={styles.sectionHeader}>Husband of the Deceased</Text>
      <FormInput label="Husband's Name" value={husbandName} onChangeText={setHusbandName} />
      <FormInput label="Surname" value={husbandSurname} onChangeText={setHusbandSurname} />
      <FormInput label="Membership Number" value={husbandMembership} onChangeText={setHusbandMembership} />
      <FormInput label="CNIC Number" value={husbandCnic} onChangeText={setHusbandCnic} />

      {/* Informer 1 Section */}
      <Text style={styles.sectionHeader}>Informer 1</Text>
      <FormInput label="Full Name" value={informer1Name} onChangeText={setInformer1Name} />
      <FormInput label="Surname" value={informer1Surname} onChangeText={setInformer1Surname} />
      <FormInput label="Membership Number" value={informer1Membership} onChangeText={setInformer1Membership} />
      <FormInput label="CNIC Number" value={informer1Cnic} onChangeText={setInformer1Cnic} />
      <FormInput label="Address" value={informer1Address} onChangeText={setInformer1Address} multiline />
      <FormInput label="Tel/Cell Number" value={informer1Phone} onChangeText={setInformer1Phone} />

      {/* Informer 2 Section */}
      <Text style={styles.sectionHeader}>Informer 2</Text>
      <FormInput label="Full Name" value={informer2Name} onChangeText={setInformer2Name} />
      <FormInput label="Surname" value={informer2Surname} onChangeText={setInformer2Surname} />
      <FormInput label="Membership Number" value={informer2Membership} onChangeText={setInformer2Membership} />
      <FormInput label="CNIC Number" value={informer2Cnic} onChangeText={setInformer2Cnic} />
      <FormInput label="Address" value={informer2Address} onChangeText={setInformer2Address} multiline />
      <FormInput label="Tel/Cell Number" value={informer2Phone} onChangeText={setInformer2Phone} />

      {/* Attachments Section */}
      <Text style={styles.sectionHeader}>Attachments</Text>
      <Text style={styles.attachmentLabel}>Death Certificate</Text>
      <PhotoUpload photo={deathCertAttachment} setPhoto={setDeathCertAttachment} />
      <Text style={styles.attachmentLabel}>JCIC of Deceased</Text>
      <PhotoUpload photo={deceasedJcicAttachment} setPhoto={setDeceasedJcicAttachment} />
      <Text style={styles.attachmentLabel}>CNIC of Deceased</Text>
      <PhotoUpload photo={deceasedCnicAttachment} setPhoto={setDeceasedCnicAttachment} />
      <Text style={styles.attachmentLabel}>JCIC of Informer 1</Text>
      <PhotoUpload photo={informer1JcicAttachment} setPhoto={setInformer1JcicAttachment} />
      <Text style={styles.attachmentLabel}>CNIC of Informer 1</Text>
      <PhotoUpload photo={informer1CnicAttachment} setPhoto={setInformer1CnicAttachment} />
      <Text style={styles.attachmentLabel}>JCIC of Informer 2</Text>
      <PhotoUpload photo={informer2JcicAttachment} setPhoto={setInformer2JcicAttachment} />
      <Text style={styles.attachmentLabel}>CNIC of Informer 2</Text>
      <PhotoUpload photo={informer2CnicAttachment} setPhoto={setInformer2CnicAttachment} />

      <SubmitButton title="Submit" onPress={() => { /* Handle form submission */ }} />
    </ScrollView>
  );
};

const FormInput = ({ label, ...props }) => (
  <View style={{ marginBottom: 12 }}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      placeholder={label}
      placeholderTextColor={colors.secondryColor + '99'}
      {...props}
    />
  </View>
);

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
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.secondryColor,
    marginTop: 18,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.primaryColor,
    paddingBottom: 4,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.secondryColor,
    marginBottom: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.secondryColor,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    color: colors.primaryColor,
    backgroundColor: '#fff',
  },
  attachmentLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.secondryColor,
    marginTop: 10,
    marginBottom: 2,
  },
});

export default DeathInfoForm;
