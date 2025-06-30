import React from 'react';
import {View} from 'react-native';
import Text from './Text';

const Label = ({children = '', required = true, viewStyles = {}}) => {
  return (
    <View style={{flexDirection: 'row', ...viewStyles}}>
      <Text>{children}</Text>
      {required && children && (
        <Text style={{color: '#FF0000', marginLeft: 2.5}}>*</Text>
      )}
    </View>
  );
};

export default Label;
