import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import {onDownloadDeathNews, onShareDeathNews} from '../Functions/Functions';
import {DeathNewsShareIcn, DeathNewsDownloadIcn} from '../Helpers/icons';
import {images} from '../Config/AppConfigData';
import {text as texts} from '../Config/AppConfigData';
import {deathInfoStyles} from '../Styles';
import {Text} from './core';

const maleImage = images.noImage;
const famaleImage = images.femaleForDeathnews;

export default function DeathNewsDetailComp(props) {
  const {
    imageUrl,
    nameString,
    burialInfo,
    dateTimeString,
    name,
    fatherName,
    maleFemale,
    husbandName,
    age,
    wasOrToBe,
    dateOfNamaz,
    timeOfNamaz,
    placeOfNamaz,
  } = props.DetailDeathNews;
  const {width} = useWindowDimensions();

  const text = `${texts.deathNewsShareHeaderText}${
    '*' +
    name +
    (fatherName !== '' &&
      (maleFemale === 'male' ? ' s/o ' : ' d/o ') + fatherName) +
    (husbandName !== '' && husbandName) +
    '*'
  }${'\n\nAge: ' + age + ' years\n'}${burialInfo !== '' && burialInfo} ${
    '\n*' +
    'Namaz-e-Janaza ' +
    wasOrToBe +
    ' offered on ' +
    dateOfNamaz +
    ' ' +
    timeOfNamaz +
    ' ' +
    placeOfNamaz +
    '*'
  } ${texts.deathNewsShareFooterText}`;

  const renderImage = () => {
    return (
      <Image
        style={{
          ...deathInfoStyles.rImage,
          height: width - 50,
        }}
        source={
          maleFemale == 'male'
            ? imageUrl
              ? {uri: imageUrl}
              : maleImage
            : famaleImage
        }
        resizeMode="contain"
      />
    );
  };
  const renderText = () => {
    return (
      <View style={deathInfoStyles.rTxtCont}>
        <Text style={{...deathInfoStyles.rtxt, fontFamily: 'Poppins-Regular'}}>
          {texts.deathNewsHeaderText}
        </Text>
        <Text style={deathInfoStyles.rTxtBold}>
          {nameString + burialInfo + dateTimeString}
        </Text>
        <Text style={{...deathInfoStyles.rtxt, fontFamily: 'Poppins-Regular'}}>
          {texts.deathNewsFooterText}
        </Text>
      </View>
    );
  };

  const renderButtons = () => {
    return (
      <View style={deathInfoStyles.btnContainer}>
        {imageUrl ? (
          <TouchableOpacity
            onPress={() => onDownloadDeathNews(imageUrl)}
            style={deathInfoStyles.btn}>
            <DeathNewsDownloadIcn />
            <Text style={deathInfoStyles.btnTxt}>Save Image</Text>
          </TouchableOpacity>
        ) : (
          <View></View>
        )}
        <TouchableOpacity
          onPress={() => onShareDeathNews(text, imageUrl ? imageUrl : '')}
          style={deathInfoStyles.btn}>
          <DeathNewsShareIcn />
          <Text style={deathInfoStyles.btnTxt}>Share News</Text>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <View style={deathInfoStyles.container}>
      <SafeAreaView style={deathInfoStyles.scroll}>
        <ScrollView>
          {renderImage()}
          {renderText()}
        </ScrollView>
      </SafeAreaView>
      {renderButtons()}
    </View>
  );
}
