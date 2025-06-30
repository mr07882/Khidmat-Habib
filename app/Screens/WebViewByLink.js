import React, {useEffect} from 'react';
import {View, useWindowDimensions, BackHandler} from 'react-native';
import {WebViewComp} from '../Components';
import RenderHTML from 'react-native-render-html';
import {renderHtmlStyles} from '../Styles';
import {HeaderLeft} from '../Navigation/components';

const WebViewByLink = ({navigation, route}) => {
  const {width} = useWindowDimensions();
  const {params} = route;

  const renderersProps = {
    a: {
      onPress(event, url) {
        // Do stuff
        navigation.navigate('WebViewByLink', {
          WebViewLink: url,
          label: 'Back',
        });
      },
    },
  };

  const backAction = () => {
    if (params.navigate) {
      navigation.navigate(params.navigate);
      return true;
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderLeft
          name={params.label !== '' ? params.label : 'Back'}
          route={params.navigate ? params.navigate : ''}
        />
      ),
    });

    if (params.navigate) {
      BackHandler.addEventListener('hardwareBackPress', backAction);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', backAction);
    }
  }, []);

  return !!params.isLink ? (
    <WebViewComp
      url={params.WebViewLink}
      headers={params.headers ? params.headers : null}
    />
  ) : !!params.isHtml ? (
    <RenderHTML
      source={{html: params.html}}
      renderersProps={renderersProps}
      contentWidth={width}
      systemFonts={['Poppins-Regular', 'Poppins-SemiBold']}
      tagsStyles={renderHtmlStyles}
      ignoredDomTags={['br']}
      textSelectable={true}
    />
  ) : (
    <View></View>
  );
};
export default WebViewByLink;
