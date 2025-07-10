import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {HeaderLeft, HeaderRight} from './components';
import {NavigationContainer} from '@react-navigation/native';
import {Linking} from 'react-native';
import * as Screens from '../Screens';
import * as Components from '../Components';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';
import {colors} from '../Config/AppConfigData';
import {InAppUpdate} from '../Functions';
import NominationForm from '../Screens/NominationForm';
import NominationWithdrawal from '../Screens/NominationWithdrawal';
import CandidateRetirement from '../Screens/CandidateRetirement';
import FamilyParticipation from '../Screens/FamilyParticipation';
import DuplicateCardForm from '../Screens/DuplicateCardForm';
import TakhtiRepairForm from '../Screens/TakhtiRepairForm';
import WadiEzainab from '../Screens/WadiEzainab';
import EducationDonationBox from '../Screens/EducationDonationBox';
import HallBookingForm from '../Screens/HallBookingForm';


const Stack = createStackNavigator();

const StackNavigator = () => {
  const linking = {
    prefixes: ['https://www.kpsiaj.org/app', 'https://kpsiaj.org/app'],
    config: {
      screens: {
        DeathAnniversaries: 'da',
      },
    },
    async getInitialURL() {
      return Linking.getInitialURL();
    },
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: '#000000',
        }}>
        <NavigationContainer
          onReady={() => {
            SplashScreen.hide();
            InAppUpdate.checkForUpdate();
          }}
          linking={linking}>
          <Stack.Navigator
            screenOptions={{
              title: '',
              headerStyle: {
                backgroundColor: colors.primaryColor,
                borderColor: colors.secondryColor,
                borderBottomWidth: 1,
                elevation: 7.5,
              },
              headerStatusBarHeight: -10,
              headerRight: () => <HeaderRight />,
            }}>

            <Stack.Screen
              name="Login"
              component={Screens.LoginScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Signup"
              component={Screens.SignupScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Profile"
              component={Screens.Profile}
              options={{headerLeft: () => <HeaderLeft name="Profile" />}}
            />
            <Stack.Screen
              name="BusinessPlace"
              component={Screens.BusinessPlace}
              options={{headerLeft: () => <HeaderLeft name="Business Place" />}}
            />

            {/* Common Screens from both A and B */}
            <Stack.Screen
              name="Home"
              component={Screens.Home}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="NewsEvents"
              component={Screens.NewsEvents}
              options={{headerLeft: () => <HeaderLeft name="News & Events" />}}
            />
            <Stack.Screen
              name="DeathNews"
              component={Screens.DeathNewsScreen}
              options={{
                headerLeft: () => <HeaderLeft name="Obituary" route="Home" />,
              }}
            />
            <Stack.Screen
              name="DeathNewsDetail"
              component={Screens.DeathNewsDetail}
              options={{headerLeft: () => <HeaderLeft />}}
            />
            <Stack.Screen
              name="DeathAnniversaries"
              component={Components.DeathAnniversaries}
              options={{
                headerLeft: () => <HeaderLeft name="Back" route="DeathNews" />,
              }}
            />
            <Stack.Screen
              name="Media"
              component={Screens.Media}
              options={{headerLeft: () => <HeaderLeft />}}
            />
            <Stack.Screen
              name="AboutUs"
              component={Screens.AboutUs}
              options={{headerLeft: () => <HeaderLeft name="About Us" />}}
            />

            {/* Donation Pages Start */}
            <Stack.Screen
              name="DonationCauses"
              component={Screens.Donation.Causes}
              options={{headerLeft: () => <HeaderLeft name="Donate Us" />}}
            />
            <Stack.Screen
              name="DonationSubTypes"
              component={Screens.Donation.SubTypes}
              options={{headerLeft: () => <HeaderLeft name="Donate Us" />}}
            />
            <Stack.Screen
              name="DonationCartItems"
              component={Screens.Donation.CartItems}
              options={{headerLeft: () => <HeaderLeft name="Donate Us" />}}
            />
            <Stack.Screen
              name="DonationCheckoutForm"
              component={Screens.Donation.CheckoutForm}
              options={{headerLeft: () => <HeaderLeft name="Donate Us" />}}
            />
            {/* Donation Pages End */}

            <Stack.Screen
              name="WebViewByLink"
              component={Screens.WebViewByLink}
            />
            <Stack.Screen name="ExtraBtns" component={Screens.ExtraBtns} />
            <Stack.Screen
              name="NEDetail"
              component={Screens.NEDetail}
              options={{headerLeft: () => <HeaderLeft />}}
            />
            <Stack.Screen
              name="RamzanQuiz"
              component={Screens.RamzanQuiz}
              options={{headerLeft: () => <HeaderLeft name="Quiz Program" />}}
            />
            <Stack.Screen
              name="DownloadTabs"
              component={Screens.DownloadTabs}
              options={{headerLeft: () => <HeaderLeft name="Downloads" />}}
            />
            <Stack.Screen
              name="ConnectUs"
              component={Screens.ConnectUs}
              options={{headerLeft: () => <HeaderLeft name="Contact Us" />}}
            />
            <Stack.Screen
              name="Telethone"
              component={Screens.Telethone}
              options={{headerLeft: () => <HeaderLeft name="Telethon" />}}
            />
            <Stack.Screen
              name="RamzanQuizStart"
              component={Screens.RamzanQuizStart}
              options={{headerLeft: () => <HeaderLeft />}}
            />
            <Stack.Screen
              name="Feedback"
              component={Screens.Feedback}
              options={{headerLeft: () => <HeaderLeft name="Feedback" />}}
            />
            <Stack.Screen
              name="EventsCalendar"
              component={Screens.EventsCalendar}
              options={{headerLeft: () => <HeaderLeft name="Events Calendar" />}}
            />
            <Stack.Screen
              name="Settings"
              component={Screens.Settings}
              options={{headerLeft: () => <HeaderLeft name="Settings" />}}
            />
            <Stack.Screen
              name="Forms"
              component={Screens.Forms}
              options={{headerLeft: () => <HeaderLeft name="Forms" />}}
            />
            <Stack.Screen name="NominationForm" component={NominationForm} />
            <Stack.Screen name="NominationWithdrawal" component={NominationWithdrawal} />
            <Stack.Screen name="CandidateRetirement" component={CandidateRetirement} />
            <Stack.Screen name="FamilyParticipation" component={FamilyParticipation} />
            <Stack.Screen name="DuplicateCardForm" component={DuplicateCardForm} />
            <Stack.Screen
              name="DeathInfoForm"
              component={Screens.DeathInfoForm}
              options={{headerLeft: () => <HeaderLeft name="Death Info" />}}
            />
            <Stack.Screen name="TakhtiRepairForm" component={TakhtiRepairForm} />
            <Stack.Screen name="WadiEzainab" component={WadiEzainab} />
            <Stack.Screen name="EducationDonationBox" component={EducationDonationBox} />
            <Stack.Screen name="HallBookingForm" component={HallBookingForm} />

            
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default StackNavigator;
