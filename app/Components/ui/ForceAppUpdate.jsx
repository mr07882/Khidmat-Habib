import React, {useEffect} from 'react';
import {View, TouchableOpacity, Linking, StyleSheet} from 'react-native';
import {appLink, colors, text} from '../../Config/AppConfigData';
import {InAppUpdate} from '../../Functions';
import {Text} from '../core';
import SplashScreen from 'react-native-splash-screen';

export default ForceAppUpdate = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text.appVersionErrorCaption}</Text>
      <View style={styles.btnContainer}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => InAppUpdate.checkForUpdate()}>
          <Text style={styles.btnTxt}>Update Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'center',
    backgroundColor: colors.secondryColor,
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  text: {
    textAlign: 'center',
    color: colors.primaryColor,
    fontSize: 20,
    paddingHorizontal: 10,
  },
  btnContainer: {marginTop: 30, alignItems: 'center'},
  btn: {
    borderWidth: 1,
    borderColor: colors.primaryColor,
    width: 200,
    padding: 5,
    borderRadius: 20,
  },
  btnTxt: {textAlign: 'center', color: colors.primaryColor, fontSize: 20},
});
