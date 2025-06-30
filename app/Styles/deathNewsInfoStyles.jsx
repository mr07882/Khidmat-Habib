import {colors} from '../Config/AppConfigData';
const {StyleSheet} = require('react-native');

const deathInfoStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondryColor,
  },
  scroll: {
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    flex: 1,
    padding: 10,
    elevation: 7.5,
  },
  btnContainer: {
    display: 'flex',
    flexDirection: 'row',
    position: 'relative',
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: colors.primaryColor,
    elevation: 7.5,
  },
  btn: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnTxt: {
    color: colors.secondryColor,
    fontSize: 14,
  },
  rTxtCont: {
    paddingTop: 10,
  },
  rtxt: {
    color: 'black',
    fontSize: 13.5,
  },
  rTxtBold: {
    color: 'black',
    fontSize: 13.5,
    fontFamily: 'Poppins-SemiBold',
  },
  rImage: {
    width: '100%',
    borderRadius: 5,
  },
});

export default deathInfoStyles;
