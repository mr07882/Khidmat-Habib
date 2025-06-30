import {StyleSheet} from 'react-native';

const contactUsStyles = StyleSheet.create({
  container: {
    backgroundColor: '#725054',
    flex: 1,
    padding: 10,
  },
  scroll: {
    backgroundColor: 'white',
    elevation: 5,
    borderRadius: 10,
    flex: 1,
    padding: 10,
    paddingRight: 0,
  },
  heading: {
    color: 'black',
    fontSize: 15.5,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
  },
  subHeading: {
    fontFamily: 'Poppins-SemiBold',
    color: 'black',
    fontSize: 14,
    paddingTop: 5,
    paddingBottom: 10,
  },
  txt: {
    color: 'blue',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  tx: {
    fontSize: 14,
  },
  txP: {
    fontSize: 14,
    paddingLeft: 25,
  },
  icn: {
    fontSize: 14,
    color: '#725054',
    paddingRight: 10,
  },
  touchable: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
  },
});

export default contactUsStyles;
