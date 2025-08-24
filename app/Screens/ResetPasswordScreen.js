import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getMemberByJCIC } from '../Api/Firebase/MemberInformation';
import { generateOTP, storeOTP, verifyOTP, updateMemberPassword, hashPassword } from '../Api/Firebase/auth';
import { sendOTPEmail } from '../Api/Firebase/emailService';

const ResetPasswordScreen = ({ navigation }) => {
  const [step, setStep] = useState('request'); // 'request' or 'otp'
  const [jcic, setJcic] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 1: Request OTP
  const handleRequestOTP = async () => {
    if (!jcic.trim()) {
      setError('Please enter your JCIC number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Check if JCIC exists
      const memberResult = await getMemberByJCIC(jcic.trim());
      
      if (!memberResult.success) {
        setError('Invalid JCIC number. Please check and try again.');
        return;
      }

      if (memberResult.error === 'jcic does not exists') {
        setError('No such JCIC exists in our database.');
        return;
      }

      // Check if user has password (is signed up)
      if (!memberResult.data.Password) {
        setError('No account found with this JCIC. Please sign up first.');
        return;
      }

      // Generate and store OTP
      const otpCode = generateOTP();
      
      const otpResult = await storeOTP(jcic.trim(), otpCode);
      
      if (!otpResult.success) {
        setError('Failed to generate OTP. Please try again.');
        return;
      }

      // Send OTP via email
      const emailResult = await sendOTPEmail(memberResult.data.Email, otpCode);
      
      if (!emailResult.success) {
        setError('Failed to send OTP. Please try again.');
        return;
      }

      // Move to OTP step
      setStep('otp');
      
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and reset password
  const handleVerifyOTP = async () => {
    if (!otp.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Verify OTP
      const otpResult = await verifyOTP(jcic.trim(), otp.trim());
      
      if (!otpResult.success) {
        setError('Invalid or expired OTP. Please try again.');
        return;
      }

      // Hash password and update member in Firebase
      const hashedPassword = await hashPassword(newPassword);
      
      // Update password in Firebase
      const updateResult = await updateMemberPassword(jcic.trim(), hashedPassword);
      
      if (!updateResult.success) {
        setError('Failed to update password. Please try again.');
        return;
      }

      // Success - redirect to login
      Alert.alert(
        'Success!', 
        'Your password has been reset successfully. Please login with your new password.',
        [
          { 
            text: 'OK', 
            onPress: () => navigation.replace('Login') 
          }
        ]
      );
      
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    setLoading(true);
    setError('');

    try {
      // Generate new OTP
      const otpCode = generateOTP();
      const otpResult = await storeOTP(jcic.trim(), otpCode);
      
      if (!otpResult.success) {
        setError('Failed to generate new OTP. Please try again.');
        return;
      }

      // Get member data to send email
      const memberResult = await getMemberByJCIC(jcic.trim());
      
      if (!memberResult.success) {
        setError('Failed to get member information. Please try again.');
        return;
      }

      // Send new OTP via email
      const emailResult = await sendOTPEmail(memberResult.data.Email, otpCode);
      
      if (!emailResult.success) {
        setError('Failed to send new OTP. Please try again.');
        return;
      }

      // Update OTP info
      // setOtpInfo({ email: memberResult.data.Email, otp: otpCode }); // This line was removed from the new_code, so it's removed here.
      Alert.alert('Success', 'New OTP sent to your email!');
      
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Render request step
  if (step === 'request') {
    return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={() => navigation.replace('Login')}
        >
          <Icon name="close" size={24} color="#715054" />
        </TouchableOpacity>

        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          Enter your JCIC number to receive an OTP on your registered email.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="JCIC Number"
          placeholderTextColor="#999"
          value={jcic}
          onChangeText={setJcic}
          keyboardType="default"
          autoCapitalize="none"
          editable={!loading}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleRequestOTP}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  }

  // Render OTP step
  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <TouchableOpacity 
        style={styles.closeButton} 
        onPress={() => navigation.replace('Login')}
      >
        <Icon name="close" size={24} color="#715054" />
      </TouchableOpacity>

      <Text style={styles.title}>Enter OTP & New Password</Text>
      <Text style={styles.subtitle}>
        An OTP has been sent to your email. Enter it along with your new password.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        placeholderTextColor="#999"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
        maxLength={6}
        editable={!loading}
      />

      <View style={styles.passwordInputContainer}>
        <TextInput
          style={[styles.input, { marginBottom: 0, flex: 1 }]}
          placeholder="New Password"
          placeholderTextColor="#999"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry={!showNewPassword}
          editable={!loading}
        />
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => setShowNewPassword(!showNewPassword)}
        >
          <Icon name={showNewPassword ? "eye" : "eye-off"} size={24} color="#715054" />
        </TouchableOpacity>
      </View>

      <View style={styles.passwordInputContainer}>
        <TextInput
          style={[styles.input, { marginBottom: 0, flex: 1 }]}
          placeholder="Confirm New Password"
          placeholderTextColor="#999"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
          editable={!loading}
        />
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          <Icon name={showConfirmPassword ? "eye" : "eye-off"} size={24} color="#715054" />
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleVerifyOTP}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Resetting Password...' : 'Reset Password'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.linkButton} 
        onPress={handleResendOTP}
        disabled={loading}
      >
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
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
    padding: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#715054',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#715054',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
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
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#ECEAE4',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 16,
    padding: 8,
  },
  linkText: {
    fontSize: 15,
    color: '#715054',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  error: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 14,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    padding: 4,
    zIndex: 2,
    backgroundColor: 'transparent',
  },
});

export default ResetPasswordScreen;