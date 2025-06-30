import React, {useState} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import KpsiajContact from '../Tabs/ConnectUs/Kpsiaj';
import FenContact from '../Tabs/ConnectUs/Fen';
import FhContact from '../Tabs/ConnectUs/Fh';
import {tabStyles} from '../Styles';

export default function ConnectUsComp() {
  const [kpsiajContact, setKpsiajContact] = useState(true);
  const [fenContact, setFenContact] = useState(false);
  const [fhContact, setFhContact] = useState(false);

  function changeTab(tab) {
    switch (tab) {
      case 'kpsiaj':
        setKpsiajContact(true);
        setFenContact(false);
        setFhContact(false);
        break;
      case 'fen':
        setKpsiajContact(false);
        setFenContact(true);
        setFhContact(false);
        break;
      case 'fh':
        setKpsiajContact(false);
        setFenContact(false);
        setFhContact(true);
        break;
      default:
        setKpsiajContact(true);
        setFenContact(false);
        setFhContact(false);
    }
  }

  return (
    <View style={tabStyles.container}>
      <View style={tabStyles.main}>
        <TouchableOpacity
          onPress={() => {
            changeTab('kpsiaj');
          }}
          style={kpsiajContact ? tabStyles.activeTab : tabStyles.tab}>
          <Text style={tabStyles.text}>KPSIAJ Contact</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            changeTab('fen');
          }}
          style={fenContact ? tabStyles.activeTab : tabStyles.tab}>
          <Text style={tabStyles.text}>FEN Contact</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            changeTab('fh');
          }}
          style={fhContact ? tabStyles.activeTab : tabStyles.tab}>
          <Text style={tabStyles.text}>FH Contact</Text>
        </TouchableOpacity>
      </View>
      <View style={tabStyles.main2}>
        {kpsiajContact && <KpsiajContact />}
        {fenContact && <FenContact />}
        {fhContact && <FhContact />}
      </View>
    </View>
  );
}
