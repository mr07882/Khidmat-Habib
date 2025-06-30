import React from 'react';
import {View, ScrollView, Linking} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {contactUsStyles} from '../../Styles';
import {Text} from '../../Components/core';

let FenContact = () => {
  return (
    <View style={contactUsStyles.container}>
      <ScrollView style={contactUsStyles.scroll}>
        <View style={{paddingBottom: 50}}>
          <Text style={contactUsStyles.heading}>
            FATIMIYAH EDUCATION NETWORK
          </Text>
          <Text style={contactUsStyles.subHeading}>
            174 - Britto Road,Near Numaish, Karachi
          </Text>
          <Text style={contactUsStyles.subHeading}>
            Phone: {'\n'}
            FEN Admin, FMS, FBS, FGS, and FIES
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
          <Text style={contactUsStyles.subHeading}>Fatimiyah College</Text>
          <View style={contactUsStyles.touchable}>
            <Icon name="phone-square" style={contactUsStyles.icn} />
            <Text
              style={contactUsStyles.txt}
              onPress={() => {
                Linking.openURL(`tel:${'+92 21 32236704'}`);
              }}>
              +92 21 32236704
            </Text>
          </View>
          <View style={contactUsStyles.touchable}>
            <Icon name="phone-square" style={contactUsStyles.icn} />
            <Text
              style={contactUsStyles.txt}
              onPress={() => {
                Linking.openURL(`tel:${'‎+92 21 32221710'}`);
              }}>
              ‎+92 21 32221710
            </Text>
          </View>
          <View style={contactUsStyles.touchable}>
            <Icon name="phone-square" style={contactUsStyles.icn} />
            <Text
              style={contactUsStyles.txt}
              onPress={() => {
                Linking.openURL(`tel:${'+92 21 32221711'}`);
              }}>
              +92 21 32221711
            </Text>
          </View>
          <Text style={contactUsStyles.subHeading}>WhatsApp</Text>
          <View style={contactUsStyles.touchable}>
            <Icon name="whatsapp" style={contactUsStyles.icn} />
            <Text>
              {`FEN Admin - `}
              <Text
                style={contactUsStyles.txt}
                onPress={() => {
                  Linking.openURL('whatsapp://send?phone=+92 322 2516625');
                }}>
                +92 322 2516625
              </Text>
            </Text>
          </View>
          <View style={contactUsStyles.touchable}>
            <Icon name="whatsapp" style={contactUsStyles.icn} />
            <Text>
              {`FMS - `}
              <Text
                style={contactUsStyles.txt}
                onPress={() => {
                  Linking.openURL('whatsapp://send?phone=+92 330 2886810');
                }}>
                +92 330 2886810
              </Text>
            </Text>
          </View>
          <View style={contactUsStyles.touchable}>
            <Icon name="whatsapp" style={contactUsStyles.icn} />
            <Text>
              {`FIES - `}
              <Text
                style={contactUsStyles.txt}
                onPress={() => {
                  Linking.openURL('whatsapp://send?phone=+92 332 3067484');
                }}>
                +92 332 3067484
              </Text>
            </Text>
          </View>
          <View style={contactUsStyles.touchable}>
            <Icon name="facebook-square" style={contactUsStyles.icn} />
            <Text
              style={contactUsStyles.txt}
              onPress={() => {
                Linking.openURL('fb://page/303212876473897');
              }}>
              Facebook
            </Text>
          </View>
          <View style={contactUsStyles.touchable}>
            <Icon name="globe" style={contactUsStyles.icn} />
            <Text
              style={contactUsStyles.txt}
              onPress={() => Linking.openURL('http://fen.edu.pk')}>
              Website
            </Text>
          </View>

          <View style={contactUsStyles.touchable}>
            <Icon name="envelope-open" style={contactUsStyles.icn} />
            <Text style={contactUsStyles.tx}>
              {`General Inquiries - `}
              <Text
                style={contactUsStyles.txt}
                onPress={() => Linking.openURL('mailto:info@fen.edu.pk')}>
                info@fen.edu.pk
              </Text>
            </Text>
          </View>
          <View style={contactUsStyles.touchable}>
            <Text style={contactUsStyles.txP}>
              Fatimiyah Montessori System -
              <Text
                style={contactUsStyles.txt}
                onPress={() => Linking.openURL('mailto:fms@fen.edu.pk')}>
                fms@fen.edu.pk
              </Text>
            </Text>
          </View>
          <View style={contactUsStyles.touchable}>
            <Text style={contactUsStyles.txP}>
              {`Fatimiyah Boys School - `}
              <Text
                style={contactUsStyles.txt}
                onPress={() => Linking.openURL('mailto:fbs@fen.edu.pk')}>
                fbs@fen.edu.pk
              </Text>
            </Text>
          </View>
          <View style={contactUsStyles.touchable}>
            <Text style={contactUsStyles.txP}>
              {`Fatimiyah Girls School - `}
              <Text
                style={contactUsStyles.txt}
                onPress={() => Linking.openURL('mailto:fgs@fen.edu.pk')}>
                fgs@fen.edu.pk
              </Text>
            </Text>
          </View>
          <View style={contactUsStyles.touchable}>
            <Text style={contactUsStyles.txP}>
              {`Fatimiyah College - `}
              <Text
                style={contactUsStyles.txt}
                onPress={() => Linking.openURL('mailto:fc@fen.edu.pk')}>
                fc@fen.edu.pk
              </Text>
            </Text>
          </View>
          <View style={contactUsStyles.touchable}>
            <Text style={contactUsStyles.txP}>
              {`Fatimiyah institude of Educational Sciences - `}
              <Text
                style={contactUsStyles.txt}
                onPress={() => Linking.openURL('mailto:admin@fies.edu.pk')}>
                admin@fies.edu.pk
              </Text>
            </Text>
          </View>
          <View style={contactUsStyles.touchable}>
            <Text style={contactUsStyles.txP}>
              {`Careers - `}
              <Text
                style={contactUsStyles.txt}
                onPress={() => Linking.openURL('mailto:hrc@fen.edu.pk')}>
                hrc@fen.edu.pk
              </Text>
            </Text>
          </View>
          <View style={contactUsStyles.touchable}>
            <Text style={contactUsStyles.txP}>
              {`Feedback - `}
              <Text
                style={contactUsStyles.txt}
                onPress={() => Linking.openURL('mailto:feedback@fen.edu.pk')}>
                feedback@fen.edu.pk
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

FenContact = React.memo(FenContact);

export default FenContact;
