import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { colors } from '../../Config/AppConfigData';

const DropDownMenu = ({ label, options, selectedValue, onValueChange, error }) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={styles.picker}
      >
        <Picker.Item label="Select" value="" />
        {options.map((option, index) => (
          <Picker.Item key={index} label={option.label} value={option.value} />
        ))}
      </Picker>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.secondryColor,
    marginBottom: 8,
  },
  picker: {
    borderWidth: 1,
    borderColor: colors.secondryColor,
    borderRadius: 8,
    backgroundColor: colors.primaryColor ,
    color: colors.secondryColor, // Updated text color to secondary color
  },
  errorText: {
    color: 'red',
    fontSize: 13,
    marginTop: 4,
  },
});

export default DropDownMenu;
