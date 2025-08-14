import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import InputField from '../Components/FormElements/InputField';
import SubmitButton from '../Components/FormElements/SubmitButton';
import { colors } from '../Config/AppConfigData';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  submitCandidateRetirementForm, 
  validateCandidateRetirementForm, 
  sanitizeFormData
} from '../Api/Firebase';

const CandidateRetirement = ({ navigation }) => {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [candidateName, setCandidateName] = useState('');
  const [fatherOrHusband, setFatherOrHusband] = useState('');
  const [post, setPost] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [jcic, setJcic] = useState('');
  const [signature, setSignature] = useState('');
  
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

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!userJCIC) {
      Alert.alert('Error', 'User not authenticated. Please login again.');
      return;
    }
    
    // Prepare form data
    const formData = {
      candidateName,
      fatherOrHusband,
      post,
      serialNumber,
      jcic,
      signature,
      date: date.toISOString(),
    };
    
    // Sanitize form data
    const sanitizedData = sanitizeFormData(formData);
    
    // Validate form data
    const validation = validateCandidateRetirementForm(sanitizedData);
    
    if (!validation.isValid) {
      Alert.alert(
        'Validation Error',
        `Please fix the following errors:\n\n${validation.errors.join('\n')}`,
        [{ text: 'OK' }]
      );
      return;
    }
    
    // Submit form
    submitForm(sanitizedData);
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
      const result = await submitCandidateRetirementForm(userJCIC, finalData);
      
      if (result.success) {
        Alert.alert(
          'Success',
          'Candidate retirement form submitted successfully! Your retirement request has been received.',
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
      console.error('Error submitting candidate retirement form:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Information Section */}
      <Text style={styles.sectionTitle}>Candidate Retirement Form</Text>
      <Text style={styles.infoText}>
        This form is for candidates who wish to retire from the Jamaat election. Please fill in your details below to submit your retirement request.
      </Text>

      {/* Personal Details Section */}
      <Text style={styles.sectionHeader}>Personal Details</Text>
      <InputField
        label="Candidate Name"
        value={candidateName}
        onChangeText={setCandidateName}
        placeholder="Enter your name"
      />
      <InputField
        label="S/o (Father/Husband Name)"
        value={fatherOrHusband}
        onChangeText={setFatherOrHusband}
        placeholder="Enter father/husband name"
      />
      <InputField
        label="Post"
        value={post}
        onChangeText={setPost}
        placeholder="Enter post name"
      />
      <InputField
        label="Serial Number"
        value={serialNumber}
        onChangeText={setSerialNumber}
        placeholder="Enter serial number"
        keyboardType="numeric"
      />
      <InputField
        label="JCIC / JID No."
        value={jcic}
        onChangeText={setJcic}
        placeholder="Enter JCIC/JID number"
      />

      {/* Declaration Section */}
      <Text style={styles.sectionHeader}>Declaration</Text>
      <Text style={styles.bodyText}>I would like to inform you that I want to retire from the post mentioned above in the forthcoming Jamaat Election. Please make sure my name does not appear on the <Text style={{fontWeight:'bold'}}>ballot paper</Text>.</Text>
      <Text style={styles.bodyText}>Thanking you for your co-operation, I remain.</Text>
      <Text style={styles.bodyText}>Yours truly,</Text>
      <InputField
        label="Signature (Type your name)"
        value={signature}
        onChangeText={setSignature}
        placeholder="Signature"
      />
      
      {isSubmitting && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.secondryColor} />
          <Text style={styles.loadingText}>Submitting form...</Text>
        </View>
      )}
      
      <SubmitButton 
        onPress={handleSubmit} 
        label={isSubmitting ? "Submitting..." : "Submit"}
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.secondryColor,
    alignSelf: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.secondryColor,
    marginBottom: 12,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 15,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionHeader: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.secondryColor,
    marginTop: 18,
    marginBottom: 8,
  },
  inputLabel: {
    color: colors.secondryColor,
    fontWeight: 'bold',
    fontSize: 15,
  },
  toText: {
    fontSize: 15,
    color: colors.primaryColor,
    marginTop: 10,
    marginBottom: 2,
  },
  address: {
    fontSize: 14,
    color: colors.primaryColor,
    marginBottom: 10,
    lineHeight: 18,
  },
  subject: {
    fontSize: 15,
    color: colors.primaryColor,
    marginBottom: 10,
  },
  bodyText: {
    fontSize: 15,
    color: '#000',
    marginBottom: 6,
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

export default CandidateRetirement;
