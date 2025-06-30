import * as React from 'react';
import {View, TouchableOpacity, ScrollView} from 'react-native';
import Loader from '../Components/Loader';
import RadioButton from '../FoamFields/RadioButton';
import CheckBox from '../FoamFields/CheckBox';
import {isNotNullOrEmpty} from '../Functions/Functions';
import {Text} from './core';

export default class QuestionsStartNow extends React.Component {
  constructor() {
    super();
    this.state = {
      link: '',
      title: '',
      questions: '',
      questionsLength: 0,
      currentQuestion: 0,
      currentAnswer: '',
      answerArray: [],
      isLoader: false,
      selectedAnswerForRadioButton: [],
    };
  }

  static getDerivedStateFromProps(nextProps) {
    return {
      questions: nextProps.questions,
      questionsLength: nextProps.questions.length,
      title: nextProps.title,
      link: nextProps.link,
      language: nextProps.language,
    };
  }

  nextQuestion() {
    this.setState({isLoader: true});
    const {questionsLength, currentQuestion, currentAnswer, answerArray} =
      this.state;
    if (currentAnswer !== '') {
      answerArray.push(currentAnswer);
      let nextQuestion = currentQuestion + 1;
      if (nextQuestion < questionsLength) {
        this.setState({
          currentQuestion: nextQuestion,
          answerArray,
          isLoader: false,
          currentAnswer: '',
          selectedAnswerForRadioButton: [],
        });
      } else {
        this.setState({isLoader: false, selectedAnswerForRadioButton: []});
        this.props.createResult(answerArray);
      }
    } else {
      this.setState({isLoader: false});
      alert('No option Selected');
    }
  }
  setCurrentAnswerInState(param, val) {
    const {questions, questionsLength, currentQuestion} = this.state;
    const question = questions[currentQuestion].question;
    let value = {
      question,
      selectedAnswer: [],
      isMultipleAnswers: param === 'muliple' ? true : false,
      title: this.state.title,
    };
    val.map((ele, ind) => {
      if (ele.selected) {
        for (let key in questions[currentQuestion]) {
          const obj = questions[currentQuestion][key];
          if (isNotNullOrEmpty(obj.isTrue) && isNotNullOrEmpty(obj.value)) {
            if (obj.value === val[ind].type) {
              value.selectedAnswer.push(obj);
            }
          }
        }
      }
    });
    let currentVal = [];
    for (let key in val) {
      if (val[key].selected) {
        currentVal.push(val[key]);
      }
    }
    this.setState({
      selectedAnswerForRadioButton: param === 'single' ? val : currentVal,
      currentAnswer: value,
    });
  }
  renderOptions(options) {
    let testing = [];
    !!options.option1 &&
      !!options.option1.value &&
      testing.push(options.option1.isTrue);
    !!options.option2 &&
      !!options.option2.value &&
      testing.push(options.option2.isTrue);
    !!options.option3 &&
      !!options.option3.value &&
      testing.push(options.option3.isTrue);
    !!options.option4 &&
      !!options.option4.value &&
      testing.push(options.option4.isTrue);
    !!options.option5 &&
      !!options.option5.value &&
      testing.push(options.option5.isTrue);
    let num = 0;
    if (testing.length) {
      for (let key in testing) {
        if (testing[key] === true) {
          num = num + 1;
        }
      }
    }

    // if (num > 1) {
    // } else if (num === 1) {
    // }
    const question = options.question;
    let radio_props = [];
    let i = 1;
    let optionsArr = ['option1', 'option2', 'option3', 'option4', 'option5'];

    if (options.shuffle.answer) {
      for (let key in options) {
        if (options[key].value) {
          radio_props.push({type: options[key].value, selected: false});
        }
      }
    } else {
      for (let x = 0; x < 5; x++) {
        if (options[optionsArr[x]].value) {
          radio_props.push({
            type: options[optionsArr[x]].value,
            selected: false,
          });
        }
      }
    }

    return (
      <View
        style={{
          padding: 10,
          paddingBottom: 50,
        }}>
        {!(num > 1) ? (
          !!radio_props.length && (
            <RadioButton
              language={this.state.language}
              // validationStatus={'Single Choice Question'}
              value={this.state.selectedAnswerForRadioButton}
              // validationStatusStyle={styles.validationStatusStyle}
              // value={isUpdate ? updatedObject.customerWaitInLobby ? updatedObject.customerWaitInLobby : dataForUpdate.customer_wait_lobby ? "Yes" : "No" : consumerWaitInLobby}
              itemList={radio_props}
              // onTermChange={val => isUpdate ? inputHandlerForUpdate('consumerWaitInLobbyOptions', val) : inputHandler('consumerWaitInLobbyOptions', val, 'aboutAudience')}
              // style={[styles.textInput, styles.mb4]}
              onTermChange={val => this.setCurrentAnswerInState('single', val)}
              label={`${this.state.currentQuestion + 1})  ${question}`}
              labelStyle={{fontSize: 20, fontWeight: 'bold'}}
            />
          )
        ) : (
          <View>
            <CheckBox
              language={this.state.language}
              value={this.state.selectedAnswerForRadioButton}
              // validationStatus={'Multiple Choice Question'}
              itemList={radio_props}
              // onTermChange={(val) => isUpdating ? inputHandlerForUpdate('audience_type_options', val) : inputHandler('audience_type_options', val)}
              onTermChange={val => this.setCurrentAnswerInState('muliple', val)}
              // handleSelectedValues={val =>
              // }
              // style={styles.textInput}
              label={`${this.state.currentQuestion + 1})  ${question}`}
              labelStyle={{fontSize: 20, fontWeight: 'bold'}}

              // labelStyle={styles.labelStyle}
              // icon={isUpdating && objForUpdate.status === "partially-approved" && !!objForUpdate.audience.data && !objForUpdate.audience.status && 'cancel'}
              // iconFamily={'AntDesign'}
              // iconColor={COLORS.danger}
              // iconStyle={{ paddingBottom: "0%" }}
              // validationStatus={'(required)'}
              // validationStatusStyle={styles.validationStatusStyle}
            />
          </View>
        )}
      </View>
    );
  }

  render() {
    const {questions, questionsLength, currentQuestion, isLoader, title, link} =
      this.state;
    const question = questions[currentQuestion].question;
    return (
      <>
        {isLoader ? (
          <Loader />
        ) : (
          <>
            {!!title && (
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Poppins-SemiBold',
                  textAlign: 'center',
                  padding: 10,
                  backgroundColor: 'lightgray',
                }}>
                {title}
              </Text>
            )}
            {!!link && (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  this.props.navigation.navigate(`${'WebViewByLink'}`, {
                    WebViewLink: link,
                    html: '',
                    label: !!title ? title + ' Quiz' : 'Go back',
                    isLink: true,
                    isHtml: false,
                  })
                }>
                <Text
                  style={{
                    fontSize: 14,
                    color: 'white',
                    textAlign: 'center',
                    padding: 10,
                    backgroundColor: 'gray',
                    textDecorationLine: 'underline',
                  }}>{`Resource material for this qiuz`}</Text>
              </TouchableOpacity>
            )}
            {!!questions.length && (
              <Text
                style={{
                  fontSize: 14,
                  color: 'white',
                  textAlign: 'center',
                  padding: 10,
                  backgroundColor: '#725054',
                }}>
                {`Questions (${currentQuestion + 1}/${questions.length})`}
              </Text>
            )}
            <ScrollView>
              {/* <Text style={{ fontSize: 22, textAlign: 'center', padding: 20 }}>{'Q:' + (currentQuestion + 1) + ') ' + question}</Text> */}
              {this.renderOptions(questions[currentQuestion])}
              <View
                style={{
                  alignItems: 'flex-end',
                  paddingRight: 20,
                  paddingBottom: 100,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.nextQuestion();
                  }}
                  style={{
                    width: 80,
                    height: 40,
                    backgroundColor: '#725054',
                    justifyContent: 'center',
                    borderRadius: 10,
                    alignItems: 'center',
                  }}>
                  {
                    <Text style={{fontSize: 18, color: 'white'}}>
                      {`${
                        !!questions.length &&
                        questions.length - 1 === currentQuestion
                          ? 'Submit'
                          : 'Next'
                      }`}
                    </Text>
                  }
                </TouchableOpacity>
              </View>
            </ScrollView>
          </>
        )}
      </>
    );
  }
}
