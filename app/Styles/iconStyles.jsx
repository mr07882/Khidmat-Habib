import {StyleSheet} from 'react-native';
import {colors} from '../Config/AppConfigData';

const icon = {
  color: colors.secondryColor,
  fontSize: 24,
};

const iconStyles = StyleSheet.create({
  rightArrow: icon,
  pin: {...icon, fontSize: 15},
});

export default iconStyles;
