import React, {useState, useEffect} from 'react';
import Button from '../Container/button';
import {View, TouchableOpacity} from 'react-native';
import * as Icn from '../Helpers/icons';
import {buttonsContainerStyles} from '../Config/StylesCss';
import {colors} from '../Config/AppConfigData';
import Loader from './Loader';
import {Text} from './core';

function Buttons(props) {
  const [loading, setLoading] = useState(true);
  const [icnColor, setIcnColor] = useState({
    btn1: colors.primaryColor,
    btn2: colors.primaryColor,
    btn3: colors.primaryColor,
    btn4: colors.primaryColor,
  });
  const {flags, navigateProp, extraBtns, donation, telethon, quiz} = props;

  useEffect(() => {
    if (
      extraBtns !== undefined &&
      donation !== undefined &&
      telethon !== undefined &&
      quiz !== undefined
    ) {
      setLoading(false);
    }
  }, [extraBtns, donation, telethon, quiz]);

  if (loading) {
    return <Loader bgColor="#F2F2F2" />;
  }

  const {btn1, btn2, btn3, btn4} = extraBtns;
  const {label, style, icon} = donation;

  const colorFunc = (color, name) => {
    switch (name) {
      case 'btn1':
        icnColor.btn1 = color;
        break;
      case 'btn2':
        icnColor.btn2 = color;
        break;
      case 'btn3':
        icnColor.btn3 = color;
        break;
      case 'btn4':
        icnColor.btn4 = color;
        break;
      default:
        break;
    }

    setIcnColor(icnColor);
  };

  const selectIcon = ({type, name}, color) => {
    switch (type) {
      case 'MCIcons':
        return Icn.MCIcons(name, color);
      case 'MaterialIcons':
        return Icn.MaterialIcons(name, color);
      case 'AntDesign':
        return Icn.AntDesign(name, color);
      case 'FontAwesome':
        return Icn.FontAwesome(name, color);
      case 'FontAwesome6':
        return Icn.FontAwesome6(name, color);
      default:
        break;
    }
  };

  return (
    !!flags && (
      <View style={buttonsContainerStyles.buttonsContainer}>
        {!!flags.newsFlag && (
          <Button
            icn={Icn.NewsIcn}
            text={'News'}
            nav={navigateProp}
            rought={'NewsEvents'}
          />
        )}
        {!!flags.obituaryFlag && (
          <Button
            icn={Icn.DeathNewsIcn}
            text={'Obituary'}
            nav={navigateProp}
            rought={'DeathNews'}
          />
        )}
        {!!btn4.visible && (
          <Button
            colorFunc={colorFunc}
            icn={selectIcon(btn4.icon, icnColor.btn4)}
            text={btn4.title}
            nav={navigateProp}
            data={{...extraBtns.btn4, name: 'btn4'}}
            rought={'ExtraBtns'}
          />
        )}
        {!!flags.downloadsFlag && (
          <Button
            icn={Icn.DownloadIcn}
            text={'Downloads'}
            nav={navigateProp}
            rought={'DownloadTabs'}
          />
        )}
        {/* extraBtns */}
        {!!btn1.visible && btn1.title !== 'JCIC Forms' && (
          <Button
            colorFunc={colorFunc}
            text={btn1.title}
            nav={navigateProp}
            data={{...extraBtns.btn1, name: 'btn1'}}
            rought={'ExtraBtns'}
            icn={selectIcon(btn1.icon, icnColor.btn1)}
          />
        )}
        {!!btn2.visible && (
          <Button
            colorFunc={colorFunc}
            icn={selectIcon(btn2.icon, icnColor.btn2)}
            text={btn2.title}
            nav={navigateProp}
            data={{...extraBtns.btn2, name: 'btn2'}}
            rought={'ExtraBtns'}
          />
        )}
        {!!btn3.visible && (
          <Button
            colorFunc={colorFunc}
            icn={selectIcon(btn3.icon, icnColor.btn3)}
            text={btn3.title}
            nav={navigateProp}
            data={{...extraBtns.btn3, name: 'btn3'}}
            rought={'ExtraBtns'}
          />
        )}
        {!!flags.aboutFlag && (
          <Button
            icn={Icn.AboutIcn}
            text={'About Us'}
            nav={navigateProp}
            rought={'AboutUs'}
          />
        )}
        {!!flags.telethoneFlag && (
          <Button
            icn={Icn.TelethoneIcn}
            telethonColors={telethon}
            text={'Telethon'}
            nav={navigateProp}
            rought={'Telethone'}
          />
        )}
        {!!flags.ramzanQuizFlag && (
          <Button
            telethonColors={quiz}
            icn={Icn.RamzanQuizIcn}
            text={'Quiz'}
            nav={navigateProp}
            rought={'RamzanQuiz'}
          />
        )}
        {!!flags.contactUsFlag && (
          <Button
            icn={Icn.ContactIcn}
            text={'Contact Us'}
            nav={navigateProp}
            rought={'ConnectUs'}
          />
        )}
        {!!flags.feedbackFlag && (
          <Button
            icn={Icn.FeedbackIcn}
            text={'Feedback'}
            nav={navigateProp}
            rought={'Feedback'}
          />
        )}
        <Button
          icn={Icn.MaterialIcons('event', colors.primaryColor)}
          text={'Events'}
          nav={navigateProp}
          rought={'EventsCalendar'}
        />

        {/* Business Place */}
        <Button
          icn={Icn.BusinessIcn(colors.primaryColor)}
          text={'Business Place'}
          nav={navigateProp}
          rought={'BusinessPlace'}
        />

        {/* JCIC Forms button removed. If you want to remove the 'Forms' button as well, remove the below block. */}
        <Button
          icn={selectIcon(btn1.icon, icnColor.btn1)}
          text={'Forms'}
          nav={navigateProp}
          rought={'Forms'}
        />

        {!!flags.donateFlag && (
          <TouchableOpacity
            onPress={() => {
              navigateProp.navigate('DonationCauses');
            }}
            style={[
              buttonsContainerStyles.donteButton,
              {
                backgroundColor:
                  style?.bgColor !== '' && style?.bgColor !== undefined
                    ? style?.bgColor
                    : colors.secondryColor,
              },
            ]}>
            {icon && selectIcon(icon, style?.color)}
            <Text
              style={{
                ...buttonsContainerStyles.donateButtonText,
                color:
                  style?.color !== '' && style?.color !== undefined
                    ? style?.color
                    : colors.primaryColor,
              }}>
              {label}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    )
  );
}

export default Buttons;
