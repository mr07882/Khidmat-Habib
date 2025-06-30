import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';

const Login = ({ onLogin, error }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    onLogin?.(identifier, password);
  };

  const handleBiometricLogin = async () => {
    const rnBiometrics = new ReactNativeBiometrics();
    const { available, biometryType } = await rnBiometrics.isSensorAvailable();
    if (!available) {
      return;
    }
    rnBiometrics.simplePrompt({ promptMessage: 'Login with Biometrics' })
      .then(resultObject => {
        const { success } = resultObject;
        if (success) {
          onLogin?.('biometric', 'biometric');
        } 
      })
      .catch(() => {
      });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Image source={require('../../assets/logo.webp')} style={styles.logo} />

      <Text style={styles.title}>User Login</Text>

      <TextInput
        style={styles.input}
        placeholder="JCIC Number"
        placeholderTextColor="#999"
        value={identifier}
        onChangeText={setIdentifier}
        keyboardType="default"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.biometricButton} onPress={handleBiometricLogin}>
        <Image source={require('../../assets/logo.webp')} style={styles.biometricIcon} />
        <Text style={styles.biometricText}>Login with Biometrics</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onLogin?.('resetPassword')} style={styles.linkContainer}>
        <Text style={styles.linkText}>Forgot password? <Text style={styles.linkHighlight}>Reset Password</Text></Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onLogin?.('signup')} style={styles.linkContainer}>
        <Text style={styles.linkText}>Don't have an account? <Text style={styles.linkHighlight}>Sign Up</Text></Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onLogin?.('backToStart')} style={styles.linkContainer}>
        <Text style={styles.linkText}>Back to Start</Text>
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
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#715054',
    marginBottom: 24,
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
    color: '#000',
  },
  linkHighlight: {
    color: '#715054',
    fontWeight: '600',
  },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderColor: '#715054',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 10,
    marginBottom: 8,
    shadowColor: '#715054',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: '100%',
    maxWidth: 280, // increased from 320 to 340
  },
  biometricIcon: {
    width: 28,
    height: 28,
    marginRight: 10,
    tintColor: '#715054',
  },
  biometricText: {
    color: '#715054',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: 'red',
    marginBottom: 8,
  },
});

export default Login;
