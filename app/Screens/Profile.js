import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { colors } from '../Config/AppConfigData';
import { 
  getMemberProfile, 
  addMemberBusiness, 
  updateBusinessByIndex, 
  deleteMemberBusiness
} from '../Api/Firebase/ProfileAPI';
import FamilyMemberManager from '../Components/FamilyMemberManager';

const Profile = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jcicState, setJcicState] = useState(null);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const jcicParam = route.params?.JCIC || (await AsyncStorage.getItem('JCIC'));
        if (jcicParam) {
          setJcicState(jcicParam);

          if (isOnline) {
            const memberData = await getMemberProfile(jcicParam);
            if (memberData && memberData.success) {
              setUser(memberData.data);
              await AsyncStorage.setItem('profileData', JSON.stringify(memberData.data));
            } else {
              setUser(null);
            }
          } else {
            const storedData = await AsyncStorage.getItem('profileData');
            if (storedData) {
              setUser(JSON.parse(storedData));
            } else {
              setUser(null);
            }
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching member data:', error);
        setUser(null);
      }
      setLoading(false);
    };

    fetchData();
  }, [route.params?.JCIC, isOnline]);

  // Business modal/form
  const [bizModal, setBizModal] = useState(false);
  const [bizForm, setBizForm] = useState({ name: '', description: '', services: '', contactPhone: '', contactEmail: '', address: '' });
  const [editBizIndex, setEditBizIndex] = useState(null);
  const [editBizForm, setEditBizForm] = useState({ name: '', description: '', services: '', contactPhone: '', contactEmail: '', address: '' });

  const [photoModal, setPhotoModal] = useState(false);

  // Business Functions
  const handleAddBusiness = async () => {
    // Validate required fields
    if (!bizForm.name.trim()) {
      Alert.alert('Error', 'Business name is required');
      return;
    }
    if (!bizForm.description.trim()) {
      Alert.alert('Error', 'Business description is required');
      return;
    }
    if (!bizForm.services.trim()) {
      Alert.alert('Error', 'Business services are required');
      return;
    }
    if (!bizForm.contactPhone.trim()) {
      Alert.alert('Error', 'Contact phone is required');
      return;
    }

    const businessData = {
      name: bizForm.name,
      description: bizForm.description,
      services: bizForm.services,
      contact: { phone: bizForm.contactPhone, email: bizForm.contactEmail },
      address: bizForm.address,
    };

    if (isOnline) {
      const result = await addMemberBusiness(jcicState, businessData);
      if (result.success) {
        setUser(prev => ({ ...prev, business: result.data }));
        await AsyncStorage.setItem('profileData', JSON.stringify({ ...user, business: result.data }));
        setBizModal(false);
        setBizForm({ name: '', description: '', services: '', contactPhone: '', contactEmail: '', address: '' });
        Alert.alert('Success', 'Business added successfully');
      } else {
        Alert.alert('Error', 'Failed to add business');
      }
    } else {
      Alert.alert('Error', 'Cannot add business while offline.');
    }
  };

  const handleEditBusiness = (idx) => {
    const biz = user.business[idx];
    setEditBizForm({
      name: biz.name || '',
      description: biz.description || '',
      services: biz.services || '',
      contactPhone: biz.contact?.phone || '',
      contactEmail: biz.contact?.email || '',
      address: biz.address || '',
    });
    setEditBizIndex(idx);
    setBizModal(true);
  };

  const handleSaveEditBusiness = async () => {
    // Validate required fields
    if (!editBizForm.name.trim()) {
      Alert.alert('Error', 'Business name is required');
      return;
    }
    if (!editBizForm.description.trim()) {
      Alert.alert('Error', 'Business description is required');
      return;
    }
    if (!editBizForm.services.trim()) {
      Alert.alert('Error', 'Business services are required');
      return;
    }
    if (!editBizForm.contactPhone.trim()) {
      Alert.alert('Error', 'Contact phone is required');
      return;
    }

    const businessData = {
      name: editBizForm.name,
      description: editBizForm.description,
      services: editBizForm.services,
      contact: { phone: editBizForm.contactPhone, email: editBizForm.contactEmail },
      address: editBizForm.address,
    };

    if (isOnline) {
      const result = await updateBusinessByIndex(jcicState, editBizIndex, businessData);
      if (result.success) {
        setUser(prev => ({ ...prev, business: result.data }));
        await AsyncStorage.setItem('profileData', JSON.stringify({ ...user, business: result.data }));
        setEditBizIndex(null);
        setBizModal(false);
        setEditBizForm({ name: '', description: '', services: '', contactPhone: '', contactEmail: '', address: '' });
        Alert.alert('Success', 'Business updated successfully');
      } else {
        Alert.alert('Error', 'Failed to update business');
      }
    } else {
      Alert.alert('Error', 'Cannot update business while offline.');
    }
  };

  const handleDeleteBusiness = async () => {
    Alert.alert(
      'Delete Business',
      'Are you sure you want to delete this business? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (isOnline) {
              const result = await deleteMemberBusiness(jcicState, editBizIndex);
              if (result.success) {
                setUser(prev => ({ ...prev, business: result.data }));
                await AsyncStorage.setItem('profileData', JSON.stringify({ ...user, business: result.data }));
                setEditBizIndex(null);
                setBizModal(false);
                setEditBizForm({ name: '', description: '', services: '', contactPhone: '', contactEmail: '', address: '' });
                Alert.alert('Success', 'Business deleted successfully');
              } else {
                Alert.alert('Error', 'Failed to delete business');
              }
            } else {
              Alert.alert('Error', 'Cannot delete business while offline.');
            }
          },
        },
      ]
    );
  };

  const resetForms = () => {
    setBizForm({ name: '', description: '', services: '', contactPhone: '', contactEmail: '', address: '' });
    setEditBizForm({ name: '', description: '', services: '', contactPhone: '', contactEmail: '', address: '' });
    setEditBizIndex(null);
  };

  const loadFamilyMembers = async () => {
    // Implement the logic to load family members if needed
  };

  if (loading) return <View style={styles.center}><Text>Loading...</Text></View>;
  if (!user) return <View style={styles.center}><Text>No user data found.</Text></View>;
  if (!jcicState) return <View style={styles.center}><Text>No JCIC provided. Please login again.</Text></View>;

  return (
    <ScrollView style={styles.container}>
      {/* Personal Details */}
      <View style={styles.section}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 }}>
          <Text style={styles.sectionTitle}>Personal Details</Text>
          <View style={{ flex: 1 }} />
          {user.picture ? (
            <TouchableOpacity onPress={() => setPhotoModal(true)} style={{ alignSelf: 'flex-start' }}>
              <Image
                source={user.picture.startsWith('http') ? { uri: user.picture } : require('../../assets/femaleDummy.webp')}
                style={styles.profilePhoto}
              />
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={styles.detailRow}><Text style={styles.label}>Name:</Text><Text style={styles.value}>{user.name}</Text></View>
        <View style={styles.detailRow}><Text style={styles.label}>Phone:</Text><Text style={styles.value}>{user.number}</Text></View>
        <View style={styles.detailRow}><Text style={styles.label}>JCIC:</Text><Text style={styles.value}>{user.jcic}</Text></View>
        <View style={styles.detailRow}><Text style={styles.label}>Email:</Text><Text style={styles.value}>{user.email}</Text></View>
      </View>

      {/* Family Members */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Family Members</Text>
        <FamilyMemberManager userJCIC={jcicState} loadFamilyMembers={loadFamilyMembers} navigation={navigation} />
      </View>

      {/* Business Details */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Business Details</Text>
          {(user.business || []).length < 5 && (
            <TouchableOpacity style={styles.addBtn} onPress={() => setBizModal(true)}>
              <Text style={styles.addBtnText}>+ Add</Text>
            </TouchableOpacity>
          )}
        </View>
        {(user.business || []).map((biz, idx) => (
          <TouchableOpacity key={idx} style={styles.card} onPress={() => handleEditBusiness(idx)}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{biz.name}</Text>
              <Text style={styles.tapHint}>Tap to edit</Text>
            </View>
            <Text style={styles.cardText}><Text style={styles.label}>Description:</Text> {biz.description}</Text>
            <Text style={styles.cardText}><Text style={styles.label}>Services:</Text> {biz.services}</Text>
            <Text style={styles.cardText}><Text style={styles.label}>Contact Phone:</Text> {biz.contact?.phone}</Text>
            <Text style={styles.cardText}><Text style={styles.label}>Email:</Text> {biz.contact?.email}</Text>
            <Text style={styles.cardText}><Text style={styles.label}>Address:</Text> {biz.address}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Business Modal */}
      <Modal visible={bizModal} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editBizIndex !== null ? 'Edit Business' : 'Add Business'}
            </Text>
            <TextInput 
              placeholder="Business Name *" 
              style={styles.input} 
              value={editBizIndex !== null ? editBizForm.name : bizForm.name} 
              onChangeText={t => editBizIndex !== null ? setEditBizForm(f => ({ ...f, name: t })) : setBizForm(f => ({ ...f, name: t }))} 
            />
            <TextInput 
              placeholder="Description *" 
              style={styles.input} 
              value={editBizIndex !== null ? editBizForm.description : bizForm.description} 
              onChangeText={t => editBizIndex !== null ? setEditBizForm(f => ({ ...f, description: t })) : setBizForm(f => ({ ...f, description: t }))} 
            />
            <TextInput 
              placeholder="Services *" 
              style={styles.input} 
              value={editBizIndex !== null ? editBizForm.services : bizForm.services} 
              onChangeText={t => editBizIndex !== null ? setEditBizForm(f => ({ ...f, services: t })) : setBizForm(f => ({ ...f, services: t }))} 
            />
            <TextInput 
              placeholder="Contact Phone *" 
              style={styles.input} 
              value={editBizIndex !== null ? editBizForm.contactPhone : bizForm.contactPhone} 
              onChangeText={t => editBizIndex !== null ? setEditBizForm(f => ({ ...f, contactPhone: t })) : setBizForm(f => ({ ...f, contactPhone: t }))} 
            />
            <TextInput 
              placeholder="Contact Email (Optional)" 
              style={styles.input} 
              value={editBizIndex !== null ? editBizForm.contactEmail : bizForm.contactEmail} 
              onChangeText={t => editBizIndex !== null ? setEditBizForm(f => ({ ...f, contactEmail: t })) : setBizForm(f => ({ ...f, contactEmail: t }))} 
            />
            <TextInput 
              placeholder="Address (Optional)" 
              style={styles.input} 
              value={editBizIndex !== null ? editBizForm.address : bizForm.address} 
              onChangeText={t => editBizIndex !== null ? setEditBizForm(f => ({ ...f, address: t })) : setBizForm(f => ({ ...f, address: t }))} 
            />
            
            {/* Three buttons at bottom */}
            <View style={styles.modalButtonsContainer}>
              {editBizIndex !== null && (
                <TouchableOpacity 
                  style={styles.deleteButton} 
                  onPress={handleDeleteBusiness}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              )}
              <View style={styles.rightButtons}>
                <TouchableOpacity 
                  style={styles.cancelButton} 
                  onPress={() => {
                    setBizModal(false);
                    resetForms();
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.updateButton} 
                  onPress={editBizIndex !== null ? handleSaveEditBusiness : handleAddBusiness}
                >
                  <Text style={styles.updateButtonText}>
                    {editBizIndex !== null ? 'Update' : 'Save'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      

      {/* Photo Modal */}
      <Modal visible={photoModal} transparent animationType="fade" onRequestClose={() => setPhotoModal(false)}>
        <View style={styles.modalBg}>
          <TouchableOpacity style={{ padding: 10 }} onPress={() => setPhotoModal(false)}>
            <Image
              source={user.picture && user.picture.startsWith('http') ? { uri: user.picture } : require('../../assets/femaleDummy.webp')}
              style={{ width: 300, height: 300, borderRadius: 12, backgroundColor: '#eee', resizeMode: 'cover' }}
            />
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.secondryColor, padding: 15 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  section: { backgroundColor: '#fff', borderRadius: 10, marginBottom: 20, padding: 15, elevation: 2 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: colors.secondryColor, marginBottom: 10 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailRow: { flexDirection: 'row', marginBottom: 5 },
  label: { fontWeight: 'bold', width: 90, color: '#000' },
  value: { color: '#333' },
  card: { backgroundColor: '#ECEAE4', borderRadius: 8, padding: 10, marginBottom: 10 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  cardTitle: { fontWeight: 'bold', fontSize: 16, color: colors.secondryColor, flex: 1 },
  cardText: { color: '#444', marginBottom: 2 },
  tapHint: { fontSize: 10, color: '#666', fontStyle: 'italic' },
  addBtn: { backgroundColor: colors.primaryColor, borderRadius: 5, paddingHorizontal: 10, paddingVertical: 4 },
  addBtnText: { color: '#fff', fontWeight: 'bold' },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 10, padding: 20, width: '90%', maxHeight: '80%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 8, marginBottom: 10 },
  modalButtonsContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  deleteButton: { 
    backgroundColor: '#dc3545', 
    borderRadius: 5, 
    paddingHorizontal: 20, 
    paddingVertical: 10 
  },
  deleteButtonText: { 
    color: '#fff', 
    fontWeight: 'bold',
    fontSize: 14
  },
  rightButtons: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  cancelButton: { 
    backgroundColor: '#fff', 
    borderRadius: 5, 
    paddingHorizontal: 20, 
    paddingVertical: 10,
    marginRight: 10,
    borderColor: '#000'
  },
  cancelButtonText: { 
    color: colors.secondryColor, 
    fontWeight: 'bold',
    fontSize: 14
  },
  updateButton: { 
    backgroundColor: colors.secondryColor, 
    borderRadius: 5, 
    paddingHorizontal: 20, 
    paddingVertical: 10 
  },
  updateButtonText: { 
    color: '#fff', 
    fontWeight: 'bold',
    fontSize: 14
  },
  profilePhoto: {
    width: 56,
    height: 56,
    borderRadius: 8,
    marginLeft: 10,
    backgroundColor: '#eee',
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

export default Profile;
