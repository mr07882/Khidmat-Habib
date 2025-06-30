const {StyleSheet} = require('react-native');
const {colors} = require('../Config/AppConfigData');

const feedbackStyles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  container: {
    paddingHorizontal: 22,
    marginTop: 30,
    marginBottom: 20,
    gap: 20,
  },
  heading: {
    fontSize: 18,
  },
  textInputs: {
    fontFamily: 'Poppins-Regular',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    height: 45,
    padding: 0,
    paddingLeft: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    fontSize: 15,
    shadowColor: '#bfbfbf',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 10,
  },
  textArea: {
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    height: 200,
    textAlignVertical: 'top',
    borderWidth: 0.5,
    borderColor: 'grey',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    borderRadius: 5,
    marginBottom: 10,
  },
  btnWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  submitBtn: {
    backgroundColor: colors.secondryColor,
    height: 45,
    width: 90,
    borderRadius: 7.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtnTxt: {
    color: 'white',
    fontSize: 14,
  },
});

export default feedbackStyles;
