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
    
    // Sanitize form data
    const sanitizedData = sanitizeFormData(formData);
    
    // Validate form data
    try {
      const validation = validateEducationDonationBoxForm(sanitizedData);
      
      if (!validation.isValid) {
        Alert.alert(
          'Validation Error',
          `Please fix the following errors:\n\n${validation.errors.join('\n')}`,
          [{ text: 'OK' }]
        );
        return;
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during validation. Please try again.');
      return;
    }
    
    // Show warnings if any
    try {
      const validation = validateEducationDonationBoxForm(sanitizedData);
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
      // If there's an error with warnings, just proceed with submission
      submitForm(sanitizedData);
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
      <InputField label="Full Name" value={name} onChangeText={setName} placeholder="Full Name" />
      <InputField label="Father's / Husband's Name" value={fatherOrHusband} onChangeText={setFatherOrHusband} placeholder="Father's / Husband's Name" />
      <InputField label="Address" value={address} onChangeText={setAddress} placeholder="Home Address" />
      <InputField label="CNIC Number" value={cnic} onChangeText={setCnic} placeholder="XXXXX-XXXXXXX-X" keyboardType="numeric" />
      <InputField label="JCIC Number" value={jcic} onChangeText={setJcic} placeholder="JCIC Number" />
      <InputField label="Email Address" value={email} onChangeText={setEmail} placeholder="example@email.com" keyboardType="email-address" />
      <InputField label="Date" value={date} onChangeText={setDate} placeholder="DD-MM-YYYY" />

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
