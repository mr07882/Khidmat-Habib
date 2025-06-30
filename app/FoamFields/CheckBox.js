import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  FlatList,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';

import {COLORS, FONTS, SIZES, ICONS} from '../constants';

const CheckBox = props => {
  const {
    labelStyle,
    darkMode,
    value,
    itemList,
    onTermChange,
    handleSelectedValues,
    style,
    label,
    editable = true,
    iconStyle,
    icon,
    iconColor,
    validationStatus,
    validationStatusStyle,
    language,
  } = props;

  const [field, setField] = useState([]);

  const [selectionList, setSelectionList] = useState([]);

  useEffect(() => {
    let updatedValues = itemList.slice(0);

    /**
     * if values are already selected and comming from container
     * then compare it with the display array type and if the
     * selected value matches with the type of display array then update
     * it's status to true else set it's to false
     */
    if (value.length) {
      for (
        let indexOfList = 0;
        indexOfList < updatedValues.length;
        indexOfList++
      ) {
        for (
          let indexOfValueList = 0;
          indexOfValueList < value.length;
          indexOfValueList++
        ) {
          if (
            updatedValues[indexOfList].type.toLowerCase() ===
            value[indexOfValueList].type.toLowerCase()
          ) {
            updatedValues[indexOfList].selected = true;
          }
        }
      }
      setSelectionList(updatedValues);
      setField(value);
    } else {
      /**
       * if the value array is empty then it means
       *  no value selected then pass the default
       * display array i.e itemlist into the selectionList
       */
      setSelectionList(itemList);
      setField(value);
    }
  }, [value.length]);

  const handleItemChange = item => {
    //update the selected value array
    let arr = selectionList.slice(0);
    let temp = field.slice(0);
    for (let index = 0; index < arr.length; index++) {
      if (arr[index].type === item) {
        arr[index].selected = !arr[index].selected;
        if (arr[index].selected === true) {
          temp.push(arr[index].type);
        }
        if (arr[index].selected === false) {
          temp = temp.filter(element => element !== item);
        }
      }
    }

    setField(temp);
    setSelectionList(arr);
    // handleSelectedValues(temp)
    onTermChange(arr);
  };

  return (
    <View>
      <View style={[styles.row1]}>
        {label && (
          <View>
            <Text
              style={[
                styles.label,
                labelStyle,
                {textAlign: language === 'urdu' ? 'right' : 'left'},
              ]}>
              {label}
              {/* {validationStatus && <Text style={[styles.label, validationStatusStyle]}>{" "}{validationStatus}</Text>} */}
            </Text>
          </View>
        )}
        {icon && (
          <View style={[styles.textInputIcon, iconStyle]}>
            <ICONS.MaterialIcons
              name={icon}
              color={iconColor ? iconColor : COLORS.black1}
              size={SIZES.calender}
            />
          </View>
        )}
      </View>
      <View style={{marginVertical: 10}}>
        {itemList.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={{
              marginVertical: 15,
              display: 'flex',
              flexDirection: language === 'urdu' ? 'row-reverse' : 'row',
            }}
            activeOpacity={0.7}
            // disabled={!editable}
            onPress={() => (editable ? handleItemChange(item.type) : {})}>
            <View
              style={[
                styles.itemIcon,
                {backgroundColor: item.selected ? COLORS.gray3 : 'transparent'},
                !editable && styles.disabledCheckBox,
              ]}>
              {item.selected && (
                <ICONS.AntDesign
                  name={'check'}
                  color={COLORS.white}
                  size={18}
                />
              )}
            </View>
            <Text style={styles.itemText}>{item.type}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default CheckBox;

const styles = StyleSheet.create({
  disabledCheckBox: {
    backgroundColor: COLORS.disabled,
    borderColor: COLORS.gray,
  },
  row1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  placeholder: {
    color: COLORS.lightGray1,
    ...FONTS.h2_r,
  },
  field: {
    color: COLORS.black1,
    ...FONTS.h2_r,
  },
  label: {
    ...FONTS.body4_r,
    paddingVertical: 20,
    color: COLORS.gray3,
    lineHeight: 25,
    letterSpacing: 0.5,
  },
  itemText: {
    ...FONTS.h2_m,
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.gray3,
    lineHeight: 20,
  },
  itemIcon: {
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: COLORS.gray3,
    overflow: 'hidden',
    marginHorizontal: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subText: {
    ...FONTS.xsmall_r,
    lineHeight: 18,
    letterSpacing: 0.16,
    color: COLORS.black3,
  },
});
