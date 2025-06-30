import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import TelethonMain from './TelethonMain';
import {userDetailForQuiz} from '../Redux/actions/authAction';
import auth from '@react-native-firebase/auth';
import {GoogleAuth} from '.';

function TelethonComp(props) {
  const [isUserLogin, setIsUserLogin] = useState(false);

  const checkUserSignIn = async () => {
    console.log('CurrentUser:', auth()?.currentUser);
    if (auth()?.currentUser) {
      if (auth()?.currentUser?.phoneNumber) {
        await auth().signOut();
        console.log('worked');
      }
      if (auth()?.currentUser?.email) {
        setIsUserLogin(true);
      }
    }
  };

  useEffect(() => {
    checkUserSignIn();
  }, []);

  const confirmUserLogin = param => {
    setIsUserLogin(true);
    props.userDetailForQuiz(true, param);
  };

  return (
    <React.Fragment>
      {isUserLogin ? (
        <TelethonMain setIsUserLogin={setIsUserLogin} />
      ) : (
        <GoogleAuth confirmUserLogin={param => confirmUserLogin(param)} />
      )}
    </React.Fragment>
  );
}
const mapDispatchToProps = dispatch => {
  return {
    userDetailForQuiz: (isLogin, param) =>
      dispatch(userDetailForQuiz(isLogin, param)),
  };
};
const mapStateToProps = state => {
  return {userInfo: state.reducer.user};
};
export default connect(mapStateToProps, mapDispatchToProps)(TelethonComp);
