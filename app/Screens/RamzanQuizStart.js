import React, {useState, useEffect, useCallback} from 'react';
import {connect} from 'react-redux';
import Quiz from '../Components/Quiz';
import database from '@react-native-firebase/database';
import Loader from '../Components/Loader';
import {displayNetworkError, isNotNullOrEmpty} from '../Functions/Functions';
import {Text} from '../Components/core';

const RamzanQuizStart = ({
  quiz,
  childUsers,
  networkStatuse,
  navigation,
  route,
}) => {
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [activeQuiz, setActiveQuiz] = useState({});
  const [networkError, setNetworkError] = useState(false);
  const [status, setStatus] = useState({
    isQuizStart: false,
    errorText: '',
  });

  const checkUserResultsExist = user => {
    if (isNotNullOrEmpty(user.resultArray)) {
      const {resultArray} = user;
      let array = resultArray;
      let keys = [];
      for (let key in array) {
        keys.push(key);
      }

      if (keys.indexOf(quiz.timeStamp.toString()) === -1) {
        setStatus({errorText: false, isQuizStart: true});
        setActiveQuiz(quiz);
      } else {
        setStatus({errorText: true, isQuizStart: false});
      }
    } else {
      setStatus({errorText: false, isQuizStart: true});
      setActiveQuiz(quiz);
    }
  };

  const getUserInfo = () => {
    let user = '';
    if (isNotNullOrEmpty(childUsers)) {
      for (let key in childUsers) {
        if (childUsers[key].perFormUid === route.params) {
          user = childUsers[key];
        }
      }
    }
    setUserInfo(user);
    checkActiveQuiz(user);
  };

  const checkActiveQuiz = user => {
    if (isNotNullOrEmpty(quiz)) {
      const {enable} = quiz;
      if (enable.status) {
        if (isNotNullOrEmpty(enable.users)) {
          if (enable.users.includes(user.perFormUid.toString())) {
            checkUserResultsExist(user);
          }
        } else {
          checkUserResultsExist(user);
        }
      }
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  useEffect(() => {
    setNetworkError(!networkStatuse);
  }, [networkStatuse]);

  const quizEnd = useCallback(async param => {
    setLoading(true);
    if (param === '') {
      return;
    } else {
      let nameOfQuiz = activeQuiz.title;
      try {
        let response = await database()
          .ref(
            `userData/${param.mainUserInfo.emailAddress}/${param.perFormUid}/resultArray/${param.quizId}/answersArray`,
          )
          .set(param.answersArray);
        console.log(response);
        setLoading(false);
        alert(
          `Your answers for ${nameOfQuiz} have been submitted successfully. Looking forward for your participation in next quiz.`,
        );
        navigation.goBack();
      } catch (e) {
        console.log(e);
        setLoading(false);
        alert(
          'Some network issue from your side answers not saved please do again this Quiz',
        );
      }
    }
  });

  const noQuiz = () => {
    return (
      <Text style={{textAlign: 'center', padding: 10, fontSize: 16}}>
        {status.errorText
          ? `${userInfo.fullName} has already submitted answers for ${quiz.title}. Please visit us again later.`
          : `No active quiz available at the moment. Please visit us again later.`}
      </Text>
    );
  };

  if (networkError) {
    return displayNetworkError();
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <React.Fragment>
      {status.isQuizStart ? (
        <Quiz
          navigation={navigation}
          userInfo={userInfo}
          todayQuiz={activeQuiz}
          quizEnd={quizEnd}
        />
      ) : (
        noQuiz()
      )}
    </React.Fragment>
  );
};

const mapStateToProps = state => {
  return {
    quiz: state.reducer.todayQuiz,
    childUsers: state.reducer.childUsers,
    networkStatuse: state.reducer.networkStatuse,
  };
};

export default connect(mapStateToProps)(RamzanQuizStart);
