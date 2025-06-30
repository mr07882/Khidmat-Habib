import {StyleSheet} from 'react-native';
import {colors} from '../Config/AppConfigData';

const aboutUsStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.secondryColor,
    flex: 1,
    padding: 5,
  },
  scroll: {
    backgroundColor: 'white',
    margin: 5,
    elevation: 7.5,
    borderRadius: 10,
    flex: 1,
    padding: 10,
  },
  txt: {
    paddingBottom: 25,
  },
});

export default aboutUsStyles;
