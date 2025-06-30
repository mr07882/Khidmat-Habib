import React from 'react';
import {Image, TouchableOpacity} from 'react-native';
import {Text} from '../../../Components/core';
import donateStyles from '../../../Styles/donateStyles';
import {DONATION_APP_URL} from '../../../Config/core';

const CauseButton = ({onPress = () => {}, text = '', icon = ''}) => {
  return (
    <TouchableOpacity style={donateStyles.causeBtn} onPress={onPress}>
      <Image
        source={{uri: DONATION_APP_URL + icon}}
        style={{
          paddingHorizontal: 10,
          width: '100%',
          height: 100,
          resizeMode: 'contain',
        }}
      />
      <Text style={donateStyles.causeBtnTxt}>{text}</Text>
    </TouchableOpacity>
  );
};

export default CauseButton;
