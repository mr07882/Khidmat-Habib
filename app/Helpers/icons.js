import React from 'react';
import AntIcon from 'react-native-vector-icons/AntDesign';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import McIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {colors} from '../Config/AppConfigData';

const dashboardStyles = {
  button: {fontSize: 20, color: '#ECEAE4', textShadowColor: 'black'},
};

// Home page button icons
const SettingsIcn = () => (
  <MaterialIcon name="settings" style={{fontSize: 24, color: '#ECEAE4'}} />
);
const NewsIcn = (
  <FontAwesomeIcon name="newspaper-o" style={dashboardStyles.button} />
);
const DeathNewsIcn = <EntypoIcon name="news" style={dashboardStyles.button} />;
const DownloadIcn = (
  <EntypoIcon name="download" style={dashboardStyles.button} />
);
const AboutIcn = <AntIcon name="exception1" style={dashboardStyles.button} />;
const ContactIcn = <AntIcon name="contacts" style={dashboardStyles.button} />;
const RamzanQuizIcn = (
  <MaterialIcon name="question-answer" style={dashboardStyles.button} />
);
const TelethoneIcn = (
  <AntIcon name="customerservice" style={dashboardStyles.button} />
);
const FeedbackIcn = (
  <MaterialIcon name="feedback" style={dashboardStyles.button} />
);
const DeathNewsDownloadIcn = () => (
  <FontAwesomeIcon name="download" style={{fontSize: 22, color: '#725054'}} />
);
const DeathNewsShareIcn = () => (
  <FontAwesomeIcon
    name="share-square"
    style={{fontSize: 22, color: '#725054'}}
  />
);
const FullScreenIcn = () => (
  <EntypoIcon
    name="resize-full-screen"
    style={{fontSize: 22, color: '#725054'}}
  />
);
const NavBackIcn = () => (
  <FontAwesomeIcon
    name="chevron-left"
    style={{fontSize: 12, color: '#725054', paddingRight: 2.5}}
  />
);

// Dynamic Button Icons
const MCIcons = (name, color) => (
  <McIcon name={name} style={[dashboardStyles.button, {color}]} />
);
const MaterialIcons = (name, color) => (
  <MaterialIcon name={name} style={[dashboardStyles.button, {color}]} />
);
const AntDesign = (name, color) => (
  <AntIcon name={name} style={[dashboardStyles.button, {color}]} />
);
const FontAwesome = (name, color) => (
  <FontAwesomeIcon name={name} style={[dashboardStyles.button, {color}]} />
);
const FontAwesome6 = (name, color) => (
  <FontAwesome6Icon name={name} style={[dashboardStyles.button, {color}]} />
);

// Other Icons
const PinIcn = ({styles = {}}) => (
  <EntypoIcon
    name="pin"
    style={{fontSize: 15, color: colors.secondryColor, ...styles}}
  />
);
const RightArrowIcn = ({styles = {}}) => (
  <FontAwesomeIcon
    name="angle-right"
    style={{fontSize: 24, color: '#ffffff', ...styles}}
  />
);
const DownArrowIcn = ({styles = {}}) => (
  <FontAwesome6Icon name="chevron-down" style={{fontSize: 16, ...styles}} />
);

const PlusIcn = ({styles = {}}) => (
  <FontAwesome6Icon name="plus" style={{fontSize: 16, ...styles}} />
);
const MinusIcn = ({styles = {}}) => (
  <FontAwesome6Icon name="minus" style={{fontSize: 16, ...styles}} />
);
const CheckIcn = ({styles = {}}) => (
  <FontAwesome6Icon name="check" style={{fontSize: 16, ...styles}} />
);
const TrashIcn = ({styles = {}}) => (
  <EntypoIcon name="trash" style={{fontSize: 16, ...styles}} />
);
const ProfileIcn = ({styles = {}}) => (
  <FontAwesome6Icon name="user" size={24} color="#ECEAE4" />
);
const BusinessIcn = (color = colors.primaryColor) => (
  <FontAwesome6Icon name="building" style={[dashboardStyles.button, {color}]} />
);

const LocIcon = (color = colors.primaryColor) => (
  <FontAwesomeIcon name="map-marker" size={16} color='#888' />
);







export {
  DownArrowIcn,
  TrashIcn,
  CheckIcn,
  MinusIcn,
  PlusIcn,
  NavBackIcn,
  SettingsIcn,
  MaterialIcons,
  MCIcons,
  AntDesign,
  FontAwesome,
  FontAwesome6,
  NewsIcn,
  DeathNewsIcn,
  DownloadIcn,
  AboutIcn,
  ContactIcn,
  RamzanQuizIcn,
  TelethoneIcn,
  FeedbackIcn,
  PinIcn,
  RightArrowIcn,
  DeathNewsDownloadIcn,
  DeathNewsShareIcn,
  FullScreenIcn,
  ProfileIcn,
  BusinessIcn,
  LocIcon,
};
