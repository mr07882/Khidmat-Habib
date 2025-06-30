import React, {useEffect, useState, createRef} from 'react';
import {WebView} from 'react-native-webview';
import {
  LogBox,
  StyleSheet,
  View,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {connect} from 'react-redux';
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome';
import Pdf from 'react-native-pdf';
import {displayNetworkError, onDownload, onShare} from '../Functions/Functions';
import Loader from './Loader';
import {Text} from './core';

LogBox.ignoreLogs(['Encountered an error loading page']);

function WebViewComp(props) {
  let web = createRef();
  const [loader, setLoader] = useState(true);
  const [networkStatuse, setNetworkStatuse] = useState(true);

  useEffect(() => {
    setNetworkStatuse(props.networkStatuse);
  });
  const errorHandling = error => {
    if (error.nativeEvent.description === 'net::ERR_FAILED') {
      web.reload();
    }
  };

  const renderButtons = () => {
    let type = 'application/pdf';
    return (
      <View style={styles.btnContainer}>
        <TouchableOpacity
          onPress={() => onDownload(props.url, type)}
          style={styles.btn}>
          <FontAwesomeIcons
            name="download"
            style={{fontSize: 22, color: '#725054'}}
          />
          <Text style={styles.btnTxt}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onShare(props.url, type)}
          style={styles.btn}>
          <FontAwesomeIcons
            name="share-square"
            style={{fontSize: 22, color: '#725054'}}
          />
          <Text style={styles.btnTxt}>Share</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderWebView = () => {
    let search = false;
    let text = props.url.toString();
    let find = text.search('.pdf');

    if (find !== -1) {
      search = true;
    }

    return search ? (
      <View style={{flex: 1}}>
        <Pdf
          trustAllCerts={false}
          ref={pdf => {
            this.pdf = pdf;
          }}
          source={{
            uri: props.url,
            cache: true,
          }}
          style={{
            flex: 1,
            backgroundColor: '#725054',
          }}
        />
        {renderButtons()}
      </View>
    ) : (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <WebView
          ref={ref => (web = ref)}
          source={
            props.headers && props.headers !== ''
              ? {uri: props.url, headers: props.headers}
              : {uri: props.url}
          }
          onError={e => errorHandling(e)}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onLoad={() => setLoader(false)}
          style={{
            marginTop: loader ? 0 : 20,
          }}
        />
        {loader ? <Loader /> : <></>}
      </SafeAreaView>
    );
  };
  return networkStatuse ? renderWebView() : displayNetworkError();
}

const styles = StyleSheet.create({
  btnContainer: {flexDirection: 'row', position: 'relative', bottom: 0},
  btn: {
    flex: 1,
    backgroundColor: '#ECEAE4',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  btnTxt: {color: '#725054', fontSize: 14},
});

const mapStateToProps = state => {
  return {networkStatuse: state.reducer.networkStatuse};
};
export default connect(mapStateToProps)(WebViewComp);
