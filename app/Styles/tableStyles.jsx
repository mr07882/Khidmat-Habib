import {colors} from '../Config/AppConfigData';
const {StyleSheet} = require('react-native');

const tableBorder = {
  borderWidth: 1,
  borderColor: colors.secondryColor,
};
const tableRow = {
  backgroundColor: colors.secondryColor,
};
const tableText = {
  paddingHorizontal: 5,
  paddingVertical: 5,
  fontFamily: 'Poppins-Regular',
};

const tableStyles = StyleSheet.create({
  tableWrapper: {
    marginVertical: 15,
  },
  table: tableBorder,
  thead: {
    ...tableRow,
    borderBottomWidth: 1,
    borderBottomColor: colors.primaryColor,
  },
  graveyardRow: tableRow,
  theadText: {
    ...tableText,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    color: 'white',
  },
  tr: {
    flexDirection: 'row',
  },
  tdText: tableText,
  centeredTdText: {...tableText, textAlign: 'center'},
});

export default tableStyles;
