import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';

const OtpScreen = ({ onVerify, onResend, phone, email, error }) => {
  const [otp, setOtp] = useState('');
  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Text style={styles.title}>Enter OTP</Text>
      <Text style={styles.subtitle}>An OTP has been sent to:</Text>
      <Text style={styles.info}>{phone}</Text>
      <Text style={styles.info}>{email}</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        keyboardType="numeric"
        value={otp}
        onChangeText={setOtp}
        maxLength={6}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={() => onVerify(otp)}>
        <Text style={styles.buttonText}>Verify OTP</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onResend} style={styles.linkContainer}>
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
    maxWidth: 200,
    height: 48,
    backgroundColor: '#fff',
    borderColor: '#715054',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 18,
    marginBottom: 16,
    color: '#000',
    textAlign: 'center',
    letterSpacing: 8,
  },
  button: {
    width: '100%',
    maxWidth: 200,
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
});

export default OtpScreen;
