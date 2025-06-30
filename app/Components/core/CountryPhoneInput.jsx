import React, {useRef} from 'react';
import PhoneInput from 'react-native-phone-number-input';
import Label from './Label';
import {View} from 'react-native';

const CountryPhoneInput = ({defaultCode = 'PK', ...props}) => {
  const phoneInput = useRef();

  return (
    <View style={{marginBottom: 10}}>
      <Label required={props.required}>{props.label}</Label>
      <PhoneInput
        ref={phoneInput}
        defaultCode={defaultCode}
        layout="first"
        flagButtonStyle={{
          width: 65,
          borderRightWidth: 1,
          borderColor: '#bfbfbf',
        }}
        codeTextStyle={{
          fontFamily: 'Poppins-SemiBold',
          fontSize: 15,
          height: 25,
          marginLeft: -5,
        }}
        textInputStyle={{
          fontFamily: 'Poppins-Regular',
          fontSize: 15,
          height: 45,
          padding: 0,
          paddingTop: 1.5,
          paddingLeft: 1.5,
        }}
        textContainerStyle={{
          borderLeftWidth: 1,
          borderTopRightRadius: 5,
          borderBottomRightRadius: 5,
          backgroundColor: '#ffffff',
          height: 43,
        }}
        containerStyle={{
          width: '100%',
          borderWidth: 1,
          borderColor: '#bfbfbf',
          height: 45,
          padding: 0,
          borderRadius: 5,
          shadowColor: '#bfbfbf',
          shadowOffset: {
            width: 0,
            height: 6,
          },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 10,
        }}
        {...props}
      />
    </View>
  );
};

export default CountryPhoneInput;
