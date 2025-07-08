import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../../Config/AppConfigData';

const SubmitButton = ({ onPress, title = 'Submit', style, textStyle, disabled = false }) => (
  <TouchableOpacity
    style={[styles.button, style, disabled && styles.disabled]}
    onPress={onPress}
    activeOpacity={0.8}
    disabled={disabled}
  >
    <Text style={[styles.text, textStyle]}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.secondryColor,
    borderRadius: 8,
    marginTop: 24,
    paddingVertical: 14,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  disabled: {
    opacity: 0.6,
  },
});

export default SubmitButton;
