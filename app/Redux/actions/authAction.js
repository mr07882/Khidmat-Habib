import database from '@react-native-firebase/database';
import NetInfo from '@react-native-community/netinfo';

const db = database();

const getAppVersion = () => {
  return (dispatch, getState) => {
    db.ref('app_version').on('value', e => {
      let app_version = e.val();
      if (app_version) {
        dispatch({type: 'APP_VERSION', app_version});
      } else {
        dispatch({type: 'APP_VERSION', app_version: null});
      }
    });
  };
};
const getAllFlags = () => {
  return (dispatch, getState) => {
    db.ref('flags').on('value', e => {
      dispatch({type: 'ALL_FLAGS', allFlags: e.val()});
    });
  };
};

const getExtraBtns = () => {
  return (dispatch, getState) => {
    db.ref('extraBtns').on('value', e => {
      dispatch({type: 'EXTRA_BTNS', extraBtns: e.val()});
    });
  };
};

const donateButtonStatuse = () => {
  return (dispatch, getState) => {
    db.ref('donateButtonFlag').on('value', e => {
      let dta = e.val();
      if (dta) {
        dispatch({type: 'DONATE-FLAG', donateFlag: e.val()});
      } else {
        dispatch({type: 'DONATE-FLAG', donateFlag: false});
      }
    });
  };
};

const quizButtonStatuse = () => {
  return (dispatch, getState) => {
    db.ref('ramzanQuizFlag').on('value', e => {
      let dta = e.val();
      if (dta) {
        dispatch({type: 'RAMZAN-QUIZ-FLAG', ramzanQuizFlag: e.val()});
      } else {
        dispatch({type: 'RAMZAN-QUIZ-FLAG', ramzanQuizFlag: false});
      }
    });
  };
};
const feedbackButonStatuse = () => {
  return (dispatch, getState) => {
    db.ref('feedbackFlag').on('value', e => {
      let dta = e.val();
      if (dta) {
        dispatch({type: 'FEEDBACK-FLAG', feedbackFlag: e.val()});
      } else {
        dispatch({type: 'FEEDBACK-FLAG', feedbackFlag: false});
      }
    });
  };
};

const telethoneButtonStatuse = () => {
  return (dispatch, getState) => {
    db.ref('telethoneFlag').on('value', e => {
      let dta = e.val();
      if (dta) {
        dispatch({type: 'TELETHONE-FLAG', telethoneFlag: e.val()});
      } else {
        dispatch({type: 'TELETHONE-FLAG', telethoneFlag: false});
      }
    });
  };
};

const getFemaleDummyImageForDeathNews = () => {
  return (dispatch, getState) => {
    db.ref('femaleImageForDeathNews').on('value', e => {
      dispatch({type: 'FEMALE-DUMMY', femaleDummy: e.val()});
    });
  };
};
const getAllFormsFromThisUser = emailAddress => {
  return (dispatch, getState) => {
    let state = getState();
    db.ref(
      `userData/${
        emailAddress || state?.reducer?.user?.userDetail?.emailAddress
      }`,
    ).on('value', e => {
      let userForms = e.val();
      let childUsers = [];
      if (userForms) {
        for (var key in userForms) {
          childUsers.push(userForms[key]);
        }
        dispatch({type: 'CHILD-USERS-FOR-QUIZ', childUsers});
      }
      dispatch({type: 'CHILD-USERS-FOR-QUIZ', childUsers});
    });
  };
};

const emptyChildUsers = () => {
  return (dispatch, getState) => {
    dispatch({type: 'CHILD-USERS-FOR-QUIZ', childUsers: []});
  };
};

const getAllRullsAndRegulations = () => {
  return (dispatch, getState) => {
    db.ref(`rullsAndRegulations`).on('value', e => {
      let rullsAndRegulations = e.val();
      dispatch({type: 'RULLS_AND_REGULATIONS', rullsAndRegulations});
    });
  };
};
const getAllQuiz = props => {
  return (dispatch, getState) => {
    db.ref(`ramzanQuizes`).on('value', e => {
      dispatch({type: 'TODAY-QUIZ', todayQuiz: ''});
      let quizData = e.val();
      let todayQuizData = '';
      if (quizData) {
        for (var key in quizData) {
          if (quizData[key].enable.status !== false) {
            todayQuizData = quizData[key];
            dispatch({type: 'TODAY-QUIZ', todayQuiz: todayQuizData});
          }
        }
      }
    });
  };
};

const userDetailForQuiz = (isLogin, param) => {
  return (dispatch, getState) => {
    let user = {
      isLogin,
      userDetail: param,
    };
    dispatch({type: 'USER-LOGIN-STATUSE-FOR-RAMAZAN-QUIZ', user});
  };
};

const networkStatuse = () => {
  return (dispatch, getState) => {
    NetInfo.addEventListener(state => {
      dispatch({type: 'NETWORK-STATUSE', networkStatuse: state.isConnected});
    });
  };
};
const getAboutUs = () => {
  return (dispatch, getState) => {
    db.ref('aboutUs').on('value', e => {
      dispatch({type: 'ABOUT-US', aboutUs: e.val()});
    });
  };
};

const getDownloads = () => {
  return (dispatch, getState) => {
    db.ref('downloads').on('value', e => {
      dispatch({type: 'DOWNLOADS', downloads: e.val()});
    });
  };
};

const getDonateUs = () => {
  return (dispatch, getState) => {
    db.ref('donateUs').on('value', e => {
      dispatch({type: 'DONATE-US', donation: e.val()});
    });
  };
};

const getTelethonButton = () => {
  return (dispatch, getState) => {
    db.ref('buttonStyles').on('value', e => {
      dispatch({type: 'TELETHON-BUTTON', telethonButton: e.val()});
    });
  };
};

const getMainPageBanners = () => {
  return (dispatch, getState) => {
    db.ref('mainPageBanners').on('value', e => {
      let data = e.val();
      if (data) {
        dispatch({type: 'MAIN-PAGE-BANNERS', mainPageBanners: e.val()});
      } else {
        dispatch({type: 'MAIN-PAGE-BANNERS', mainPageBanners: null});
      }
    });
  };
};
const getDeathNews = () => {
  return (dispatch, getState) => {
    db.ref('deathNews').on('value', e => {
      const deathNews = [];
      let data = e.val();
      if (data) {
        for (var key in data) {
          deathNews.push(data[key]);
        }
        deathNews.length && dispatch({type: 'DEATH-NEWS', deathNews});
      }
    });
  };
};
const getEventNews = () => {
  return (dispatch, getState) => {
    db.ref('eventNews').on('value', e => {
      const eventNews = [];
      let data = e.val();
      if (data) {
        for (var key in data) {
          eventNews.push(data[key]);
        }
        eventNews.length && dispatch({type: 'EVENT-NEWS', eventNews});
      }
    });
  };
};
const getLastUpdateTimeOfPopUpScreen = timeStamp => {
  return (dispatch, getState) => {
    dispatch({type: 'POPUP-UPDATED', isPopupUpdated: timeStamp});
  };
};
const saveAppOpeningTime = dateOfLastOpen => {
  return (dispatch, getState) => {
    dispatch({type: 'APP-OPENING-DATE', dateOfLastOpen});
  };
};
const setConfirmationForPhoneAuthInRedux = confirmation => {
  return (dispatch, getState) => {
    dispatch({type: 'CONFIRMATION_FOR_NUMBER_AUTH', confirmation});
  };
};
export {
  networkStatuse,
  getDeathNews,
  getEventNews,
  getMainPageBanners,
  getAboutUs,
  getDownloads,
  getDonateUs,
  getExtraBtns,
  getFemaleDummyImageForDeathNews,
  saveAppOpeningTime,
  emptyChildUsers,
  getLastUpdateTimeOfPopUpScreen,
  userDetailForQuiz,
  getAllQuiz,
  getTelethonButton,
  getAllFormsFromThisUser,
  quizButtonStatuse,
  telethoneButtonStatuse,
  feedbackButonStatuse,
  donateButtonStatuse,
  getAppVersion,
  getAllFlags,
  setConfirmationForPhoneAuthInRedux,
  getAllRullsAndRegulations,
};
