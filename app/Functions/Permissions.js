import {PermissionsAndroid} from 'react-native';

const write = async () => {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    {
      title: 'KPSIAJ App Storage Permission',
      message: 'KPSIAJ App needs access to your storage to download Photos.',
    },
  );

  return granted;
};

const storage = {
  write,
};

export {storage};
