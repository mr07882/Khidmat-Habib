import React from 'react';
import { View, Image } from 'react-native';
import {logoLineStyles} from '../Config/StylesCss';
import {images} from '../Config/AppConfigData';

export default function Logoline() {
  return (
    <View style={logoLineStyles.container}>
      <View style={logoLineStyles.main}>
        <View style={logoLineStyles.shadowImage}>
        <Image
          style={logoLineStyles.logoimage}
          source={images.mainLogo}
          />
          </View>
      </View>
    </View>
  );
}