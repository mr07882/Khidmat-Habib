import React, {useEffect} from 'react';
import {WebViewComp} from '../Components';
import {HeaderLeft} from '../Navigation/components';

const ExtraBtns = ({navigation, route}) => {
  const {title, url, headers} = route.params;

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <HeaderLeft name={title ? title : 'Back'} />,
    });
  }, []);
  return <WebViewComp url={url} headers={{headers: headers}} />;
};

export default ExtraBtns;
