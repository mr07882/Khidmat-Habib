import React, {useEffect, useState} from 'react';
import {connect, useDispatch, useSelector} from 'react-redux';
import auth from '@react-native-firebase/auth';
import RamzanQuizCheckIdentity from '../Components/RamzanQuizCheckIdentity';
import {
  userDetailForQuiz,
  getAllQuiz,
  emptyChildUsers,
} from '../Redux/actions/authAction';
import {GoogleAuth} from '../Components';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {displayNetworkError} from '../Functions/Functions';

const RamzanQuiz = props => {
  const [networkError, setNetworkError] = useState(false);
  const {user} = useSelector(state => state.reducer);
  const dispatch = useDispatch();

  const checkUserSignIn = async () => {
    const userInfo = auth()?.currentUser;

    if (userInfo && userInfo.phoneNumber) {
      await auth().signOut();
    }
  };

  useEffect(() => {
    props.getAllQuiz();
    checkUserSignIn();
    GoogleSignin.configure({});
  }, []);

  useEffect(() => {
    setNetworkError(!props.networkStatuse);
  }, [props.networkStatuse]);

  const logOut = async () => {
    try {
      await GoogleSignin.signOut();
      await auth().signOut();
      props.userDetailForQuiz(false, {});
      dispatch(emptyChildUsers());
      alert('User logout successfully');
    } catch (e) {
      console.log('Logout error', e);
      alert('An error occurred while signing out the user');
    }
  };

  const confirmUserLogin = param => {
    if (param) {
      props.userDetailForQuiz(true, param);
    } else {
      props.userDetailForQuiz(false, {});
    }
  };

  if (networkError) {
    return displayNetworkError();
  }

  return (
    <React.Fragment>
      {user?.isLogin && user?.emailAddress ? (
        <RamzanQuizCheckIdentity
          logOut={logOut}
          navigation={props.navigation}
        />
      ) : (
        <GoogleAuth confirmUserLogin={confirmUserLogin} />
      )}
    </React.Fragment>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    userDetailForQuiz: (isLogin, param) =>
      dispatch(userDetailForQuiz(isLogin, param)),
    getAllQuiz: () => dispatch(getAllQuiz()),
  };
};
const mapStateToProps = state => {
  return {
    userInfo: state.reducer.user,
    networkStatuse: state.reducer.networkStatuse,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(RamzanQuiz);
