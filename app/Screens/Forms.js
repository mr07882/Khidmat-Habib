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

const formsList = [
  {key: 'NominationForm', label: 'Nomination Form', screen: 'NominationForm'},
  {key: 'NominationWithdrawal', label: 'Nomination Withdrawal'},
  {key: 'CandidateRetirement', label: 'Candidate Retirement'},
  {key: 'FamilyParticipation', label: 'Family Participation Program'},
  {key: 'MembershipForm', label: 'Membership form & Form A'},
  {key: 'DuplicateCard', label: 'Duplicate Card'},
  {key: 'DeathInfo', label: 'Death Information Form'},
  {key: 'TakhtiRequest', label: 'Takhti Request Form'},
  {key: 'WadiAuthority', label: 'Wadi e Zainab (sa) Authority Letter'},
  {key: 'EducationDonationBox', label: 'Education Donation Box'},
  {key: 'HallBooking', label: 'Hall booking'},
  {key: 'BusBooking', label: 'Bus Booking'},
  {key: 'NikahFile', label: 'Nikah File – Gen Information Form / Rules'},
  {key: 'SportsMembership', label: 'Fatimiyah Sports Complex – Membership Form'},
  {key: 'GraveRepair', label: 'Grave Repair Form'},
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
    color: colors.primaryColor,
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
