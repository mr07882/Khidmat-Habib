import React, {useState} from 'react';
import {
  SafeAreaView,
  useWindowDimensions,
  ScrollView,
  Image,
  View,
  TouchableOpacity,
} from 'react-native';
import RenderHtml from 'react-native-render-html';
import Pdf from 'react-native-pdf';
import Video from 'react-native-video';
import {onDownload, onShare, onShareDeathNews} from '../Functions/Functions';
import {
  DeathNewsDownloadIcn,
  DeathNewsShareIcn,
  FullScreenIcn,
} from '../Helpers/icons';
import {newsEventsDetailStyles} from '../Config/StylesCss';
import {Text} from './core';
import {renderHtmlStyles} from '../Styles';

export default function NewsEventsDetailComp({navigation}) {
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const {width} = useWindowDimensions();

  const renderMedia = (imageUrls, imageUrl) => {
    if ((imageUrls && imageUrls.length) || imageUrl) {
      let type = '';
      let url = '';
      if (imageUrls && imageUrls.length) {
        type = imageUrls && imageUrls.length && imageUrls[0].type;
        url = imageUrls && imageUrls.length && imageUrls[0].url;
      } else if (imageUrl) {
        type = imageUrl && imageUrl.type;
        url = imageUrl && imageUrl.url;
      }
      switch (type) {
        case 'application/pdf':
          return <Pdf source={{uri: url}} style={newsEventsDetailStyles.pdf} />;
        case 'video/mp4':
          return (
            <Video
              source={{uri: url}} // Can be a URL or a local file.
              style={newsEventsDetailStyles.video}
              controls={true}
              paused={isVideoPaused}
              resizeMode="contain"
            />
          );
        case 'image/png':
        case 'image/jpg':
        case 'image/jpeg':
        case 'image/gif':
        case 'image/webp':
          return (
            <Image source={{uri: url}} style={newsEventsDetailStyles.img} />
          );
      }
    }
  };

  const renderersProps = {
    a: {
      onPress(event, url) {
        // Do stuff
        navigation.navigation.navigate('WebViewByLink', {
          WebViewLink: url,
          html: '',
          label: 'Go Back',
          isLink: true,
          isHtml: false,
        });
      },
    },
  };

  const renderText = text => {
    return (
      <RenderHtml
        source={{html: text}}
        renderersProps={renderersProps}
        contentWidth={width}
        systemFonts={['Poppins-Regular', 'Poppins-SemiBold']}
        tagsStyles={renderHtmlStyles}
        ignoredDomTags={['br']}
        textSelectable={true}
      />
    );
  };

  const handleVideo = media => {
    setIsVideoPaused(true);
    navigation.navigation.navigate('Media', media);
  };

  const renderButtons = (media, html) => {
    let display = 'flex';
    let type;
    let url;

    let text = html.replace(/<[^>]+>/g, '');
    text = text.replace(/&nbsp;/g, '');

    if (media !== undefined) {
      type = media[0].type;
      url = media[0].url;
    } else {
      display = 'none';
    }
    return (
      <View style={newsEventsDetailStyles.btnContainer}>
        <TouchableOpacity
          onPress={() => onDownload(url, type)}
          style={[newsEventsDetailStyles.btn, {display}]}>
          <DeathNewsDownloadIcn />
          <Text style={newsEventsDetailStyles.btnTxt}>Save</Text>
        </TouchableOpacity>

        {media === undefined ? (
          <TouchableOpacity
            onPress={() => onShareDeathNews(text, '')}
            style={newsEventsDetailStyles.btn}>
            <DeathNewsShareIcn />
            <Text style={newsEventsDetailStyles.btnTxt}>Share News</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => onShare(url, type)}
            style={newsEventsDetailStyles.btn}>
            <DeathNewsShareIcn />
            <Text style={newsEventsDetailStyles.btnTxt}>Share</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => handleVideo(media)}
          style={[newsEventsDetailStyles.btn, {display: display}]}>
          <FullScreenIcn />
          <Text style={newsEventsDetailStyles.btnTxt}>Full Screen</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const DetaileventNews = navigation.route.params.DetaileventNews;
  const {imageUrls, text, imageUrl} = DetaileventNews;

  return (
    <View style={newsEventsDetailStyles.mainscreen}>
      <SafeAreaView style={newsEventsDetailStyles.scroll}>
        <ScrollView>
          <View style={newsEventsDetailStyles.main}>
            {renderMedia(imageUrls, imageUrl)}
            <View style={{padding: 10}}>{text && renderText(text)}</View>
          </View>
        </ScrollView>
      </SafeAreaView>
      {renderButtons(imageUrls, text)}
    </View>
  );
}
