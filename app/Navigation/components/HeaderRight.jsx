import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {images} from '../../Config/AppConfigData';

const HeaderRight = () => {
  return (
    <View style={styles.container}>
      <Image source={images.navBarLogo} style={styles.img} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // height: 40,
    width: 30,
    marginRight: 15,
    elevation: 7.5,
    borderRadius: 20,
  },
  img: {
    height: 30,
    width: 30,
  },
});

export default HeaderRight;
