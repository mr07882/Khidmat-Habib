import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import {colors} from '../../Config/AppConfigData';

const LabeledTextInput = ({label, value, onChangeText, placeholder, ...props}) => (
  <View style={{marginBottom: 8}}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      {...props}
    />
  </View>
);

const styles = StyleSheet.create({
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 2,
    color: colors.primaryColor,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.primaryColor,
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    fontSize: 15,
  },
});

export default LabeledTextInput;
