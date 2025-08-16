import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image, Alert, Platform, PermissionsAndroid, Linking} from 'react-native';
import {colors} from '../../Config/AppConfigData';
import DocumentPicker from 'react-native-document-picker';

const PhotoUpload = ({photo, setPhoto, error}) => {
  const handlePick = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images],
      });
      setPhoto(res.uri);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        console.warn('Error picking photo:', err);
      }
    }
  };

  return (
    <View style={{marginBottom: 12, marginTop: 10, borderTopWidth: 1, borderTopColor: colors.primaryColor, paddingTop: 10}}>
      <TouchableOpacity style={styles.photoUpload} onPress={handlePick}>
        {photo ? (
          <Image source={{uri: photo}} style={styles.photo} />
        ) : (
          <Text style={styles.photoText}>Upload Photo</Text>
        )}
      </TouchableOpacity>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 2,
    color: colors.secondryColor,
  },
  photoUpload: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.secondryColor,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(167, 154, 154, 0.8)', 
    alignSelf: 'flex-start',
  },
  photo: {
    width: 76,
    height: 76,
    borderRadius: 8,
  },
  photoText: {
    color: colors.secondryColor,
    fontSize: 13,
  },
  errorText: {
    color: 'red',
    fontSize: 13,
    marginTop: 4,
  },
});

export default PhotoUpload;
