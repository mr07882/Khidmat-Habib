import {colors} from '../Config/AppConfigData';

const {StyleSheet} = require('react-native');

const settingStyles = StyleSheet.create({
  mainView: {
    padding: 20,
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subView: {
    marginTop: 20,
  },
  heading: {
    margin: 10,
    marginBottom: 40,
    fontSize: 19,
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
  },
  noPermissions: {
    fontSize: 18,
    marginTop: 15,
  },
  toggle: {
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondryColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleLabel: {
    fontFamily: 'Poppins-Medium',
    color: 'black',
    fontSize: 17,
  },
  trackStyle: {
    marginRight: 8,
  },
  deviceId: {
    fontSize: 8,
  },
});

export default settingStyles;
