import React from 'react';
import {renderHtmlStyles} from '../../Styles';
import {Linking, useWindowDimensions} from 'react-native';
import RenderHTML from 'react-native-render-html';

const DisplayHTML = ({html = '', navigation = ''}) => {
  const {width} = useWindowDimensions();

  const renderersProps = {
    a: {
      onPress(event, href) {
        if (href.startsWith('mailto:')) {
          Linking.openURL(href);
        } else {
          navigation.navigate('WebViewByLink', {
            WebViewLink: href,
            label: 'Back',
          });
        }
      },
    },
  };

  if (html) {
    let unescapeStr = html
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");

    return (
      <RenderHTML
        source={{html: unescapeStr}}
        renderersProps={renderersProps}
        contentWidth={width}
        systemFonts={['Poppins-Regular', 'Poppins-SemiBold']}
        tagsStyles={renderHtmlStyles}
        ignoredDomTags={['br']}
        textSelectable={true}
      />
    );
  }

  return null;
};

export default DisplayHTML;
