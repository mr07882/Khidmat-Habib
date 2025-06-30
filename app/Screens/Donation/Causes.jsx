import React, {useCallback, useEffect, useState} from 'react';
import {Alert, BackHandler, FlatList, SafeAreaView, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Text} from '../../Components/core';
import donateStyles from '../../Styles/donateStyles';
import CauseButton from './Components/CauseButton';
import CartBtn from './Components/CartBtn';
import Loader from '../../Components/Loader';
import {
  getDonationCauses,
  updateDonationCart,
} from '../../Redux/actions/donationAction';
import {displayNetworkError} from '../../Functions/Functions';
import {useFocusEffect} from '@react-navigation/native';
import {HeaderLeft} from '../../Navigation/components';

const Causes = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const donation = useSelector(state => state.donation);
  const state = useSelector(state => state.reducer);
  const dispatch = useDispatch();

  const backAlert = () => {
    if (donation.cart.length > 0 && state.networkStatuse) {
      Alert.alert(
        'Are you sure?',
        'Navigating away from this page will empty your cart. Do you want to continue?',
        [
          {
            text: 'No',
          },
          {
            text: 'Yes',
            onPress: () => {
              dispatch(updateDonationCart([]));
              navigation.goBack();
            },
          },
        ],
      );
    } else {
      navigation.goBack();
    }
  };

  const setHeader = () => {
    navigation.setOptions({
      headerLeft: () => <HeaderLeft name="Donate Us" onPress={backAction} />,
    });
  };

  const backAction = () => {
    backAlert();
    return true;
  };

  useEffect(() => {
    if (state.networkStatuse) {
      dispatch(getDonationCauses());
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (state.networkStatuse) {
        BackHandler.addEventListener('hardwareBackPress', backAction);
        return () =>
          BackHandler.removeEventListener('hardwareBackPress', backAction);
      }
    }, [donation]),
  );

  useEffect(() => {
    if (donation.causes.length > 0 && donation.cart && state.networkStatuse) {
      setHeader();
      setLoading(false);
    }
  }, [donation]);

  if (!state.networkStatuse) {
    return displayNetworkError();
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={donateStyles.mainscreen}>
      <View style={donateStyles.firstSection}>
        <Text style={donateStyles.quote}>
          Happiness doesn't result from what we get, but from what we give.
        </Text>
      </View>
      <FlatList
        numColumns={2}
        data={donation.causes}
        style={donateStyles.secondSection}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({item}) => (
          <CauseButton
            onPress={() =>
              navigation.navigate('DonationSubTypes', {
                data: item,
              })
            }
            icon={item.fund_icon}
            text={item.fundtitle}
          />
        )}
      />
      <CartBtn navigation={navigation} />
    </SafeAreaView>
  );
};

export default Causes;
