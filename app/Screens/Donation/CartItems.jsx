import React, {useEffect, useState} from 'react';
import {FlatList, TouchableOpacity, View} from 'react-native';
import donateStyles from '../../Styles/donateStyles';
import {useDispatch, useSelector} from 'react-redux';
import {Button, Text} from '../../Components/core';
import {PlusIcn, RightArrowIcn, TrashIcn} from '../../Helpers/icons';
import Loader from '../../Components/Loader';
import {calculateTotal} from '../../Functions/Functions';
import {updateDonationCart} from '../../Redux/actions/donationAction';

const CartItems = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const {cart} = useSelector(state => state.donation);
  const dispatch = useDispatch();

  useEffect(() => {
    if (cart.length > 0) {
      setTotal(calculateTotal(cart, 'amount'));
    }
    if (cart) {
      setLoading(false);
    }
  }, [cart]);

  const deleteItemFromCart = index => {
    let items = cart;
    items.splice(index, 1);
    dispatch(updateDonationCart(items));
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <View
      style={{
        ...donateStyles.mainscreen,
        padding: 20,
      }}>
      <Text style={donateStyles.heading}>Selected Causes</Text>
      {cart.length > 0 ? (
        <View>
          <FlatList
            data={cart}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({item, index}) => {
              let itemAmount = +item.amount;
              itemAmount = itemAmount.toLocaleString();

              return (
                <View style={donateStyles.itemDetails}>
                  <Text style={donateStyles.itemName}>
                    {item.subtypes && item.subtypes !== 'Not Selected'
                      ? `${item.subtypes} - ${item.causeName}`
                      : item.causeName}
                  </Text>
                  <View style={donateStyles.itemAmountWrapper}>
                    <Text style={donateStyles.itemAmount}>
                      PKR {itemAmount}
                    </Text>
                    <TouchableOpacity
                      style={donateStyles.trashBtn}
                      onPress={() => deleteItemFromCart(index)}>
                      <TrashIcn styles={{color: '#ffffff'}} />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          />
        </View>
      ) : (
        <View style={donateStyles.itemDetails}>
          <Text
            style={{
              ...donateStyles.itemAmount,
              textAlign: 'center',
              width: '100%',
            }}>
            No donation items found! Click the{' '}
            <Text
              style={{
                ...donateStyles.itemAmount,
                fontFamily: 'Poppins-SemiBold',
              }}>
              Add More
            </Text>{' '}
            button below to add items to your cart.
          </Text>
        </View>
      )}
      <Button
        btnStyles={donateStyles.addItemBtn}
        btnTextStyles={{fontSize: 14.5}}
        onPress={() => navigation.navigate('DonationCauses')}
        rightIcn={<PlusIcn styles={donateStyles.addItemBtnIcn} />}>
        Add More
      </Button>
      <View style={{flex: 2, justifyContent: 'flex-end'}}>
        <View style={donateStyles.cartAmountWrapper}>
          <Text style={donateStyles.cartAmountHeading}>Total Amount</Text>
          <Text style={donateStyles.cartAmount}>PKR {total}</Text>
        </View>
        <Button
          onPress={() => {
            if (cart.length > 0) {
              navigation.navigate('DonationCheckoutForm');
            } else {
              alert('Please add items to your cart to continue.');
            }
          }}
          rightIcn={<RightArrowIcn styles={{color: '#ffffff'}} />}>
          Continue
        </Button>
      </View>
    </View>
  );
};

export default CartItems;
