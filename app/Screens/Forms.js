import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
} from 'react-native';
import {colors} from '../Config/AppConfigData';
import { screensEnabled } from 'react-native-screens';

const formsList = [
  {key: 'NominationForm', label: 'Nomination Form', screen: 'NominationForm'},
  {key: 'NominationWithdrawal', label: 'Nomination Withdrawal', screen: 'NominationWithdrawal'},
  {key: 'CandidateRetirement', label: 'Candidate Retirement', screen: 'CandidateRetirement'},
  {key: 'FamilyParticipation', label: 'Family Participation Program', screen: 'FamilyParticipation'},
  {key: 'MembershipForm', label: 'Membership form & Form A'},
  {key: 'DuplicateCardForm', label: 'Duplicate Card', screen: 'DuplicateCardForm'},
  {key: 'DeathInfo', label: 'Death Information Form', screen: 'DeathInfoForm'},
  {key: 'TakhtiRequest', label: 'Takhti Request Form' ,screen: 'TakhtiRepairForm'},
  {key: 'WadiAuthority', label: 'Wadi e Zainab (sa) Authority Letter', screen: 'WadiEzainab'},
  {key: 'EducationDonationBox', label: 'Education Donation Box' , screen: 'EducationDonationBox'},
  {key: 'HallBooking', label: 'Hall booking' , screen: 'HallBookingForm'},
  {key: 'BusBooking', label: 'Bus Booking', screen: 'BusBookingForm'},
  {key: 'NikahFile', label: 'Nikah File – Gen Information Form / Rules'},
  {key: 'SportsMembership', label: 'Fatimiyah Sports Complex – Membership Form'},
  {key: 'GraveRepair', label: 'Grave Repair Form', screen: 'GraveRepairForm'},
  
];

const Forms = ({navigation}) => {
  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.button}
      onPress={() => {
        if (item.screen) {
          navigation.navigate(item.screen);
        }
      }}
    >
      <Text style={styles.buttonText}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forms</Text>
      <FlatList
        data={formsList}
        renderItem={renderItem}
        keyExtractor={item => item.key}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgColor || '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: colors.secondryColor,
    alignSelf: 'center',
  },
  list: {
    paddingBottom: 16,
  },
  button: {
    backgroundColor: colors.secondryColor,
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 16,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: colors.primaryColor,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
});

export default Forms;
