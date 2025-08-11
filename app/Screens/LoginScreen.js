import React, { useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { getMemberByJCIC, checkMemberSignupStatus } from '../Api/Firebase/MemberInformation';
import { comparePassword } from '../Api/Firebase/auth';

import Login from '../Components/Login';
import { setUserId } from '../Redux/actions/authAction';
import { setUserLoggedIn } from '../Functions/Functions';

const LoginScreen = ({ navigation }) => {
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = async (jcic, password) => {
    setLoginError('');
    setLoading(true);
    // Handle special cases
    if (jcic === 'signup') {
      setLoading(false);
      navigation.replace('Signup');
      return;
    }
    if (jcic === 'resetPassword') {
      setLoading(false);
      navigation.replace('ResetPassword');
      return;
    }
    if (jcic === 'backToStart') {
      setLoading(false);
      navigation.replace('StartScreen');
      return;
    }
    // Validation
    if (!jcic && !password) {
      setLoginError('Please enter your JCIC and password.');
      setLoading(false);
      return;
    }
    if (!jcic) {
      setLoginError('Please enter your JCIC.');
      setLoading(false);
      return;
    }
    if (!password) {
      setLoginError('Please enter your password.');
      setLoading(false);
      return;
    }
    try {
      // Step 1: Check if JCIC exists in Firebase
      const memberResult = await getMemberByJCIC(jcic);
      if (!memberResult.success) {
        setLoginError('Invalid JCIC number. Please check and try again.');
        setLoading(false);
        return;
      }
      if (memberResult.error === 'jcic does not exists') {
        setLoginError('No such JCIC exists in our database. Please check and try again.');
        setLoading(false);
        return;
      }
      // Step 2: Check if user is signed up
      const signupStatus = await checkMemberSignupStatus(jcic);
      if (!signupStatus.hasPassword) {
        setLoginError('No account found with this JCIC. Please sign up first.');
        setLoading(false);
        return;
      }
      // Step 3: Verify password
      const isPasswordValid = await comparePassword(password, memberResult.data.Password);
      if (!isPasswordValid) {
        setLoginError('Invalid password. Please try again.');
        setLoading(false);
        return;
      }
      // Login successful
      try {
        // Set user as logged in for persistent login
        await setUserLoggedIn(jcic);
        // Save JCIC to AsyncStorage
        await AsyncStorage.setItem('JCIC', jcic);
        // Set JCIC in Redux
        dispatch(setUserId(jcic));
        // Pass JCIC via navigation
        navigation.replace('Home', { JCIC: jcic });
      } catch (err) {
        setLoginError('Login successful but failed to save session. Please try again.');
      }
      setLoading(false);
    } catch (err) {
      setLoginError('An error occurred during login. Please try again.');
      setLoading(false);
    }
  };

  return <Login onLogin={handleLogin} error={loginError} loading={loading} />;
};

export default LoginScreen;
