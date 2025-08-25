import React, { useState, useEffect } from 'react';
import {
  View,
  Modal,
  TextInput,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text } from '../Components/core';
import Loader from '../Components/Loader';
import { getMemberByJCIC } from '../Api/Firebase/MemberInformation';
import { generateOTP, storeOTP, verifyOTP } from '../Api/Firebase/auth';
import { sendOTPEmail } from '../Api/Firebase/emailService';
import { db } from '../Config/firebase';
import { ref, update, get } from 'firebase/database';
import { colors } from '../Config/AppConfigData';

const FAMILY_STORAGE_KEY = 'family_jcics';

const FamilyMemberManager = ({ userJCIC, loadFamilyMembers, navigation }) => {
  const [familyModalVisible, setFamilyModalVisible] = useState(false);
  const [familyJCICInput, setFamilyJCICInput] = useState('');
  const [familyOtp, setFamilyOtp] = useState('');
  const [pendingFamilyJCIC, setPendingFamilyJCIC] = useState('');
  const [familyApiError, setFamilyApiError] = useState('');
  const [familyOtpError, setFamilyOtpError] = useState('');
  const [isFamilyLoading, setIsFamilyLoading] = useState(false);
  const [familyOtpModal, setFamilyOtpModal] = useState(false);
  const [familyMembers, setFamilyMembers] = useState([]);

  useEffect(() => {
    const fetchFamilyMembers = async () => {
      try {
        const stored = await AsyncStorage.getItem(FAMILY_STORAGE_KEY);
        const members = stored ? JSON.parse(stored) : [];
        setFamilyMembers(members);
      } catch (error) {
        console.error('Error fetching family members:', error);
      }
    };
    fetchFamilyMembers();
  }, []);

  const handleAddFamilyMember = async () => {
    setFamilyApiError('');
    if (!familyJCICInput) {
      setFamilyApiError('Please enter JCIC number');
      return;
    }
    if (familyJCICInput === userJCIC) {
      setFamilyApiError('You cannot add yourself as a family member');
      return;
    }
    try {
      const stored = await AsyncStorage.getItem(FAMILY_STORAGE_KEY);
      let arr = stored ? JSON.parse(stored) : [];
      if (arr.includes(familyJCICInput)) {
        setFamilyApiError('Family member already added');
        return;
      }
    } catch (e) {}
    setIsFamilyLoading(true);
    try {
      const response = await getMemberByJCIC(familyJCICInput);
      if (!response.success || !response.data) {
        setFamilyApiError('Member Not found');
        setIsFamilyLoading(false);
        return;
      }
      const email = response.data.Email;
      if (!email) {
        setFamilyApiError('Family member does not have an email');
        setIsFamilyLoading(false);
        return;
      }
      const otp = generateOTP();
      await storeOTP(familyJCICInput, otp);
      await sendOTPEmail(email, otp);
      setPendingFamilyJCIC(familyJCICInput);
      setFamilyModalVisible(false);
      setFamilyOtpModal(true);
    } catch (e) {
      setFamilyApiError('Error sending OTP');
    } finally {
      setIsFamilyLoading(false);
    }
  };

  const handleVerifyFamilyOtp = async () => {
    setFamilyOtpError('');
    if (!familyOtp) {
      setFamilyOtpError('Please enter OTP');
      return;
    }
    setIsFamilyLoading(true);
    try {
      const result = await verifyOTP(pendingFamilyJCIC, familyOtp);
      if (!result.success) {
        setFamilyOtpError('Invalid OTP');
        setIsFamilyLoading(false);
        return;
      }

      const memberRef = ref(db, `Members/${userJCIC}`);
      const snapshot = await get(memberRef);
      let memberData = snapshot.exists() ? snapshot.val() : {};
      let familyList = Array.isArray(memberData.FamilyMembers) ? memberData.FamilyMembers : [];
      if (!familyList.includes(pendingFamilyJCIC)) {
        familyList.push(pendingFamilyJCIC);
        await update(memberRef, { FamilyMembers: familyList });
      }

      let stored = await AsyncStorage.getItem(FAMILY_STORAGE_KEY);
      let arr = stored ? JSON.parse(stored) : [];
      if (!arr.includes(pendingFamilyJCIC)) {
        arr.push(pendingFamilyJCIC);
        await AsyncStorage.setItem(FAMILY_STORAGE_KEY, JSON.stringify(arr));
      }

      setFamilyMembers(arr);
      setFamilyOtpModal(false);
      setFamilyOtp('');
      setFamilyJCICInput('');
      setPendingFamilyJCIC('');
      Alert.alert(
        'Family Member Added Successfully',
        'Please swipe through the membership cards on the home page to view the membership cards of your family members.'
      );
      setIsFamilyLoading(false);
      await loadFamilyMembers();

      // Navigate to Home screen and pass the new family member JCIC
      navigation.navigate('Home', { newFamilyMemberJCIC: pendingFamilyJCIC });
    } catch (e) {
      setFamilyOtpError('Error verifying OTP');
      setIsFamilyLoading(false);
    }
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.familyCard}
        onPress={() => setFamilyModalVisible(true)}>
        <Text style={styles.familyCardTitle}>Add Family Member</Text>
        <Text style={styles.familyCardDesc}>Add a family member to your account and access their membership card.</Text>
      </TouchableOpacity>

      
      {familyMembers.length > 0 ? (
        familyMembers.map((memberJCIC, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.cardText}>{memberJCIC}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.noFamilyText}>No family members added yet.</Text>
      )}

      <Modal
        visible={familyModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFamilyModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Family Member JCIC</Text>
            <TextInput
              style={styles.input}
              placeholder="JCIC Number"
              value={familyJCICInput}
              onChangeText={setFamilyJCICInput}
              keyboardType="numeric"
            />
            {familyApiError ? <Text style={styles.error}>{familyApiError}</Text> : null}
            <TouchableOpacity style={styles.modalButton} onPress={handleAddFamilyMember} disabled={isFamilyLoading}>
              <Text style={styles.modalButtonText}>{isFamilyLoading ? 'Please wait...' : 'Okay'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setFamilyModalVisible(false)} style={styles.modalCancel}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={familyOtpModal}
        transparent
        animationType="slide"
        onRequestClose={() => setFamilyOtpModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter OTP</Text>
            <Text style={styles.modalSubtitle}>
              Please enter the OTP sent to the family member's email/phone
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter OTP"
              value={familyOtp}
              onChangeText={setFamilyOtp}
              keyboardType="numeric"
              maxLength={6}
            />
            {familyOtpError ? <Text style={styles.error}>{familyOtpError}</Text> : null}
            <TouchableOpacity style={styles.modalButton} onPress={handleVerifyFamilyOtp} disabled={isFamilyLoading}>
              <Text style={styles.modalButtonText}>{isFamilyLoading ? 'Verifying...' : 'Verify OTP'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setFamilyOtpModal(false)} style={styles.modalCancel}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  familyCard: {
    backgroundColor: '#ECEAE4',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    elevation: 2,
  },
  familyCardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: colors.secondryColor,
    marginBottom: 5,
  },
  familyCardDesc: {
    color: '#444',
    marginBottom: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: colors.secondryColor,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#444',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: colors.secondryColor,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalCancel: {
    marginTop: 10,
  },
  modalCancelText: {
    color: colors.secondryColor,
    fontSize: 15,
    textAlign: 'center',
  },
  error: {
    color: 'red',
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.secondryColor,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  cardText: {
    fontSize: 14,
    color: '#444',
  },
  noFamilyText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    marginTop: 10,
  },
});

export default FamilyMemberManager;
