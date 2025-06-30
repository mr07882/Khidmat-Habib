import * as React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {onDownload, onShare} from '../../Functions/Functions';
import Pdf from 'react-native-pdf';
import {Text} from '../../Components/core';

let Constitution = url => {
  // let url =
  //   'https://kpsiaj.org/wp-content/uploads/2019/08/Constitution_and_Bye_Laws.pdf';

  const renderButtons = () => {
    let type = 'application/pdf';
    return (
      <View style={styles.btnContainer}>
        <TouchableOpacity
          onPress={() => onDownload(url, type)}
          style={styles.btn}>
          <Icon name="download" style={{fontSize: 22, color: '#725054'}} />
          <Text style={styles.btnTxt}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onShare(url, type)} style={styles.btn}>
          <Icon name="share-square" style={{fontSize: 22, color: '#725054'}} />
          <Text style={styles.btnTxt}>Share</Text>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <View style={{flex: 1}}>
      <Pdf
        trustAllCerts={false}
        ref={pdf => {
          this.pdf = pdf;
        }}
        source={{
          uri: url,
          cache: true,
        }}
        style={{
          flex: 1,
          backgroundColor: '#725054',
        }}
      />
      {renderButtons()}
    </View>
  );
};
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

Constitution = React.memo(Constitution);

export default Constitution;
