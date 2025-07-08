import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Pressable,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../Config/AppConfigData';
import * as Icn from '../Helpers/icons';

const API_URL = 'http://10.0.2.2:5000'; // Change to your backend URL if needed

const BusinessPlace = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [workDesc, setWorkDesc] = useState('');
  const [selectedBiz, setSelectedBiz] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/businesses`);
      const data = await res.json();
      setBusinesses(data);
    } catch (e) {
      setBusinesses([]);
    }
    setLoading(false);
  };

  const handleSearch = async () => {
    Keyboard.dismiss();
    setSearching(true);
    try {
      let url = `${API_URL}/businesses/search?`;
      if (search) url += `query=${encodeURIComponent(search)}&`;
      if (workDesc) url += `work=${encodeURIComponent(workDesc)}`;
      const res = await fetch(url);
      const data = await res.json();
      setBusinesses(data);
    } catch (e) {
      setBusinesses([]);
    }
    setSearching(false);
  };

  const renderBusiness = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => { setSelectedBiz(item); setModalVisible(true); }}>
      <View style={styles.cardHeader}>
        {/* Removed business icon */}
        <Text style={styles.cardTitle}>{item.name ? item.name : '[No Business Name]'}</Text>
      </View>
      <Text style={styles.cardOwner}>Owner: {item.ownerName ? item.ownerName : '[No Owner Name]'}</Text>
      <Text style={styles.cardDetail} numberOfLines={2}>{item.description ? item.description : '-'}</Text>
      <View style={styles.servicesRow}>
        <Icn.RightArrowIcn styles={{color: colors.secondryColor, fontSize: 16}} />
        <Text style={styles.servicesText} numberOfLines={1}>{item.services ? item.services : '-'}</Text>
      </View>
    </TouchableOpacity>
  );

  useEffect(() => {
    if (businesses && businesses.length > 0) {
      console.log('Business data:', businesses);
    }
  }, [businesses]);

  return (
    <View style={styles.container}>
      <View style={styles.filters}>
        <Text style={styles.heading}>Find a Business</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Search by business or owner name"
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="📝 Describe the work you want done (optional)"
          value={workDesc}
          onChangeText={setWorkDesc}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch} disabled={searching}>
          {searching ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.searchBtnText}>Search</Text>}
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color={colors.primaryColor} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={businesses}
          keyExtractor={(_, idx) => idx.toString()}
          contentContainerStyle={{ paddingBottom: 30 }}
          renderItem={renderBusiness}
          ListEmptyComponent={<Text style={styles.emptyText}>No businesses found.</Text>}
        />
      )}
      {/* Modal for business details */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            {selectedBiz && (
              <>
                <Text style={styles.modalTitle}>{selectedBiz.name}</Text>
                <Text style={styles.modalOwner}>Owner: {selectedBiz.ownerName}</Text>
                <Text style={styles.modalLabel}>Description:</Text>
                <Text style={styles.modalText}>{selectedBiz.description || '-'}</Text>
                <Text style={styles.modalLabel}>Services:</Text>
                <Text style={styles.modalText}>{selectedBiz.services || '-'}</Text>
                <Text style={styles.modalLabel}>Contact:</Text>
                {/* Phone clickable */}
                <Text style={styles.modalText}>
                  Phone: {selectedBiz.contact?.phone ? (
                    <Text
                      style={{ color: '#1976d2', textDecorationLine: 'underline' }}
                      onPress={() => {
                        if (selectedBiz.contact?.phone) {
                          const phone = selectedBiz.contact.phone.replace(/[^0-9+]/g, '');
                          const url = `tel:${phone}`;
                          import('react-native').then(({ Linking }) => Linking.openURL(url));
                        }
                      }}
                    >
                      {selectedBiz.contact.phone}
                    </Text>
                  ) : (
                    '-'
                  )}
                </Text>
                {/* Email clickable */}
                <Text style={styles.modalText}>
                  Email: {selectedBiz.contact?.email || selectedBiz.ownerEmail ? (
                    <Text
                      style={{ color: '#1976d2', textDecorationLine: 'underline' }}
                      onPress={() => {
                        const email = selectedBiz.contact?.email || selectedBiz.ownerEmail;
                        if (email) {
                          const url = `mailto:${email}`;
                          import('react-native').then(({ Linking }) => Linking.openURL(url));
                        }
                      }}
                    >
                      {selectedBiz.contact?.email || selectedBizWW.ownerEmail}
                    </Text>
                  ) : (
                    '-'
                  )}
                </Text>
                <Text style={styles.modalText}>Address: {selectedBiz.address || '-'}</Text>
                <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
                  <Text style={styles.closeBtnText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondryColor,
    padding: 10,
  },
  filters: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.secondryColor,
    marginBottom: 10,
    textAlign: 'center',

  },
  searchInput: {
    backgroundColor: '#ECEAE4',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
  },
  searchBtn: {
    backgroundColor: 'black',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 2,
  },
  searchBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 17,
    color: colors.secondryColor, // changed from primaryColor
    marginLeft: 8,
  },
  cardOwner: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.secondryColor,
    marginBottom: 2,
  },
  cardDetail: {
    color: '#555',
    fontSize: 14,
    marginBottom: 2,
  },
  servicesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  servicesText: {
    marginLeft: 6,
    color: colors.secondryColor, // changed from primaryColor
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 30,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black', // changed to a rich purple for better visibility
    marginBottom: 6,
    textAlign: 'center',
  },
  modalOwner: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.secondryColor,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalLabel: {
    fontWeight: 'bold',
    color: 'black',
    marginTop: 8,
  },
  modalText: {
    color: '#444',
    fontSize: 15,
    marginBottom: 2,
  },
  closeBtn: {
    backgroundColor: 'black', // changed to match heading for a more prominent button
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  closeBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default BusinessPlace;
