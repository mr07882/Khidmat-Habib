import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {eventStyles} from '../../../Styles';
import {colors} from '../../../Config/AppConfigData';
import {PinIcn, RightArrowIcn} from '../../../Helpers/icons';
import {Text} from '../../../Components/core';

const EventDetailBtn = ({navigation, getDate, item, pinned = false}) => {
  let styles = {
    ...eventStyles.eventBtn,
    backgroundColor: pinned ? colors.primaryColor : '#ffffff',
  };

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('NEDetail', {
          DetaileventNews: item,
        })
      }
      style={styles}>
      <View style={eventStyles.btnView}>
        <Text style={eventStyles.eventName} numberOfLines={2}>
          {item.title}
        </Text>
        <RightArrowIcn styles={{color: colors.secondryColor}} />
      </View>
      <View style={eventStyles.pinnedDateWrapper}>
        <Text style={eventStyles.eventDate}>{getDate(item.timeStamp)}</Text>
        {pinned && <PinIcn />}
      </View>
    </TouchableOpacity>
  );
};

export default EventDetailBtn;
