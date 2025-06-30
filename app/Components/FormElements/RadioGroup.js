import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {colors} from '../../Config/AppConfigData';

const RadioGroup = ({options, value, onChange}) => (
  <View style={styles.row}>
    {options.map(opt => (
      <TouchableOpacity
        key={opt.value}
        style={[styles.radio, value === opt.value && styles.radioSelected]}
        onPress={() => onChange(opt.value)}
      >
        <Text style={value === opt.value ? styles.selectedText : styles.text}>{opt.label}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  radio: {
    borderWidth: 1,
    borderColor: colors.primaryColor,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginHorizontal: 6,
    backgroundColor: '#fff',
  },
  radioSelected: {
    backgroundColor: colors.primaryColor,
  },
  text: {
    color: colors.primaryColor,
  },
  selectedText: {
    color: '#fff',
  },
});

export default RadioGroup;
