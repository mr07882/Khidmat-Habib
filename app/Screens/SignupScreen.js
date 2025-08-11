import React, { useState } from 'react';
import Signup from '../Components/Signup';
import OtpScreen from '../Components/OtpScreen';
import { Alert } from 'react-native';
import { getMemberByJCIC, checkMemberSignupStatus } from '../Api/Firebase/MemberInformation';
import { generateOTP, storeOTP, verifyOTP, updateMemberPassword, hashPassword } from '../Api/Firebase/auth';
import { sendOTPEmail } from '../Api/Firebase/emailService';

const SignupScreen = ({ navigation }) => {
  const [step, setStep] = useState('signup');
  const [loading, setLoading] = useState(false);
  const [jcic, setJcic] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpInfo, setOtpInfo] = useState({ phone: '', email: '' });
  const [error, setError] = useState('');
  const [memberData, setMemberData] = useState(null);

  const handleSignup = async (jcicInput, pass, confirmPass) => {
    setError('');
    setLoading(true);
    // Validation
    if (!jcicInput) {
      setError('Please enter your JCIC.');
      setLoading(false);
      return;
    }
    if (!pass) {
      setError('Please enter your password.');
      setLoading(false);
      return;
    }
    if (!confirmPass) {
      setError('Please confirm your password.');
      setLoading(false);
      return;
    }
    if (pass !== confirmPass) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    setJcic(jcicInput);
    setPassword(pass);
    setConfirmPassword(confirmPass);

    try {
      // Step 1: Check if JCIC exists in Firebase
      const memberResult = await getMemberByJCIC(jcicInput);
      if (!memberResult.success) {
        setError('Invalid JCIC number. Please check and try again.');
        setLoading(false);
        return;
      }
      if (memberResult.error === 'jcic does not exists') {
        setError('No such JCIC exists in our database. Please check and try again.');
        setLoading(false);
        return;
      }
      // Step 2: Check if user is already signed up
      const signupStatus = await checkMemberSignupStatus(jcicInput);
      if (signupStatus.hasPassword) {
        setError('An account with this JCIC already exists. Please login instead.');
        setLoading(false);
        return;
      }
      // Step 3: Store member data and proceed to OTP
      setMemberData(memberResult.data);
      // Generate and send OTP
      const otp = generateOTP();
      const otpResult = await storeOTP(jcicInput, otp);
      if (!otpResult.success) {
        setError('Failed to generate OTP. Please try again.');
        setLoading(false);
        return;
      }
      // Send OTP via email
      const emailResult = await sendOTPEmail(memberResult.data.Email, otp);
      if (!emailResult.success) {
        setError('Failed to send OTP. Please try again.');
        setLoading(false);
        return;
      }
      // Set OTP info and proceed to OTP screen
      setOtpInfo({ 
        phone: memberResult.data.Phone || '', 
        email: memberResult.data.Email 
      });
      setStep('otp');
      setLoading(false);
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (otp) => {
    setError('');
    
    try {
      // Verify OTP
      const otpResult = await verifyOTP(jcic, otp);
      
      if (!otpResult.success) {
        setError(otpResult.error || 'OTP verification failed');
        return;
      }

      // Hash password and update member in Firebase
      const hashedPassword = await hashPassword(password);
      
      // Update member password in Firebase
      const updateResult = await updateMemberPassword(jcic, hashedPassword);
      
      if (!updateResult.success) {
        setError('Failed to create account. Please try again.');
        return;
      }

      // Success - redirect to login screen
      Alert.alert('Success!', 'Account created successfully! Please login with your credentials.', [
        { text: 'OK', onPress: () => navigation.replace('Login') }
      ]);
      
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  const handleResendOtp = async () => {
    setError('');
    
    try {
      // Generate new OTP
      const otp = generateOTP();
      const otpResult = await storeOTP(jcic, otp);
      
      if (!otpResult.success) {
        setError('Failed to generate new OTP. Please try again.');
        return;
      }

      // Send new OTP via email
      const emailResult = await sendOTPEmail(memberData.Email, otp);
      
      if (!emailResult.success) {
        setError('Failed to send new OTP. Please try again.');
        return;
      }

      Alert.alert('Success', 'New OTP sent to your email!');
      
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
    }
  };

  return step === 'signup' ? (
    <Signup
      onSignup={handleSignup}
      onGoToLogin={() => navigation.replace('Login')}
      error={error}
      loading={loading}
    />
  ) : (
    <OtpScreen
      onVerify={handleVerifyOtp}
      onResend={handleResendOtp}
      phone={otpInfo.phone}
      email={otpInfo.email}
      error={error}
      onClose={() => navigation.replace('Login')}
    />
  );
};

export default SignupScreen;
