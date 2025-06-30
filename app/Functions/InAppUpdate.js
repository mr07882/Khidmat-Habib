import SpInAppUpdates, {
  IAUUpdateKind,
  IAUInstallStatus,
} from 'sp-react-native-in-app-updates';
import {Platform} from 'react-native';

const checkForUpdate = async () => {
  const inAppUpdates = new SpInAppUpdates(
    false, // isDebug
  );

  await inAppUpdates
    .checkNeedsUpdate()
    .then(result => {
      try {
        if (result.shouldUpdate) {
          let updateOptions = {};
          if (Platform.OS === 'android') {
            // android only, on iOS the user will be promped to go to your app store page
            updateOptions = {
              updateType: IAUUpdateKind.IMMEDIATE,
            };
          }
          if (Platform.OS === 'ios') {
            updateOptions = {
              title: 'Update available',
              message:
                'There is a new version of the app available on the App Store, do you want to update it?',
              buttonUpgradeText: 'Update',
              buttonCancelText: 'Cancel',
            };
          }
          inAppUpdates.addStatusUpdateListener(downloadStatus => {
            console.log('download status', downloadStatus);
            if (downloadStatus.status === IAUInstallStatus.DOWNLOADED) {
              console.log('downloaded');
              inAppUpdates.installUpdate();
              inAppUpdates.removeStatusUpdateListener(finalStatus => {
                console.log('final status', finalStatus);
              });
            }
          });
          inAppUpdates.startUpdate(updateOptions);
        }
      } catch (error) {
        console.log('An error occurred while updating the app', error);
      }
    })
    .catch(err =>
      console.log(
        'An error occurred while checking the app is up to date or not',
        err,
      ),
    );
};

const InAppUpdate = {
  checkForUpdate,
};

export default InAppUpdate;
