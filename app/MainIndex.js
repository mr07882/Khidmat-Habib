import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {
  getAppVersion,
  getAllFlags,
  getExtraBtns,
  donateButtonStatuse,
  networkStatuse,
  feedbackButonStatuse,
  getDeathNews,
  getEventNews,
  getMainPageBanners,
  getDonateUs,
  getAboutUs,
  getDownloads,
  getFemaleDummyImageForDeathNews,
  quizButtonStatuse,
  telethoneButtonStatuse,
  getAllRullsAndRegulations,
  getTelethonButton,
} from './Redux/actions/authAction';
import {version as installed_app_version} from '../package.json';
import {StackNavigator} from './Navigation';
import {permissions} from './Functions';
import {ForceAppUpdate} from './Components/ui';

let MainIndex = props => {
  const [app_version, setApp_version] = useState(installed_app_version);

  useEffect(() => {
    permissions.storage.write();
    props.app_version
      ? setApp_version('1.5.8')
      : setApp_version(installed_app_version);
    props.getAppVersion();
    props.getAllFlags();
    props.getExtraBtns();
    props.donateButtonStatuse();
    props.quizButtonStatuse();
    props.feedbackButonStatuse();
    props.telethoneButtonStatuse();
    props.networkStatuse();
    props.getMainPageBanners();
    props.getDeathNews();
    props.getEventNews();
    props.getDonateUs();
    props.getTelethonButton();
    props.getAboutUs();
    props.getDownloads();
    props.getFemaleDummyImageForDeathNews();
    props.getAllRullsAndRegulations();
  });

  let versionFlag = installed_app_version >= app_version;

  return versionFlag ? <StackNavigator /> : <ForceAppUpdate />;
};
const mapDispatchToProps = dispatch => {
  return {
    getAppVersion: () => dispatch(getAppVersion()),
    donateButtonStatuse: () => dispatch(donateButtonStatuse()),
    quizButtonStatuse: () => dispatch(quizButtonStatuse()),
    feedbackButonStatuse: () => dispatch(feedbackButonStatuse()),
    telethoneButtonStatuse: () => dispatch(telethoneButtonStatuse()),
    networkStatuse: () => dispatch(networkStatuse()),
    getDeathNews: () => dispatch(getDeathNews()),
    getEventNews: () => dispatch(getEventNews()),
    getMainPageBanners: () => dispatch(getMainPageBanners()),
    getDonateUs: () => dispatch(getDonateUs()),
    getTelethonButton: () => dispatch(getTelethonButton()),
    getAboutUs: () => dispatch(getAboutUs()),
    getDownloads: () => dispatch(getDownloads()),
    getFemaleDummyImageForDeathNews: () =>
      dispatch(getFemaleDummyImageForDeathNews()),
    getAllFlags: () => dispatch(getAllFlags()),
    getExtraBtns: () => dispatch(getExtraBtns()),
    getAllRullsAndRegulations: () => dispatch(getAllRullsAndRegulations()),
  };
};

MainIndex = React.memo(MainIndex);

const mapStateToProps = state => {
  return {
    app_version: state.reducer.app_version,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(MainIndex);
