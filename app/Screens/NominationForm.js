import React, {useState} from 'react';
import {View, Text, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {colors} from '../Config/AppConfigData';
import LabeledTextInput from '../Components/FormElements/LabeledTextInput';
import RadioGroup from '../Components/FormElements/RadioGroup';
import PhotoUpload from '../Components/FormElements/PhotoUpload';

const officeOptions = [
  'President',
  'Vice President',
  'Hon. Secretary',
  'Hon. Treasurer',
  'Hon. Joint Secretary',
  'Member Managing Committee',
  'Women Councillor (Female Only)',
];

const NominationForm = () => {
  const [photo, setPhoto] = useState(null);
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('male');
  const [fatherOrHusband, setFatherOrHusband] = useState('');
  const [surname, setSurname] = useState('');
  const [jid, setJid] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [office, setOffice] = useState('');
  const [membershipDate, setMembershipDate] = useState('');
  const [dob, setDob] = useState('');
  // Proposer
  const [proposerName, setProposerName] = useState('');
  const [proposerSurname, setProposerSurname] = useState('');
  const [proposerJid, setProposerJid] = useState('');
  const [proposerContact, setProposerContact] = useState('');
  const [proposerEmail, setProposerEmail] = useState('');
  const [proposerSignature, setProposerSignature] = useState('');
  // Seconder
  const [seconderName, setSeconderName] = useState('');
  const [seconderSurname, setSeconderSurname] = useState('');
  const [seconderJid, setSeconderJid] = useState('');
  const [seconderContact, setSeconderContact] = useState('');
  const [seconderEmail, setSeconderEmail] = useState('');
  const [seconderSignature, setSeconderSignature] = useState('');
  // Declaration
  const [isFiler, setIsFiler] = useState(null);
  const [ballotName, setBallotName] = useState('');
  const [candidateSignature, setCandidateSignature] = useState('');
  const [candidateDate, setCandidateDate] = useState('');

  return (
    <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 32}}>
      <Text style={styles.title}>Nomination Form</Text>
      <Text style={styles.section}>Section 1: Candidate Details</Text>
      <PhotoUpload photo={photo} setPhoto={setPhoto} />
      <LabeledTextInput label="Full Name" value={fullName} onChangeText={setFullName} placeholder="Full Name" />
      <RadioGroup
        options={[
          {label: 'Mr.', value: 'male'},
          {label: 'Ms.', value: 'female'},
        ]}
        value={gender}
        onChange={setGender}
      />
      <LabeledTextInput label={gender === 'male' ? 's/o' : 'd/o - w/o'} value={fatherOrHusband} onChangeText={setFatherOrHusband} placeholder={gender === 'male' ? 's/o' : 'd/o - w/o'} />
      <LabeledTextInput label="Surname" value={surname} onChangeText={setSurname} placeholder="Surname" />
      <LabeledTextInput label="JCIC / JID No." value={jid} onChangeText={setJid} placeholder="JCIC / JID No." />
      <LabeledTextInput label="Contact No." value={contact} onChangeText={setContact} placeholder="Contact No." keyboardType="phone-pad" />
      <LabeledTextInput label="Email (Optional)" value={email} onChangeText={setEmail} placeholder="Email (Optional)" keyboardType="email-address" />
      <Text style={styles.label}>Office Applying For</Text>
      {officeOptions.map(opt => (
        <View key={opt} style={{marginBottom: 4}}>
          <RadioGroup
            options={[{label: opt, value: opt}]}
            value={office}
            onChange={setOffice}
          />
        </View>
      ))}
      <LabeledTextInput label="Date/Year of Membership with Jamaat" value={membershipDate} onChangeText={setMembershipDate} placeholder="Date/Year of Membership" />
      <LabeledTextInput label="Date/Year of Birth" value={dob} onChangeText={setDob} placeholder="Date/Year of Birth" />
      <Text style={styles.section}>Section 2: Proposer & Seconder Details</Text>
      <LabeledTextInput label="Proposed By - Name" value={proposerName} onChangeText={setProposerName} placeholder="Name" />
      <LabeledTextInput label="Surname" value={proposerSurname} onChangeText={setProposerSurname} placeholder="Surname" />
      <LabeledTextInput label="JCIC/JID No." value={proposerJid} onChangeText={setProposerJid} placeholder="JCIC/JID No." />
      <LabeledTextInput label="Contact No." value={proposerContact} onChangeText={setProposerContact} placeholder="Contact No." keyboardType="phone-pad" />
      <LabeledTextInput label="Email (Optional)" value={proposerEmail} onChangeText={setProposerEmail} placeholder="Email (Optional)" keyboardType="email-address" />
      <LabeledTextInput label="Signature" value={proposerSignature} onChangeText={setProposerSignature} placeholder="Signature" />
      <LabeledTextInput label="Seconded By - Name" value={seconderName} onChangeText={setSeconderName} placeholder="Name" />
      <LabeledTextInput label="Surname" value={seconderSurname} onChangeText={setSeconderSurname} placeholder="Surname" />
      <LabeledTextInput label="JCIC/JID No." value={seconderJid} onChangeText={setSeconderJid} placeholder="JCIC/JID No." />
      <LabeledTextInput label="Contact No." value={seconderContact} onChangeText={setSeconderContact} placeholder="Contact No." keyboardType="phone-pad" />
      <LabeledTextInput label="Email (Optional)" value={seconderEmail} onChangeText={setSeconderEmail} placeholder="Email (Optional)" keyboardType="email-address" />
      <LabeledTextInput label="Signature" value={seconderSignature} onChangeText={setSeconderSignature} placeholder="Signature" />
      <Text style={styles.section}>Section 3: Candidate’s Consent & Declaration</Text>
      <Text style={styles.declarationText}>I, the candidate, hereby consent to this nomination and affirm that:</Text>
      <Text style={styles.declarationText}>- I will abide by the Jamaat’s Constitution and Bye-Laws.</Text>
      <Text style={styles.declarationText}>- I will serve diligently if elected.</Text>
      <RadioGroup
        options={[
          {label: 'Yes', value: true},
          {label: 'No', value: false},
        ]}
        value={isFiler}
        onChange={setIsFiler}
      />
      <LabeledTextInput label="My name on the ballot paper should appear as" value={ballotName} onChangeText={setBallotName} placeholder="Ballot Name" />
      <LabeledTextInput label="Signature of Candidate" value={candidateSignature} onChangeText={setCandidateSignature} placeholder="Signature of Candidate" />
      <LabeledTextInput label="Date" value={candidateDate} onChangeText={setCandidateDate} placeholder="Date" />
      <Text style={styles.section}>Section 4: Terms & Conditions</Text>
      <Text style={styles.declarationText}>By submitting this form, the candidate agrees to:</Text>
      <Text style={styles.declarationText}>- Pay the applicable nomination fee:</Text>
      <Text style={styles.declarationText}>  President: PKR 5,000</Text>
      <Text style={styles.declarationText}>  Other Office Bearers: PKR 3,000</Text>
      <Text style={styles.declarationText}>  Managing Committee / Women Councillor: PKR 1,500</Text>
      <Text style={styles.declarationText}>- Submit required documents:</Text>
      <Text style={styles.declarationText}>  Copy of Jamaat ID (JCIC/JID) of Candidate, Proposer, and Seconder.</Text>
      <Text style={styles.declarationText}>  Copy of the latest Income Tax Return (if applicable).</Text>
      <Text style={styles.declarationText}>- Accept that:</Text>
      <Text style={styles.declarationText}>  Jamaat reserves the right to reject any nomination without explanation.</Text>
      <Text style={styles.declarationText}>  False information will lead to disqualification.</Text>
      <Text style={styles.declarationText}>  Withdrawal must be submitted in writing before the election date.</Text>
      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
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
  section: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 18,
    marginBottom: 8,
    color: colors.secondryColor,
    opacity: 1,
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 2,
    color: colors.secondryColor,
    opacity: 1,
  },
  declarationText: {
    fontSize: 14,
    color: colors.secondryColor,
    marginBottom: 2,
    opacity: 1,
  },
  submitButton: {
    backgroundColor: colors.primaryColor,
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
  input: {
    borderWidth: 1,
    borderColor: colors.secondryColor,
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    backgroundColor: '#fff',
    fontSize: 15,
    color: colors.secondryColor,
    opacity: 1,
  },
});

export default NominationForm;
