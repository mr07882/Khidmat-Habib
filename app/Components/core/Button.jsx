import React from 'react';
import {colors} from '../../Config/AppConfigData';
import {TouchableOpacity, View} from 'react-native';
import Text from './Text';

const Button = ({
  btnStyles = {},
  btnTextStyles = {},
  children,
  leftIcn = '',
  rightIcn = '',
  ...props
}) => {
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 15,
        backgroundColor: colors.secondryColor,
        borderRadius: 5,
        paddingVertical: 9.5,
        paddingHorizontal: 15,
        ...btnStyles,
      }}
      {...props}>
      <View>{leftIcn}</View>
      <Text
        selectable={false}
        style={{
          color: '#ffffff',
          fontSize: 16,
          fontFamily: 'Poppins-SemiBold',
          lineHeight: 23,
          ...btnTextStyles,
        }}>
        {children}
      </Text>
      <View>{rightIcn}</View>
    </TouchableOpacity>
  );
};

export default Button;
