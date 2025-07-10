import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../Config/AppConfigData';

const RadioGroup = ({
  options,
  value,
  onChange,
  radioColor,
  direction = 'row', // Default is horizontal
}) => (
  <View
    style={[
      styles.groupContainer,
      direction === 'column' ? styles.column : styles.row,
    ]}
  >
    {options.map(opt => {
      const isSelected = value === opt.value;
      const outlineColor = colors.secondryColor;
      const textColor = isSelected ? colors.primaryColor : colors.secondryColor;
      const backgroundColor = isSelected ? colors.secondryColor : colors.primaryColor;

      return (
        <TouchableOpacity
          key={opt.value}
          style={[
            styles.radio,
            {
              borderColor: outlineColor,
              backgroundColor,
              marginRight: direction === 'row' ? 8 : 0,
              marginBottom: direction === 'column' ? 8 : 0,
            },
          ]}
          onPress={() => onChange(opt.value)}
        >
          <Text style={{ fontWeight: isSelected ? 'bold' : 'normal' }}>
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
  groupContainer: {
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  column: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  radio: {
    borderWidth: 1,
    borderColor: colors.primaryColor, // default, will be overridden inline
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginHorizontal: 6,
    marginVertical: 6,
    backgroundColor: '#fff', // default, will be overridden inline
  },
});

export default RadioGroup;
