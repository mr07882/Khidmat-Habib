import React, {useState} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
// import Constitution from '../Tabs/Downloads/Constitution';
import WebViewComp from './WebViewComp';
import {connect} from 'react-redux';
import {tabStyles} from '../Styles';

function DownloadsComp({downloads}) {
  const [tab, setTab] = useState(true);
  const [forms, setForms] = useState(false);
  const [constitution, setConstitution] = useState(false);

  function changeTab(tab) {
    switch (tab) {
      case 'tab':
        setTab(true);
        setForms(false);
        setConstitution(false);
        break;
      case 'forms':
        setTab(false);
        setForms(true);
        setConstitution(false);
        break;
      case 'constitution':
        setTab(false);
        setForms(false);
        setConstitution(true);
        break;
      default:
        setTab(true);
        setForms(false);
        setConstitution(false);
    }
  }
  return (
    <View style={tabStyles.container}>
      <View style={tabStyles.main}>
        {downloads.newsLetter.status ? (
          <TouchableOpacity
            onPress={() => {
              changeTab('tab');
            }}
            style={tab ? tabStyles.activeTab : tabStyles.tab}>
            <Text style={tabStyles.text}>{downloads.newsLetter.label}</Text>
          </TouchableOpacity>
        ) : (
          <></>
        )}
        <TouchableOpacity
          onPress={() => {
            changeTab('forms');
          }}
          style={forms ? tabStyles.activeTab : tabStyles.tab}>
          <Text style={tabStyles.text}>Forms</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            changeTab('constitution');
          }}
          style={constitution ? tabStyles.activeTab : tabStyles.tab}>
          <Text style={tabStyles.text}>Constitution</Text>
        </TouchableOpacity>
      </View>
      <View style={tabStyles.main2}>
        {downloads.newsLetter.status && tab ? (
          <WebViewComp url={downloads.newsLetter.link} />
        ) : (
          <></>
        )}
        {/* {tab && <WebViewComp url={'https://kpsiajapp.web.app/NewsLetterContainer'} />} */}

        {forms ? <WebViewComp url={downloads.forms} /> : <></>}
        {/* {forms && <WebViewComp url={'https://kpsiajapp.web.app/FormsContainer'} />} */}

        {constitution ? <WebViewComp url={downloads.constitution} /> : <></>}
      </View>
    </View>
  );
}

const mapStateToProps = state => {
  return {downloads: state.reducer.downloads};
};
export default connect(mapStateToProps)(DownloadsComp);
