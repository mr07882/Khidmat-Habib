import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import InputField from '../Components/FormElements/InputField';
import RadioGroup from '../Components/FormElements/RadioGroup';
import SubmitButton from '../Components/FormElements/SubmitButton';
import AttachmentField from '../Components/FormElements/AttachmentField';
import { colors } from '../Config/AppConfigData';

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

const HallBookingForm = () => {
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

  const handleSubmit = () => {
    const data = {
      applicant: {
        fullName,
        fatherName,
        surname,
        organization,
        designation,
        jcic,
        cnic,
        address,
      },
      purpose: {
        type: purpose,
        otherDetail: purpose === 'other' ? otherPurposeDetail : '',
      },
      booking: {
        hall,
        fatimiyahDetail: hall === 'fatimiyah' ? fatimiyahDetail : '',
        otherHallDetail: hall === 'other' ? otherHallDetail : '',
        bookingDay,
        bookingDate,
        timingFrom,
        timingTo,
        totalHours,
        serving: {
          item: serveItem,
          otherDetail: serveItem === 'other' ? otherServeDetail : '',
        },
      },
    };

    console.log('Hall Booking Submission:', data);
    // TODO: Submit to backend or handle data
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      <Text style={styles.title}>Hall Booking Form</Text>
      <Text style={styles.infoText}>
        This form is for requesting a hall booking for various Jamaat-related or personal events.
      </Text>

      {/* Section 1: Applicant Details */}
      <Text style={styles.section}>Section 1: Applicant Details</Text>
      <InputField label="Full Name" value={fullName} onChangeText={setFullName} placeholder="Full Name" />
      <InputField label="Father's Name" value={fatherName} onChangeText={setFatherName} placeholder="Father's Name" />
      <InputField label="Surname" value={surname} onChangeText={setSurname} placeholder="Surname" />
      <InputField label="Name of Organization" value={organization} onChangeText={setOrganization} placeholder="Organization Name" />
      <InputField label="Designation (Authorized Person)" value={designation} onChangeText={setDesignation} placeholder="Designation" />
      <InputField label="JCIC Number" value={jcic} onChangeText={setJcic} placeholder="JCIC Number" />
      <InputField label="CNIC Number" value={cnic} onChangeText={setCnic} placeholder="CNIC Number" keyboardType="numeric" />
      <InputField label="Full Address" value={address} onChangeText={setAddress} placeholder="House/Flat No, Floor, Area, City, Country" />

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
      <RadioGroup
        options={hallOptions.map(opt => ({
          label: <Text style={{ color: colors.secondryColor }}>{opt.label}</Text>,
          value: opt.value,
        }))}
        value={hall}
        onChange={setHall}
        radioColor={colors.secondryColor}
      />
      {hall === 'fatimiyah' && (
        <RadioGroup
          options={fatimiyahOptions.map(opt => ({
            label: <Text style={{ color: colors.secondryColor }}>{opt.label}</Text>,
            value: opt.value,
          }))}
          value={fatimiyahDetail}
          onChange={setFatimiyahDetail}
          radioColor={colors.secondryColor}
        />
      )}
      {hall === 'other' && (
        <InputField
          label="Please specify the hall"
          value={otherHallDetail}
          onChangeText={setOtherHallDetail}
          placeholder="Other hall"
        />
      )}

      <InputField label="Booking Day" value={bookingDay} onChangeText={setBookingDay} placeholder="e.g., Friday" />
      <InputField label="Booking Date" value={bookingDate} onChangeText={setBookingDate} placeholder="DD-MM-YYYY" />
      <InputField label="Timing From" value={timingFrom} onChangeText={setTimingFrom} placeholder="e.g., 6:00 PM" />
      <InputField label="Timing To" value={timingTo} onChangeText={setTimingTo} placeholder="e.g., 10:00 PM" />
      <InputField label="Total Hours" value={totalHours} onChangeText={setTotalHours} placeholder="e.g., 4" keyboardType="numeric" />

      <Text style={styles.section}>What Will Be Served</Text>
      <RadioGroup
        options={serveOptions.map(opt => ({
          label: <Text style={{ color: colors.secondryColor }}>{opt.label}</Text>,
          value: opt.value,
        }))}
        value={serveItem}
        onChange={setServeItem}
        radioColor={colors.secondryColor}
      />
      {serveItem === 'other' && (
        <InputField
          label="Please specify what will be served"
          value={otherServeDetail}
          onChangeText={setOtherServeDetail}
          placeholder="Other serving items"
        />
      )}

      {/* Attachments Section */}
      <Text style={styles.section}>Section 4: Attachments</Text>
      <AttachmentField
        label="Scan of JCIC / CNIC"
        file={jcicFile}
        onPick={setJcicFile}
      />
      <AttachmentField
        label="Request Letter (in case of organization)"
        file={requestLetter}
        onPick={setRequestLetter}
      />
      <AttachmentField
        label="Online Payment Receipt"
        file={paymentReceipt}
        onPick={setPaymentReceipt}
      />


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




      <SubmitButton onPress={handleSubmit} />
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

export default HallBookingForm;
