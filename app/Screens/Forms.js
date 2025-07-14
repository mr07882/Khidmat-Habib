import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
  Dimensions,
} from 'react-native';
import { colors } from '../Config/AppConfigData';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const categoryIcons = {
  election: 'account-group',
  funeral: 'grave-stone',
  donation: 'hand-heart',
  general: 'account-box-multiple',
  event: 'calendar-star',
};

const categoryColors = [
  '#8a6a65', // purple
  '#a2857b', // orange
  '#5a3f3f', // teal
  '#a89b95', // blue
  '#c2b3ad', // red
];

const categories = [
  {
    key: 'election',
    label: 'Jamaat Election Services',
    forms: ['NominationForm', 'NominationWithdrawal', 'CandidateRetirement'],
  },
  {
    key: 'funeral',
    label: 'Funeral And Grave Services',
    forms: ['TakhtiRequest', 'WadiAuthority', 'GraveRepair', 'DeathInfo'],
  },
  {
    key: 'donation',
    label: 'Donation Services',
    forms: ['EducationDonationBox', 'FamilyParticipation'],
  },
  {
    key: 'general',
    label: 'General Member Services',
    forms: ['SportsMembership', 'DuplicateCardForm', 'NikahFile'],
  },
  {
    key: 'event',
    label: 'Event Services',
    forms: ['HallBooking', 'BusBooking'],
  },
];

const formsList = [
  { key: 'NominationForm', label: 'Nomination Form', screen: 'NominationForm' },
  { key: 'NominationWithdrawal', label: 'Nomination Withdrawal', screen: 'NominationWithdrawal' },
  { key: 'CandidateRetirement', label: 'Candidate Retirement', screen: 'CandidateRetirement' },
  { key: 'FamilyParticipation', label: 'Family Participation Program', screen: 'FamilyParticipation' },
  { key: 'DuplicateCardForm', label: 'Duplicate Card', screen: 'DuplicateCardForm' },
  { key: 'DeathInfo', label: 'Death Information Form', screen: 'DeathInfoForm' },
  { key: 'TakhtiRequest', label: 'Takhti Request Form', screen: 'TakhtiRepairForm' },
  { key: 'WadiAuthority', label: 'Wadi e Zainab (sa) Authority Letter', screen: 'WadiEzainab' },
  { key: 'EducationDonationBox', label: 'Education Donation Box', screen: 'EducationDonationBox' },
  { key: 'HallBooking', label: 'Hall booking', screen: 'HallBookingForm' },
  { key: 'BusBooking', label: 'Bus Booking', screen: 'BusBookingForm' },
  { key: 'NikahFile', label: 'Nikah File – Gen Information Form / Rules', screen: 'NikahForm' },
  { key: 'SportsMembership', label: 'Fatimiyah Sports Complex – Membership Form', screen: 'FSC_Form' },
  { key: 'GraveRepair', label: 'Grave Repair Form', screen: 'GraveRepairForm' },
];

const Forms = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const filteredForms = selectedCategory
    ? formsList.filter(form =>
        categories.find(cat => cat.key === selectedCategory)?.forms.includes(form.key)
      )
    : [];

  const numColumns = 2;
  const categoryCardWidth = (Dimensions.get('window').width - 48) / numColumns;

  const renderCategory = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.categoryCard,
        { backgroundColor: categoryColors[index % categoryColors.length], width: categoryCardWidth },
        selectedCategory === item.key && styles.categoryCardSelected,
      ]}
      onPress={() => setSelectedCategory(item.key)}
      activeOpacity={0.85}
    >
      <Icon
        name={categoryIcons[item.key] || 'folder'}
        size={38}
        color="#fff"
        style={{ marginBottom: 10 }}
      />
      <Text style={styles.categoryCardText}>{item.label}</Text>
    </TouchableOpacity>
  );

  const renderForm = ({ item }) => (
    <TouchableOpacity
      style={styles.formButton}
      onPress={() => {
        if (item.screen) {
          navigation.navigate(item.screen);
        }
      }}
      activeOpacity={0.85}
    >
      <Text style={styles.formButtonText}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Forms</Text>
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={item => item.key}
        numColumns={numColumns}
        contentContainerStyle={styles.categoryGrid}
        scrollEnabled={false}
      />
      {selectedCategory && (
        <View style={styles.formsSection}>
          <Text style={styles.formsTitle}>{categories.find(c => c.key === selectedCategory)?.label} Forms</Text>
          <FlatList
            data={filteredForms}
            renderItem={renderForm}
            keyExtractor={item => item.key}
            contentContainerStyle={styles.formsListContainer}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgColor || '#fff',
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: colors.secondryColor,
    alignSelf: 'center',
    letterSpacing: 0.5,
  },
  categoryGrid: {
    marginBottom: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 8,
  },
  categoryCard: {
    borderRadius: 18,
    paddingVertical: 28,
    paddingHorizontal: 8,
    margin: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    minHeight: 120,
  },
  categoryCardSelected: {
    borderWidth: 3,
    borderColor: '#fff',
    elevation: 6,
    shadowOpacity: 0.18,
  },
  categoryCardText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 2,
    letterSpacing: 0.1,
  },
  formsSection: {
    marginTop: 24,
    marginBottom: 8,
  },
  formsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.secondryColor,
    marginBottom: 6,
    alignSelf: 'center',
  },
  formsListContainer: {
    paddingBottom: 16,
    paddingTop: 4,
  },
  formButton: {
    backgroundColor: colors.secondryColor,
    borderRadius: 10,
    marginVertical: 8,
    marginHorizontal: 8,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
  },
  formButtonText: {
    color: colors.primaryColor,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 8,
    letterSpacing: 0.2,
  },
});

export default Forms;
