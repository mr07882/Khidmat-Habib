import React, {useEffect, useState} from 'react';
import {View, FlatList, SafeAreaView} from 'react-native';
import {connect} from 'react-redux';
import {month} from '../../Config/AppConfigData';
import {eventStyles} from '../../Styles';
import {Text} from '../../Components/core';
import EventDetailBtn from './components/EventDetailBtn';
import Loader from '../../Components/Loader';
import {isNotNullOrEmpty} from '../../Functions/Functions';

function NewsEvents(props) {
  const {eventNews, navigation} = props;
  const [events, setEvents] = useState([]);
  const [pinnedEvent, setPinnedEvent] = useState({});
  const [isEventPinned, setIsEventPinned] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (props.route.params.id !== undefined) {
      const {id} = props.route.params;
      const event = eventNews.filter(ele => ele.timeStamp === +id);
      if (event[0] !== undefined) {
        navigation.navigate('NEDetail', {
          DetaileventNews: event[0],
        });
      }
    }
  }, [eventNews]);

  useEffect(() => {
    if (eventNews) {
      let sorted = eventNews.sort((a, b) => a.timeStamp - b.timeStamp);
      let display = sorted.reverse();
      setEvents(display);

      let eventArr = display.filter(ele => ele.pinned == true);
      if (isNotNullOrEmpty(eventArr[0])) {
        setPinnedEvent(eventArr[0]);
        setIsEventPinned(true);
      }

      console.log(eventArr);

      setLoading(false);
    }
  }, []);

  function getDate(param) {
    let date = new Date(param).getDate();
    let year = new Date(param).getFullYear();
    let NumOfMonth = new Date(param).getMonth();
    let convertedMonth = month[NumOfMonth];
    return date + '-' + convertedMonth + '-' + year;
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={eventStyles.mainscreen}>
      <View style={eventStyles.firstSection}>
        <Text style={eventStyles.eventTxt}>
          Community is about caring for each other, supporting each other, and
          working together to achieve goals.
        </Text>
        <EventDetailBtn
          navigation={navigation}
          getDate={getDate}
          item={isEventPinned ? pinnedEvent : events[0]}
          pinned={true}
        />
      </View>
      {events.length ? (
        <FlatList
          data={events}
          style={eventStyles.secondSection}
          renderItem={({item}) => {
            if (
              (!isEventPinned && events.indexOf(item) === 0) ||
              (isEventPinned && pinnedEvent.timeStamp === item.timeStamp)
            ) {
              return;
            }
            return (
              <EventDetailBtn
                navigation={navigation}
                getDate={getDate}
                item={item}
              />
            );
          }}
          keyExtractor={item => item.timeStamp.toString()}
        />
      ) : (
        <View></View>
      )}
    </SafeAreaView>
  );
}

const mapStateToProps = state => {
  return {eventNews: state.reducer.eventNews};
};
export default connect(mapStateToProps)(NewsEvents);
