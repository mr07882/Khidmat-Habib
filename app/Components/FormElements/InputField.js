import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors } from '../../Config/AppConfigData';

const InputField = ({ label, value, onChangeText, placeholder, multiline = false, keyboardType = 'default', style, inputStyle, ...props }) => (
  <View style={[styles.container, style]}>
    {label ? <Text style={styles.label}>{label}</Text> : null}
    <TextInput
      style={[styles.input, inputStyle]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.secondryColor + '99'}
      multiline={multiline}
      keyboardType={keyboardType}
      {...props}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.secondryColor,
    marginBottom: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.secondryColor,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    color: colors.primaryColor,
    backgroundColor: '#fff',
  },
});

export default InputField;
