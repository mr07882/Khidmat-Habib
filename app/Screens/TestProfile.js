import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../Config/AppConfigData';
import { getMemberProfile, updateMemberBusiness } from '../Api/Firebase/ProfileAPI';

const ProfileFirebase = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bizModal, setBizModal] = useState(false);
  const [bizForm, setBizForm] = useState({ 
      name: '', 
      description: '', 
      services: '', 
      contactPhone: '', 
      contactEmail: '', 
      address: '' 
    });
  const [editBizIndex, setEditBizIndex] = useState(null);
  const [editBizForm, setEditBizForm] = useState({ 
      name: '', 
      description: '', 
      services: '', 
      contactPhone: '', 
      contactEmail: '', 
      address: '' 
    });
  const navigation = useNavigation();
  const route = useRoute();
  const [jcicState, setJcicState] = useState(null);

  useEffect(() => {
    const getJCIC = async () => {
      let jcicParam = route.params?.JCIC;
      let jcic = jcicParam;
      if (!jcic) {
        const storedJCIC = await AsyncStorage.getItem('JCIC');
        if (storedJCIC) jcic = storedJCIC;
      }
      setJcicState(jcic);
      if (!jcic) return;
      
      fetchMemberData(jcic);
    };
    getJCIC();
  }, [route.params?.JCIC]);

  const fetchMemberData = async (jcic) => {
    try {
      const response = await getMemberProfile(jcic);
      if (response.success) {
        setUser(response.data);
      } else {
        Alert.alert('Error', response.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch member data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBusiness = async () => {
    if (!bizForm.name || !bizForm.description || !bizForm.services) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    try {
      const currentBusiness = user.business || [];
      const newBusiness = [...currentBusiness, bizForm];
      
      const response = await updateMemberBusiness(jcicState, newBusiness);
      if (response.success) {
        setUser(prev => ({ ...prev, business: newBusiness }));
        setBizModal(false);
        setBizForm({ 
          name: '', 
          description: '', 
          services: '', 
          contactPhone: '', 
          contactEmail: '', 
          address: '' 
        });
      } else {
        Alert.alert('Error', response.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add business');
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
      address: biz.address || ''
    });
    setEditBizIndex(idx);
  };

  const handleSaveEditBusiness = async () => {
    if (!editBizForm.name || !editBizForm.description || !editBizForm.services) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    try {
      const updatedBusiness = [...user.business];
      updatedBusiness[editBizIndex] = {
        name: editBizForm.name,
        description: editBizForm.description,
        services: editBizForm.services,
        contact: {
          phone: editBizForm.contactPhone,
          email: editBizForm.contactEmail
        },
        address: editBizForm.address
      };
      
      const response = await updateMemberBusiness(jcicState, updatedBusiness);
      if (response.success) {
        setUser(prev => ({ ...prev, business: updatedBusiness }));
        setEditBizIndex(null);
        setEditBizForm({ 
          name: '', 
          description: '', 
          services: '', 
          contactPhone: '', 
          contactEmail: '', 
          address: '' 
        });
      } else {
        Alert.alert('Error', response.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update business');
    }
  };

  const handleDeleteBusiness = async (idx) => {
    Alert.alert(
      'Delete Business',
      'Are you sure you want to delete this business? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedBusiness = user.business.filter((_, index) => index !== idx);
              const response = await updateMemberBusiness(jcicState, updatedBusiness);
              
              if (response.success) {
                setUser(prev => ({ ...prev, business: updatedBusiness }));
                Alert.alert('Success', 'Business deleted successfully');
              } else {
                Alert.alert('Error', response.error);
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete business');
            }
          }
        }
      ]
    );
  };

  if (loading) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Loading...</Text>
    </View>
  );
  
  if (!user) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>No user data found.</Text>
    </View>
  );
  
  if (!jcicState) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>No JCIC provided. Please login again.</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Personal Details */}
      <View style={styles.section}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 }}>
          <Text style={styles.sectionTitle}>Personal Details</Text>
          <View style={{ flex: 1 }} />
          {user.picture ? (
            <Image
              source={user.picture.startsWith('http') ? { uri: user.picture } : require('../../assets/femaleDummy.webp')}
              style={styles.profilePhoto}
            />
          ) : null}
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{user.name}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{user.number}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>JCIC:</Text>
          <Text style={styles.value}>{user.jcic}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{user.email}</Text>
        </View>
      </View>

      {/* Business Details */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Business Details</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => setBizModal(true)}>
            <Text style={styles.addBtnText}>+ Add</Text>
          </TouchableOpacity>
        </View>
        
        {(user.business || []).map((biz, idx) => (
          <TouchableOpacity key={idx} style={styles.card} onPress={() => handleEditBusiness(idx)}>
            <Text style={styles.cardTitle}>{biz.name}</Text>
            <Text style={styles.cardText}>
              <Text style={styles.label}>Description:</Text> {biz.description}
            </Text>
            <Text style={styles.cardText}>
              <Text style={styles.label}>Services:</Text> {biz.services}
            </Text>
            <Text style={styles.cardText}>
              <Text style={styles.label}>Contact:</Text> {biz.contact?.phone || 'N/A'}, {biz.contact?.email || 'N/A'}
            </Text>
            <Text style={styles.cardText}>
              <Text style={styles.label}>Address:</Text> {biz.address || 'N/A'}
            </Text>
            
            <View style={styles.cardActions}>
              <TouchableOpacity 
                style={styles.editBtn} 
                onPress={() => handleEditBusiness(idx)}
              >
                <Text style={styles.editBtnText}>Edit</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.deleteBtn} 
                onPress={() => handleDeleteBusiness(idx)}
              >
                <Text style={styles.deleteBtnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Business Modal */}
      <Modal visible={bizModal} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Business</Text>
            
            <TextInput 
              placeholder="Business Name" 
              style={styles.input} 
              value={bizForm.name} 
              onChangeText={t => setBizForm(f => ({ ...f, name: t }))} 
            />
            
            <TextInput 
              placeholder="Description" 
              style={styles.input} 
              value={bizForm.description} 
              onChangeText={t => setBizForm(f => ({ ...f, description: t }))} 
            />
            
            <TextInput 
              placeholder="Services" 
              style={styles.input} 
              value={bizForm.services} 
              onChangeText={t => setBizForm(f => ({ ...f, services: t }))} 
            />
            
            <TextInput 
              placeholder="Contact Phone" 
              style={styles.input} 
              value={bizForm.contactPhone} 
              onChangeText={t => setBizForm(f => ({ ...f, contactPhone: t }))} 
            />
            
            <TextInput 
              placeholder="Contact Email" 
              style={styles.input} 
              value={bizForm.contactEmail} 
              onChangeText={t => setBizForm(f => ({ ...f, contactEmail: t }))} 
            />
            
            <TextInput 
              placeholder="Address" 
              style={styles.input} 
              value={bizForm.address} 
              onChangeText={t => setBizForm(f => ({ ...f, address: t }))} 
            />
            
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalBtn} onPress={() => setBizModal(false)}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtnSave} onPress={handleAddBusiness}>
                <Text style={{ color: '#fff' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Business Modal */}
      <Modal visible={editBizIndex !== null} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Business</Text>
            
            <TextInput 
              placeholder="Business Name" 
              style={styles.input} 
              value={editBizForm.name} 
              onChangeText={t => setEditBizForm(f => ({ ...f, name: t }))} 
            />
            
            <TextInput 
              placeholder="Description" 
              style={styles.input} 
              value={editBizForm.description} 
              onChangeText={t => setEditBizForm(f => ({ ...f, description: t }))} 
            />
            
            <TextInput 
              placeholder="Services" 
              style={styles.input} 
              value={editBizForm.services} 
              onChangeText={t => setEditBizForm(f => ({ ...f, services: t }))} 
            />
            
            <TextInput 
              placeholder="Contact Phone" 
              style={styles.input} 
              value={editBizForm.contactPhone} 
              onChangeText={t => setEditBizForm(f => ({ ...f, contactPhone: t }))} 
            />
            
            <TextInput 
              placeholder="Contact Email" 
              style={styles.input} 
              value={editBizForm.contactEmail} 
              onChangeText={t => setEditBizForm(f => ({ ...f, contactEmail: t }))} 
            />
            
            <TextInput 
              placeholder="Address" 
              style={styles.input} 
              value={editBizForm.address} 
              onChangeText={t => setEditBizForm(f => ({ ...f, address: t }))} 
            />
            
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalBtn} onPress={() => setEditBizIndex(null)}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtnSave} onPress={handleSaveEditBusiness}>
                <Text style={{ color: '#fff' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5', 
    padding: 15 
  },
  section: { 
    backgroundColor: '#fff', 
    borderRadius: 10, 
    marginBottom: 20, 
    padding: 15, 
    elevation: 2 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#333', 
    marginBottom: 10 
  },
  sectionHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  detailRow: { 
    flexDirection: 'row', 
    marginBottom: 5 
  },
  label: { 
    fontWeight: 'bold', 
    width: 90, 
    color: '#000' 
  },
  value: { 
    color: '#333' 
  },
  card: { 
    backgroundColor: '#f9f9f9', 
    borderRadius: 8, 
    padding: 10, 
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0'
  },
  cardTitle: { 
    fontWeight: 'bold', 
    fontSize: 16, 
    color: '#333' 
  },
  cardText: { 
    color: '#666', 
    marginBottom: 2 
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  addBtn: { 
    backgroundColor: '#007bff', 
    borderRadius: 5, 
    paddingHorizontal: 10, 
    paddingVertical: 4 
  },
  addBtnText: { 
    color: '#fff', 
    fontWeight: 'bold' 
  },
  editBtn: {
    backgroundColor: '#28a745',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 4
  },
  editBtnText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  deleteBtn: {
    backgroundColor: '#dc3545',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 4
  },
  deleteBtnText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  modalBg: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.4)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  modalContent: { 
    backgroundColor: '#fff', 
    borderRadius: 10, 
    padding: 20, 
    width: '90%' 
  },
  modalTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 10 
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 5, 
    padding: 8, 
    marginBottom: 10 
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10
  },
  modalBtn: { 
    marginLeft: 10, 
    padding: 8 
  },
  modalBtnSave: { 
    marginLeft: 10, 
    padding: 8, 
    backgroundColor: '#007bff', 
    borderRadius: 5 
  },
  profilePhoto: {
    width: 56,
    height: 56,
    borderRadius: 8,
    marginLeft: 10,
    backgroundColor: '#eee',
    borderWidth: 1,
    borderColor: '#ccc',
  }
});

export default ProfileFirebase;
