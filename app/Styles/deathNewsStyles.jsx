const {StyleSheet} = require('react-native');
import {colors} from '../Config/AppConfigData';

const deathNewsStyles = StyleSheet.create({
  mainscreen: {
    flex: 1,
    backgroundColor: colors.primaryColor,
  },
  firstSection: {
    backgroundColor: colors.secondryColor,
    height: 190,
    padding: 25,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 55,
    borderBottomRightRadius: 55,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  deathNewsTxt: {
    color: colors.primaryColor,
    fontWeight: 600,
    fontSize: 14,
    textAlign: 'center',
  },
  anniversaryBtn: {
    backgroundColor: colors.primaryColor,
    width: 310,
    height: 55,
    paddingHorizontal: 25,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  anniversaryBtnTxt: {
    marginTop: 4,
    width: '100%',
    textAlign: 'center',
    color: colors.secondryColor,
    fontSize: 14.5,
    fontFamily: 'Poppins-SemiBold',
  },
  secondSection: {
    paddingVertical: 20,
  },
  deathNewsBtn: {
    borderRadius: 15,
    height: 70,
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
  btnView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  personName: {
    fontSize: 15,
    color: colors.secondryColor,
    fontFamily: 'Poppins-SemiBold',
  },
  namazEJanazaDetails: {
    fontSize: 10,
    color: colors.secondryColor,
    fontFamily: 'Poppins-SemiBold',
  },
});

export default deathNewsStyles;
