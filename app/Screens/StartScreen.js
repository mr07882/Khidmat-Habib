import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const StartScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/logo.webp')} style={styles.logo} />
      <Text style={styles.title}>Welcome to KPSIAJ</Text>
      <Text style={styles.subtitle}>Please select your role to continue</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.replace('Login')}>
        <Text style={styles.buttonText}>Enter as User</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.adminButton]} onPress={() => navigation.replace('AdminLogin')}>
        <Text style={styles.adminButtonText}>Enter as Admin</Text>
      </TouchableOpacity>
    </View>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#715054',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#715054',
    marginBottom: 30,
  },
  button: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#715054',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#715054',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  adminButton: {
    backgroundColor: '#ECEAE4', // same as screen bg, so text stands out
    borderWidth: 2,
    borderColor: '#715054',
  },
  buttonText: {
    color: '#ECEAE4', // user button text color
    fontSize: 18,
    fontWeight: 'bold',
  },
  adminButtonText: {
    color: '#715054', // admin button text color matches user button bg
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default StartScreen;
