import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../Config/AppConfigData';

const Checkbox = ({
  options = [],
  value = [],
  onChange,
  multiple = false,
  style = {},
  checkboxStyle = {},
  labelStyle = {},
  selectedColor = colors.secondryColor,
  unselectedColor = colors.secondryColor,
  selectedBackgroundColor = colors.secondryColor + '22',
  checkboxSize = 20,
  labelFontSize = 15,
  labelFontWeight = 'normal',
  selectedLabelFontWeight = 'bold',
  spacing = 8,
  padding = 8,
  borderRadius = 6,
}) => {
  const handleSelection = (optionValue) => {
    if (multiple) {
      // Multiple selection logic
      const newValue = value.includes(optionValue)
        ? value.filter(item => item !== optionValue)
        : [...value, optionValue];
      onChange(newValue);
    } else {
      // Single selection logic
      onChange(optionValue === value ? '' : optionValue);
    }
  };

  const isSelected = (optionValue) => {
    if (multiple) {
      return value.includes(optionValue);
    } else {
      return value === optionValue;
    }
  };

  return (
    <View style={[styles.container, style]}>
      {options.map((option, index) => {
        const selected = isSelected(option.value);
        return (
          <TouchableOpacity
            key={option.value || index}
            style={[
              styles.checkboxRow,
              {
                backgroundColor: selected ? selectedBackgroundColor : 'transparent',
                paddingVertical: padding,
                paddingHorizontal: padding,
                borderRadius: borderRadius,
                marginBottom: spacing,
              },
            ]}
            onPress={() => handleSelection(option.value)}
          >
            <View
              style={[
                styles.checkbox,
                {
                  width: checkboxSize,
                  height: checkboxSize,
                  borderColor: selected ? selectedColor : unselectedColor,
                  backgroundColor: selected ? selectedColor : '#fff',
                  borderRadius: checkboxSize / 4,
                },
                checkboxStyle,
              ]}
            />
            <Text
              style={[
                styles.checkboxLabel,
                {
                  fontSize: labelFontSize,
                  fontWeight: selected ? selectedLabelFontWeight : labelFontWeight,
                  color: selectedColor,
                },
                labelStyle,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    borderWidth: 2,
    marginRight: 10,
  },
  checkboxLabel: {
    flex: 1,
  },
});

export default Checkbox; 