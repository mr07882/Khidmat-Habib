import React from 'react';
import {View} from 'react-native';
import Text from './Text';

const Badge = ({count = 0, badgeWrapperStyles = {}, badgeTextStyles = {}}) => {
  return (
    <View
      style={{
        position: 'absolute',
        top: 7,
        right: 5,
        zIndex: 1,
        width: 18,
        height: 18,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        ...badgeWrapperStyles,
      }}>
      <Text
        style={{
          fontSize: 11,
          color: 'white',
          lineHeight: 15,
          fontFamily: 'Poppins-SemiBold',
          ...badgeTextStyles,
        }}>
        {count}
      </Text>
    </View>
  );
};

export default Badge;
