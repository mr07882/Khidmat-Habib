import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { colors } from '../Config/AppConfigData';
import AttachmentField from '../Components/FormElements/AttachmentField';
import SubmitButton from '../Components/FormElements/SubmitButton';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  submitDeathInfoForm,
  validateDeathInfoForm,
  sanitizeFormData,
  uploadDocumentToCloudinary
} from '../Api/Firebase';

const DeathInfoForm = ({ navigation }) => {
  // Deceased Section
  const [deceasedName, setDeceasedName] = useState('');
  const [deceasedAge, setDeceasedAge] = useState('');
  const [deceasedMembership, setDeceasedMembership] = useState('');
  const [deceasedCnic, setDeceasedCnic] = useState('');
  const [deceasedAddress, setDeceasedAddress] = useState('');
  const [causeOfDeath, setCauseOfDeath] = useState('');
  const [doctorName, setDoctorName] = useState('');

  // Father Section
  const [fatherName, setFatherName] = useState('');
  const [fatherSurname, setFatherSurname] = useState('');
  const [fatherMembership, setFatherMembership] = useState('');
  const [fatherCnic, setFatherCnic] = useState('');

  // Husband Section
  const [husbandName, setHusbandName] = useState('');
  const [husbandSurname, setHusbandSurname] = useState('');
  const [husbandMembership, setHusbandMembership] = useState('');
  const [husbandCnic, setHusbandCnic] = useState('');

  // Informer 1 Section
  const [informer1Name, setInformer1Name] = useState('');
  const [informer1Surname, setInformer1Surname] = useState('');
  const [informer1Membership, setInformer1Membership] = useState('');
  const [informer1Cnic, setInformer1Cnic] = useState('');
  const [informer1Address, setInformer1Address] = useState('');
  const [informer1Phone, setInformer1Phone] = useState('');

  // Informer 2 Section
  const [informer2Name, setInformer2Name] = useState('');
  const [informer2Surname, setInformer2Surname] = useState('');
  const [informer2Membership, setInformer2Membership] = useState('');
  const [informer2Cnic, setInformer2Cnic] = useState('');
  const [informer2Address, setInformer2Address] = useState('');
  const [informer2Phone, setInformer2Phone] = useState('');

  // Attachments
  const [deathCertAttachment, setDeathCertAttachment] = useState(null);
  const [deceasedJcicAttachment, setDeceasedJcicAttachment] = useState(null);
  const [deceasedCnicAttachment, setDeceasedCnicAttachment] = useState(null);
  const [informer1JcicAttachment, setInformer1JcicAttachment] = useState(null);
  const [informer1CnicAttachment, setInformer1CnicAttachment] = useState(null);
  const [informer2JcicAttachment, setInformer2JcicAttachment] = useState(null);
  const [informer2CnicAttachment, setInformer2CnicAttachment] = useState(null);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userJCIC, setUserJCIC] = useState(null);

  // Error state
  const [errors, setErrors] = useState({});

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

  const validateForm = () => {
    const newErrors = {};
    const cnicRegex = /^[0-9]{5}-[0-9]{7}-[0-9]$/;
    const jcicRegex = /^[0-9]{16}$/;

    if (!deceasedName) newErrors.deceasedName = 'Name of the deceased is required.';
    if (!deceasedAge) newErrors.deceasedAge = 'Age of the deceased is required.';
    if (!deceasedMembership) {
      newErrors.deceasedMembership = 'JCIC of the deceased is required.';
    } else if (!jcicRegex.test(deceasedMembership)) {
      newErrors.deceasedMembership = 'Invalid JCIC format. It must be a 16-digit numeric value.';
    }
    if (!deceasedCnic) {
      newErrors.deceasedCnic = 'CNIC of the deceased is required.';
    } else if (!cnicRegex.test(deceasedCnic)) {
      newErrors.deceasedCnic = 'Invalid CNIC format. Use XXXXX-XXXXXXX-X.';
    }
    if (!deceasedAddress) newErrors.deceasedAddress = 'Address of the deceased is required.';
    if (!causeOfDeath) newErrors.causeOfDeath = 'Cause of death is required.';
    if (!doctorName) newErrors.doctorName = 'Doctor name is required.';

    if (!fatherName) newErrors.fatherName = 'Father name is required.';
    if (!fatherSurname) newErrors.fatherSurname = 'Father surname is required.';
    if (!fatherMembership) {
      newErrors.fatherMembership = 'Father JCIC is required.';
    } else if (!jcicRegex.test(fatherMembership)) {
      newErrors.fatherMembership = 'Invalid JCIC format. It must be a 16-digit numeric value.';
    }
    if (!fatherCnic) {
      newErrors.fatherCnic = 'Father CNIC is required.';
    } else if (!cnicRegex.test(fatherCnic)) {
      newErrors.fatherCnic = 'Invalid CNIC format. Use XXXXX-XXXXXXX-X.';
    }

    if (!informer1Name) newErrors.informer1Name = 'Informer 1 name is required.';
    if (!informer1Surname) newErrors.informer1Surname = 'Informer 1 surname is required.';
    if (!informer1Membership) {
      newErrors.informer1Membership = 'Informer 1 JCIC is required.';
    } else if (!jcicRegex.test(informer1Membership)) {
      newErrors.informer1Membership = 'Invalid JCIC format. It must be a 16-digit numeric value.';
    }
    if (!informer1Cnic) {
      newErrors.informer1Cnic = 'Informer 1 CNIC is required.';
    } else if (!cnicRegex.test(informer1Cnic)) {
      newErrors.informer1Cnic = 'Invalid CNIC format. Use XXXXX-XXXXXXX-X.';
    }
    if (!informer1Address) newErrors.informer1Address = 'Informer 1 address is required.';
    if (!informer1Phone) newErrors.informer1Phone = 'Informer 1 phone number is required.';

    if (!deathCertAttachment) newErrors.deathCertAttachment = 'Death Certificate is required.';
    if (!deceasedJcicAttachment) newErrors.deceasedJcicAttachment = 'JCIC of Deceased is required.';
    if (!deceasedCnicAttachment) newErrors.deceasedCnicAttachment = 'CNIC of Deceased is required.';
    if (!informer1JcicAttachment) newErrors.informer1JcicAttachment = 'JCIC of Informer 1 is required.';
    if (!informer1CnicAttachment) newErrors.informer1CnicAttachment = 'CNIC of Informer 1 is required.';

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      if (!userJCIC) {
        Alert.alert('Error', 'User not authenticated. Please login again.');
        return;
      }

      // Check if required attachments are selected
      if (!deathCertAttachment) {
        Alert.alert('Validation Error', 'Death Certificate is required');
        return;
      }
      if (!deceasedJcicAttachment) {
        Alert.alert('Validation Error', 'JCIC of Deceased is required');
        return;
      }
      if (!deceasedCnicAttachment) {
        Alert.alert('Validation Error', 'CNIC of Deceased is required');
        return;
      }
      if (!informer1JcicAttachment) {
        Alert.alert('Validation Error', 'JCIC of Informer 1 is required');
        return;
      }
      if (!informer1CnicAttachment) {
        Alert.alert('Validation Error', 'CNIC of Informer 1 is required');
        return;
      }
      if (!informer2JcicAttachment) {
        Alert.alert('Validation Error', 'JCIC of Informer 2 is required');
        return;
      }
      if (!informer2CnicAttachment) {
        Alert.alert('Validation Error', 'CNIC of Informer 2 is required');
        return;
      }

      // Flatten form data
      const formData = {
        deceasedName,
        deceasedAge,
        deceasedMembership,
        deceasedCnic,
        deceasedAddress,
        causeOfDeath,
        doctorName,
        fatherName,
        fatherSurname,
        fatherMembership,
        fatherCnic,
        husbandName,
        husbandSurname,
        husbandMembership,
        husbandCnic,
        informer1Name,
        informer1Surname,
        informer1Membership,
        informer1Cnic,
        informer1Address,
        informer1Phone,
        informer2Name,
        informer2Surname,
        informer2Membership,
        informer2Cnic,
        informer2Address,
        informer2Phone,
      };

      const sanitized = sanitizeFormData(formData);

      // Validate form data
      const validation = validateDeathInfoForm(sanitized);
      if (!validation.isValid) {
        Alert.alert('Validation Error', validation.errors.join('\n'));
        return;
      }

      // Proceed with form submission
      submitForm(sanitized);
    }
  };

  const submitForm = async (data) => {
    setIsSubmitting(true);
    try {
      // Upload all attachments to Cloudinary
      let deathCertUrl = null, deceasedJcicUrl = null, deceasedCnicUrl = null;
      let informer1JcicUrl = null, informer1CnicUrl = null;
      let informer2JcicUrl = null, informer2CnicUrl = null;

      // Upload Death Certificate
      if (deathCertAttachment) {
        try {
          const fileUri = deathCertAttachment.uri || deathCertAttachment.fileCopyUri || deathCertAttachment.path;
          const fileName = deathCertAttachment.name || 'death_certificate.pdf';
          const res = await uploadDocumentToCloudinary(fileUri, fileName, 'forms/death-info');
          if (res.success) {
            deathCertUrl = res.url;
          }
        } catch (uploadError) {
          // Continue without throwing error
        }
      }

      // Upload Deceased JCIC
      if (deceasedJcicAttachment) {
        try {
          const fileUri = deceasedJcicAttachment.uri || deceasedJcicAttachment.fileCopyUri || deceasedJcicAttachment.path;
          const fileName = deceasedJcicAttachment.name || 'deceased_jcic.pdf';
          const res = await uploadDocumentToCloudinary(fileUri, fileName, 'forms/death-info');
          if (res.success) {
            deceasedJcicUrl = res.url;
          }
        } catch (uploadError) {
          // Continue without throwing error
        }
      }

      // Upload Deceased CNIC
      if (deceasedCnicAttachment) {
        try {
          const fileUri = deceasedCnicAttachment.uri || deceasedCnicAttachment.fileCopyUri || deceasedCnicAttachment.path;
          const fileName = deceasedCnicAttachment.name || 'deceased_cnic.pdf';
          const res = await uploadDocumentToCloudinary(fileUri, fileName, 'forms/death-info');
          if (res.success) {
            deceasedCnicUrl = res.url;
          }
        } catch (uploadError) {
          // Continue without throwing error
        }
      }

      // Upload Informer 1 JCIC
      if (informer1JcicAttachment) {
        try {
          const fileUri = informer1JcicAttachment.uri || informer1JcicAttachment.fileCopyUri || informer1JcicAttachment.path;
          const fileName = informer1JcicAttachment.name || 'informer1_jcic.pdf';
          const res = await uploadDocumentToCloudinary(fileUri, fileName, 'forms/death-info');
          if (res.success) {
            informer1JcicUrl = res.url;
          }
        } catch (uploadError) {
          // Continue without throwing error
        }
      }

      // Upload Informer 1 CNIC
      if (informer1CnicAttachment) {
        try {
          const fileUri = informer1CnicAttachment.uri || informer1CnicAttachment.fileCopyUri || informer1CnicAttachment.path;
          const fileName = informer1CnicAttachment.name || 'informer1_cnic.pdf';
          const res = await uploadDocumentToCloudinary(fileUri, fileName, 'forms/death-info');
          if (res.success) {
            informer1CnicUrl = res.url;
          }
        } catch (uploadError) {
          // Continue without throwing error
        }
      }

      // Upload Informer 2 JCIC
      if (informer2JcicAttachment) {
        try {
          const fileUri = informer2JcicAttachment.uri || informer2JcicAttachment.fileCopyUri || informer2JcicAttachment.path;
          const fileName = informer2JcicAttachment.name || 'informer2_jcic.pdf';
          const res = await uploadDocumentToCloudinary(fileUri, fileName, 'forms/death-info');
          if (res.success) {
            informer2JcicUrl = res.url;
          }
        } catch (uploadError) {
          // Continue without throwing error
        }
      }

      // Upload Informer 2 CNIC
      if (informer2CnicAttachment) {
        try {
          const fileUri = informer2CnicAttachment.uri || informer2CnicAttachment.fileCopyUri || informer2CnicAttachment.path;
          const fileName = informer2CnicAttachment.name || 'informer2_cnic.pdf';
          const res = await uploadDocumentToCloudinary(fileUri, fileName, 'forms/death-info');
          if (res.success) {
            informer2CnicUrl = res.url;
          }
        } catch (uploadError) {
          // Continue without throwing error
        }
      }

      // Validate that all uploads were successful
      if (!deathCertUrl) {
        Alert.alert('Upload Error', 'Failed to upload Death Certificate. Please try again.');
        return;
      }
      if (!deceasedJcicUrl) {
        Alert.alert('Upload Error', 'Failed to upload JCIC of Deceased. Please try again.');
        return;
      }
      if (!deceasedCnicUrl) {
        Alert.alert('Upload Error', 'Failed to upload CNIC of Deceased. Please try again.');
        return;
      }
      if (!informer1JcicUrl) {
        Alert.alert('Upload Error', 'Failed to upload JCIC of Informer 1. Please try again.');
        return;
      }
      if (!informer1CnicUrl) {
        Alert.alert('Upload Error', 'Failed to upload CNIC of Informer 1. Please try again.');
        return;
      }
      if (!informer2JcicUrl) {
        Alert.alert('Upload Error', 'Failed to upload JCIC of Informer 2. Please try again.');
        return;
      }
      if (!informer2CnicUrl) {
        Alert.alert('Upload Error', 'Failed to upload CNIC of Informer 2. Please try again.');
        return;
      }

      const finalData = {
        ...data,
        deathCertUrl,
        deceasedJcicUrl,
        deceasedCnicUrl,
        informer1JcicUrl,
        informer1CnicUrl,
        informer2JcicUrl,
        informer2CnicUrl,
        submittedByJCIC: userJCIC,
      };

      const result = await submitDeathInfoForm(userJCIC, finalData);
      if (result.success) {
        Alert.alert('Success', 'Death information form submitted successfully!', [
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
    <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 32}}>
      <Text style={styles.title}>Death Information Form</Text>

      {/* Deceased Section */}
      <Text style={styles.sectionHeader}>Deceased Information</Text>
      <FormInput label="Name" value={deceasedName} onChangeText={setDeceasedName} placeholder="Enter name of the deceased" />
      {errors.deceasedName && <Text style={styles.error}>{errors.deceasedName}</Text>}
      <FormInput label="Age" value={deceasedAge} onChangeText={setDeceasedAge} keyboardType="numeric"  placeholder="Enter age of the deceased"/>
      {errors.deceasedAge && <Text style={styles.error}>{errors.deceasedAge}</Text>}
      <FormInput label="JCIC" value={deceasedMembership} onChangeText={setDeceasedMembership}  placeholder="Enter 16-digit JCIC of the deceased"/>
      {errors.deceasedMembership && <Text style={styles.error}>{errors.deceasedMembership}</Text>}
      <FormInput label="CNIC Number" value={deceasedCnic} onChangeText={setDeceasedCnic}  placeholder="XXXXX-XXXXXXX-X"/>
      {errors.deceasedCnic && <Text style={styles.error}>{errors.deceasedCnic}</Text>}
      <FormInput label="Address" value={deceasedAddress} onChangeText={setDeceasedAddress} multiline  placeholder="Enter address of the deceased" />
      {errors.deceasedAddress && <Text style={styles.error}>{errors.deceasedAddress}</Text>}
      <FormInput label="Cause of Death" value={causeOfDeath} onChangeText={setCauseOfDeath}  placeholder="Enter the cause of death" />
      {errors.causeOfDeath && <Text style={styles.error}>{errors.causeOfDeath}</Text>}
      <FormInput label="Doctor's Name" value={doctorName} onChangeText={setDoctorName}  placeholder="Enter name of attending doctor"/>
      {errors.doctorName && <Text style={styles.error}>{errors.doctorName}</Text>}

      {/* Father Section */}
      <Text style={styles.sectionHeader}>Father of the Deceased</Text>
      <FormInput label="Father Name" value={fatherName} onChangeText={setFatherName} />
      {errors.fatherName && <Text style={styles.error}>{errors.fatherName}</Text>}
      <FormInput label="Surname" value={fatherSurname} onChangeText={setFatherSurname} />
      {errors.fatherSurname && <Text style={styles.error}>{errors.fatherSurname}</Text>}
      <FormInput label="JCIC" value={fatherMembership} onChangeText={setFatherMembership} />
      {errors.fatherMembership && <Text style={styles.error}>{errors.fatherMembership}</Text>}
      <FormInput label="CNIC Number" value={fatherCnic} onChangeText={setFatherCnic} />
      {errors.fatherCnic && <Text style={styles.error}>{errors.fatherCnic}</Text>}

      {/* Husband Section */}
      <Text style={styles.sectionHeader}>Husband of the Deceased</Text>
      <FormInput label="Husband's Name" value={husbandName} onChangeText={setHusbandName} />
      <FormInput label="Surname" value={husbandSurname} onChangeText={setHusbandSurname} />
      <FormInput label="JCIC" value={husbandMembership} onChangeText={setHusbandMembership} />
      <FormInput label="CNIC Number" value={husbandCnic} onChangeText={setHusbandCnic} />

      {/* Informer 1 Section */}
      <Text style={styles.sectionHeader}>Informer 1</Text>
      <FormInput label="Full Name" value={informer1Name} onChangeText={setInformer1Name} />
      {errors.informer1Name && <Text style={styles.error}>{errors.informer1Name}</Text>}
      <FormInput label="Surname" value={informer1Surname} onChangeText={setInformer1Surname} />
      {errors.informer1Surname && <Text style={styles.error}>{errors.informer1Surname}</Text>}
      <FormInput label="JCIC" value={informer1Membership} onChangeText={setInformer1Membership} />
      {errors.informer1Membership && <Text style={styles.error}>{errors.informer1Membership}</Text>}
      <FormInput label="CNIC Number" value={informer1Cnic} onChangeText={setInformer1Cnic} />
      {errors.informer1Cnic && <Text style={styles.error}>{errors.informer1Cnic}</Text>}
      <FormInput label="Address" value={informer1Address} onChangeText={setInformer1Address} multiline />
      {errors.informer1Address && <Text style={styles.error}>{errors.informer1Address}</Text>}
      <FormInput label="Tel/Cell Number" value={informer1Phone} onChangeText={setInformer1Phone} />
      {errors.informer1Phone && <Text style={styles.error}>{errors.informer1Phone}</Text>}

      {/* Informer 2 Section */}
      <Text style={styles.sectionHeader}>Informer 2</Text>
      <FormInput label="Full Name" value={informer2Name} onChangeText={setInformer2Name} />
      <FormInput label="Surname" value={informer2Surname} onChangeText={setInformer2Surname} />
      <FormInput label="JCIC" value={informer2Membership} onChangeText={setInformer2Membership} />
      <FormInput label="CNIC Number" value={informer2Cnic} onChangeText={setInformer2Cnic} />
      <FormInput label="Address" value={informer2Address} onChangeText={setInformer2Address} multiline />
      <FormInput label="Tel/Cell Number" value={informer2Phone} onChangeText={setInformer2Phone} />

      {/* Attachments Section */}
      <Text style={styles.sectionHeader}>Attachments</Text>
      {errors.deathCertAttachment && <Text style={styles.error}>{errors.deathCertAttachment}</Text>}
      <AttachmentField
        label="Death Certificate"
        file={deathCertAttachment}
        onPick={setDeathCertAttachment}
      />
      {errors.deceasedJcicAttachment && <Text style={styles.error}>{errors.deceasedJcicAttachment}</Text>}
      <AttachmentField
        label="JCIC of Deceased"
        file={deceasedJcicAttachment}
        onPick={setDeceasedJcicAttachment}
      />
      {errors.deceasedCnicAttachment && <Text style={styles.error}>{errors.deceasedCnicAttachment}</Text>}
      <AttachmentField
        label="CNIC of Deceased"
        file={deceasedCnicAttachment}
        onPick={setDeceasedCnicAttachment}
      />
      {errors.informer1JcicAttachment && <Text style={styles.error}>{errors.informer1JcicAttachment}</Text>}
      <AttachmentField
        label="JCIC of Informer 1"
        file={informer1JcicAttachment}
        onPick={setInformer1JcicAttachment}
      />
      {errors.informer1CnicAttachment && <Text style={styles.error}>{errors.informer1CnicAttachment}</Text>}
      <AttachmentField
        label="CNIC of Informer 1"
        file={informer1CnicAttachment}
        onPick={setInformer1CnicAttachment}
      />
      <AttachmentField
        label="JCIC of Informer 2"
        file={informer2JcicAttachment}
        onPick={setInformer2JcicAttachment}
      />
      <AttachmentField
        label="CNIC of Informer 2"
        file={informer2CnicAttachment}
        onPick={setInformer2CnicAttachment}
      />

      {isSubmitting && (
        <View style={{ alignItems: 'center', marginVertical: 12 }}>
          <ActivityIndicator size="large" color={colors.secondryColor} />
          <Text style={{ marginTop: 8, color: colors.secondryColor }}>Submitting form...</Text>
        </View>
      )}

      <SubmitButton title={isSubmitting ? 'Submitting...' : 'Submit'} onPress={handleSubmit} disabled={isSubmitting} />
    </ScrollView>
  );
};

const FormInput = ({ label, ...props }) => (
  <View style={{ marginBottom: 12 }}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      placeholder={label}
      placeholderTextColor={colors.secondryColor + '99'}
      {...props}
    />
  </View>
);

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
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.secondryColor,
    marginTop: 18,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.primaryColor,
    paddingBottom: 4,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.secondryColor,
    marginBottom: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.secondryColor,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    color: 'black', // Updated text color to black
    backgroundColor: '#fff',
  },
  attachmentLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.secondryColor,
    marginTop: 10,
    marginBottom: 2,
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginBottom: 4,
  },
});

export default DeathInfoForm;
