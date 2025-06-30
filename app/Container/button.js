import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {mainScreenbuttonsStyles} from '../Config/StylesCss';
import {colors} from '../Config/AppConfigData';

export default function Button({
  nav,
  rought,
  data,
  WebViewLink,
  icn,
  text,
  colorFunc,
  telethonColors,
}) {
  const [btnBgColor, setBtnBgColor] = useState(colors.secondryColor);
  const [btnColor, setBtnColor] = useState(colors.primaryColor);
  let color = data?.style?.color;
  let bgColor = data?.style?.bgColor;

  const changeColor = () => {
    if (data !== undefined) {
      if (color !== '' && color !== undefined) {
        setBtnColor(color);
        colorFunc(color, data.name);
      } else {
        colorFunc(colors.primaryColor, data.name);
      }
      if (bgColor !== '' && bgColor !== undefined) {
        setBtnBgColor(bgColor);
      }
    }
  };

  useEffect(() => {
    changeColor();
  }, [color, bgColor]);

  const navigateFunc = () => {
    // if (data?.visible || data?.title === 'Electoral') {
    if (data?.visible) {
      nav.navigate(`${rought}`, data);
    } else {
      nav.navigate(`${rought}`, {WebViewLink: WebViewLink});
    }
  };

  return (
    <View style={mainScreenbuttonsStyles.buttonContainer}>
      <TouchableOpacity
        onPress={navigateFunc}
        style={[
          mainScreenbuttonsStyles.button,
          {
            backgroundColor:
              telethonColors?.bgColor !== undefined
                ? telethonColors.bgColor
                : btnBgColor,
          },
        ]}>
        {icn}
        <Text
          style={[
            mainScreenbuttonsStyles.buttonText,
            {
              color:
                telethonColors?.color !== undefined
                  ? telethonColors.color
                  : btnColor,
            },
          ]}>
          {text}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
