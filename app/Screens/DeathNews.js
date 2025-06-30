import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {View, FlatList, SafeAreaView, TouchableOpacity} from 'react-native';
import {colors, text} from '../Config/AppConfigData';
import {deathNewsStyles} from '../Styles';
import {RightArrowIcn} from '../Helpers/icons';
import {Text} from '../Components/core';

function DeathNewsScreen(props) {
  const {deathNews, navigation} = props;

  useEffect(() => {
    if (props.route.params && props.route.params.id !== undefined) {
      const {id} = props.route.params;
      deathNews.map(ele => {
        if (ele.timeStamp === +id) {
          return navigation.navigate('DeathNewsDetail', {
            DetailDeathNews: ele,
          });
        }
      });
    }
  }, [deathNews]);

  const renderDeathNewsList = () => {
    if (deathNews) {
      let sorted = deathNews.sort((a, b) => a.timeString - b.timeString);
      let display = sorted.reverse();
      return display.length ? (
        <FlatList
          data={display}
          style={deathNewsStyles.secondSection}
          renderItem={({item}) => (
            <TouchableOpacity
              style={deathNewsStyles.deathNewsBtn}
              onPress={() =>
                navigation.navigate('DeathNewsDetail', {
                  DetailDeathNews: display[display.indexOf(item)],
                })
              }>
              <View style={deathNewsStyles.btnView}>
                <Text style={deathNewsStyles.personName}>{item.name}</Text>
                <RightArrowIcn styles={{color: colors.secondryColor}} />
              </View>
              <Text
                style={deathNewsStyles.namazEJanazaDetails}
                numberOfLines={1}>
                {`${item.dateOfNamaz} ${item.timeOfNamaz} ${item.placeOfNamaz}`}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.timeStamp.toString()}
        />
      ) : (
        <View></View>
      );
    } else {
      <View></View>;
    }
  };
  return (
    <SafeAreaView style={deathNewsStyles.mainscreen}>
      <View style={deathNewsStyles.firstSection}>
        <Text style={deathNewsStyles.deathNewsTxt}>
          {text.deathNewsListTopText}
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('DeathAnniversaries')}
          style={deathNewsStyles.anniversaryBtn}>
          <Text style={deathNewsStyles.anniversaryBtnTxt}>
            Today's Death Anniversaries
          </Text>
          <RightArrowIcn styles={{color: colors.secondryColor}} />
        </TouchableOpacity>
      </View>
      {renderDeathNewsList()}
    </SafeAreaView>
  );
}

const mapStateToProps = state => {
  return {deathNews: state.reducer.deathNews};
};
export default connect(mapStateToProps)(DeathNewsScreen);
