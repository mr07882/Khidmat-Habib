import {StyleSheet, useWindowDimensions} from 'react-native';
import {colors} from './AppConfigData';

// const donateUsStyles = {
//   container: {backgroundColor: colors.secondryColor, flex: 1, padding: 5},
//   scroll: {
//     backgroundColor: 'white',
//     margin: 5,
//     elevation: 7.5,
//     borderRadius: 10,
//     flex: 1,
//     padding: 10,
//   },
// };
const NewsEventsStyles = {
  mainscreen: {flex: 1, padding: 10, backgroundColor: colors.secondryColor},
  listItm: {
    height: 50,
    backgroundColor: colors.primaryColor,
    padding: 5,
    margin: 10,
    borderRadius: 5,
    justifyContent: 'space-evenly',
    elevation: 7.5,
  },
  listTxt: {
    textAlign: 'center',
    fontSize: 14,
    color: colors.secondryColor,
    fontWeight: 'bold',
  },
  list2ndTxt: {
    textAlign: 'right',
    fontSize: 8,
    color: colors.secondryColor,
    fontWeight: 'bold',
  },
};
const loaderStyles = {
  container: {
    position: 'absolute',
    zIndex: 100,
    justifyContent: 'center',
    backgroundColor: 'grey',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    opacity: 0.8,
  },
  loader: {zIndex: 110},
};
const mainScreenbuttonsStyles = {
  buttonContainer: {
    width: '45%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    flexDirection: 'column',
    height: 65,
    width: 100,
    marginTop: '4%',
    marginBottom: '4%',
    borderRadius: 7.5,
    elevation: 7.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    marginTop: 5,
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
  },
};
const buttonsContainerStyles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingTop: 30,
    paddingBottom: 20,
    width: '100%',
    alignSelf: 'center',
  },
  donteButton: {
    marginTop: 20,
    width: '90%',
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 7.5,
    elevation: 7.5,
  },
  donateButtonText: {
    marginLeft: 8,
    marginTop: 5,
    fontSize: 15,
  },
});
const popUpScreenStyles = {
  modalImageStyle: {
    width: useWindowDimensions().width - 80,
  },
  modalCancleIcn: {
    fontSize: 30,
    elevation: 10,
    borderRadius: 20,
    textAlign: 'center',
    height: 30,
    width: 30,
    color: 'white',
    position: 'absolute',
    top: -10,
    left: -10,
    backgroundColor: 'red',
    zIndex: 1,
  },
};
const logoLineStyles = {
  container: {flexDirection: 'row', elevation: 10},
  main: {flex: 1, alignItems: 'center'},
  logoimage: {width: 70, height: 70},
  shadowImage: {
    backgroundColor: 'white',
    height: 70,
    width: 70,
    borderRadius: 40,
    elevation: 7.5,
  },
};

const newsEventsDetailStyles = {
  mainscreen: {flex: 1, backgroundColor: colors.secondryColor},
  scroll: {
    margin: 10,
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'white',
    elevation: 7.5,
  },
  main: {backgroundColor: 'white', borderRadius: 10},
  img: {
    height: useWindowDimensions().width - 50,
    width: '100%',
    resizeMode: 'contain',
    borderRadius: 10,
  },
  pdf: {
    height: useWindowDimensions().width - 50,
    width: '100%',
    borderRadius: 10,
  },
  video: {
    height: useWindowDimensions().width - 50,
    width: '100%',
    borderRadius: 10,
  },
  btnContainer: {
    display: 'flex',
    height: 50,
    backgroundColor: '#ECEAE4',
    flexDirection: 'row',
    position: 'relative',
    bottom: 0,
    right: 0,
    left: 0,
    elevation: 7.5,
  },
  btn: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  btnTxt: {color: colors.secondryColor, fontSize: 14},
};

const questionsStartNowStyles = {
  quizOpt: {
    width: useWindowDimensions().width,
    backgroundColor: 'red',
  },
};
export {
  // donateUsStyles,
  NewsEventsStyles,
  loaderStyles,
  questionsStartNowStyles,
  mainScreenbuttonsStyles,
  buttonsContainerStyles,
  popUpScreenStyles,
  logoLineStyles,
  newsEventsDetailStyles,
};
