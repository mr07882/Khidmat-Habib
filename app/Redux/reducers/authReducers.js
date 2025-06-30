const reducer = (
  state = {
    allFlags: {
      newsFlag: true,
      obituaryFlag: true,
      graveSearchFlag: true,
      downloadsFlag: true,
      aboutFlag: true,
      contactUsFlag: true,
      feedbackFlag: true,
      donateFlag: true,
      settingsFlag: true,
      logoFlag: true,
      mainPageBannerFlag: true,
      telethoneFlag: false,
      ramzanQuizFlag: false,
    },
  },
  action,
) => {
  switch (action.type) {
    case 'NETWORK-STATUSE': {
      return {...state, networkStatuse: action.networkStatuse};
    }
    case 'DEATH-NEWS': {
      return {...state, deathNews: action.deathNews};
    }
    case 'EVENT-NEWS': {
      return {...state, eventNews: action.eventNews};
    }
    case 'MAIN-PAGE-BANNERS': {
      return {...state, mainPageBanners: action.mainPageBanners};
    }
    case 'DONATE-US': {
      return {...state, donation: action.donation};
    }
    case 'TELETHON-BUTTON': {
      return {...state, telethonButton: action.telethonButton};
    }
    case 'ABOUT-US': {
      return {...state, aboutUs: action.aboutUs};
    }
    case 'DOWNLOADS': {
      return {...state, downloads: action.downloads};
    }
    case 'FEMALE-DUMMY': {
      return {...state, femaleDummy: action.femaleDummy};
    }
    case 'APP-OPENING-DATE': {
      return {...state, dateOfLastOpen: action.dateOfLastOpen};
    }
    case 'POPUP-UPDATED': {
      return {...state, isPopupUpdated: action.isPopupUpdated};
    }
    case 'USER-LOGIN-STATUSE-FOR-RAMAZAN-QUIZ': {
      return {...state, user: action.user};
    }
    case 'TODAY-QUIZ': {
      return {...state, todayQuiz: action.todayQuiz};
    }
    case 'CHILD-USERS-FOR-QUIZ': {
      return {...state, childUsers: action.childUsers};
    }
    case 'RAMZAN-QUIZ-FLAG': {
      return {...state, ramzanQuizFlag: action.ramzanQuizFlag};
    }
    case 'TELETHONE-FLAG': {
      return {...state, telethoneFlag: action.telethoneFlag};
    }
    case 'FEEDBACK-FLAG': {
      return {...state, feedbackFlag: action.feedbackFlag};
    }
    case 'DONATE-FLAG': {
      return {...state, donateFlag: action.donateFlag};
    }
    case 'APP_VERSION': {
      return {...state, app_version: action.app_version};
    }
    case 'ALL_FLAGS': {
      return {...state, allFlags: action.allFlags};
    }
    case 'EXTRA_BTNS': {
      return {...state, extraBtns: action.extraBtns};
    }
    case 'CONFIRMATION_FOR_NUMBER_AUTH': {
      return {...state, confirmation: action.confirmation};
    }
    case 'RULLS_AND_REGULATIONS': {
      return {...state, rullsAndRegulations: action.rullsAndRegulations};
    }
    default: {
      return state;
    }
  }
};

export default reducer;
