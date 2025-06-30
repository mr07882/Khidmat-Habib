import React from 'react';
import {connect} from 'react-redux';
import {View, ScrollView, useWindowDimensions} from 'react-native';
import RenderHtml from 'react-native-render-html';
import {aboutUsStyles, renderHtmlStyles} from '../Styles';

function AboutUs(props) {
  const {width} = useWindowDimensions();

  const renderersProps = {
    a: {
      onPress(event, url, htmlAttribs, target) {
        // Do stuff
        props.navigation.push('WebViewByLink', {
          WebViewLink: url,
          html: '',
          label: 'Go Back',
          isLink: true,
          isHtml: false,
        });
      },
    },
  };
  return (
    <View style={aboutUsStyles.container}>
      <ScrollView style={aboutUsStyles.scroll}>
        <View style={aboutUsStyles.txt}>
          {!!props.aboutUs && !!props.aboutUs.text && (
            <RenderHtml
              source={{html: props.aboutUs.text}}
              renderersProps={renderersProps}
              contentWidth={width}
              systemFonts={['Poppins-Regular', 'Poppins-SemiBold']}
              tagsStyles={renderHtmlStyles}
              ignoredDomTags={['br']}
              textSelectable={true}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const mapStateToProps = state => {
  return {aboutUs: state.reducer.aboutUs};
};
export default connect(mapStateToProps)(AboutUs);
