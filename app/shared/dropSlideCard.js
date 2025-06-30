import React, {useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Animated,
  useWindowDimensions,
} from 'react-native';
import {FONTS, COLORS, SIZES} from '../constants';
import RenderHtml from 'react-native-render-html';
import {renderHtmlStyles} from '../Styles';
import {Text} from '../Components/core';

export const DropSlideCard = props => {
  const {content, isHtml, mainTitle, navigation} = props;
  const [isHidden, setIsHidden] = useState(true);
  const [toggleCard, setToggleCard] = useState(false);
  const [bounceValue, setBounceValue] = useState(new Animated.Value(0));
  const {width} = useWindowDimensions();

  const renderersProps = {
    a: {
      onPress(event, url, htmlAttribs, target) {
        // Do stuff
        navigation.push('WebViewByLink', {
          WebViewLink: url,
          html: '',
          label: 'Go Back',
          isLink: true,
          isHtml: false,
        });
      },
    },
  };

  function _toggleSubview() {
    var toValue = 0;

    if (isHidden) {
      toValue = 50;
    } else {
      setBounceValue(new Animated.Value(0));
    }

    //This will animate the transalteY of the subview between 0 & 100 depending on its current state
    //100 comes from the style below, which is the height of the subview.
    Animated.spring(bounceValue, {
      toValue: toValue,
      velocity: 3,
      tension: 2,
      friction: 8,
      useNativeDriver: true,
    }).start();
    setIsHidden(!isHidden);
    // setBounceValue(new Animated.Value(100))
  }
  return (
    <>
      <TouchableOpacity
        activeOpacity={0.7}
        style={[
          styles.header,
          {position: 'absolute', top: 0, left: 0, zIndex: 100, margin: 15},
        ]}
        onPress={() => {
          // setanimatedStyle(animationStyle === 'slideOutUp' ? 'slideInUp' : 'slideOutUp')
          // setTimeout(() => {
          _toggleSubview();

          // }, 200);
        }}>
        <Text
          style={
            (styles.headerText,
            {
              ...FONTS.h1_m,
              textDecorationLine: 'underline',
              color: '#725054',
              fontFamily: 'Poppins-SemiBold',
            })
          }>
          {`${isHidden ? 'Show' : 'Hide'} ${mainTitle}`}
        </Text>
      </TouchableOpacity>
      {!isHidden && (
        <Animated.ScrollView
          style={[styles.subView, {transform: [{translateY: bounceValue}]}]}>
          {isHtml && (
            <RenderHtml
              source={{html: content}}
              renderersProps={renderersProps}
              contentWidth={width}
              systemFonts={['Poppins-Regular', 'Poppins-SemiBold']}
              tagsStyles={renderHtmlStyles}
              ignoredDomTags={['br']}
              textSelectable={true}
            />
          )}
        </Animated.ScrollView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  subView: {
    padding: 7,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    zIndex: 100,
    // height: '100%'
  },
  container: {flex: 1, backgroundColor: COLORS.white},
  section1: {
    width: '60%',
    alignSelf: 'center',
    alignItems: 'center',
    paddingBottom: '2%',
  },
  formSection: {paddingTop: '10%'},
  themeSection: {display: 'flex', flexDirection: 'row', marginBottom: '5%'},
  socialMediaTextSection: {marginBottom: '6%'},

  _row: {flexDirection: 'row', marginBottom: SIZES.height * 0.05},
  _col1: {flex: 0.8, marginRight: '2%'},
  _col2: {flex: 0.8},
  themeSectioncol1: {flex: 0.2},

  body3_m: {...FONTS.body3_m, letterSpacing: 0.13, color: COLORS.black1},
  body4_m: {
    ...FONTS.body4_m,
    color: COLORS.black1,
    letterSpacing: 0.1,
    textAlign: 'center',
  },
  body4_m_gray8: {...FONTS.body4_m, letterSpacing: 0.1, color: COLORS.gray8},
  body4_m_gray4: {
    ...FONTS.body4_m,
    letterSpacing: 0.17,
    lineHeight: 17,
    color: COLORS.gray4,
  },
  body4_m_gray5: {
    ...FONTS.body4_m,
    letterSpacing: 0.11,
    lineHeight: 17,
    color: COLORS.gray5,
    width: '80%',
  },

  labelStyle: {paddingBottom: '4%'},
  textInput: {marginBottom: '6%', width: '100%'},

  small_r: {
    ...FONTS.small_r,
    lineHeight: 16,
    letterSpacing: 0.32,
    color: COLORS.black1,
    paddingBottom: '2%',
  },
  xsmall_m: {...FONTS.xsmall_m, color: COLORS.gray3, letterSpacing: 0.27},
  xsmall_b: {...FONTS.xsmall_b, fontWeight: 'bold'},
  h_m: {
    ...FONTS.h_m,
    lineHeight: 24,
    letterSpacing: 0.17,
    color: COLORS.black1,
  },

  h3_m: {
    textAlign: 'center',
    ...FONTS.h3_m,
    color: COLORS.gray4,
    letterSpacing: 0.13,
  },
  h3_m_u: {
    ...FONTS.h3_m,
    letterSpacing: 0.13,
    color: COLORS.black1,
    textDecorationLine: 'underline',
    marginTop: -4,
    paddingBottom: 10,
  },
  _profileImage: {
    borderRadius: 2,
    height: SIZES.height * 0.38,
    width: '40%',
    backgroundColor: COLORS.lightGray3,
    borderWidth: 2.1,
    marginTop: '2%',
  },
  dashedBorder: {borderStyle: 'dashed'},

  addInputBtnLabelStyle: {width: '100%'},

  btnRight: {...FONTS.h1_b, color: COLORS.gray3},

  body: {padding: '2%'},

  header: {
    // backgroundColor: COLORS.white,
    // display: "flex",
    // flexDirection: "column",
    // justifyContent: "center",
    // alignItems: "center",
    // paddingLeft: 15,
    // paddingRight: 15,
    // borderRadius: 10,
    // zIndex: 100,
    // position: "absolute",
    // top: 0,
    // right: 0,
    // left: 0,
    // height: 70,
    // zIndex: 50,
  },
  headerText: {
    ...FONTS.h1_m,
    color: COLORS.black1,
    lineHeight: 24,
    letterSpacing: 0.15,
  },
  headerRightImage: {
    width: 24,
    height: 26,
  },
  headerRightBtn: {
    ...FONTS.h1_m,
    color: COLORS.black1,
    lineHeight: 24,
    letterSpacing: 0.15,
  },
  videoContainer: {width: 140, height: 200, margin: 10, marginTop: 5},
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    zIndex: 20,
    backgroundColor: 'black',
  },
  videoPausBtn: {
    zIndex: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  forIcon: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
