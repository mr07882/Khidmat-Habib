import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../Config/AppConfigData';
import { API_URL } from '../config';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [eduModal, setEduModal] = useState(false);
  const [bizModal, setBizModal] = useState(false);
  const [eduForm, setEduForm] = useState({ institution: '', year: '', description: '' });
  const [bizForm, setBizForm] = useState({ name: '', description: '', services: '', contactPhone: '', contactEmail: '', address: '' });
  const [editEduIndex, setEditEduIndex] = useState(null);
  const [editBizIndex, setEditBizIndex] = useState(null);
  const [editEduForm, setEditEduForm] = useState({ institution: '', year: '', description: '' });
  const [editBizForm, setEditBizForm] = useState({ name: '', description: '', services: '', contactPhone: '', contactEmail: '', address: '' });
  const [photoModal, setPhotoModal] = useState(false);
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
      fetch(`${API_URL}/profile/${jcic}`)
        .then(res => res.json())
        .then(data => {
          setUser(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    };
    getJCIC();
  }, [route.params?.JCIC]);

  const handleAddEducation = () => {
    fetch(`${API_URL}/profile/${jcicState}/education`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eduForm),
    })
      .then(res => res.json())
      .then(data => {
        setUser(prev => ({ ...prev, education: data.education }));
        setEduModal(false);
        setEduForm({ institution: '', year: '', description: '' });
      })
      .catch(() => Alert.alert('Error', 'Failed to add education'));
  };

  const handleAddBusiness = () => {
    fetch(`${API_URL}/profile/${jcicState}/business`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: bizForm.name,
        description: bizForm.description,
        services: bizForm.services,
        contact: { phone: bizForm.contactPhone, email: bizForm.contactEmail },
        address: bizForm.address,
      }),
    })
      .then(res => res.json())
      .then(data => {
        setUser(prev => ({ ...prev, business: data.business }));
        setBizModal(false);
        setBizForm({ name: '', description: '', services: '', contactPhone: '', contactEmail: '', address: '' });
      })
      .catch(() => Alert.alert('Error', 'Failed to add business'));
  };

  // Edit Education
  const handleEditEducation = (idx) => {
    const edu = user.education[idx];
    setEditEduForm({ ...edu });
    setEditEduIndex(idx);
  };
  const handleSaveEditEducation = () => {
    const updatedEducation = [...user.education];
    updatedEducation[editEduIndex] = { ...editEduForm };
    fetch(`${API_URL}/profile/${jcicState}/education`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ education: updatedEducation }),
    })
      .then(res => res.json())
      .then(data => {
        setUser(prev => ({ ...prev, education: data.education }));
        setEditEduIndex(null);
      })
      .catch(() => Alert.alert('Error', 'Failed to update education'));
  };

  // Edit Business
  const handleEditBusiness = (idx) => {
    const biz = user.business[idx];
    setEditBizForm({
      name: biz.name,
      description: biz.description,
      services: biz.services,
      contactPhone: biz.contact?.phone || '',
      contactEmail: biz.contact?.email || '',
      address: biz.address,
    });
    setEditBizIndex(idx);
  };
  const handleSaveEditBusiness = () => {
    const updatedBusiness = [...user.business];
    updatedBusiness[editBizIndex] = {
      name: editBizForm.name,
      description: editBizForm.description,
      services: editBizForm.services,
      contact: { phone: editBizForm.contactPhone, email: editBizForm.contactEmail },
      address: editBizForm.address,
    };
    fetch(`${API_URL}/profile/${jcicState}/business`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ business: updatedBusiness }),
    })
      .then(res => res.json())
      .then(data => {
        setUser(prev => ({ ...prev, business: data.business }));
        setEditBizIndex(null);
      })
      .catch(() => Alert.alert('Error', 'Failed to update business'));
  };

  if (loading) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Loading...</Text></View>;
  if (!user) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>No user data found.</Text></View>;
  if (!jcicState) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>No JCIC provided. Please login again.</Text></View>;

  return (
    <ScrollView style={styles.container}>
      {/* Personal Details */}
      <View style={styles.section}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 }}>
          <Text style={styles.sectionTitle}>Personal Details</Text>
          <View style={{ flex: 1 }} />
          {user.FaceID ? (
            <TouchableOpacity onPress={() => setPhotoModal(true)} style={{ alignSelf: 'flex-start' }}>
              <Image
                source={user.FaceID.startsWith('http') ? { uri: user.FaceID } : require('../../assets/femaleDummy.webp')}
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

      {/* Education Details */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Education Details</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => setEduModal(true)}><Text style={styles.addBtnText}>+ Add</Text></TouchableOpacity>
        </View>
        {(user.education || []).map((edu, idx) => (
          <TouchableOpacity key={idx} style={styles.card} onPress={() => handleEditEducation(idx)}>
            <Text style={styles.cardTitle}>{edu.institution} ({edu.year})</Text>
            <Text style={styles.cardText}><Text style={styles.label}>Description:</Text> {edu.description}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Business Details */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Business Details</Text>
          {(user.business || []).length < 5 && (
            <TouchableOpacity style={styles.addBtn} onPress={() => setBizModal(true)}><Text style={styles.addBtnText}>+ Add</Text></TouchableOpacity>
          )}
        </View>
        {(user.business || []).map((biz, idx) => (
          <TouchableOpacity key={idx} style={styles.card} onPress={() => handleEditBusiness(idx)}>
            <Text style={styles.cardTitle}>{biz.name}</Text>
            <Text style={styles.cardText}><Text style={styles.label}>Description:</Text> {biz.description}</Text>
            <Text style={styles.cardText}><Text style={styles.label}>Services:</Text> {biz.services}</Text>
            <Text style={styles.cardText}><Text style={styles.label}>Contact:</Text> {biz.contact?.phone}, {biz.contact?.email}</Text>
            <Text style={styles.cardText}><Text style={styles.label}>Address:</Text> {biz.address}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Education Modal */}
      <Modal visible={eduModal} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Education</Text>
            <TextInput placeholder="Institution" style={styles.input} value={eduForm.institution} onChangeText={t => setEduForm(f => ({ ...f, institution: t }))} />
            <TextInput placeholder="Year" style={styles.input} value={eduForm.year} onChangeText={t => setEduForm(f => ({ ...f, year: t }))} />
            <TextInput placeholder="Description" style={styles.input} value={eduForm.description} onChangeText={t => setEduForm(f => ({ ...f, description: t }))} />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity style={styles.modalBtn} onPress={() => setEduModal(false)}><Text>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={styles.modalBtnSave} onPress={handleAddEducation}><Text style={{ color: '#fff' }}>Save</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Business Modal */}
      <Modal visible={bizModal} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Business</Text>
            <TextInput placeholder="Business Name" style={styles.input} value={bizForm.name} onChangeText={t => setBizForm(f => ({ ...f, name: t }))} />
            <TextInput placeholder="Description" style={styles.input} value={bizForm.description} onChangeText={t => setBizForm(f => ({ ...f, description: t }))} />
            <TextInput placeholder="Services" style={styles.input} value={bizForm.services} onChangeText={t => setBizForm(f => ({ ...f, services: t }))} />
            <TextInput placeholder="Contact Phone" style={styles.input} value={bizForm.contactPhone} onChangeText={t => setBizForm(f => ({ ...f, contactPhone: t }))} />
            <TextInput placeholder="Contact Email" style={styles.input} value={bizForm.contactEmail} onChangeText={t => setBizForm(f => ({ ...f, contactEmail: t }))} />
            <TextInput placeholder="Address" style={styles.input} value={bizForm.address} onChangeText={t => setBizForm(f => ({ ...f, address: t }))} />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity style={styles.modalBtn} onPress={() => setBizModal(false)}><Text>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={styles.modalBtnSave} onPress={handleAddBusiness}><Text style={{ color: '#fff' }}>Save</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Education Modal */}
      <Modal visible={editEduIndex !== null} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Education</Text>
            <TextInput placeholder="Institution" style={styles.input} value={editEduForm.institution} onChangeText={t => setEditEduForm(f => ({ ...f, institution: t }))} />
            <TextInput placeholder="Year" style={styles.input} value={editEduForm.year} onChangeText={t => setEditEduForm(f => ({ ...f, year: t }))} />
            <TextInput placeholder="Description" style={styles.input} value={editEduForm.description} onChangeText={t => setEditEduForm(f => ({ ...f, description: t }))} />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity style={styles.modalBtn} onPress={() => setEditEduIndex(null)}><Text>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={styles.modalBtnSave} onPress={handleSaveEditEducation}><Text style={{ color: '#fff' }}>Save</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Business Modal */}
      <Modal visible={editBizIndex !== null} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Business</Text>
            <TextInput placeholder="Business Name" style={styles.input} value={editBizForm.name} onChangeText={t => setEditBizForm(f => ({ ...f, name: t }))} />
            <TextInput placeholder="Description" style={styles.input} value={editBizForm.description} onChangeText={t => setEditBizForm(f => ({ ...f, description: t }))} />
            <TextInput placeholder="Services" style={styles.input} value={editBizForm.services} onChangeText={t => setEditBizForm(f => ({ ...f, services: t }))} />
            <TextInput placeholder="Contact Phone" style={styles.input} value={editBizForm.contactPhone} onChangeText={t => setEditBizForm(f => ({ ...f, contactPhone: t }))} />
            <TextInput placeholder="Contact Email" style={styles.input} value={editBizForm.contactEmail} onChangeText={t => setEditBizForm(f => ({ ...f, contactEmail: t }))} />
            <TextInput placeholder="Address" style={styles.input} value={editBizForm.address} onChangeText={t => setEditBizForm(f => ({ ...f, address: t }))} />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity style={styles.modalBtn} onPress={() => setEditBizIndex(null)}><Text>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={styles.modalBtnSave} onPress={handleSaveEditBusiness}><Text style={{ color: '#fff' }}>Save</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Photo Modal */}
      <Modal visible={photoModal} transparent animationType="fade" onRequestClose={() => setPhotoModal(false)}>
        <TouchableOpacity style={styles.modalBg} activeOpacity={1} onPress={() => setPhotoModal(false)}>
          <View pointerEvents="box-none">
            <Image
              source={user.FaceID && user.FaceID.startsWith('http') ? { uri: user.FaceID } : require('../../assets/femaleDummy.webp')}
              style={{ width: 300, height: 300, borderRadius: 12, backgroundColor: '#eee', resizeMode: 'cover' }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.secondryColor, padding: 15 },
  section: { backgroundColor: '#fff', borderRadius: 10, marginBottom: 20, padding: 15, elevation: 2 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: colors.secondryColor, marginBottom: 10 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailRow: { flexDirection: 'row', marginBottom: 5 },
  label: { fontWeight: 'bold', width: 90, color: '#000' },
  value: { color: '#333' },
  card: { backgroundColor: '#ECEAE4', borderRadius: 8, padding: 10, marginBottom: 10 },
  cardTitle: { fontWeight: 'bold', fontSize: 16, color: colors.secondryColor },
  cardText: { color: '#444', marginBottom: 2 },
  addBtn: { backgroundColor: colors.primaryColor, borderRadius: 5, paddingHorizontal: 10, paddingVertical: 4 },
  addBtnText: { color: '#fff', fontWeight: 'bold' },
  editBtn: { alignSelf: 'flex-end', marginTop: 5 },
  editBtnText: { color: colors.primaryColor, fontWeight: 'bold' },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 10, padding: 20, width: '90%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 8, marginBottom: 10 },
  modalBtn: { marginLeft: 10, padding: 8 },
  modalBtnSave: { marginLeft: 10, padding: 8, backgroundColor: '#4B2E2B', borderRadius: 5 },
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


