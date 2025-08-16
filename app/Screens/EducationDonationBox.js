import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import InputField from '../Components/FormElements/InputField';
import SubmitButton from '../Components/FormElements/SubmitButton';
import { colors } from '../Config/AppConfigData';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  submitEducationDonationBoxForm, 
  validateEducationDonationBoxForm, 
  sanitizeFormData
} from '../Api/Firebase';

const EducationDonationBoxForm = ({ navigation }) => {
  const [name, setName] = useState('');
  const [fatherOrHusband, setFatherOrHusband] = useState('');
  const [address, setAddress] = useState('');
  const [cnic, setCnic] = useState('');
  const [jcic, setJcic] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  
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
        console.error('Error getting user JCIC:', error);
      }
    };
    getUserJCIC();
  }, [userId]);

  // Handle form submission
  const handleSubmit = async () => {
    if (!userJCIC) {
      Alert.alert('Error', 'User not authenticated. Please login again.');
      return;
    }
    
    // Prepare form data
    const formData = {
      name: name || '',
      fatherOrHusband: fatherOrHusband || '',
      address: address || '',
      cnic: cnic || '',
      jcic: jcic || '',
      email: email || '',
      date: date || '',
    };

    // Inline required field validation for Father's/Husband's Name and Date
    const fieldErrors = {};
    if (!fatherOrHusband.trim()) {
      fieldErrors.fatherOrHusband = "Father's / Husband's Name is required.";
    }
    if (!date.trim()) {
      fieldErrors.date = "Date is required.";
    }
    // Sanitize form data
    const sanitizedData = sanitizeFormData(formData);

    // Validate form data
    try {
      const validation = validateEducationDonationBoxForm(sanitizedData);
      if (!validation.isValid || Object.keys(fieldErrors).length > 0) {
        validation.errors.forEach((error) => {
          Object.entries({
            name: 'Full Name',
            fatherOrHusband: "Father's / Husband's Name",
            address: 'Address',
            cnic: 'CNIC Number',
            jcic: 'JCIC Number',
            email: 'Email Address',
            date: 'Date',
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
      // Show warnings if any
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
      // Prepare final data
      const finalData = {
        ...formData,
        submittedByJCIC: userJCIC,
      };
      
      // Submit to Firebase
      const result = await submitEducationDonationBoxForm(userJCIC, finalData);
      
      if (result.success) {
        Alert.alert(
          'Success',
          'Education donation box request submitted successfully! Your request has been received and will be processed.',
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
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      <Text style={styles.title}>Education Donation Box Request Form</Text>
      <Text style={styles.infoText}>
        By filling this form, you are requesting a donation box to be delivered to your home address. 
        This box will allow you to contribute towards the Jamaat's education fund by collecting donations conveniently at your home.
      </Text>

  <Text style={styles.section}>Personal Details</Text>
  <InputField label="Full Name" value={name} onChangeText={setName} placeholder="Full Name" error={errors.name} />
  <InputField label="Father's / Husband's Name" value={fatherOrHusband} onChangeText={setFatherOrHusband} placeholder="Father's / Husband's Name" error={errors.fatherOrHusband} />
  <InputField label="Address" value={address} onChangeText={setAddress} placeholder="Home Address" error={errors.address} />
  <InputField label="CNIC Number" value={cnic} onChangeText={setCnic} placeholder="XXXXX-XXXXXXX-X" keyboardType="numeric" error={errors.cnic} />
  <InputField label="JCIC Number" value={jcic} onChangeText={setJcic} placeholder="JCIC Number" error={errors.jcic} />
  <InputField label="Email Address" value={email} onChangeText={setEmail} placeholder="example@email.com" keyboardType="email-address" error={errors.email} />
  <InputField label="Date (For Sending The Donation Box)" value={date} onChangeText={setDate} placeholder="DD-MM-YYYY" error={errors.date} />

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

export default EducationDonationBoxForm;
