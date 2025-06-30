import React from 'react';
import {View, ScrollView, Linking} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {contactUsStyles} from '../../Styles';
import {Text} from '../../Components/core';

let FhContact = () => {
  return (
    <View style={contactUsStyles.container}>
      <ScrollView style={contactUsStyles.scroll}>
        <View style={{paddingBottom: 50}}>
          <Text style={contactUsStyles.heading}>FATIMIYAH HOSPITAL</Text>
          <Text style={contactUsStyles.subHeading}>
            272/2-3, Britto Rd, Garden East, Soldier Bazar 3, Karachi
          </Text>
          <View style={contactUsStyles.touchable}>
            <Icon name="phone-square" style={contactUsStyles.icn} />
            <Text
              style={contactUsStyles.txt}
              onPress={() => {
                Linking.openURL(`tel:${'+92 21 111012014'}`);
              }}>
              +92 21 111012014
            </Text>
          </View>
          <View style={contactUsStyles.touchable}>
            <Icon name="facebook-square" style={contactUsStyles.icn} />
            <Text
              style={contactUsStyles.txt}
              onPress={() => {
                Linking.openURL('fb://page/955164577951349');
              }}>
              Facebook
            </Text>
          </View>
          <View style={contactUsStyles.touchable}>
            <Icon name="globe" style={contactUsStyles.icn} />
            <Text
              style={contactUsStyles.txt}
              onPress={() => Linking.openURL('https://www.fh.org.pk')}>
              Website
            </Text>
          </View>

          <View style={contactUsStyles.touchable}>
            <Icon name="envelope-open" style={contactUsStyles.icn} />
            <Text style={contactUsStyles.tx}>
              {`General Inquiries - `}
              <Text
                style={contactUsStyles.txt}
                onPress={() => Linking.openURL('mailto:info@fh.org.pk')}>
                info@fh.org.pk
              </Text>
            </Text>
          </View>
          <View style={contactUsStyles.touchable}>
            <Text style={contactUsStyles.txP}>
              {`Careers - `}
              <Text
                style={contactUsStyles.txt}
                onPress={() => Linking.openURL('mailto:hr@fh.org.pk')}>
                hr@fh.org.pk
              </Text>
            </Text>
          </View>
          <View style={contactUsStyles.touchable}>
            <Text style={contactUsStyles.txP}>
              {`Feedback - `}
              <Text
                style={contactUsStyles.txt}
                onPress={() => Linking.openURL('mailto:feedback@fh.org.pk')}>
                feedback@fh.org.pk
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

FhContact = React.memo(FhContact);

export default FhContact;
