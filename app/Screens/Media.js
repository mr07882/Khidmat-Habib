import React from 'react';
import {Image, View} from 'react-native';
import Pdf from 'react-native-pdf';
import Video from 'react-native-video';

export default function Media(props) {
  const media = props.route.params;

  const renderMedia = () => {
    let type = media[0].type;
    let url = media[0].url;
    switch (type) {
      case 'application/pdf':
        return (
          <Pdf
            source={{uri: url, cache: true}}
            style={{flex: 1, backgroundColor: 'black'}}
          />
        );
      case 'video/mp4':
        return (
          <Video
            source={{uri: url}}
            controls={true}
            style={{flex: 1, backgroundColor: 'black'}}
            resizeMode="contain"
          />
        );
      case 'image/png':
      case 'image/jpg':
      case 'image/jpeg':
      case 'image/gif':
      case 'image/webp':
        return (
          <Image
            style={{flex: 1, resizeMode: 'contain', backgroundColor: 'black'}}
            source={{uri: url}}
          />
        );
    }
  };

  return (
    <View style={{flex: 1}}>{media && media.length && renderMedia()}</View>
  );
}
