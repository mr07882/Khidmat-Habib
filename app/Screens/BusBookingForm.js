import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import InputField from '../Components/FormElements/InputField';
import SubmitButton from '../Components/FormElements/SubmitButton';
import AttachmentField from '../Components/FormElements/AttachmentField';
import DateTimePicker from '@react-native-community/datetimepicker';
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

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePickerBooking, setShowTimePickerBooking] = useState(false);
  const [showTimePickerOut, setShowTimePickerOut] = useState(false);

  // Attachments
  const [jcicFile, setJcicFile] = useState(null);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
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

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDateOfBooking(selectedDate.toISOString().split('T')[0]);
    }
  };

  const handleBookingTimeChange = (event, selectedTime) => {
    setShowTimePickerBooking(false);
    if (selectedTime) {
      setBookingTime(selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
  };

  const handleTimeOutChange = (event, selectedTime) => {
    setShowTimePickerOut(false);
    if (selectedTime) {
      setTimeOut(selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
  };

  const validateForm = () => {
    const fieldErrors = {};

    if (!fullName) fieldErrors.fullName = 'Full Name is required.';
    if (!address) fieldErrors.address = 'Address is required.';
    if (!membershipNumber) fieldErrors.membershipNumber = 'JCIC is required.';
    if (!cellNo) fieldErrors.cellNo = 'Cell Number is required.';
    if (!dateOfBooking) fieldErrors.dateOfBooking = 'Please select a date.';
    if (!pickUpPoint) fieldErrors.pickUpPoint = 'Pick Up Point is required.';
    if (!purpose) fieldErrors.purpose = 'Purpose is required.';
    if (!bookingTime) fieldErrors.bookingTime = 'Booking Time is required.';
    if (!timeOut) fieldErrors.timeOut = 'Time Out is required.';
    if (!jcicFile) fieldErrors.jcicFile = 'JCIC/CNIC copy is required.';

    setErrors(fieldErrors);

    return Object.keys(fieldErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    if (!userJCIC) {
      Alert.alert('Error', 'User not authenticated. Please login again.');
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
        placeholder="Enter your full name" 
        error={errors.fullName}
      />
      <InputField 
        label="Address" 
        value={address} 
        onChangeText={setAddress} 
        placeholder="Enter your complete address" 
        multiline={true}
        error={errors.address}
      />
      <InputField 
        label="JCIC" 
        value={membershipNumber} 
        onChangeText={setMembershipNumber} 
        placeholder="XXXX XXXX XXXX XXXX" 
        error={errors.membershipNumber}
      />
      <InputField 
        label="Cell No" 
        value={cellNo} 
        onChangeText={setCellNo} 
        placeholder="03XXXXXXXXX" 
        keyboardType="phone-pad"
        error={errors.cellNo}
      />
      <InputField 
        label="Res No" 
        value={resNo} 
        onChangeText={setResNo} 
        placeholder="021XXXXXXX" 
        keyboardType="phone-pad"
      />

      {/* Booking Details */}
      <Text style={styles.section}>Booking Details</Text>
      <Text style={styles.label}>Date of Booking</Text>
      {errors.dateOfBooking && <Text style={styles.errorText}>{errors.dateOfBooking}</Text>}
      <Text onPress={() => setShowDatePicker(true)} style={styles.datePicker}>{dateOfBooking || 'Select Date'}</Text>
      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      <InputField 
        label="Pick Up Point" 
        value={pickUpPoint} 
        onChangeText={setPickUpPoint} 
        placeholder="Pick up location" 
        error={errors.pickUpPoint}
      />
      <InputField 
        label="Purpose of booking the vehicle" 
        value={purpose} 
        onChangeText={setPurpose} 
        placeholder="Briefly describe the purpose for booking the vehicle" 
        multiline={true}
        error={errors.purpose}
      />

      <Text style={styles.label}>Booking Time</Text>
      <Text onPress={() => setShowTimePickerBooking(true)} style={styles.datePicker}>{bookingTime || 'Select Time'}</Text>
      {showTimePickerBooking && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          display="default"
          onChange={handleBookingTimeChange}
        />
      )}
      {errors.bookingTime && <Text style={styles.errorText}>{errors.bookingTime}</Text>}

      <Text style={styles.label}>Time Out</Text>
      <Text onPress={() => setShowTimePickerOut(true)} style={styles.datePicker}>{timeOut || 'Select Time'}</Text>
      {showTimePickerOut && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          display="default"
          onChange={handleTimeOutChange}
        />
      )}
      {errors.timeOut && <Text style={styles.errorText}>{errors.timeOut}</Text>}

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
        error={errors.jcicFile}
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
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  datePicker: {
    borderWidth: 1,
    borderColor: colors.secondryColor,
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    textAlign: 'center',
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
  errorText: {
    fontSize: 12,
    color: 'red',
    marginBottom: 8,
  },
});

export default BusBookingForm;