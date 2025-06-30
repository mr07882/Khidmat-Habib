import React, { useState } from 'react';
import Signup from '../Components/Signup';
import OtpScreen from '../Components/OtpScreen';
import { Alert } from 'react-native';

const API_URL = 'http://10.0.2.2:5000'; // Change to your backend URL

const SignupScreen = ({ navigation }) => {
  const [step, setStep] = useState('signup');
  const [jcic, setJcic] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpInfo, setOtpInfo] = useState({ phone: '', email: '' });
  const [error, setError] = useState('');

  const handleSignup = async (jcicInput, pass, confirmPass) => {
    setError('');
    if (!jcicInput) {
      setError('Please enter your JCIC.');
      return;
    }
    if (!pass) {
      setError('Please enter your password.');
      return;
    }
    if (!confirmPass) {
      setError('Please confirm your password.');
      return;
    }
    if (pass !== confirmPass) {
      setError('Passwords do not match');
      return;
    }
    setJcic(jcicInput);
    setPassword(pass);
    setConfirmPassword(confirmPass);
    try {
      const res = await fetch(`${API_URL}/signup/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ JCIC: jcicInput }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP');
      setOtpInfo({ phone: data.number, email: data.email });
      setStep('otp');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleVerifyOtp = async (otp) => {
    setError('');
    try {
      const res = await fetch(`${API_URL}/signup/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ JCIC: jcic, password, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'OTP verification failed');
      Alert.alert('Signup successful!');
      navigation.replace('Home');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleResendOtp = () => handleSignup(jcic, password, confirmPassword);

  return step === 'signup' ? (
    <Signup
      onSignup={handleSignup}
      onGoToLogin={() => navigation.replace('Login')}
      error={error}
    />
  ) : (
    <OtpScreen
      onVerify={handleVerifyOtp}
      onResend={handleResendOtp}
      phone={otpInfo.phone}
      email={otpInfo.email}
      error={error}
    />
  );
};

export default SignupScreen;
