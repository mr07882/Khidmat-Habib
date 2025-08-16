import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import InputField from '../Components/FormElements/InputField';
import { colors } from '../Config/AppConfigData';
import RadioGroup from '../Components/FormElements/RadioGroup';
import PhotoUpload from '../Components/FormElements/PhotoUpload';
import SubmitButton from '../Components/FormElements/SubmitButton';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  submitFamilyParticipationForm, 
  validateFamilyParticipationForm, 
  sanitizeFormData,
  uploadImageToCloudinary
} from '../Api/Firebase';

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
  const [jcic, setJcic] = useState('');
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
  
  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userJCIC, setUserJCIC] = useState(null);
  const [errors, setErrors] = useState({});
  
  // Get user JCIC from Redux or AsyncStorage
  const userId = useSelector(state => state.reducer.userId);
  
  useEffect(() => {
    const getUserJCIC = async () => {
      try {
        const storedJCIC = await AsyncStorage.getItem('JCIC');
        setUserJCIC(userId || storedJCIC);
          } catch (error) {
      // Handle error silently
    }
    };
    getUserJCIC();
  }, [userId]);

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

  // Handle form submission
  const handleSubmit = async () => {
    if (!userJCIC) {
      Alert.alert('Error', 'User not authenticated. Please login again.');
      return;
    }
    // Prepare form data
    const formData = {
      name: name || '',
      relation: relation || '',
      relationship: relationship || '',
      jcic: jcic || '',
      email: email || '',
      cellNo: cellNo || '',
      ptclNo: ptclNo || '',
      amount: amount || '',
      frequency: frequency || [],
      mode: mode || [],
      chequeName: chequeName || '',
      signature: signature || '',
      address: address || '',
      transactionSlip: transactionSlip || null,
      date: date.toISOString(),
    };
    // Sanitize form data
    const sanitizedData = sanitizeFormData(formData);
    // Validate form data
    try {
      const validation = validateFamilyParticipationForm(sanitizedData);
      if (!validation.isValid) {
        const fieldErrors = {};
        validation.errors.forEach((error) => {
          Object.entries({
            name: 'Your Name',
            relation: 'Family Member Name',
            relationship: 'Relationship with Family Member',
            jcic: 'JCIC',
            email: 'Email',
            cellNo: 'Cell Number',
            ptclNo: 'PTCL Number',
            amount: 'Amount Donated',
            frequency: 'Payment Frequency',
            mode: 'Payment Method',
            chequeName: 'Name as on Cheque',
            signature: 'Signature',
            address: 'Address',
            transactionSlip: 'Transaction Slip',
          }).forEach(([key, label]) => {
            if (error.startsWith(label)) {
              fieldErrors[key] = error;
            }
          });
        });
        setErrors(fieldErrors);
        return;
      }
      setErrors({});
      // ...existing code...
      if (validation.warnings.length > 0) {
        Alert.alert(
          'Warnings',
          `Please note:\n\n${validation.warnings.join('\n')}`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Continue', onPress: () => submitForm(sanitizedData) }
          ]
        );
      } else {
        submitForm(sanitizedData);
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during validation. Please try again.');
      return;
    }
  };
  
  // Submit form to Firebase
  const submitForm = async (formData) => {
    setIsSubmitting(true);
    
    try {
      // Upload transaction slip if provided
      let transactionSlipUrl = null;
      if (transactionSlip) {
        const uploadResult = await uploadImageToCloudinary(transactionSlip, 'forms/family-participation');
        if (uploadResult.success) {
          transactionSlipUrl = uploadResult.url;
        } else {
          Alert.alert('Error', 'Failed to upload transaction slip. Please try again.');
          setIsSubmitting(false);
          return;
        }
      }
      
      // Prepare final data
      const finalData = {
        ...formData,
        transactionSlipUrl,
        submittedByJCIC: userJCIC,
      };
      
      // Submit to Firebase
      const result = await submitFamilyParticipationForm(userJCIC, finalData);
      
      if (result.success) {
        Alert.alert(
          'Success',
          'Family participation form submitted successfully! Your participation request has been received.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      } else {
        Alert.alert('Error', result.error || 'Failed to submit form. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
        error={errors.name}
      />
      <InputField
        label="Family Member Name"
        value={relation}
        onChangeText={setRelation}
        placeholder="Enter family member name"
        error={errors.relation}
      />
      <InputField
        label="Relationship with Family Member"
        value={relationship}
        onChangeText={setRelationship}
        placeholder="e.g. Father, Mother, Son, Daughter"
        error={errors.relationship}
      />
      <InputField
        label="JCIC"
        value={jcic}
        onChangeText={setJcic}
        placeholder="Enter JCIC number"
        error={errors.jcic}
      />
      <InputField
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        error={errors.email}
      />
      <InputField
        label="Cell No."
        value={cellNo}
        onChangeText={setCellNo}
        placeholder="Cell No."
        keyboardType="phone-pad"
        error={errors.cellNo}
      />
      <InputField
        label="PTCL No."
        value={ptclNo}
        onChangeText={setPtclNo}
        placeholder="PTCL No."
        keyboardType="phone-pad"
        error={errors.ptclNo}
      />

      {/* Payment Section */}
      <Text style={styles.sectionHeader}>Payment Details</Text>
      <InputField
        label="Amount Donated (Rs.)"
        value={amount}
        onChangeText={setAmount}
        placeholder="Enter amount"
        keyboardType="numeric"
        error={errors.amount}
      />
      <Text style={styles.label}>Payment Frequency</Text>
      <RadioGroup
        options={paymentFrequencies.map(opt => ({ label: <Text style={{ color: colors.secondryColor }}>{opt.label}</Text>, value: opt.value }))}
        value={frequency[0] || ''}
        onChange={val => setFrequency([val])}
        radioColor={colors.secondryColor}
        error={errors.frequency}
      />
      <Text style={styles.label}>Payment Method</Text>
      <RadioGroup
        options={paymentModes.map(opt => ({ label: <Text style={{ color: colors.secondryColor }}>{opt.label}</Text>, value: opt.value }))}
        value={mode[0] || ''}
        onChange={val => setMode([val])}
        radioColor={colors.secondryColor}
        error={errors.mode}
      />
      {/* Cheque Name Input */}
      {mode.includes('cheque') && (
        <InputField
          label={'Name as on Cheque'}
          value={chequeName}
          onChangeText={setChequeName}
          placeholder="Enter name as on cheque"
          error={errors.chequeName}
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
          <PhotoUpload photo={transactionSlip} setPhoto={setTransactionSlip} error={errors.transactionSlip} />
        </View>
      )}
      
      {/* Signature Section */}
      <Text style={styles.sectionHeader}>Declaration</Text>
      <InputField
        label="Signature"
        value={signature}
        onChangeText={setSignature}
        placeholder="Enter your full name as signature"
        error={errors.signature}
      />
      <InputField
        label="Address"
        value={address}
        onChangeText={setAddress}
        placeholder="Enter your complete address"
        multiline={true}
        error={errors.address}
      />
      
      {isSubmitting && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.secondryColor} />
          <Text style={styles.loadingText}>Submitting form...</Text>
        </View>
      )}
      
      <SubmitButton 
        onPress={handleSubmit} 
        title={isSubmitting ? "Submitting..." : "Submit"} 
        style={{ marginTop: 24 }}
        disabled={isSubmitting}
      />
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
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.secondryColor,
  },
});

export default FamilyParticipation;
