import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import InputField from '../Components/FormElements/InputField';
import { colors } from '../Config/AppConfigData';
import RadioGroup from '../Components/FormElements/RadioGroup';
import PhotoUpload from '../Components/FormElements/PhotoUpload';
import SubmitButton from '../Components/FormElements/SubmitButton';

const paymentFrequencies = [
  { label: 'Monthly', value: 'monthly' },
  { label: 'Quarterly', value: 'quarterly' },
  { label: 'Half yearly', value: 'halfyearly' },
  { label: 'Annually', value: 'annually' },
];
const paymentModes = [
  { label: 'Cash', value: 'cash' },
  { label: 'Cheque', value: 'cheque' },
  { label: 'Online payment', value: 'online' },
];

const FamilyParticipation = ({ navigation }) => {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const [relationship, setRelationship] = useState('');
  const [membershipNo, setMembershipNo] = useState('');
  const [email, setEmail] = useState('');
  const [cellNo, setCellNo] = useState('');
  const [ptclNo, setPtclNo] = useState('');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState([]);
  const [mode, setMode] = useState([]);
  const [chequeName, setChequeName] = useState('');
  const [signature, setSignature] = useState('');
  const [address, setAddress] = useState('');
  const [transactionSlip, setTransactionSlip] = useState(null);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const handleCheck = (arr, setArr, value) => {
    if (arr.includes(value)) {
      setArr(arr.filter(v => v !== value));
    } else {
      setArr([...arr, value]);
    }
  };

  // Only one option can be selected for frequency and mode
  const handleSingleCheck = (setArr, value) => {
    setArr([value]);
  };

  const handleSubmit = () => {
    if (!name || !relation || !amount || frequency.length === 0 || mode.length === 0 || !signature || !membershipNo || !email || !address || !cellNo) {
      Alert.alert('Incomplete', 'Please fill all required fields.');
      return;
    }
    Alert.alert('Submitted', 'Your Family Participation request has been submitted.');
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Information Section */}
      <Text style={styles.sectionTitle}>Family Participation Program (FPP)</Text>
      <Text style={styles.infoText}>
        This form is for individuals who wish to participate in the Family Participation Program (FPP) and support their Jamaat through various projects.
      </Text>

      {/* Personal Details Section */}
      <Text style={styles.sectionHeader}>Personal Details</Text>
      <InputField
        label="Your Name"
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
      />
      <InputField
        label="Family Member Name"
        value={relation}
        onChangeText={setRelation}
        placeholder="Enter family member name"
      />
      <InputField
        label="Relationship with Family Member"
        value={relationship}
        onChangeText={setRelationship}
        placeholder="e.g. Father, Mother, Son, Daughter"
      />
      <InputField
        label="Membership Number"
        value={membershipNo}
        onChangeText={setMembershipNo}
        placeholder="Membership No."
      />
      <InputField
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
      />
      <InputField
        label="Cell No."
        value={cellNo}
        onChangeText={setCellNo}
        placeholder="Cell No."
        keyboardType="phone-pad"
      />
      <InputField
        label="PTCL No."
        value={ptclNo}
        onChangeText={setPtclNo}
        placeholder="PTCL No."
        keyboardType="phone-pad"
      />

      {/* Payment Section */}
      <Text style={styles.sectionHeader}>Payment Details</Text>
      <InputField
        label="Amount Donated (Rs.)"
        value={amount}
        onChangeText={setAmount}
        placeholder="Enter amount"
        keyboardType="numeric"
      />
      <Text style={styles.label}>Payment Frequency</Text>
      <RadioGroup
        options={paymentFrequencies.map(opt => ({ label: <Text style={{ color: colors.secondryColor }}>{opt.label}</Text>, value: opt.value }))}
        value={frequency[0] || ''}
        onChange={val => setFrequency([val])}
        radioColor={colors.secondryColor}
      />
      <Text style={styles.label}>Payment Method</Text>
      <RadioGroup
        options={paymentModes.map(opt => ({ label: <Text style={{ color: colors.secondryColor }}>{opt.label}</Text>, value: opt.value }))}
        value={mode[0] || ''}
        onChange={val => setMode([val])}
        radioColor={colors.secondryColor}
      />
      {/* Cheque Name Input */}
      {mode.includes('cheque') && (
        <InputField
          label={'Name as on Cheque'}
          value={chequeName}
          onChangeText={setChequeName}
          placeholder="Enter name as on cheque"
        />
      )}
      {/* Online Payment Details */}
      {mode.includes('online') && (
        <View style={styles.accountBox}>
          <Text style={styles.accountTitle}>For online payment:</Text>
          <Text style={styles.accountLabel}>Title of Account</Text>
          <Text style={styles.accountValue}>KPSIAJ FUND A/C.</Text>
          <Text style={styles.accountLabel}>Account No</Text>
          <Text style={styles.accountValue}>1047-0081-002215-01-0</Text>
          <Text style={styles.accountLabel}>IBAN</Text>
          <Text style={styles.accountValue}>PK92 BAHL 1047 0081 0022 1501</Text>
          <Text style={[styles.inputLabel, { marginTop: 8 }]}>Attach Transaction Slip</Text>
          <PhotoUpload photo={transactionSlip} setPhoto={setTransactionSlip} />
        </View>
      )}
      <SubmitButton onPress={handleSubmit} label="Submit" style={{ marginTop: 24 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bgColor || '#fff',
    padding: 18,
    flexGrow: 1,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.secondryColor,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 15,
    color: 'black',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.secondryColor,
    marginTop: 20,
    marginBottom: 10,
  },
  inputLabel: {
    color: colors.secondryColor,
    fontWeight: 'normal',
    fontSize: 15,
  },
  label: {
    fontSize: 15,
    color: colors.secondryColor,
    marginBottom: 6,
    marginTop: 10,
  },
  checkRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  checkBox: {
    borderWidth: 1,
    borderColor: colors.secondryColor,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 6,
    backgroundColor: colors.bgColor || '#fff',
  },
  checkBoxSelected: {
    backgroundColor: colors.secondryColor,
    borderColor: colors.secondryColor,
  },
  checkText: {
    color: colors.secondryColor,
  },
  checkTextSelected: {
    color: colors.bgColor || '#fff',
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
  accountBox: {
    backgroundColor: colors.lightBgColor,
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    marginBottom: 10,
  },
  accountTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  accountLabel: {
    fontSize: 14,
    color: '#000',
    marginBottom: 4,
  },
  accountValue: {
    fontSize: 14,
    color: '#000',
    marginBottom: 8,
  },
});

export default FamilyParticipation;
