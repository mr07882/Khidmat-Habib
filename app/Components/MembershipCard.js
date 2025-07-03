import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, Pressable, TouchableOpacity, Animated, TouchableWithoutFeedback } from 'react-native';
import { colors } from '../Config/AppConfigData';
const logo = require('../../assets/logo.webp');
const secSign = require('../../assets/SecSign.png');
import { getMemberDetails } from '../Functions/Functions';
import QRCode from 'react-native-qrcode-svg';

const formatJCIC = jcic => jcic ? String(jcic).replace(/(\d{4})(?=\d)/g, '$1 ') : '';

const CARD_WIDTH = 320; // You can adjust this for your app's layout
const CARD_HEIGHT = Math.round(CARD_WIDTH * 54 / 85.6);

const MembershipCard = ({ userId }) => {
  const [member, setMember] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const imagePressedRef = useRef(false);

  // Helper to check if FaceID is a valid URL
  const isValidImageUrl = url => typeof url === 'string' && url.startsWith('http');

  useEffect(() => {
    if (userId) {
      getMemberDetails(userId).then(data => {
        setMember(data);
        setImageError(false); // Reset image error when member changes
      });
    }
  }, [userId]);

  // Flip animation
  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: flipped ? 180 : 0,
      useNativeDriver: true,
      friction: 8,
      tension: 10,
    }).start();
  }, [flipped]);

  const frontInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });
  const backInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (!userId) return <Text style={{color:'red'}}>No userId provided</Text>;
  if (!member) return null;

  // Card front
  const CardFront = (
    <View style={[styles.cardContent, { width: CARD_WIDTH, height: CARD_HEIGHT }]}> 
      {/* Faded background logo at bottom right */}
      <Image source={logo} style={styles.bgLogo} pointerEvents="none" />
      <View style={styles.headerRow}>
        <Image source={logo} style={styles.logo} />
        <View style={styles.headerTextContainer}>
          <Text style={styles.titleEn}>KHOJA (PIRHAI) SHIA ISNA ASHERI JAMAAT</Text>
          <Text style={styles.titleUr}>خوجہ (پیرائی) شیعہ اثنا عشری جماعت</Text>
          <Text style={styles.titleGu}>ખોજા (પીરહાઈ) શિયા ઇસ્ના અશરી જમાત</Text>
        </View>
      </View>
      <View style={styles.infoRow}>
        <View style={{alignItems: 'center', justifyContent: 'flex-start', width: 70}}>
          <TouchableOpacity>
            <Image
              source={(!imageError && isValidImageUrl(member.FaceID))
                ? { uri: member.FaceID }
                : require('../../assets/femaleDummy.webp')}
              style={styles.faceImg}
              onError={() => {
                setImageError(true);
              }}
            />
          </TouchableOpacity>
          <View style={styles.signatureBlock}>
            <Image source={secSign} style={styles.secSign} />
            <View style={styles.hr} />
            <Text style={styles.secretaryText}>Hon. Secretary</Text>
          </View>
        </View>
        <View style={styles.infoCol}>
          <Text style={[styles.cardHeading, {textAlign: 'center'}]}>MEMBERSHIP CARD</Text>
          <Text style={[styles.jcic, {textAlign: 'center'}]}>{formatJCIC(member.jcic)}</Text>
          <Text style={styles.infoText}><Text style={styles.infoLabel}>Name:</Text> {member.name}</Text>
          <Text style={styles.infoText}><Text style={styles.infoLabel}>Father/Husband:</Text> {member.fatherHusband}</Text>
          <Text style={styles.infoText}><Text style={styles.infoLabel}>Surname:</Text> {member.surname}</Text>
          <Text style={styles.infoText}><Text style={styles.infoLabel}>CNIC:</Text> {member.cnic}</Text>
        </View>
      </View>
    </View>
  );

  // Card back
  const CardBack = (
    <View style={[styles.cardContent, styles.backCardContent, { width: CARD_WIDTH, height: CARD_HEIGHT }]}> 
      <Image source={logo} style={styles.bgLogo} pointerEvents="none" />
      <View style={{alignItems: 'center', marginBottom: 10, width: '100%'}}>
        <Text style={[styles.jcic, {textAlign: 'center', marginBottom: 8, alignSelf: 'center', width: '100%'}]}>{formatJCIC(member.jcic)}</Text>
      </View>
      <View style={{marginLeft: 10}}>
        <Text style={styles.infoText}><Text style={styles.infoLabel}>Blood Group:</Text> {member.BloodGroup || '-'}</Text>
        <Text style={styles.infoText}><Text style={styles.infoLabel}>DOB:</Text> {formatDate(member.DOB)}</Text>
        <Text style={styles.infoText}><Text style={styles.infoLabel}>Islamic DOB:</Text> {member.IslamicDOB || '-'}</Text>
      </View>
      <View style={{flex: 1}} />
      <View style={styles.qrRow}>
        <Text style={{fontSize: 11, color: '#888', textAlign: 'center', marginTop: 20, flex: 1}}>
          For any update, please contact Jamaat office.
        </Text>
        <View style={styles.qrContainer}>
          <QRCode
            value={String(member.jcic) || ''}
            size={54}
            backgroundColor="white"
          />
        </View>
      </View>
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={() => {
      if (imagePressedRef.current) {
        return;
      }
      setFlipped(f => !f);
    }}>
      <View>
        <Animated.View style={[styles.card, {backfaceVisibility: 'hidden', transform: [{rotateY: frontInterpolate}]}]}>
          {CardFront}
        </Animated.View>
        <Animated.View style={[styles.card, styles.cardBack, {position: 'absolute', top: 0, left: 0, right: 0, backfaceVisibility: 'hidden', transform: [{rotateY: backInterpolate}]}]}>
          {CardBack}
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 5,
    margin: 10,
    padding: 15,
    alignItems: 'stretch',
    minHeight: 210,
  },
  cardBack: {
    zIndex: 2,
  },
  cardContent: {
    flex: 1,
  },
  backCardContent: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginRight: 10,
  },
  headerTextContainer: {
    flex: 1,
  },
  titleEn: {
    fontWeight: 'bold',
    fontSize: 13,
    color: colors.secondryColor,
  },
  titleUr: {
    fontSize: 13,
    color: colors.secondryColor,
    fontFamily: 'Jameel Noori Nastaleeq',
    textAlign: 'left',
  },
  titleGu: {
    fontSize: 13,
    color: colors.secondryColor,
    fontFamily: 'Noto Sans Gujarati',
    textAlign: 'left',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  picCol: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 0.9,
  },
  faceImg: {
    width: 48, // square size, like passport photo
    height: 48,
    borderRadius: 1, // slight rounding for photo corners
    marginRight: 8,
    backgroundColor: '#eee',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
  },
  infoCol: {
    flex: 1,
  },
  cardHeading: {
    color: '#1976d2',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
  },
  jcic: {
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 2,
  },
  infoText: {
    fontSize: 13,
    marginBottom: 1,
    fontWeight: 'bold',
    color: '#222',
  },
  infoLabel: {
    color: '#1976d2',
    fontWeight: 'bold',
  },
  signatureBlock: {
    alignItems: 'center',
    width: 70,
  },
  hr: {
    borderBottomColor: '#333',
    borderBottomWidth: 1,
    width: 60,
    marginTop: 2,
    marginBottom: 2,
    alignSelf: 'center',
  },
  secretaryText: {
    fontSize: 9, // smaller font size
    color: '#222',
    textAlign: 'center',
    marginTop: 0,
    fontWeight: 'bold',
  },
  secSign: {
    width: 60,
    height: 28,
    resizeMode: 'contain',
    marginTop: 4,
    marginBottom: 2,
    alignSelf: 'center',
  },
  bgLogo: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 180,
    height: 180,
    opacity: 0.20,
    zIndex: 0,
  },
  qrRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
    marginBottom: 0,
  },
  qrContainer: {
    marginRight: 10,
    marginBottom: 5,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
});

export default MembershipCard;
