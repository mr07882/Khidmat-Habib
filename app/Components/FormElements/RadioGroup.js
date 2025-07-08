import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {colors} from '../../Config/AppConfigData';

const RadioGroup = ({options, value, onChange, radioColor}) => (
  <View style={styles.row}>
    {options.map(opt => {
      const isSelected = value === opt.value;
      // Set colors based on selection state
      const outlineColor = colors.secondryColor;
      // Fix: Always use primary color for selected text
      const textColor = isSelected ? colors.primaryColor : colors.secondryColor;
      const backgroundColor = isSelected ? colors.secondryColor : colors.primaryColor;
      return (
        <TouchableOpacity
          key={opt.value}
          style={[
            styles.radio,
            {
              borderColor: outlineColor,
              backgroundColor: backgroundColor,
            },
          ]}
          onPress={() => onChange(opt.value)}
        >
          <Text style={{fontWeight: isSelected ? 'bold' : 'normal'}}>
            {React.isValidElement(opt.label)
              ? React.cloneElement(opt.label, {
                  style: [opt.label.props.style, { color: textColor }],
                })
              : <Text style={{ color: textColor }}>{opt.label}</Text>}
          </Text>
        </TouchableOpacity>
      );
    })}
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
    borderColor: colors.primaryColor, // default, will be overridden inline
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginHorizontal: 6,
    backgroundColor: '#fff', // default, will be overridden inline
  },
});

export default RadioGroup;
