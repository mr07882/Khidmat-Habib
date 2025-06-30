import React from 'react';
import {View, ActivityIndicator} from 'react-native';
import {loaderStyles} from '../Config/StylesCss';
export default function Loader() {
  return (
    <View style={loaderStyles.container}>
      <ActivityIndicator size="large" style={loaderStyles.loader} />
    </View>
  );
}
