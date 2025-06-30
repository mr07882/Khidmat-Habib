import * as React from 'react';
import QuestionsStartNow from './QuestionsStartNow';
import {calculateAge} from '../Functions/Functions';

export default class Quiz extends React.Component {
  constructor() {
    super();
    this.state = {
      todayQuiz: '',
      userInfo: '',
    };
    this.createResult = this.createResult.bind(this);
  }

  static getDerivedStateFromProps(nextProps) {
    return {
      todayQuiz: nextProps.todayQuiz,
      userInfo: nextProps.userInfo,
    };
  }
  createResult(param) {
    const {todayQuiz, userInfo} = this.state;
    let obj = {
      ...userInfo,
      quizId: todayQuiz.timeStamp,
      answersArray: param,
    };
    this.props.quizEnd(obj);
    // if(userInfo.resultArray){
    // userInfo.resultArray.push(obj)
    // this.props.quizEnd(userInfo)
    // }else{
    // userInfo.resultArray = [obj]
    // }
  }

  renderQuiz(questions, title, link, language) {
    return (
      <QuestionsStartNow
        navigation={this.props.navigation}
        questions={questions}
        link={link}
        language={language}
        title={title}
        createResult={this.createResult}
      />
    );
  }

  render() {
    const {todayQuiz, userInfo} = this.state;
    const {navigation} = this.props;
    let arr = todayQuiz.questionsArray;

    function shuffle(array) {
      let shuffleQuestions = array.filter(ele => ele.shuffle.question);
      let unShuffleQuestions = array.filter(ele => !ele.shuffle.question);

      var currentIndex = shuffleQuestions.length,
        temporaryValue,
        randomIndex;
      // While there remain elements to shuffle...
      while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = shuffleQuestions[currentIndex];
        shuffleQuestions[currentIndex] = shuffleQuestions[randomIndex];
        shuffleQuestions[randomIndex] = temporaryValue;
      }

      let finalArray = [...unShuffleQuestions, ...shuffleQuestions];
      return finalArray;
    }

    function notEligible() {
      alert(
        `Minimum age requirement for ${todayQuiz.title} is ${todayQuiz.age} years.`,
      );
      navigation.goBack();
    }

    function allowQuiz() {
      let userAge = calculateAge(userInfo.dateOfBirth);
      return userAge >= todayQuiz.age;
    }

    return (
      <>
        {allowQuiz()
          ? !!todayQuiz &&
            !!userInfo &&
            this.renderQuiz(
              shuffle(arr),
              todayQuiz.title,
              todayQuiz.link,
              todayQuiz.language,
            )
          : notEligible()}
      </>
    );
  }
}
