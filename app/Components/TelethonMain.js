import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import WebViewComp from './WebViewComp';
import TelethonForm from './TelethonForm';
import {Text} from './core';

export default function TelethonMain({setIsUserLogin}) {
  const [pledge, setPledge] = useState(true);
  const [details, setDetails] = useState(false);

  const changeTab = tab => {
    switch (tab) {
      case 'pledge':
        setPledge(true);
        setDetails(false);
        break;
      case 'details':
        setPledge(false);
        setDetails(true);
        break;
      default:
        setPledge(true);
        setDetails(false);
    }
  };
  return (
    <View style={{height: '100%'}}>
      <View
        style={{
          backgroundColor: '#ECEAE4',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => {
            changeTab('pledge');
          }}
          style={pledge ? styles.activeTab : styles.tab}>
          <Text
            style={{
              fontWeight: 'bold',
              color: '#725054',
            }}>
            Pledge
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            changeTab('details');
          }}
          style={details ? styles.activeTab : styles.tab}>
          <Text
            style={{
              fontWeight: 'bold',
              color: '#725054',
            }}>
            Details
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{flex: 1}}>
        {pledge && <TelethonForm setIsUserLogin={setIsUserLogin} />}
        {details && (
          <View
            style={{flex: 1, paddingHorizontal: 10, backgroundColor: 'white'}}>
            <WebViewComp url={'https://kpsiaj.org/kpsiaj-telethon'} />
          </View>
        )}
        {/* {details && <WebViewComp url={'https://kpsiajapp.web.app/TelethoneDetailsContainer'} />} */}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  activeTab: {
    paddingTop: 10,
    paddingBottom: 10,
    flex: 1,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#725054',
  },
  tab: {paddingTop: 10, paddingBottom: 10, flex: 1, alignItems: 'center'},
});
