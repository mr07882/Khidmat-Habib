import React from 'react';
import {Badge} from '../../../Components/core';
import {MaterialCommunityIcons} from '../../../constants/icons';
import {TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import {colors} from '../../../Config/AppConfigData';

const CartBtn = ({navigation}) => {
  const donation = useSelector(state => state.donation);

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 15,
      }}>
      <TouchableOpacity
        style={{
          backgroundColor: colors.secondryColor,
          borderRadius: 8,
          padding: 14,
          paddingLeft: 10,
          paddingBottom: 10,
          position: 'relative',
        }}
        onPress={() => navigation.navigate('DonationCartItems')}>
        <Badge count={donation.cart.length} />
        <MaterialCommunityIcons
          name="cart"
          style={{fontSize: 26, color: 'white'}}
        />
      </TouchableOpacity>
    </View>
  );
};

export default CartBtn;
