import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import InputField from '../Components/FormElements/InputField';
import RadioGroup from '../Components/FormElements/RadioGroup';
import SubmitButton from '../Components/FormElements/SubmitButton';
import AttachmentField from '../Components/FormElements/AttachmentField';
import DropDownMenu from '../Components/FormElements/DropDownMenu';
import { colors } from '../Config/AppConfigData';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  submitHallBookingForm,
  validateHallBookingForm,
  sanitizeFormData,
  uploadDocumentToCloudinary
} from '../Api/Firebase';
import DateTimePicker from '@react-native-community/datetimepicker';

const purposeOptions = [
  { label: 'Majlis', value: 'majlis' },
  { label: 'Marriage', value: 'marriage' },
  { label: 'Seminar', value: 'seminar' },
  { label: 'Meeting', value: 'meeting' },
  { label: 'Other', value: 'other' },
];

const hallOptions = [
  { label: 'Shaheed Hamid Ali Bhojani Hall (Ground Floor Khoja Jamaat Complex)', value: 'shaheed' },
  { label: 'Sughra Bai Raza Hussain Agha Auditorium (Basement Khoja Jamaat Complex)', value: 'sughra' },
  { label: 'Fatimiyah Community Centre (Gusal Khana)', value: 'fatimiyah' },
  { label: 'F.B.S Entrance Hall', value: 'fbs' },
  { label: 'Other', value: 'other' },
];

const fatimiyahOptions = [
  { label: 'Ground Floor', value: 'ground' },
  { label: 'Upper Floor', value: 'upper' },
  { label: 'Both', value: 'both' },
];

const serveOptions = [
  { label: 'Food', value: 'food' },
  { label: 'Refreshment', value: 'refreshment' },
  { label: 'Other', value: 'other' },
];

const scrollToError = (errors, scrollRef) => {
  const errorKeys = Object.keys(errors);
  if (errorKeys.length > 0) {
    const firstErrorKey = errorKeys[0];
    const errorPositions = {
      fullName: 0,
      fatherName: 1,
      surname: 2,
      organization: 3,
      designation: 4,
      jcic: 5,
      cnic: 6,
      address: 7,
      purpose: 8,
      hall: 9,
      bookingDate: 10,
      timingFrom: 11,
      timingTo: 12,
      serveItem: 13,
      jcicFile: 14,
      requestLetter: 15,
      paymentReceipt: 16,
    };
    const position = errorPositions[firstErrorKey];
    if (position !== undefined) {
      scrollRef.current.scrollTo({ y: position * 100, animated: true });
    }
  }
};

const HallBookingForm = ({ navigation }) => {
  const scrollRef = useRef(null);

  // Section 1: Applicant Details
  const [fullName, setFullName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [surname, setSurname] = useState('');
  const [organization, setOrganization] = useState('');
  const [designation, setDesignation] = useState('');
  const [jcic, setJcic] = useState('');
  const [cnic, setCnic] = useState('');
  const [address, setAddress] = useState('');

  // Section 2: Purpose
  const [purpose, setPurpose] = useState('');
  const [otherPurposeDetail, setOtherPurposeDetail] = useState('');

  // Section 3: Booking Details
  const [hall, setHall] = useState('');
  const [fatimiyahDetail, setFatimiyahDetail] = useState('');
  const [otherHallDetail, setOtherHallDetail] = useState('');

  const [bookingDay, setBookingDay] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [timingFrom, setTimingFrom] = useState('');
  const [timingTo, setTimingTo] = useState('');
  const [totalHours, setTotalHours] = useState('');

  const [serveItem, setServeItem] = useState('');
  const [otherServeDetail, setOtherServeDetail] = useState('');

  const [jcicFile, setJcicFile] = useState(null);
  const [requestLetter, setRequestLetter] = useState(null);
  const [paymentReceipt, setPaymentReceipt] = useState(null);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userJCIC, setUserJCIC] = useState(null);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePickerFrom, setShowTimePickerFrom] = useState(false);
  const [showTimePickerTo, setShowTimePickerTo] = useState(false);

  const [errors, setErrors] = useState({});

  const userId = useSelector(state => state.reducer.userId);
  useEffect(() => {
    const getUserJCIC = async () => {
      try {
        const storedJCIC = await AsyncStorage.getItem('JCIC');
        setUserJCIC(userId || storedJCIC);
      } catch (error) {}
    };
    getUserJCIC();
  }, [userId]);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setBookingDate(selectedDate.toISOString().split('T')[0]);
    }
  };

  const handleTimeFromChange = (event, selectedTime) => {
    setShowTimePickerFrom(false);
    if (selectedTime) {
      setTimingFrom(selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
  };

  const handleTimeToChange = (event, selectedTime) => {
    setShowTimePickerTo(false);
    if (selectedTime) {
      const selectedTimeString = selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setTimingTo(selectedTimeString);
      if (timingFrom) {
        const from = new Date(`1970-01-01T${timingFrom}:00`);
        const to = new Date(`1970-01-01T${selectedTimeString}:00`);
        const diff = (to - from) / (1000 * 60 * 60);
        setTotalHours(diff > 0 ? diff : 0);
      }
    }
  };

  useEffect(() => {
    if (timingFrom && timingTo) {
      const sanitizedTimingFrom = timingFrom.replace(/[^\d:\sAPM]/g, '');
      const sanitizedTimingTo = timingTo.replace(/[^\d:\sAPM]/g, '');
      const from = new Date(`1970-01-01T${sanitizedTimingFrom}:00`);
      const to = new Date(`1970-01-01T${sanitizedTimingTo}:00`);
      const diff = (to - from) / (1000 * 60 * 60);
      console.log('Sanitized Timing From:', sanitizedTimingFrom);
      console.log('Sanitized Timing To:', sanitizedTimingTo);
      console.log('Calculated Difference (hours):', diff);
      setTotalHours(diff > 0 ? diff : 0);
    }
  }, [timingFrom, timingTo]);

  const validateForm = () => {
    const fieldErrors = {};

    if (!fullName) fieldErrors.fullName = 'Full Name is required.';
    if (!fatherName) fieldErrors.fatherName = 'Father Name is required.';
    if (!surname) fieldErrors.surname = 'Surname is required.';
    if (!jcic) fieldErrors.jcic = 'JCIC is required.';
    if (!cnic) fieldErrors.cnic = 'CNIC is required.';
    if (!address) fieldErrors.address = 'Address is required.';

    if (!organization) fieldErrors.organization = 'Organization Name is required.';
    if (!designation) fieldErrors.designation = 'Designation is required.';

    if (!purpose) fieldErrors.purpose = 'Purpose is required.';

    if (!serveItem) fieldErrors.serveItem = 'Please select what will be served.';
    if (serveItem === 'other' && !otherServeDetail) fieldErrors.otherServeDetail = 'Please specify what will be served.';

    if (!hall) fieldErrors.hall = 'Hall selection is required.';
    if (hall === 'other' && !otherHallDetail) fieldErrors.otherHallDetail = 'Please specify the hall.';
    if (hall === 'fatimiyah' && !fatimiyahDetail) fieldErrors.fatimiyahDetail = 'Please specify Fatimiyah details.';

    if (!bookingDate) fieldErrors.bookingDate = 'Booking Date is required.';
    if (!timingFrom) fieldErrors.timingFrom = 'Timing From is required.';
    if (!timingTo) fieldErrors.timingTo = 'Timing To is required.';

    if (!jcicFile) fieldErrors.jcicFile = 'JCIC/CNIC scan is required.';

    setErrors(fieldErrors);

    return Object.keys(fieldErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      scrollToError(errors, scrollRef);
      return;
    }
    if (!userJCIC) {
      Alert.alert('Error', 'User not authenticated. Please login again.');
      return;
    }

    // Flatten form data
    const formData = {
      fullName, fatherName, surname, organization, designation, jcic, cnic, address,
      purpose, otherPurposeDetail,
      hall, fatimiyahDetail, otherHallDetail,
      bookingDay, bookingDate, timingFrom, timingTo, totalHours,
      serveItem, otherServeDetail,
    };

    const sanitized = sanitizeFormData(formData);

    // Check if all required attachments are selected
    if (!jcicFile) {
      Alert.alert('Validation Error', 'JCIC/CNIC scan is required');
      return;
    }

    // Proceed with form submission
    submitForm(sanitized);
  };

  const submitForm = async (data) => {
    setIsSubmitting(true);
    try {
      // Upload attachments to Cloudinary if present
      let jcicFileUrl = null, requestLetterUrl = null, paymentReceiptUrl = null;
      
      if (jcicFile) {
        try {
          const fileUri = jcicFile.uri || jcicFile.fileCopyUri || jcicFile.path;
          const fileName = jcicFile.name || 'jcic_scan.pdf';
          const res = await uploadDocumentToCloudinary(fileUri, fileName, 'forms/hall-booking');
          if (res.success) {
            jcicFileUrl = res.url;
          }
        } catch (uploadError) {
          // Continue without throwing error
        }
      }
      
      if (requestLetter) {
        try {
          const fileUri = requestLetter.uri || requestLetter.fileCopyUri || requestLetter.path;
          const fileName = requestLetter.name || 'request_letter.pdf';
          const res = await uploadDocumentToCloudinary(fileUri, fileName, 'forms/hall-booking');
          if (res.success) {
            requestLetterUrl = res.url;
          }
        } catch (uploadError) {
          // Continue without throwing error
        }
      }
      
      if (paymentReceipt) {
        try {
          const fileUri = paymentReceipt.uri || paymentReceipt.fileCopyUri || paymentReceipt.path;
          const fileName = paymentReceipt.name || 'payment_receipt.pdf';
          const res = await uploadDocumentToCloudinary(fileUri, fileName, 'forms/hall-booking');
          if (res.success) {
            paymentReceiptUrl = res.url;
          }
        } catch (uploadError) {
          // Continue without throwing error
        }
      }

      // Validate that all uploads were successful
      if (!jcicFileUrl) {
        Alert.alert('Upload Error', 'Failed to upload JCIC/CNIC scan. Please try again.');
        return;
      }
      if (!requestLetterUrl) {
        Alert.alert('Upload Error', 'Failed to upload request letter. Please try again.');
        return;
      }
      if (!paymentReceiptUrl) {
        Alert.alert('Upload Error', 'Failed to upload payment receipt. Please try again.');
        return;
      }

      const finalData = {
        ...data,
        jcicFileUrl,
        requestLetterUrl,
        paymentReceiptUrl,
        submittedByJCIC: userJCIC,
      };

      const result = await submitHallBookingForm(userJCIC, finalData);
      if (result.success) {
        Alert.alert('Success', 'Hall booking submitted successfully!', [
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
    <ScrollView ref={scrollRef} style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      <Text style={styles.title}>Hall Booking Form</Text>
      <Text style={styles.infoText}>
        This form is for requesting a hall booking for various Jamaat-related or personal events.
      </Text>

      {/* Section 1: Applicant Details */}
      <Text style={styles.section}>Section 1: Applicant Details</Text>
      <InputField
        label="Full Name"
        value={fullName}
        onChangeText={setFullName}
        placeholder="Enter full name"
        error={errors.fullName}
      />
      <InputField
        label="Father's Name"
        value={fatherName}
        onChangeText={setFatherName}
        placeholder="Enter your father's name"
        error={errors.fatherName}
      />
      <InputField
        label="Surname"
        value={surname}
        onChangeText={setSurname}
        placeholder="Surname"
        error={errors.surname}
      />
      <InputField
        label="Name of Organization"
        value={organization}
        onChangeText={setOrganization}
        placeholder="Organization Name"
        error={errors.organization}
      />
      <InputField
        label="Designation (Authorized Person)"
        value={designation}
        onChangeText={setDesignation}
        placeholder="Enter your designation in the organization"
        error={errors.designation}
      />
      <InputField
        label="JCIC Number"
        value={jcic}
        onChangeText={setJcic}
        placeholder="Enter your 16-digit JCIC number"
        error={errors.jcic}
      />
      <InputField
        label="CNIC Number"
        value={cnic}
        onChangeText={setCnic}
        placeholder="XXXXX-XXXXXXX-X"
        keyboardType="numeric"
        error={errors.cnic}
      />
      <InputField
        label="Full Address"
        value={address}
        onChangeText={setAddress}
        placeholder="House/Flat No, Floor, Area, City, Country"
        error={errors.address}
      />

      {/* Section 2: Purpose */}
      <Text style={styles.section}>Section 2: Purpose of Booking</Text>
      <RadioGroup
        options={purposeOptions.map(opt => ({
          label: <Text style={{ color: colors.secondryColor }}>{opt.label}</Text>,
          value: opt.value,
        }))}
        value={purpose}
        onChange={setPurpose}
        radioColor={colors.secondryColor}
        error={errors.purpose}
      />
      {purpose === 'other' && (
        <InputField
          label="Please specify the purpose"
          value={otherPurposeDetail}
          onChangeText={setOtherPurposeDetail}
          placeholder="Other purpose"
        />
      )}

      {/* Section 3: Booking Details */}
      <Text style={styles.section}>Section 3: Booking Details</Text>
      <DropDownMenu
        label="Select Hall"
        options={hallOptions}
        selectedValue={hall}
        onValueChange={setHall}
        error={errors.hall}
      />
      {hall === 'fatimiyah' && (
        <DropDownMenu
          label="Select Fatimiyah Detail"
          options={fatimiyahOptions}
          selectedValue={fatimiyahDetail}
          onValueChange={setFatimiyahDetail}
          error={errors.fatimiyahDetail}
        />
      )}
      {hall === 'other' && (
        <InputField
          label="Please specify the hall"
          value={otherHallDetail}
          onChangeText={setOtherHallDetail}
          placeholder="Other hall"
          error={errors.otherHallDetail}
        />
      )}

      <Text style={styles.label}>Booking Date</Text>
      <Text onPress={() => setShowDatePicker(true)} style={styles.datePicker}>{bookingDate || 'Select Date'}</Text>
      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      {errors.bookingDate && <Text style={styles.errorText}>{errors.bookingDate}</Text>}

      <Text style={styles.label}>Timing From</Text>
      <Text onPress={() => setShowTimePickerFrom(true)} style={styles.datePicker}>{timingFrom || 'Select Time'}</Text>
      {showTimePickerFrom && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          display="default"
          onChange={handleTimeFromChange}
        />
      )}
      {errors.timingFrom && <Text style={styles.errorText}>{errors.timingFrom}</Text>}

      <Text style={styles.label}>Timing To</Text>
      <Text onPress={() => setShowTimePickerTo(true)} style={styles.datePicker}>{timingTo || 'Select Time'}</Text>
      {showTimePickerTo && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          display="default"
          onChange={handleTimeToChange}
        />
      )}
      {errors.timingTo && <Text style={styles.errorText}>{errors.timingTo}</Text>}

      <InputField
        label="Total Hours"
        value={totalHours}
        onChangeText={setTotalHours}
        placeholder="Enter total hours"
        keyboardType="numeric"
        error={errors.totalHours}
      />

      <Text style={styles.section}>What Will Be Served</Text>
      <RadioGroup
        options={serveOptions.map(opt => ({
          label: <Text style={{ color: colors.secondryColor }}>{opt.label}</Text>,
          value: opt.value,
        }))}
        value={serveItem}
        onChange={setServeItem}
        radioColor={colors.secondryColor}
        error={errors.serveItem}
      />
      {serveItem === 'other' && (
        <InputField
          label="Please specify what will be served"
          value={otherServeDetail}
          onChangeText={setOtherServeDetail}
          placeholder="Other serving items"
          error={errors.otherServeDetail}
        />
      )}

      {/* Attachments Section */}
      <Text style={styles.section}>Section 4: Attachments</Text>
      <AttachmentField
        label="Scan of JCIC / CNIC"
        file={jcicFile}
        onPick={setJcicFile}
        error={errors.jcicFile}
      />
      <AttachmentField
        label="Request Letter (in case of organization)"
        file={requestLetter}
        onPick={setRequestLetter}
        error={errors.requestLetter}
      />
      <AttachmentField
        label="Online Payment Receipt"
        file={paymentReceipt}
        onPick={setPaymentReceipt}
        error={errors.paymentReceipt}
      />

      {isSubmitting && (
        <View style={{ alignItems: 'center', marginVertical: 12 }}>
          <ActivityIndicator size="large" color={colors.secondryColor} />
          <Text style={{ marginTop: 8, color: colors.secondryColor }}>Submitting form...</Text>
        </View>
      )}

      {/* Undertaking Section */}
      <Text style={styles.section}>Undertaking</Text>
      <View style={styles.undertakingBox}>
        <Text style={styles.undertakingText}>
          To,{'\n'}
          Honorary Secretary,{'\n'}
          Khoja (Pirhai) Shia Isna Ashri JAMAAT,{'\n'}
          Karachi.{'\n\n'}

          SUBJECT: Undertaking For Utilizing Of Halls Owned By KPSIAJ Karachi{'\n\n'}

          Dear Sir,{'\n'}
          I/We hereby undertake that:
        </Text>

        {[
          'I/We shall pay all dues in advance for booking of desired hall(s) and within 30 days before the date of program if the booking has to be made by an organization as per given schedule for the year.',
          'The facilities are being hired exclusively for me/us and not on behalf of any other organization/institution and/or any individual.',
          'The facilities shall only be used for the purpose, day and time, for which it is booked as per prescribed booking form.',
          'I/We shall use the electric/lighting facility which is already available in the respective Hall and will not fix/use any other light from my/our side of any specification.',
          'I/We take due care of all the facilities while under my/our utilization and understand that if anything is damaged or broken while it is in use, I/We shall be responsible for paying the cost of repairs / replacement immediately.',
          'I/We understand that charges are customary for any item(s) of equipment(s) borrowed from the Hall.',
          'I/We shall be responsible for keeping speakers/noise volume levels at a minimum and will not disturb other programs or use outside speakers.',
          'I/We shall manage proper parking and not block the road or cause inconvenience to others.',
          'The program shall be organized according to Shariah and no acts in contravention of Shariah shall be arranged.',
          'I/We shall print the name(s) of the hall on our invitation card as mentioned in the prescribed form.',
          'I/We understand that JAMAAT may alter the hall layout for safety or regulatory compliance.',
          'Except for Backdrop, no banners or inscriptions will be placed unless permitted, and must be placed only in prescribed areas.',
        ].map((point, index) => (
          <Text key={index} style={styles.pointText}>{`${index + 1}. ${point}`}</Text>
        ))}

        <Text style={styles.undertakingText}>
          I/We further agree that:
        </Text>

        {[
          'a) JAMAAT reserves the right to approve/reject any application or cancel a booking without reason.',
          'b) Booking is confirmed only after full advance payment and deposit.',
          'c) Multiple hall bookings will be treated separately, including cancellation charges.',
          'd) Booking is for 4 hours, ending no later than 12:00 midnight.',
          'e) Rs. 1000/- will be charged per hour beyond 4 hours.',
          'f) Deposit must be claimed within 30 days after the program; otherwise, it will be treated as donation.',
          'g) Provisional bookings made via phone/fax/email will be cancelled if not confirmed within 48 hours.',
          'h) I/We will obtain all required government permissions/NOCs; JAMAAT is not liable for any mishap.',
          'i) Only authorized caterers and decorators will be used.',
          'j) Cancellation Charges:',
          '   I. 10% before 45 days of the program.',
          '   II. 25% before 30 days.',
          '   III. 50% before 15 days.',
          '   IV. 75% before 7 days.',
          '   V. 100% within 3 days of the program.',
        ].map((clause, index) => (
          <Text key={`clause-${index}`} style={styles.pointText}>{clause}</Text>
        ))}

        <Text style={[styles.undertakingText, { marginTop: 10 }]}>
          By submitting this form, the user expressly ratifies the terms and conditions contained herein.
        </Text>
      </View>




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

export default HallBookingForm;
