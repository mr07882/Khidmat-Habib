const {StyleSheet} = require('react-native');
import {colors} from '../Config/AppConfigData';

const eventStyles = StyleSheet.create({
  mainscreen: {
    flex: 1,
    backgroundColor: colors.primaryColor,
  },
  firstSection: {
    backgroundColor: colors.secondryColor,
    height: 220,
    paddingVertical: 20,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  eventTxt: {
    color: colors.primaryColor,
    fontWeight: 600,
    fontSize: 14,
    textAlign: 'center',
  },
  pinnedDateWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondSection: {
    paddingVertical: 20,
  },
  btnView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eventBtn: {
    borderRadius: 15,
    height: 82,
    justifyContent: 'space-between',
    marginVertical: 10,
    marginHorizontal: 25,
    backgroundColor: '#ffffff',
    paddingVertical: 9,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  eventName: {
    width: '90%',
    marginRight: 15,
    fontSize: 14,
    color: colors.secondryColor,
    fontFamily: 'Poppins-SemiBold',
  },
  eventDate: {
    fontSize: 10,
    color: colors.secondryColor,
    fontFamily: 'Poppins-SemiBold',
  },
});

export default eventStyles;
