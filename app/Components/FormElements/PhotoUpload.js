import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image, Alert, Platform, PermissionsAndroid, Linking} from 'react-native';
import {colors} from '../../Config/AppConfigData';
import {launchImageLibrary} from 'react-native-image-picker';

async function requestGalleryPermission() {
  if (Platform.OS === 'android') {
    try {
      let permission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
      if (PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES) {
        permission = PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES;
      }
      const granted = await PermissionsAndroid.request(
        permission,
        {
          title: 'Gallery Permission',
          message: 'App needs access to your photo gallery',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        Alert.alert(
          'Permission Required',
          'Please enable photo permissions in settings to upload a photo.',
          [
            {text: 'Cancel', style: 'cancel'},
            {text: 'Open Settings', onPress: () => Linking.openSettings()},
          ]
        );
        return false;
      } else {
        Alert.alert('Permission Denied', 'Cannot access photo library');
        return false;
      }
    } catch (err) {
      Alert.alert('Permission error', err.message);
      return false;
    }
  }
  return true;
}

const PhotoUpload = ({photo, setPhoto}) => {
  const pickImage = async () => {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) {
      return;
    }
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 500,
        maxHeight: 500,
        quality: 0.8,
      },
      (response) => {
        if (response && response.assets && response.assets.length > 0) {
          setPhoto(response.assets[0].uri);
        }
      }
    );
  };

  return (
    <View style={{marginBottom: 12, marginTop: 10, borderTopWidth: 1, borderTopColor: colors.primaryColor, paddingTop: 10}}>
      <TouchableOpacity style={styles.photoUpload} onPress={pickImage}>
        {photo ? (
          <Image source={{uri: photo}} style={styles.photo} />
        ) : (
          <Text style={styles.photoText}>Upload Photo</Text>
        )}
      </TouchableOpacity>
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
});

export default PhotoUpload;
