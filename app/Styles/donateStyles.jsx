const {StyleSheet} = require('react-native');
import {colors} from '../Config/AppConfigData';

const mainscreen = {
  flex: 1,
  backgroundColor: colors.tertiaryColor,
};

const shadow = {
  borderColor: '#bfbfbf',
  borderWidth: 0.7,
  shadowColor: '#bfbfbf',
  shadowOffset: {
    width: 0,
    height: 6,
  },
  shadowOpacity: 0.1,
  shadowRadius: 2,
  elevation: 10,
};

const donateStyles = StyleSheet.create({
  // Global styles
  mainscreen,

  // Cause List Styles
  firstSection: {
    backgroundColor: colors.secondryColor,
    paddingVertical: 20,
    paddingHorizontal: 15,
    margin: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  quote: {
    color: colors.primaryColor,
    fontWeight: 600,
    fontSize: 14,
    textAlign: 'center',
  },
  secondSection: {
    marginHorizontal: 20,
  },
  causeBtn: {
    width: '45%',
    margin: 10,
    paddingHorizontal: 7,
    paddingTop: 15,
    paddingBottom: 7,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    justifyContent: 'space-between',
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
  causeBtnTxt: {
    marginTop: 10,
    width: '100%',
    textAlign: 'center',
    color: colors.secondryColor,
    fontSize: 14.5,
    fontFamily: 'Poppins-SemiBold',
  },

  // Sub Type Styles
  subScreen: {
    ...mainscreen,
    paddingVertical: 20,
    paddingHorizontal: 23,
  },
  detailsWrapper: {
    flexDirection: 'column',
    marginTop: 15,
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    ...shadow,
  },
  qtyInpWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailsBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailsTxt: {
    marginTop: 15,
  },
  submitBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '85%',
    marginVertical: 15,
    backgroundColor: colors.secondryColor,
    borderRadius: 20,
    paddingVertical: 9.5,
    paddingHorizontal: 15,
  },
  submitBtnTxt: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 12,
  },

  // Cart Items
  heading: {
    fontSize: 18,
    marginBottom: 18,
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 12,
    ...shadow,
  },
  itemName: {
    maxWidth: '57%',
    // backgroundColor: 'aqua',
    color: colors.secondryColor,
    fontSize: 15.5,
    flexWrap: 'wrap',
    lineHeight: 20.5,
  },
  itemAmountWrapper: {
    flexDirection: 'row',
    // backgroundColor: 'aqua',
    alignItems: 'center',
  },
  itemAmount: {
    fontSize: 15.5,
  },
  trashBtn: {
    backgroundColor: '#ff5555',
    borderRadius: 20,
    padding: 7,
    marginLeft: 7,
  },
  addItemBtn: {
    borderRadius: 400,
    width: 140,
    paddingVertical: 8,
    alignSelf: 'center',
  },
  addItemBtnIcn: {
    color: '#ffffff',
    fontSize: 14,
  },
  cartAmountWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cartAmountHeading: {
    fontSize: 17,
    fontFamily: 'Poppins-SemiBold',
    color: colors.secondryColor,
  },
  cartAmount: {
    fontSize: 16.5,
    fontFamily: 'Poppins-SemiBold',
  },
  causeImg: {
    width: '100%',
    aspectRatio: 1.5,
  },

  // Checkout Form
  bankInfo: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 17,
    borderRadius: 10,
    marginBottom: 15,
  },
  heading: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
  },
  subheading: {
    fontFamily: 'Poppins-Bold',
  },
  accountInfo: {
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomColor: '#000000',
    borderBottomWidth: 1,
  },
});

export default donateStyles;
