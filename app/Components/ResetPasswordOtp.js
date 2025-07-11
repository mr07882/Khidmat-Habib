import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ResetPasswordOtp = ({ onSubmit, onResend, email, error, onClose }) => {
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Function to mask sensitive information
  const maskInfo = (info) => {
    if (!info) return '';
    if (info.length <= 5) return info;
    
    const firstThree = info.substring(0, 3);
    const lastTwo = info.substring(info.length - 2);
    const maskedLength = info.length - 5;
    const maskedPart = '*'.repeat(Math.min(maskedLength, 8)); // Max 8 asterisks
    
    return `${firstThree}${maskedPart}${lastTwo}`;
  };
  
  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Icon name="close" size={24} color="#715054" />
      </TouchableOpacity>
      <Text style={styles.title}>Enter OTP & New Password</Text>
      <Text style={styles.subtitle}>An OTP has been sent to your email:</Text>
      <Text style={styles.info}>{maskInfo(email)}</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        placeholderTextColor="#999"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
        maxLength={6}
      />
      <TextInput
        style={styles.input}
        placeholder="New Password"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm New Password"
        placeholderTextColor="#999"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={() => onSubmit(otp, password, confirmPassword)}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.linkContainer} onPress={onResend}>
        <Text style={styles.linkText}>Resend OTP</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECEAE4',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#715054',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#715054',
    marginBottom: 4,
  },
  info: {
    fontSize: 15,
    color: '#000',
    marginBottom: 2,
  },
  input: {
    width: '100%',
    maxWidth: 320,
    height: 48,
    backgroundColor: '#fff',
    borderColor: '#715054',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    marginBottom: 16,
    color: '#000',
  },
  button: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#715054',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#ECEAE4',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkContainer: {
    marginTop: 16,
  },
  linkText: {
    fontSize: 15,
    color: '#715054',
    fontWeight: '600',
  },
  error: {
    color: 'red',
    marginBottom: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
    padding: 8,
  },
});

export default ResetPasswordOtp;
