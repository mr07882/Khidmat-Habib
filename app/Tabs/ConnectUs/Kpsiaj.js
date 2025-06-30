import React from 'react';
import {View, ScrollView, Linking} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {contactUsStyles} from '../../Styles';
import {Text} from '../../Components/core';

let KpsiajContact = () => {
  return (
    <View style={contactUsStyles.container}>
      <ScrollView style={contactUsStyles.scroll}>
        <View style={{paddingBottom: 50}}>
          <Text style={contactUsStyles.heading}>
            THE KHOJA (PIRHAI) SHIA ISNA ASHERI JAMAAT
          </Text>
          <Text style={contactUsStyles.subHeading}>
            Khoja Jamaat Complex
            {'\n\n'}
            174 - Britto Road,Near Old Numaish,
            {'\n'}
            Soldier Bazaar, Karachi-74800 (Pakistan)
          </Text>
          <View style={contactUsStyles.touchable}>
            <Icon name="phone-square" style={contactUsStyles.icn} />
            <Text
              style={contactUsStyles.txt}
              onPress={() => {
                Linking.openURL(`tel:${'+92 21 32254214'}`);
              }}>
              +92 21 32254214
            </Text>
          </View>
          <View style={contactUsStyles.touchable}>
            <Icon name="phone-square" style={contactUsStyles.icn} />
            <Text
              style={contactUsStyles.txt}
              onPress={() => {
                Linking.openURL(`tel:${'‎+92 21 32233278'}`);
              }}>
              ‎+92 21 32233278
            </Text>
          </View>
          <View style={contactUsStyles.touchable}>
            <Icon name="phone-square" style={contactUsStyles.icn} />
            <Text
              style={contactUsStyles.txt}
              onPress={() => {
                Linking.openURL(`tel:${'+92 21 32233273'}`);
              }}>
              +92 21 32233273
            </Text>
          </View>
          <View style={contactUsStyles.touchable}>
            <Icon name="phone-square" style={contactUsStyles.icn} />
            <Text
              style={contactUsStyles.txt}
              onPress={() => {
                Linking.openURL(`tel:${'+92 21 32233274'}`);
              }}>
              +92 21 32233274
            </Text>
          </View>
          <View style={contactUsStyles.touchable}>
            <Icon name="phone-square" style={contactUsStyles.icn} />
            <Text
              style={contactUsStyles.txt}
              onPress={() => {
                Linking.openURL(`tel:${'‎+92 21 32257579'}`);
              }}>
              ‎+92 21 32257579
            </Text>
          </View>
          <View style={contactUsStyles.touchable}>
            <Icon name="phone-square" style={contactUsStyles.icn} />
            <Text
              style={contactUsStyles.txt}
              onPress={() => {
                Linking.openURL(`tel:${'+92 21 32233275'}`);
              }}>
              +92 21 32233275
            </Text>
          </View>
          <View style={contactUsStyles.touchable}>
            <Icon name="whatsapp" style={contactUsStyles.icn} />
            <Text
              style={contactUsStyles.txt}
              onPress={() => {
                Linking.openURL('whatsapp://send?phone=+92 334 3913770');
              }}>
              +92 334 3913770
            </Text>
          </View>
          <View style={contactUsStyles.touchable}>
            <Icon name="facebook-square" style={contactUsStyles.icn} />
            <Text
              style={contactUsStyles.txt}
              onPress={() => {
                Linking.openURL('fb://page/254059321457936');
              }}>
              Facebook
            </Text>
          </View>
          <View style={contactUsStyles.touchable}>
            <Icon name="globe" style={contactUsStyles.icn} />
            <Text
              style={contactUsStyles.txt}
              onPress={() => Linking.openURL('https://kpsiaj.org/')}>
              Website
            </Text>
          </View>
          <View style={contactUsStyles.touchable}>
            <Icon name="youtube" style={contactUsStyles.icn} />
            <Text
              style={contactUsStyles.txt}
              onPress={() => {
                Linking.openURL(
                  'vnd.youtube://www.youtube.com/channel/UCdft3Z35RG2U2VoJo7HHXIw',
                );
              }}>
              Youtube
            </Text>
          </View>
          <View style={contactUsStyles.touchable}>
            <Icon name="envelope-open" style={contactUsStyles.icn} />
            <Text style={contactUsStyles.tx}>
              {`General Queries - `}
              <Text
                style={contactUsStyles.txt}
                onPress={() =>
                  Linking.openURL('mailto:secretariat@kpsiaj.org')
                }>
                secretariat@kpsiaj.org
              </Text>
            </Text>
          </View>
          <View style={contactUsStyles.touchable}>
            <Text style={contactUsStyles.txP}>
              {`Hon. Secretary - `}
              <Text
                style={contactUsStyles.txt}
                onPress={() => Linking.openURL('mailto:secretary@kpsiaj.org')}>
                secretary@kpsiaj.org
              </Text>
            </Text>
          </View>
          <View style={contactUsStyles.touchable}>
            <Text style={contactUsStyles.txP}>
              {`Chief Operating Officer - `}
              <Text
                style={contactUsStyles.txt}
                onPress={() => Linking.openURL('mailto:coo@kpsiaj.org')}>
                coo@kpsiaj.org
              </Text>
            </Text>
          </View>
          <View style={contactUsStyles.touchable}>
            <Text style={contactUsStyles.txP}>
              {`Family Relations Committee - `}
              <Text
                style={contactUsStyles.txt}
                onPress={() => Linking.openURL('mailto:frc@kpsiaj.org')}>
                frc@kpsiaj.org
              </Text>
            </Text>
          </View>
          <View style={contactUsStyles.touchable}>
            <Text style={contactUsStyles.txP}>
              {`Fatimiyah Sports Complex - `}
              <Text
                style={contactUsStyles.txt}
                onPress={() => Linking.openURL('mailto:fsc@kpsiaj.org')}>
                fsc@kpsiaj.org
              </Text>
            </Text>
          </View>
          <View style={contactUsStyles.touchable}>
            <Text style={contactUsStyles.txP}>
              {`KPSIAJ Women Wing - `}
              <Text
                style={contactUsStyles.txt}
                onPress={() => Linking.openURL('mailto:womenwing@kpsiaj.org')}>
                womenwing@kpsiaj.org
              </Text>
            </Text>
          </View>
          <View style={contactUsStyles.touchable}>
            <Text style={contactUsStyles.txP}>
              {`Jobs and Recruitment - `}
              <Text
                style={contactUsStyles.txt}
                onPress={() => Linking.openURL('mailto:hrc@kpsiaj.org')}>
                hrc@kpsiaj.org
              </Text>
            </Text>
          </View>
          <View style={contactUsStyles.touchable}>
            <Text style={contactUsStyles.txP}>
              {`Fatimiyah Community Center - `}
              <Text
                style={contactUsStyles.txt}
                onPress={() => Linking.openURL('mailto:fcc@kpsiaj.org')}>
                fcc@kpsiaj.org
              </Text>
            </Text>
          </View>
          <View style={contactUsStyles.touchable}>
            <Text style={contactUsStyles.txP}>
              {`Feedback - `}
              <Text
                style={contactUsStyles.txt}
                onPress={() => Linking.openURL('mailto:feedback@kpsiaj.org')}>
                feedback@kpsiaj.org
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

KpsiajContact = React.memo(KpsiajContact);

export default KpsiajContact;
