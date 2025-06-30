import {PermissionsAndroid} from 'react-native';

const notificationPermission = async () => {
  try {
    const response = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export default notificationPermission;
