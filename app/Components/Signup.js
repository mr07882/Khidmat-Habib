import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Signup = ({ onSignup, onGoToLogin, error }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = () => {
    onSignup?.(identifier, password, confirmPassword);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Image source={require('../../assets/logo.webp')} style={styles.logo} />

      <Text style={styles.title}>Create Account</Text>

      <TextInput
        style={styles.input}
        placeholder="JCIC No, Email or Phone"
        placeholderTextColor="#999"
        value={identifier}
        onChangeText={setIdentifier}
        keyboardType="default"
        autoCapitalize="none"
      />

      <View style={styles.passwordInputContainer}>
        <TextInput
          style={[styles.input, { marginBottom: 0, flex: 1 }]}
          placeholder="Password"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => setShowPassword((prev) => !prev)}
        >
          <Icon name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color="#715054" />
        </TouchableOpacity>
      </View>

      <View style={styles.passwordInputContainer}>
        <TextInput
          style={[styles.input, { marginBottom: 0, flex: 1 }]}
          placeholder="Confirm Password"
          placeholderTextColor="#999"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
        />
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => setShowConfirmPassword((prev) => !prev)}
        >
          <Icon name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color="#715054" />
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onGoToLogin} style={styles.linkContainer}>
        <Text style={styles.linkText}>Already have an account? <Text style={styles.linkHighlight}>Login</Text></Text>
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
  error: {
    color: 'red',
    marginBottom: 8,
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

export default Signup;
