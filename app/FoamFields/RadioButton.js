import React, {useState, useEffect} from 'react';
import {StyleSheet, FlatList, Text, View, TouchableOpacity} from 'react-native';

import {COLORS, FONTS, SIZES, ICONS} from '../constants';
import {text} from '../Config/AppConfigData';

const RadioButton = props => {
  const {
    darkMode,
    value,
    itemList,
    onTermChange,
    style,
    label,
    validationStatus,
    validationStatusStyle,
    editable,
    labelStyle,
    language,
  } = props;

  const handleItemChange = (item, index) => {
    itemList.forEach(element => {
      if (element.type === item) {
        element.selected = true;
      } else {
        element.selected = false;
      }
    });
    onTermChange(itemList);
    // let arr = itemList.slice(0)

    // arr.forEach((item) => item.selected = false)
    // arr[index] = {
    // 	type: item,
    // 	selected: true
    // };
    // onTermChange(arr)
  };

  return (
    <View>
      <View>
        {!!label && (
          <View>
            <Text
              style={[
                styles.label,
                labelStyle,
                {textAlign: language === 'urdu' ? 'right' : 'left'},
              ]}>
              {label}
              {/* {validationStatus && <Text style={[styles.label, darkMode && DARK_THEME.lightGray7, !editable && { color: COLORS.disabled }, validationStatusStyle]}>{" "}{validationStatus}</Text>} */}
            </Text>
          </View>
        )}
      </View>
      <View style={{marginVertical: 10}}>
        {!!value && !!value.length
          ? value.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  marginVertical: 15,
                  display: 'flex',
                  flexDirection: language === 'urdu' ? 'row-reverse' : 'row',
                }}
                underlayColor={COLORS.light}
                onPress={() => handleItemChange(item.type, index)}>
                <View style={styles.itemIcon}>
                  {item.selected && (
                    <ICONS.FontAwesome
                      name={'circle'}
                      color={COLORS.gray3}
                      size={12}
                    />
                  )}
                </View>
                <Text style={styles.itemText}>{item.type}</Text>
              </TouchableOpacity>
            ))
          : itemList &&
            itemList.length &&
            itemList.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  marginVertical: 15,
                  display: 'flex',
                  flexDirection: language === 'urdu' ? 'row-reverse' : 'row',
                }}
                underlayColor={COLORS.light}
                onPress={() => handleItemChange(item.type, index)}>
                <View style={styles.itemIcon}>
                  {item.selected && (
                    <ICONS.FontAwesome
                      name={'circle'}
                      color={COLORS.gray3}
                      size={12}
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

export default RadioButton;

const styles = StyleSheet.create({
  row1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    // textTransform: 'capitalize'
  },
  itemText: {
    ...FONTS.h2_m,
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.gray3,
    width: '88%',
    lineHeight: 24,
  },
  itemIcon: {
    width: 20,
    height: 20,
    borderRadius: 50,
    borderWidth: 2,
    marginHorizontal: 10,
    borderColor: COLORS.gray3,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
