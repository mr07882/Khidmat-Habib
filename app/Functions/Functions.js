import React from 'react';
import Share from 'react-native-share';
import {PermissionsAndroid, Platform, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import {Text} from '../Components/core';
import {permissions} from '.';
import database from '@react-native-firebase/database';
import { API_URL } from '../config';

const onShare = async (url, type) => {
  let data = `data:${type};base64,`;
  if (type !== 'application/pdf' && type !== 'video/mp4') {
    data = `data:${'image/jpeg'};base64,`;
  }
  try {
    let filePath = null;
    if (url) {
      const configOptions = {fileCache: true};
      let base64Data = await RNFetchBlob.config(configOptions)
        .fetch('GET', url)
        .then(resp => {
          filePath = resp.path();
          return resp.readFile('base64');
        });
      base64Data = data + base64Data;
      await Share.open({url: base64Data, message: 'From KPSIAJ App'});
    }
    await RNFetchBlob.fs.unlink(filePath);
  } catch (error) {
    if (
      error.message ===
      'Unable to resolve host "firebasestorage.googleapis.com": No address associated with hostname'
    ) {
      alert(`Sorry you can't use this option with out internet `);
    }
  }
};
const onShareDeathNews = async (text, fileUrl) => {
  try {
    let filePath = null;
    if (fileUrl) {
      const configOptions = {fileCache: true};
      let base64Data = await RNFetchBlob.config(configOptions)
        .fetch('GET', fileUrl)
        .then(resp => {
          filePath = resp.path();
          return resp.readFile('base64');
        });
      base64Data = `data:${'image/jpeg'};base64,` + base64Data;
      await Share.open({url: base64Data, message: text});
      await RNFetchBlob.fs.unlink(filePath);
    } else {
      await Share.open({message: text});
    }
  } catch (error) {
    if (
      error.message ===
      'Unable to resolve host "firebasestorage.googleapis.com": No address associated with hostname'
    ) {
      alert(`Sorry you can't use this option with out internet `);
    }
  }
};

const onDownload = async (url, type) => {
  try {
    if (Platform.Version <= 29) {
      const granted = await permissions.storage.write();

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        return alert('Storage Permission Not Granted');
      }
    }

    let path = '';
    if (type === 'application/pdf') {
      path =
        RNFetchBlob.fs.dirs.DownloadDir +
        '/KPSIAJ/' +
        new Date().getTime() +
        '.pdf';
    } else if (type === 'video/mp4') {
      path =
        RNFetchBlob.fs.dirs.DownloadDir +
        '/KPSIAJ/' +
        new Date().getTime() +
        '.mp4';
    } else {
      path =
        RNFetchBlob.fs.dirs.DownloadDir +
        '/KPSIAJ/' +
        new Date().getTime() +
        '.jpg';
    }

    let options = {
      fileCache: true,
      addAndroidDownloads: {
        notification: true,
        useDownloadManager: true,
        title: 'Downloaded',
        path: path,
      },
    };
    await RNFetchBlob.config(options)
      .fetch('GET', url)
      .then(res => {});
  } catch (error) {
    alert('An error occurred while downloading the file');
  }
};

const onDownloadDeathNews = async image_URL => {
  try {
    if (Platform.Version <= 29) {
      const granted = await permissions.storage.write();

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        return alert('Storage Permission Not Granted');
      }
    }

    let options = {
      fileCache: true,
      addAndroidDownloads: {
        notification: true,
        useDownloadManager: true,
        title: 'Image Downloaded',
        path:
          RNFetchBlob.fs.dirs.DownloadDir +
          '/KPSIAJ/' +
          new Date().getTime() +
          '.jpg',
      },
    };
    await RNFetchBlob.config(options)
      .fetch('GET', image_URL)
      .then(res => {});
  } catch (error) {
    alert('An error occurred while downloading the image');
  }
};

const calculateAge = dob => {
  let convertedDOB = new Date(dob);
  var ageDifMs = Date.now() - convertedDOB.getTime();
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

function parseDate(s) {
  var months = {
    jan: 0,
    feb: 1,
    mar: 2,
    apr: 3,
    may: 4,
    jun: 5,
    jul: 6,
    aug: 7,
    sep: 8,
    oct: 9,
    nov: 10,
    dec: 11,
  };
  var p = s.split('-');
  return new Date(p[2], months[p[1].toLowerCase()], p[0]);
}

const compareDates = date => {
  let stringDate = parseDate(date);
  let currentDate = new Date();

  if (currentDate.getFullYear() === stringDate.getFullYear()) {
    if (currentDate.getMonth() === stringDate.getMonth()) {
      if (currentDate.getDate() === stringDate.getDate()) {
        return true;
      }
    }
  }

  return false;
};

const isNotNullOrEmpty = value => {
  return value !== '' && value !== undefined && value !== null;
};

const displayNetworkError = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 20,
      }}>
      <Text style={{fontSize: 20, color: '#725054', textAlign: 'center'}}>
        <Icon name={'wifi-off'} style={{fontSize: 250, color: '#725054'}} />
        {'\n'}
        Connection Error
        {'\n'}
        Network not available
      </Text>
      <Text style={{fontSize: 16, color: '#725054', textAlign: 'center'}}>
        Please Check your internet connection and try again later
      </Text>
    </View>
  );
};

const getData = async (key, obj = true) => {
  try {
    const data = await AsyncStorage.getItem(key);

    if (isNotNullOrEmpty(data)) {
      if (obj) return JSON.parse(data);
      return data;
    } else {
      return null;
    }
  } catch (e) {
    alert('An Error occurred while retrieving data in the async storage.');
  }
};

const storeData = async (key, value, obj = true) => {
  try {
    let data = value;
    if (obj) data = JSON.stringify(value);
    await AsyncStorage.setItem(key, data);
  } catch (e) {
    alert('An Error occurred while storing data in the async storage.');
  }
};

const Storage = {
  storeData,
  getData,
};

const sendError = navigation => {
  navigation.goBack();
  alert('An Error Occurred. Please try again');
};

const calculateTotal = (state, property) => {
  let total = 0;
  state.map(ele => (total += +ele[property]));
  return total.toLocaleString();
};

const checkIsWholeNumber = num => +num === Math.floor(+num);

// Fetch member details from Firebase Members collection by userId
export const getMemberDetails = async userId => {
  try {
    const res = await fetch(`${API_URL}/profile/${userId}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data;
  } catch (e) {
    console.log('Error fetching member details:', e);
    return null;
  }
};

export {
  checkIsWholeNumber,
  sendError,
  calculateTotal,
  displayNetworkError,
  isNotNullOrEmpty,
  onShareDeathNews,
  onDownloadDeathNews,
  onShare,
  onDownload,
  calculateAge,
  compareDates,
  Storage,
};
