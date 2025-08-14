import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import InputField from '../Components/FormElements/InputField';
import SubmitButton from '../Components/FormElements/SubmitButton';
import AttachmentField from '../Components/FormElements/AttachmentField';
import { colors } from '../Config/AppConfigData';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  submitBusBookingForm,
  validateBusBookingForm,
  sanitizeFormData,
  uploadDocumentToCloudinary
} from '../Api/Firebase';

const BusBookingForm = ({ navigation }) => {
  // Applicant Details
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [membershipNumber, setMembershipNumber] = useState('');
  const [cellNo, setCellNo] = useState('');
  const [resNo, setResNo] = useState('');

  // Booking Details
  const [dateOfBooking, setDateOfBooking] = useState('');
  const [pickUpPoint, setPickUpPoint] = useState('');
  const [purpose, setPurpose] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [timeOut, setTimeOut] = useState('');
  const [totalHours, setTotalHours] = useState('');

  // Attachments
  const [jcicFile, setJcicFile] = useState(null);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userJCIC, setUserJCIC] = useState(null);

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

  const handleSubmit = async () => {
    if (!userJCIC) {
      Alert.alert('Error', 'User not authenticated. Please login again.');
      return;
    }

    // Check if required attachment is selected
    if (!jcicFile) {
      Alert.alert('Validation Error', 'JCIC/CNIC copy is required');
      return;
    }

    // Flatten form data
    const formData = {
      fullName,
      address,
      membershipNumber,
      cellNo,
      resNo,
      dateOfBooking,
      pickUpPoint,
      purpose,
      bookingTime,
      timeOut,
      totalHours,
    };

    const sanitized = sanitizeFormData(formData);

    // Validate form data (excluding file upload validation)
    const validation = validateBusBookingForm(sanitized);
    if (!validation.isValid) {
      Alert.alert('Validation Error', validation.errors.join('\n'));
      return;
    }

    // Proceed with form submission
    submitForm(sanitized);
  };

  const submitForm = async (data) => {
    setIsSubmitting(true);
    try {
      // Upload JCIC/CNIC file to Cloudinary
      let jcicFileUrl = null;
      if (jcicFile) {
        try {
          const fileUri = jcicFile.uri || jcicFile.fileCopyUri || jcicFile.path;
          const fileName = jcicFile.name || 'jcic_scan.pdf';
          const res = await uploadDocumentToCloudinary(fileUri, fileName, 'forms/bus-booking');
          if (res.success) {
            jcicFileUrl = res.url;
          }
        } catch (uploadError) {
          // Continue without throwing error
        }
      }

      // Validate that upload was successful
      if (!jcicFileUrl) {
        Alert.alert('Upload Error', 'Failed to upload JCIC/CNIC copy. Please try again.');
        return;
      }

      const finalData = {
        ...data,
        jcicFileUrl,
        submittedByJCIC: userJCIC,
      };

      const result = await submitBusBookingForm(userJCIC, finalData);
      if (result.success) {
        Alert.alert('Success', 'Bus booking submitted successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Error', result.error || 'Failed to submit form.');
      }
    } catch (e) {
      Alert.alert('Error', e.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      <Text style={styles.title}>Bus Booking Form</Text>
      <Text style={styles.infoText}>
        This form is used to book a bus for various purposes.
      </Text>

      {/* Applicant Details */}
      <Text style={styles.section}>Applicant Details</Text>
      <InputField 
        label="Name" 
        value={fullName} 
        onChangeText={setFullName} 
        placeholder="Applicant's Full Name" 
      />
      <InputField 
        label="Address" 
        value={address} 
        onChangeText={setAddress} 
        placeholder="Applicant's Complete Address" 
        multiline={true}
      />
      <InputField 
        label="Membership Number" 
        value={membershipNumber} 
        onChangeText={setMembershipNumber} 
        placeholder="XXXX XXXX XXXX XXXX" 
      />
      <InputField 
        label="Cell No" 
        value={cellNo} 
        onChangeText={setCellNo} 
        placeholder="03XXXXXXXXX" 
        keyboardType="phone-pad"
      />
      <InputField 
        label="Res No" 
        value={resNo} 
        onChangeText={setResNo} 
        placeholder="Residence Phone Number" 
        keyboardType="phone-pad"
      />

      {/* Booking Details */}
      <Text style={styles.section}>Booking Details</Text>
      <InputField 
        label="Date of Booking" 
        value={dateOfBooking} 
        onChangeText={setDateOfBooking} 
        placeholder="DD-MM-YYYY" 
      />
      <InputField 
        label="Pick Up Point" 
        value={pickUpPoint} 
        onChangeText={setPickUpPoint} 
        placeholder="Pick up location" 
      />
      <InputField 
        label="Purpose of booking the vehicle" 
        value={purpose} 
        onChangeText={setPurpose} 
        placeholder="Purpose of booking" 
        multiline={true}
      />
      <InputField 
        label="Booking Time" 
        value={bookingTime} 
        onChangeText={setBookingTime} 
        placeholder="e.g., 6:00 PM" 
      />
      <InputField 
        label="Time Out" 
        value={timeOut} 
        onChangeText={setTimeOut} 
        placeholder="e.g., 10:00 PM" 
      />
      <InputField 
        label="Total Hours" 
        value={totalHours} 
        onChangeText={setTotalHours} 
        placeholder="e.g., 4" 
        keyboardType="numeric"
      />

      {/* Attachments Section */}
      <Text style={styles.section}>Attachments</Text>
      <AttachmentField
        label="Copy of JCIC/CNIC"
        file={jcicFile}
        onPick={setJcicFile}
      />

      {/* Undertaking Section */}
      <Text style={styles.section}>Undertaking</Text>
      <View style={styles.undertakingBox}>
        <Text style={styles.undertakingText}>
          To,{'\n'}
          Honorary Secretary,{'\n'}
          Khoja (Pirhai) Shia Isna Asheri Jamaat,{'\n'}
          Karachi.{'\n\n'}

          SUBJECT: Undertaking For Bus Booking{'\n\n'}

          Dear Sir,{'\n'}
          We/I hereby undertake that:
        </Text>

        {[
          'We/I shall pay all deposits in advance for our booking of subject mentioned facilities.',
          'The facility / facilities is / are not being hired by us / me on behalf of any other institution / individual.',
          'The facility / facilities shall be used for the specific purpose for which the permission is requested in the prescribed form.',
          'We / I shall take due care of the facility / facilities while under our / my utilization.',
          'We / I shall be responsible for repairs / replacement of all damages.',
        ].map((point, index) => (
          <Text key={index} style={styles.pointText}>{`${index + 1}. ${point}`}</Text>
        ))}

        <Text style={styles.undertakingText}>
          We / I agree that:
        </Text>

        {[
          'i. The Management of jamaat reserves the right to approves or reject any application for booking and / or cancel any prior approved booking etc. without assigning any reasons whatsoever.',
          'ii. The Management of jamaat shall not confirm the booking until all the charge and security amount is deposited in advance by us/me.',
          'iii. The Management of jamaat shall forfeit 10% of booking charges if we / I cancel the booking before 36 hours of the date of scheduled program.',
          'iv. The Management of jamaat shall forfeit 20% booking charges if we / I cancel the booking within 24hours from the data of scheduled program.',
        ].map((clause, index) => (
          <Text key={`clause-${index}`} style={styles.pointText}>{clause}</Text>
        ))}

        {[
          '7. The safety of the passengers while embarking and disembarking shall be their own responsibility.',
          '8. Driver shall not be forced to driver faster than the prescribed speed.',
          '9. In case of accident / damage, no liability will be entertained.',
          '10. In case of any complaint, I will lodge the same at the jamaat office',
        ].map((point, index) => (
          <Text key={`point-${index + 7}`} style={styles.pointText}>{point}</Text>
        ))}

        <Text style={[styles.undertakingText, { marginTop: 10 }]}>
          By submitting this form, I expressly ratifY the terms and conditions contained herein.
        </Text>
      </View>

      {isSubmitting && (
        <View style={{ alignItems: 'center', marginVertical: 12 }}>
          <ActivityIndicator size="large" color={colors.secondryColor} />
          <Text style={{ marginTop: 8, color: colors.secondryColor }}>Submitting form...</Text>
        </View>
      )}

      <SubmitButton onPress={handleSubmit} title={isSubmitting ? 'Submitting...' : 'Submit'} disabled={isSubmitting} />
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
  undertakingBox: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    borderColor: colors.secondryColor,
    borderWidth: 1,
    marginTop: 12,
    marginBottom: 20,
  },
  undertakingText: {
    fontSize: 14,
    marginBottom: 6,
    color: '#333',
  },
  pointText: {
    fontSize: 14,
    marginBottom: 4,
    color: '#444',
    lineHeight: 20,
  },
});

export default BusBookingForm; 