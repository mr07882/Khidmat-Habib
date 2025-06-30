import React from 'react';
import {TextInput, View} from 'react-native';
import Label from './Label';
import Text from './Text';

const Input = ({
  inputWrapperStyles = {},
  inputStyles = {},
  readOnly = false,
  helperText = '',
  label = '',
  ...props
}) => {
  return (
    <View style={{marginBottom: 10, ...inputWrapperStyles}}>
      {label && <Label required={props.required}>{label}</Label>}
      <TextInput
        placeholderTextColor="#5e5e5e"
        style={{
          fontFamily: 'Poppins-Regular',
          borderWidth: 1,
          borderColor: '#bfbfbf',
          height: 45,
          padding: 0,
          paddingLeft: 10,
          backgroundColor: 'white',
          borderRadius: 5,
          fontSize: 15,
          shadowColor: '#bfbfbf',
          shadowOffset: {
            width: 0,
            height: 6,
          },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 10,
          color: readOnly ? '#808080' : '#000000',
          ...inputStyles,
        }}
        readOnly={readOnly}
        {...props}
      />
      {helperText && (
        <Text style={{marginLeft: 5, marginTop: 3, color: '#505050'}}>
          {helperText}
        </Text>
      )}
    </View>
  );
};

export default Input;
