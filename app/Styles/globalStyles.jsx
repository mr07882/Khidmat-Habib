import {colors} from '../Config/AppConfigData';
const {StyleSheet} = require('react-native');

const tabStyles = StyleSheet.create({
  container: {
    height: '100%',
  },
  main: {
    backgroundColor: colors.primaryColor,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  main2: {
    flex: 1,
    backgroundColor: 'white',
    elevation: 7.5,
  },
  text: {
    fontFamily: 'Poppins-SemiBold',
    color: colors.secondryColor,
  },
  activeTab: {
    paddingTop: 10,
    paddingBottom: 10,
    flex: 1,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: colors.secondryColor,
  },
  tab: {
    paddingTop: 10,
    paddingBottom: 10,
    flex: 1,
    alignItems: 'center',
  },
});

const renderHtmlStyles = StyleSheet.create({
  p: {
    marginVertical: 3.5,
    fontFamily: 'Poppins-Regular',
  },
  h3: {
    fontWeight: 500,
    fontFamily: 'Poppins-SemiBold',
  },
  strong: {
    fontWeight: 500,
    fontFamily: 'Poppins-SemiBold',
  },
});

export {tabStyles, renderHtmlStyles};
