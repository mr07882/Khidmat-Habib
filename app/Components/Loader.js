import React from 'react';
import ring from '../../assets/loader.gif';
import {Image, View} from 'react-native';

const Loader = ({bgColor = 'white'}) => {
  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: bgColor,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Image source={ring} style={{width: 100, height: 100}}></Image>
    </View>
  );
};

export default Loader;
