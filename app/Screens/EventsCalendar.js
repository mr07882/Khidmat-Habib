import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import moment from 'moment-hijri';

// Safe imports with fallbacks
let shiaHijriEvents = [];
let communityEvents = [];

try {
  const shiaData = require('../Data/shiaHijriEvents');
  shiaHijriEvents = shiaData.shiaHijriEvents || [];
} catch (error) {
  console.warn('Could not load shiaHijriEvents:', error);
  shiaHijriEvents = [];
}

try {
  const communityData = require('../Data/communityEvents');
  communityEvents = communityData.communityEvents || [];
} catch (error) {
  console.warn('Could not load communityEvents:', error);
  communityEvents = [];
}

import { month } from '../Config/AppConfigData';

const today = moment().format('YYYY-MM-DD');
const CALENDAR_HEIGHT = 630;

// Function to convert Hijri date to Gregorian for current and next Hijri year
const convertHijriToGregorian = (hijriDay, hijriMonth) => {
  const currentHijriYear = moment().format('iYYYY');
  const nextHijriYear = parseInt(currentHijriYear) + 1;
  
  const currentYearDate = moment(`${hijriDay}/${hijriMonth}/${currentHijriYear}`, 'iD/iM/iYYYY');
  const nextYearDate = moment(`${hijriDay}/${hijriMonth}/${nextHijriYear}`, 'iD/iM/iYYYY');
  
  return [
    currentYearDate.format('YYYY-MM-DD'),
    nextYearDate.format('YYYY-MM-DD')
  ];
};

// Function to get color based on event type
const getEventColor = (event) => {
  try {
    // Check if event is an object with color property or just a string
    const title = typeof event === 'string' ? event : (event && event.title ? event.title : '');
    const eventColor = typeof event === 'object' && event && event.color ? event.color : null;
    
    // If color is specified in data file, use that color
    if (eventColor) {
      return eventColor;
    }
    
    // Check if it's a community event with category
    if (typeof event === 'object' && event && event.category) {
      switch (event.category) {
        case 'education': return '#4CAF50'; // Green
        case 'social': return '#FF9800'; // Orange
        case 'sports': return '#E91E63'; // Pink
        case 'charity': return '#795548'; // Brown
        case 'cultural': return '#673AB7'; // Deep purple
        case 'business': return '#607D8B'; // Blue grey
        case 'religious': return '#4A4A4A'; // Dark grey
        default: return '#009688'; // Teal as default for community events
      }
    }
    
    // Otherwise, determine color based on event title (for Shia events)
    if (title) {
      const lowerTitle = title.toLowerCase();
      if (lowerTitle.includes('martyrdom') || lowerTitle.includes('death')) {
        return '#8B0000'; // Dark red for martyrdom/death
      } else if (lowerTitle.includes('birth')) {
        return '#228B22'; // Green for births
      } else if (lowerTitle.includes('eid') || lowerTitle.includes('rejoicing')) {
        return '#FFD700'; // Gold for celebrations
      } else if (lowerTitle.includes('night of qadr') || lowerTitle.includes('ashura')) {
        return '#4B0082'; // Indigo for special nights
      } else if (lowerTitle.includes('mourning') || lowerTitle.includes('arbaeen')) {
        return '#696969'; // Dark gray for mourning periods
      }
    }
    
    return '#1E90FF'; // Default blue for other events
  } catch (error) {
    console.warn('Error in getEventColor:', error);
    return '#1E90FF'; // Default blue for errors
  }
};

// Convert Hijri events to Gregorian dates and create events object
const events = {};
const importantIslamicDates = {};

// Add today's date marker
importantIslamicDates[today] = { 
  marked: true, 
  dotColor: '#6b4b3e', 
  selectedColor: '#6b4b3e' 
};

// Process Shia Hijri events
if (shiaHijriEvents && Array.isArray(shiaHijriEvents)) {
  shiaHijriEvents.forEach(event => {
    if (event && event.day && event.month) {
      const gregorianDates = convertHijriToGregorian(event.day, event.month);
      const eventColor = getEventColor(event);
      
      gregorianDates.forEach(gregorianDate => {
        // Add to events object
        if (!events[gregorianDate]) {
          events[gregorianDate] = [];
        }
        events[gregorianDate].push(event);
        
        // Add to marked dates with multi-dot support
        if (!importantIslamicDates[gregorianDate]) {
          importantIslamicDates[gregorianDate] = {
            marked: true,
            dots: []
          };
        }
        
        // Ensure dots array exists before using find
        if (!importantIslamicDates[gregorianDate].dots) {
          importantIslamicDates[gregorianDate].dots = [];
        }
        
        // Add dot for this event if not already added
        const existingDot = importantIslamicDates[gregorianDate].dots.find(dot => dot && dot.color === eventColor);
        if (!existingDot) {
          importantIslamicDates[gregorianDate].dots.push({
            color: eventColor
          });
        }
      });
    }
  });
}

// Process Community events
if (communityEvents && Array.isArray(communityEvents)) {
  communityEvents.forEach(event => {
    if (event && event.date) {
      const eventDate = event.date; // Community events already have Gregorian dates
      const eventColor = getEventColor(event);
      
      // Add to events object
      if (!events[eventDate]) {
        events[eventDate] = [];
      }
      events[eventDate].push(event);
      
      // Add to marked dates with multi-dot support
      if (!importantIslamicDates[eventDate]) {
        importantIslamicDates[eventDate] = {
          marked: true,
          dots: []
        };
      }
      
      // Ensure dots array exists before using find
      if (!importantIslamicDates[eventDate].dots) {
        importantIslamicDates[eventDate].dots = [];
      }
      
      // Add dot for this event if not already added
      const existingDot = importantIslamicDates[eventDate].dots.find(dot => dot && dot.color === eventColor);
      if (!existingDot) {
        importantIslamicDates[eventDate].dots.push({
          color: eventColor
        });
      }
    }
  });
}

const EventsCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [visibleMonth, setVisibleMonth] = useState(today);
  const [modalVisible, setModalVisible] = useState(false);  const [modalEvents, setModalEvents] = useState([]);

  // Function to get all events for the current month
  const getMonthEvents = (dateString) => {
    try {
      const monthStart = moment(dateString, 'YYYY-MM-DD').startOf('month');
      const monthEnd = moment(dateString, 'YYYY-MM-DD').endOf('month');
      const monthEvents = [];

      // Iterate through all days in the month
      for (let date = monthStart.clone(); date.isSameOrBefore(monthEnd); date.add(1, 'day')) {
        const dayStr = date.format('YYYY-MM-DD');
        const dayEvents = events[dayStr] || [];
        
        if (Array.isArray(dayEvents)) {
          dayEvents.forEach(event => {
            if (event) {
              monthEvents.push({
                ...event,
                date: dayStr,
                gregorianDate: date.format('MMMM D, YYYY'),
                hijriDate: date.format('iD iMMMM iYYYY')
              });
            }
          });
        }
      }

      // Sort events by date
      return monthEvents.sort((a, b) => moment(a.date).diff(moment(b.date)));
    } catch (error) {
      console.error('Error getting month events:', error);
      return [];
    }
  };

  const renderHijriDate = (dateString) => {
    return moment(dateString, 'YYYY-MM-DD').format('iD iMMMM iYYYY');
  };

  const getHijriMonthLabel = (dateString) => {
    const monthStart = moment(dateString, 'YYYY-MM-DD').startOf('month');
    const daysInMonth = monthStart.daysInMonth();

    const hijriPairs = [];
    const hijriYears = new Set();

    for (let i = 0; i < daysInMonth; i++) {
      const day = monthStart.clone().add(i, 'days');
      const hijriMonth = day.format('iMMMM');
      const hijriYear = day.format('iYYYY');
      const key = `${hijriMonth}-${hijriYear}`;
      if (!hijriPairs.find((p) => p.key === key)) {
        hijriPairs.push({ month: hijriMonth, year: hijriYear, key });
        hijriYears.add(hijriYear);
      }
    }

    if (hijriPairs.length === 1) {
      return `${hijriPairs[0].month} ${hijriPairs[0].year}`;
    }

    if (hijriYears.size === 1) {
      return `${hijriPairs[0].month} – ${hijriPairs[1].month} ${hijriPairs[0].year}`;
    }

    return `${hijriPairs[0].month} ${hijriPairs[0].year} – ${hijriPairs[1].month} ${hijriPairs[1].year}`;
  };

  const getWeeksInMonth = (dateString) => {
    const date = moment(dateString, 'YYYY-MM-DD');
    const startOfMonth = date.clone().startOf('month').startOf('isoWeek');
    const endOfMonth = date.clone().endOf('month').endOf('isoWeek');
    const days = endOfMonth.diff(startOfMonth, 'days') + 1;
    console.log(`Calculating weeks for month: ${dateString}`);
    console.log(`date: ${date.format('YYYY-MM-DD')}`);
    console.log(`Start of month: ${startOfMonth.format('YYYY-MM-DD')}`);
    console.log(`End of month: ${endOfMonth.format('YYYY-MM-DD')}`);
    console.log(`Days in month: ${days}`);
    return days / 7; // Always 4, 5, or 6

  };
  const weeksInMonth = getWeeksInMonth(visibleMonth);
  const cellHeight = (CALENDAR_HEIGHT - 210) / weeksInMonth;
  console.log('cellHeight:', cellHeight);
  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={true}
      contentContainerStyle={styles.scrollContainer}
    >
      <Text style={styles.hijriMonthHeader}>
        {getHijriMonthLabel(visibleMonth)}
      </Text>

      <View style={{ height: CALENDAR_HEIGHT }}>
        <Calendar
          current={today}
          onDayPress={(day) => {
            setSelectedDate(day.dateString);
            const e = events[day.dateString] || [];
            setModalEvents(e);
            setModalVisible(true);
          }}
          onMonthChange={(month) => {
            const dateStr = `${month.year}-${String(month.month).padStart(2, '0')}-01`;
            setVisibleMonth(dateStr);
          }}
          enableSwipeMonths={true}
          firstDay={1}
          markingType={'multi-dot'}
          markedDates={importantIslamicDates}
          theme={{
            arrowColor: '#6b4b3e',
            todayTextColor: '#6b4b3e',
            todayBackgroundColor: '#fceae4',
          }}
          dayComponent={({ date, state }) => {
            const dateStr = date.dateString;
            const isToday = dateStr === today;
            const hijriDay = moment(dateStr, 'YYYY-MM-DD').format('iD');
            const hijriMonth = moment(dateStr, 'YYYY-MM-DD').format('iM');
            const hijriLabel = `(${hijriDay}/${hijriMonth})`;
            const dayEvents = events[dateStr] || [];

            // Decide how many events to show based on cellHeight (min 1, max 4)
            let maxEventsToShow = 1;
            if (cellHeight > 70) maxEventsToShow = 2;
            else if (cellHeight > 50) maxEventsToShow = 1;

            return (
              <TouchableOpacity
              style={[styles.dayContainer, { height: cellHeight }]}
              onPress={() => {
                setSelectedDate(dateStr);
                setModalEvents(dayEvents);
                setModalVisible(true);
              }}
              >
              <View style={[styles.dateBadge, isToday && styles.todayOutline]}>
                <Text
                style={[
                  styles.englishDate,
                  state === 'disabled' && styles.disabledText,
                ]}
                >
                {date.day}
                </Text>
              </View>
              <Text style={styles.hijriDate}>{hijriLabel}</Text>
              
              {/* Show event titles with colors */}
              {dayEvents.slice(0, maxEventsToShow).map((event, idx) => {
                const eventTitle = typeof event === 'string' ? event : event.title;
                const displayText = eventTitle.length > 15 ? eventTitle.substring(0, 12) + '...' : eventTitle;
                
                return (
                <Text
                  key={idx}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[styles.eventText, { color: getEventColor(event) }]}
                >
                  • {displayText}
                </Text>
                );
              })}
              
              {dayEvents.length > maxEventsToShow && (
                <Text style={styles.moreEventsText}>
                +{dayEvents.length - maxEventsToShow} more
                </Text>
              )}
              </TouchableOpacity>
            );
          }}        />
      </View>

      {/* Monthly Events List */}
      <View style={styles.monthlyEventsContainer}>
        <Text style={styles.monthlyEventsTitle}>
          Events and Important Dates for {moment(visibleMonth, 'YYYY-MM-DD').format('MMMM YYYY')}
        </Text>
        
        <ScrollView 
          style={styles.monthlyEventsList}
          showsVerticalScrollIndicator={true}
          nestedScrollEnabled={true}
        >
          {getMonthEvents(visibleMonth).length > 0 ? (
            getMonthEvents(visibleMonth).map((event, idx) => {
              const eventTitle = typeof event === 'string' ? event : event.title;
              const isCommunityEvent = event.category;
              
              return (
                <TouchableOpacity
                  key={`${event.date}-${idx}`}
                  style={[styles.monthlyEventItem, { borderLeftColor: getEventColor(event) }]}
                  onPress={() => {
                    setSelectedDate(event.date);
                    setModalEvents([event]);
                    setModalVisible(true);
                  }}
                >
                  <View style={styles.monthlyEventHeader}>
                    <View style={[styles.monthlyEventDot, { backgroundColor: getEventColor(event) }]} />
                    <View style={styles.monthlyEventContent}>
                      <Text style={styles.monthlyEventTitle}>{eventTitle}</Text>
                      <Text style={styles.monthlyEventDate}>
                        📅 {event.gregorianDate}
                      </Text>
                      <Text style={styles.monthlyEventHijriDate}>
                        🌙 {event.hijriDate}
                      </Text>
                      
                      {isCommunityEvent && (
                        <View style={styles.monthlyEventDetails}>
                          {event.time && (
                            <Text style={styles.monthlyEventDetailText}>⏰ {event.time}</Text>
                          )}
                          {event.location && (
                            <Text style={styles.monthlyEventDetailText}>📍 {event.location}</Text>
                          )}
                          {event.organizer && (
                            <Text style={styles.monthlyEventDetailText}>👤 {event.organizer}</Text>
                          )}
                        </View>
                      )}
                      
                      {event.category && (
                        <View style={[styles.categoryBadge, { backgroundColor: getEventColor(event) + '20' }]}>
                          <Text style={[styles.categoryText, { color: getEventColor(event) }]}>
                            {event.category.toUpperCase()}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            <View style={styles.noEventsContainer}>
              <Text style={styles.noEventsText}>No events this month</Text>
            </View>
          )}
        </ScrollView>
      </View>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalWrapper}>
          <View style={styles.modalContent}>
            <Text style={styles.detailsText}>
              {selectedDate && moment(selectedDate, 'YYYY-MM-DD').format('MMMM D, YYYY')}
            </Text>
            
            <Text style={styles.hijriDateText}>
              {selectedDate && renderHijriDate(selectedDate)}
            </Text>
            
            <ScrollView 
              style={styles.modalScrollView}
              showsVerticalScrollIndicator={true}
              contentContainerStyle={styles.scrollContentContainer}
            >
              {modalEvents.length > 0 ? (
                modalEvents.map((event, idx) => {
                  const eventTitle = typeof event === 'string' ? event : event.title;
                  const isShiaEvent = !event.date; // Shia events don't have direct date property
                  const isCommunityEvent = event.date && event.category;
                  
                  return (
                    <View key={idx} style={[styles.eventContainer, { borderLeftColor: getEventColor(event) }]}>
                      <View style={styles.eventHeader}>
                        <View style={[styles.eventColorDot, { backgroundColor: getEventColor(event) }]} />
                        <View style={styles.eventContent}>
                          <Text style={styles.eventLine}>• {eventTitle}</Text>
                          {isCommunityEvent && (
                            <View style={styles.eventDetails}>
                              {event.time && (
                                <Text style={styles.eventDetailText}>⏰ {event.time}</Text>
                              )}
                              {event.location && (
                                <Text style={styles.eventDetailText}>📍 {event.location}</Text>
                              )}
                              {event.organizer && (
                                <Text style={styles.eventDetailText}>👤 {event.organizer}</Text>
                              )}
                              {event.description && (
                                <Text style={styles.eventDescription}>{event.description}</Text>
                              )}
                            </View>
                          )}
                        </View>
                      </View>
                    </View>
                  );
                })
              ) : (
                <Text style={styles.eventLine}>No events for this date</Text>
              )}
            </ScrollView>
            
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({  container: {
    flex: 1,
    backgroundColor: '#faf4ef',
    paddingTop: 20,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  hijriMonthHeader: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6b4b3e',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  dayContainer: {
    padding: 4,
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderTopWidth: 0.5,
    borderColor: '#ccc',
  },
  dateBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  todayOutline: {
    borderColor: '#6b4b3e',
    borderWidth: 2,
    borderRadius: 50,
    backgroundColor: '#f9eee8',
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  englishDate: {
    fontSize: 16,
    color: '#000',
  },
  hijriDate: {
    fontSize: 10,
    color: '#888',
    marginTop: 2,
  },
  disabledText: {
    color: '#ccc',
  },
  eventText: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 1,
    textAlign: 'center',
  },
  moreEventsText: {
    fontSize: 9,
    color: '#666',
    textAlign: 'center',
    marginTop: 1,  },
  
  monthlyEventsContainer: {
    backgroundColor: '#fff',
    marginTop: 15,
    marginHorizontal: 10,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  monthlyEventsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4a3c2f',
    marginBottom: 15,
    textAlign: 'center',
  },
  monthlyEventsList: {
    maxHeight: 400,
  },
  monthlyEventItem: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  monthlyEventHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  monthlyEventDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
    marginTop: 4,
  },
  monthlyEventContent: {
    flex: 1,
  },
  monthlyEventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    lineHeight: 22,
  },
  monthlyEventDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  monthlyEventHijriDate: {
    fontSize: 13,
    color: '#888',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  monthlyEventDetails: {
    marginTop: 6,
    paddingLeft: 8,
  },
  monthlyEventDetailText: {
    fontSize: 13,
    color: '#555',
    marginBottom: 3,
    lineHeight: 18,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
  },
  noEventsContainer: {
    padding: 30,
    alignItems: 'center',
  },
  noEventsText: {
    fontSize: 16,
    color: '#888',
    fontStyle: 'italic',
  },

  modalWrapper: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '95%',
    maxHeight: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalScrollView: {
    maxHeight: Dimensions.get('window').height * 0.6,
    paddingHorizontal: 20,
  },
  scrollContentContainer: {
    paddingBottom: 10,
  },
  
  detailsText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4a3c2f',
    marginBottom: 6,
    textAlign: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  hijriDateText: {
    fontSize: 16,
    color: '#6b4b3e',
    textAlign: 'center',
    marginBottom: 15,
    fontStyle: 'italic',
    paddingHorizontal: 20,
  },
  
  eventContainer: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  eventContent: {
    flex: 1,
  },
  
  eventDetails: {
    marginTop: 8,
    paddingLeft: 16,
  },
  eventDetailText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
    lineHeight: 20,
  },
  eventDescription: {
    fontSize: 14,
    color: '#444',
    fontStyle: 'italic',
    marginTop: 6,
    lineHeight: 22,
  },
  eventColorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
    marginTop: 2,
  },
  eventLine: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    lineHeight: 24,
    flex: 1,  },
  
  closeButton: {
    marginTop: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#6b4b3e',
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default EventsCalendar;
