import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import InputField from '../Components/FormElements/InputField';
import RadioGroup from '../Components/FormElements/RadioGroup';
import SubmitButton from '../Components/FormElements/SubmitButton';
import AttachmentField from '../Components/FormElements/AttachmentField';
import PhotoUpload from '../Components/FormElements/PhotoUpload';
import { colors } from '../Config/AppConfigData';

const maritalStatusOptions = [
  { label: 'Bachelor', value: 'bachelor' },
  { label: 'Widower', value: 'widower' },
  { label: 'Divorcee', value: 'divorcee' },
];

const NikahForm = () => {
  // Section 1: Bridegroom Details
  const [groomName, setGroomName] = useState('');
  const [groomMaritalStatus, setGroomMaritalStatus] = useState('');
  const [groomDOB, setGroomDOB] = useState('');
  const [groomFatherName, setGroomFatherName] = useState('');
  const [groomFatherSO, setGroomFatherSO] = useState('');
  const [groomFatherSurname, setGroomFatherSurname] = useState('');
  const [groomCNIC, setGroomCNIC] = useState('');
  const [groomJCIC, setGroomJCIC] = useState('');
  const [groomAddressRes, setGroomAddressRes] = useState('');
  const [groomAddressOff, setGroomAddressOff] = useState('');
  const [groomCellNo, setGroomCellNo] = useState('');
  const [groomTelRes, setGroomTelRes] = useState('');
  const [groomTelOff, setGroomTelOff] = useState('');
  const [groomEmail, setGroomEmail] = useState('');
  const [groomPhoto, setGroomPhoto] = useState(null);
  const [groomCNICFile, setGroomCNICFile] = useState(null);
  const [groomJCICFile, setGroomJCICFile] = useState(null);
  const [groomFatherCNICFile, setGroomFatherCNICFile] = useState(null);
  const [groomFatherJCICFile, setGroomFatherJCICFile] = useState(null);
  const [groomBloodTestFile, setGroomBloodTestFile] = useState(null);

  // Section 2: Bride Details
  const [brideName, setBrideName] = useState('');
  const [brideMaritalStatus, setBrideMaritalStatus] = useState('');
  const [brideDOB, setBrideDOB] = useState('');
  const [brideFatherName, setBrideFatherName] = useState('');
  const [brideFatherSO, setBrideFatherSO] = useState('');
  const [brideFatherSurname, setBrideFatherSurname] = useState('');
  const [brideCNIC, setBrideCNIC] = useState('');
  const [brideJCIC, setBrideJCIC] = useState('');
  const [brideAddressRes, setBrideAddressRes] = useState('');
  const [brideAddressOff, setBrideAddressOff] = useState('');
  const [brideCellNo, setBrideCellNo] = useState('');
  const [brideTelRes, setBrideTelRes] = useState('');
  const [brideTelOff, setBrideTelOff] = useState('');
  const [brideEmail, setBrideEmail] = useState('');
  const [bridePhoto, setBridePhoto] = useState(null);
  const [brideCNICFile, setBrideCNICFile] = useState(null);
  const [brideJCICFile, setBrideJCICFile] = useState(null);
  const [brideFatherCNICFile, setBrideFatherCNICFile] = useState(null);
  const [brideFatherJCICFile, setBrideFatherJCICFile] = useState(null);
  const [brideBloodTestFile, setBrideBloodTestFile] = useState(null);

  // Section 3: Additional Requirements
  const [otherJamaatNOCFile, setOtherJamaatNOCFile] = useState(null);
  const [divorceNOCFile, setDivorceNOCFile] = useState(null);
  const [nadraDivorceCertificateFile, setNadraDivorceCertificateFile] = useState(null);

  const handleSubmit = () => {
    const data = {
      groom: {
        name: groomName,
        maritalStatus: groomMaritalStatus,
        dob: groomDOB,
        father: {
          name: groomFatherName,
          so: groomFatherSO,
          surname: groomFatherSurname,
        },
        cnic: groomCNIC,
        jcic: groomJCIC,
        addressRes: groomAddressRes,
        addressOff: groomAddressOff,
        cellNo: groomCellNo,
        telRes: groomTelRes,
        telOff: groomTelOff,
        email: groomEmail,
        photo: groomPhoto,
        cnicFile: groomCNICFile,
        jcicFile: groomJCICFile,
        fatherCNICFile: groomFatherCNICFile,
        fatherJCICFile: groomFatherJCICFile,
        bloodTestFile: groomBloodTestFile,
      },
      bride: {
        name: brideName,
        maritalStatus: brideMaritalStatus,
        dob: brideDOB,
        father: {
          name: brideFatherName,
          so: brideFatherSO,
          surname: brideFatherSurname,
        },
        cnic: brideCNIC,
        jcic: brideJCIC,
        addressRes: brideAddressRes,
        addressOff: brideAddressOff,
        cellNo: brideCellNo,
        telRes: brideTelRes,
        telOff: brideTelOff,
        email: brideEmail,
        photo: bridePhoto,
        cnicFile: brideCNICFile,
        jcicFile: brideJCICFile,
        fatherCNICFile: brideFatherCNICFile,
        fatherJCICFile: brideFatherJCICFile,
        bloodTestFile: brideBloodTestFile,
      },
      additionalRequirements: {
        otherJamaatNOC: otherJamaatNOCFile,
        divorceNOC: divorceNOCFile,
        nadraDivorceCertificate: nadraDivorceCertificateFile,
      },
    };

    console.log('Nikah Form Submission:', data);
    // TODO: Submit to backend or handle data
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      <Text style={styles.title}>Nikah Form</Text>
      <Text style={styles.infoText}>
        This form is intended for members of Khoja (Pirhai) Shia Isna Asheri Jamaat who wish to initiate and officially register their Nikah (marriage) through Jamaat.
      </Text>

      {/* Section 1: Bridegroom Details */}
      <Text style={styles.section}>Section 1: Details of the Bridegroom</Text>
      <InputField label="Bridegroom's Name" value={groomName} onChangeText={setGroomName} placeholder="Full Name" />
      
      <Text style={styles.subsection}>Marital Status</Text>
      <RadioGroup
        options={maritalStatusOptions.map(opt => ({
          label: <Text style={{ color: colors.secondryColor }}>{opt.label}</Text>,
          value: opt.value,
        }))}
        value={groomMaritalStatus}
        onChange={setGroomMaritalStatus}
        radioColor={colors.secondryColor}
      />

      <InputField label="Date of Birth" value={groomDOB} onChangeText={setGroomDOB} placeholder="DD-MM-YYYY" />
      
      <Text style={styles.subsection}>Father's/Guardian Name</Text>
      <InputField label="Name" value={groomFatherName} onChangeText={setGroomFatherName} placeholder="Father's Name" />
      <InputField label="S/O" value={groomFatherSO} onChangeText={setGroomFatherSO} placeholder="Son of" />
      <InputField label="Surname" value={groomFatherSurname} onChangeText={setGroomFatherSurname} placeholder="Surname" />
      
      <InputField label="CNIC Number" value={groomCNIC} onChangeText={setGroomCNIC} placeholder="CNIC Number" keyboardType="numeric" />
      <InputField label="JCIC Number" value={groomJCIC} onChangeText={setGroomJCIC} placeholder="JCIC Number" />
      <InputField label="Address (Residential)" value={groomAddressRes} onChangeText={setGroomAddressRes} placeholder="Residential Address" multiline />
      <InputField label="Address (Office)" value={groomAddressOff} onChangeText={setGroomAddressOff} placeholder="Office Address" multiline />
      <InputField label="Cell Number" value={groomCellNo} onChangeText={setGroomCellNo} placeholder="Cell Number" keyboardType="phone-pad" />
      <InputField label="Telephone (Residential)" value={groomTelRes} onChangeText={setGroomTelRes} placeholder="Residential Phone" keyboardType="phone-pad" />
      <InputField label="Telephone (Office)" value={groomTelOff} onChangeText={setGroomTelOff} placeholder="Office Phone" keyboardType="phone-pad" />
      <InputField label="Email" value={groomEmail} onChangeText={setGroomEmail} placeholder="Email Address" keyboardType="email-address" />

      <Text style={styles.subsection}>Attachments - Bridegroom</Text>
      <PhotoUpload photo={groomPhoto} setPhoto={setGroomPhoto} />
      <AttachmentField label="CNIC of Groom" file={groomCNICFile} onPick={setGroomCNICFile} />
      <AttachmentField label="JCIC of Groom" file={groomJCICFile} onPick={setGroomJCICFile} />
      <AttachmentField label="CNIC of Groom's Father/Guardian" file={groomFatherCNICFile} onPick={setGroomFatherCNICFile} />
      <AttachmentField label="JCIC of Groom's Father/Guardian" file={groomFatherJCICFile} onPick={setGroomFatherJCICFile} />
      <AttachmentField label="Blood Test Reports (Thalassemia/Hepatitis/HIV/Blood Group)" file={groomBloodTestFile} onPick={setGroomBloodTestFile} />

      {/* Section 2: Bride Details */}
      <Text style={styles.section}>Section 2: Details of the Bride</Text>
      <InputField label="Bride's Name" value={brideName} onChangeText={setBrideName} placeholder="Full Name" />
      
      <Text style={styles.subsection}>Marital Status</Text>
      <RadioGroup
        options={maritalStatusOptions.map(opt => ({
          label: <Text style={{ color: colors.secondryColor }}>{opt.label}</Text>,
          value: opt.value,
        }))}
        value={brideMaritalStatus}
        onChange={setBrideMaritalStatus}
        radioColor={colors.secondryColor}
      />

      <InputField label="Date of Birth" value={brideDOB} onChangeText={setBrideDOB} placeholder="DD-MM-YYYY" />
      
      <Text style={styles.subsection}>Father's/Guardian Name</Text>
      <InputField label="Name" value={brideFatherName} onChangeText={setBrideFatherName} placeholder="Father's Name" />
      <InputField label="S/O" value={brideFatherSO} onChangeText={setBrideFatherSO} placeholder="Son of" />
      <InputField label="Surname" value={brideFatherSurname} onChangeText={setBrideFatherSurname} placeholder="Surname" />
      
      <InputField label="CNIC Number" value={brideCNIC} onChangeText={setBrideCNIC} placeholder="CNIC Number" keyboardType="numeric" />
      <InputField label="JCIC Number" value={brideJCIC} onChangeText={setBrideJCIC} placeholder="JCIC Number" />
      <InputField label="Address (Residential)" value={brideAddressRes} onChangeText={setBrideAddressRes} placeholder="Residential Address" multiline />
      <InputField label="Address (Office)" value={brideAddressOff} onChangeText={setBrideAddressOff} placeholder="Office Address" multiline />
      <InputField label="Cell Number" value={brideCellNo} onChangeText={setBrideCellNo} placeholder="Cell Number" keyboardType="phone-pad" />
      <InputField label="Telephone (Residential)" value={brideTelRes} onChangeText={setBrideTelRes} placeholder="Residential Phone" keyboardType="phone-pad" />
      <InputField label="Telephone (Office)" value={brideTelOff} onChangeText={setBrideTelOff} placeholder="Office Phone" keyboardType="phone-pad" />
      <InputField label="Email" value={brideEmail} onChangeText={setBrideEmail} placeholder="Email Address" keyboardType="email-address" />

      <Text style={styles.subsection}>Attachments - Bride</Text>
      <PhotoUpload photo={bridePhoto} setPhoto={setBridePhoto} />
      <AttachmentField label="CNIC of Bride" file={brideCNICFile} onPick={setBrideCNICFile} />
      <AttachmentField label="JCIC of Bride" file={brideJCICFile} onPick={setBrideJCICFile} />
      <AttachmentField label="CNIC of Bride's Father/Guardian" file={brideFatherCNICFile} onPick={setBrideFatherCNICFile} />
      <AttachmentField label="JCIC of Bride's Father/Guardian" file={brideFatherJCICFile} onPick={setBrideFatherJCICFile} />
      <AttachmentField label="Blood Test Reports (Thalassemia/Hepatitis/HIV/Blood Group)" file={brideBloodTestFile} onPick={setBrideBloodTestFile} />

      {/* Section 3: Additional Requirements */}
      <Text style={styles.section}>Section 3: Additional Requirements</Text>
      <Text style={styles.infoText}>
        In case the spouse belongs to Jamaat other than Khoja Shia Isna Asheria, they should attach the NOC from their respective Jamaat. In case of marriage after divorce, attach Jamaat's NOC and NADRA divorce certificate.
      </Text>
      <AttachmentField label="NOC from Other Jamaat (if applicable)" file={otherJamaatNOCFile} onPick={setOtherJamaatNOCFile} />
      <AttachmentField label="Jamaat's NOC for Divorce (if applicable)" file={divorceNOCFile} onPick={setDivorceNOCFile} />
      <AttachmentField label="NADRA Divorce Certificate (if applicable)" file={nadraDivorceCertificateFile} onPick={setNadraDivorceCertificateFile} />

      {/* Section 4: Payment Details */}
      <Text style={styles.section}>Section 4: Payment Details</Text>
      <View style={styles.paymentBox}>
        <Text style={styles.paymentTitle}>Jamaat NIKAH File will only be issued to a member of Jamaat against payment of:</Text>
        <Text style={styles.paymentItem}>a) Advance Jehaz Tax of Rs. 10,000.00 (payable by Bridegroom)</Text>
        <Text style={styles.paymentItem}>b) Nikah file fees/charges Rs. 600.00 (payable by Bridegroom)</Text>
        <Text style={styles.paymentItem}>c) Nikah file fees/charges Rs. 600.00 (payable by Bride)</Text>
        <Text style={styles.paymentItem}>d) Marriage Certificate charges Rs. 100.00 (payable by Bridegroom)</Text>
        <Text style={styles.paymentItem}>e) Refundable Security Deposit of Rs. 2,000.00 (payable by Bridegroom)*</Text>
        <Text style={styles.paymentNote}>
          *Security Deposit will be refunded after the Nikah File is submitted to Jamaat for Registration
        </Text>
        <Text style={styles.paymentNote}>
          Nikah File must be submitted within seven days after Nikah ceremony to avoid late fees. If the Nikah File is not submitted within seven days; late fee charged by the Registrar will be deducted from the Security Deposit
        </Text>
        <Text style={styles.paymentNote}>
          Female member marrying a Non-member can take Nikahnama against payment of Rs. 1,000.00
        </Text>
      </View>

      {/* Section 5: Undertaking */}
      <Text style={styles.section}>Section 5: Undertaking</Text>
      <View style={styles.undertakingBox}>
        <Text style={styles.undertakingText}>
          WE the undersigned hereby undertake:
        </Text>

        {[
          'To comply with the rules and regulations of Khoja (Pirhai) Shia Isna Asheri Jamaat in force from time to time',
          'To give true and correct information on all the Nikah and Marriage Forms of Jamaat and Governmental Nikahnama',
          'To submit NIKAH FILE in Jamaat for Registration within SEVEN DAYS from the date of NIKAH to avoid late fee',
          'To hold all Nikah/Marriage ceremonies as requested by the Management of Jamaat in their letter No. KPSIAJ/N&M/2014, which we have received along with Nikah file',
          "That we will fill in the details of JAHEZ, PRESENTS and GIFTS in FORM 'F' of JAMAAT within 10 (ten) DAYS after RUKHSATI and make payment of balance amount of JAHEZ TAX or adjust the advance amount. However, we are depositing Rs. 10,000.00 (Rupees ten thousand only) as Advance JAHEZ TAX with Jamaat",
        ].map((point, index) => (
          <Text key={index} style={styles.pointText}>{`• ${point}`}</Text>
        ))}
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
  subsection: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 6,
    color: colors.secondryColor,
  },
  paymentBox: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    borderColor: colors.secondryColor,
    borderWidth: 1,
    marginTop: 12,
    marginBottom: 20,
  },
  paymentTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  paymentItem: {
    fontSize: 14,
    marginBottom: 4,
    color: '#444',
    lineHeight: 20,
  },
  paymentNote: {
    fontSize: 13,
    marginTop: 8,
    marginBottom: 4,
    color: '#666',
    fontStyle: 'italic',
    lineHeight: 18,
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
    fontWeight: 'bold',
  },
  pointText: {
    fontSize: 14,
    marginBottom: 4,
    color: '#444',
    lineHeight: 20,
  },
});

export default NikahForm; 