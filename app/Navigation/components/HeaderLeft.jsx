import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NavBackIcn} from '../../Helpers/icons';
import {isNotNullOrEmpty} from '../../Functions/Functions';
import {colors} from '../../Config/AppConfigData';

const HeaderLeft = ({name = 'Back', route = '', onPress = false}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => {
          onPress
            ? onPress()
            : isNotNullOrEmpty(route)
            ? navigation.navigate(route)
            : navigation.goBack();
        }}>
        <NavBackIcn />
        <Text style={styles.txt}>{name}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // height: 40,
    top: 0,
    flexDirection: 'row',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
  },
  txt: {
    fontSize: 16,
    marginTop: 2,
    paddingLeft: 5,
    color: colors.secondryColor,
    fontFamily: 'Poppins-SemiBold',
  },
});

export default HeaderLeft;
