import React, { useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';

import Login from '../Components/Login';
import ResetPasswordRequest from '../Components/ResetPasswordRequest';
import ResetPasswordOtp from '../Components/ResetPasswordOtp';
import { setUserId } from '../Redux/actions/authAction';

const API_URL = 'http://10.0.2.2:5000'; // Change to your backend URL

const LoginScreen = ({ navigation }) => {
  const [step, setStep] = useState('login');
  const [resetJcic, setResetJcic] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [resetError, setResetError] = useState('');
  const [loginError, setLoginError] = useState('');
  const dispatch = useDispatch();

  const handleLogin = async (jcic, password) => {
    setLoginError('');
    if (jcic === 'signup') {
      navigation.replace('Signup');
      return;
    }
    if (jcic === 'resetPassword') {
      setStep('resetRequest');
      setResetError('');
      return;
    }
    if (jcic === 'backToStart') {
      navigation.replace('StartScreen');
      return;
    }
    if (!jcic && !password) {
      setLoginError('Please enter your JCIC and password.');
      return;
    }
    if (!jcic) {
      setLoginError('Please enter your JCIC.');
      return;
    }
    if (!password) {
      setLoginError('Please enter your password.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ JCIC: jcic, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error('Invalid JCIC or password');
      // Save JCIC to AsyncStorage
      await AsyncStorage.setItem('JCIC', jcic);
      // Set JCIC in Redux
      dispatch(setUserId(jcic));
      // Pass JCIC via navigation
      navigation.replace('Home', { JCIC: jcic });
    } catch (err) {
      setLoginError(err.message);
    }
  };

  const handleResetRequest = async (jcic) => {
    setResetError('');
    setResetJcic(jcic);
    try {
      const res = await fetch(`${API_URL}/reset-password/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ JCIC: jcic }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP');
      setResetEmail(data.email);
      setStep('resetOtp');
    } catch (err) {
      setResetError(err.message);
    }
  };

  const handleResetOtp = async (otp, password, confirmPassword) => {
    setResetError('');
    if (password !== confirmPassword) {
      setResetError('Passwords do not match');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/reset-password/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ JCIC: resetJcic, otp, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reset password');
      Alert.alert('Password reset successful!');
      navigation.replace('Profile', { JCIC: jcic });
    } catch (err) {
      setResetError(err.message);
    }
  };

  const handleResendOtp = () => handleResetRequest(resetJcic);

  if (step === 'resetRequest') {
    return <ResetPasswordRequest onSubmit={handleResetRequest} error={resetError} />;
  }
  if (step === 'resetOtp') {
    return <ResetPasswordOtp onSubmit={handleResetOtp} onResend={handleResendOtp} email={resetEmail} error={resetError} />;
  }
  return <Login onLogin={handleLogin} error={loginError} />;
};

export default LoginScreen;
