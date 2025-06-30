import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  useWindowDimensions,
  TouchableOpacity,
  Text,
} from 'react-native';
import {connect} from 'react-redux';
import RenderHtml from 'react-native-render-html';
import {donateUsStyles, navigatorStyles} from '../Config/StylesCss';
import {WebViewComp} from '../Components';
import {NavBackIcn} from '../Helpers/icons';
import Loader from '../Components/Loader';
import {renderHtmlStyles} from '../Styles';

function DonateUs(props) {
  const {width} = useWindowDimensions();
  const [loader, setLoader] = useState(true);

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

  useEffect(() => {
    props.navigation.setOptions({
      headerLeft: () => (
        <View style={navigatorStyles.headerLeft.container}>
          <TouchableOpacity
            style={navigatorStyles.headerLeft.backBtn}
            onPress={() => {
              props.navigation.goBack();
            }}>
            <NavBackIcn />
            <Text style={navigatorStyles.headerLeft.txt}>
              {props.donateUs.label !== '' ? props.donateUs.label : 'Donate'}
            </Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, []);

  useEffect(() => {
    setLoader(false);
  }, []);
  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <>
          {props.donateUs.webViewLink !== '' ? (
            <WebViewComp url={props.donateUs.webViewLink} />
          ) : (
            <View style={donateUsStyles.container}>
              <ScrollView style={donateUsStyles.scroll}>
                <View style={donateUsStyles.txt}>
                  <RenderHtml
                    source={{html: props.donateUs.html}}
                    renderersProps={renderersProps}
                    contentWidth={width}
                    systemFonts={['Poppins-Regular', 'Poppins-SemiBold']}
                    tagsStyles={renderHtmlStyles}
                    ignoredDomTags={['br']}
                    textSelectable={true}
                  />
                </View>
              </ScrollView>
            </View>
          )}
        </>
      )}
    </>
  );
}

const mapStateToProps = state => {
  return {donateUs: state.reducer.donateUs};
};
export default connect(mapStateToProps)(DonateUs);
