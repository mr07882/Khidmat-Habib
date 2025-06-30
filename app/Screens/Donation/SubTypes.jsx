import React, {useEffect, useState} from 'react';
import {Image, ScrollView, TouchableOpacity, View, Alert} from 'react-native';
import donateStyles from '../../Styles/donateStyles';
import {Button, Input, Label} from '../../Components/core';
import {Dropdown, Text} from '../../Components/core';
import {
  DownArrowIcn,
  MinusIcn,
  PlusIcn,
  RightArrowIcn,
} from '../../Helpers/icons';
import DisplayHTML from '../../Components/core/DisplayHTML';
import {DONATION_APP_URL} from '../../Config/core';
import {useDispatch, useSelector} from 'react-redux';
import {
  addItemInDonationCart,
  updateDonationCart,
} from '../../Redux/actions/donationAction';
import CartBtn from './Components/CartBtn';
import {colors} from '../../Config/AppConfigData';
import {checkIsWholeNumber} from '../../Functions/Functions';

const SubTypes = ({navigation, route}) => {
  const {data} = route.params;
  const [expand, setExpand] = useState(false);
  const [value, setValue] = useState('');
  const [items, setItems] = useState(data.fundtypes);
  const [amount, setAmount] = useState(
    data.amount ? data.amount.toString() : '',
  );
  const [quantity, setQuantity] = useState('1');
  const {cart} = useSelector(state => state.donation);
  const dispatch = useDispatch();

  const validateForm = () => {
    if (!quantity) {
      alert('Please enter the quantity you want to donate');
      return false;
    }

    if (+quantity < 0.1) {
      alert('Donation quantity should be equal or greater than 0.1');
      return false;
    }

    if (!checkIsWholeNumber(quantity) && !data.accept_fraction) {
      alert('Donation quantity must be in whole number');
      return false;
    }

    if (!amount) {
      alert('Please enter the donation amount');
      return false;
    }

    return true;
  };

  const checkDuplicateItem = () => {
    let val = value !== '' ? value : 'Not Selected';
    let duplicateItem = false;

    cart.forEach((ele, index) => {
      if (ele.id === data.id) {
        if (ele.subtypes === val) {
          duplicateItem = {...ele, index};
        }
      }
    });

    return duplicateItem;
  };

  const resetState = () => {
    // reset form
    setValue('');
    setAmount(data.amount ? data.amount.toString() : '');
    setQuantity('1');
    setExpand(false);

    navigation.navigate('DonationCartItems');
  };

  const addItemToCart = () => {
    if (validateForm()) {
      let duplicateItem = checkDuplicateItem();

      if (duplicateItem) {
        Alert.alert(
          'Are you sure?',
          'This item already exists in the cart do you want to add it?',
          [
            {
              text: 'No',
            },
            {
              text: 'Yes',
              onPress: () => {
                let donationCart = cart;
                let ind = duplicateItem.index;
                donationCart[ind].amount = +duplicateItem.amount + +amount;
                if (data.amount) {
                  donationCart[ind].quantity = (
                    +duplicateItem.quantity + +quantity
                  ).toFixed(3);
                }
                dispatch(updateDonationCart(donationCart));
                resetState();
              },
            },
          ],
        );
      } else {
        dispatch(
          addItemInDonationCart({
            id: data.id,
            causeName: data.fundtitle,
            subtypes: value === '' ? 'Not Selected' : value,
            amount,
            quantity: data.amount ? (+quantity).toFixed(3) : null,
          }),
        );
        resetState();
      }
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.tertiaryColor}}>
      <ScrollView
        style={donateStyles.subScreen}
        contentContainerStyle={{paddingBottom: 20}}
        keyboardShouldPersistTaps="handled">
        <Input readOnly={true} label="Donation Cause" value={data.fundtitle} />
        {items.length > 0 && (
          <Dropdown
            label="Sub Type"
            title="Select Sub Type"
            schema={{
              label: 'typename',
              value: 'typename',
            }}
            required={false}
            items={items}
            value={value}
            setItems={setItems}
            setValue={setValue}
          />
        )}
        <Input
          label="Amount"
          keyboardType="numeric"
          placeholder="Enter Amount - PKR"
          helperText={
            data.amount
              ? `Per ration bag costs PKR ${data.amount.toLocaleString()}`
              : false
          }
          maxLength={8}
          value={amount}
          onChangeText={text => {
            let qt = 1 / (+data.amount / +text);
            if (qt >= 0.1) {
              // qt = checkIsWholeNumber(qt) ? qt.toFixed(0) : qt.toFixed(2);
              setQuantity(qt.toString());
            } else {
              setQuantity('0');
            }
            setAmount(text);
          }}
        />
        {data.amount && (
          <View>
            <Label>Quantity</Label>
            <View style={donateStyles.qtyInpWrapper}>
              <Button
                btnStyles={{marginVertical: 0}}
                onPress={() => {
                  if (+quantity > 1) {
                    setQuantity((+quantity - 1).toString());
                    setAmount((+amount - +data.amount).toString());
                  }
                }}>
                {<MinusIcn />}
              </Button>
              <Input
                inputMode="numeric"
                inputWrapperStyles={{
                  marginBottom: 0,
                  width: '65%',
                }}
                inputStyles={{
                  textAlign: 'center',
                  fontSize: 19,
                }}
                maxLength={5}
                value={quantity}
                onChangeText={text => {
                  setAmount(Math.round(+data.amount * +text).toString());
                  setQuantity(text);
                }}
              />
              <Button
                btnStyles={{marginVertical: 0}}
                onPress={() => {
                  setQuantity((+quantity + 1).toString());
                  setAmount((+amount + +data.amount).toString());
                }}>
                {<PlusIcn />}
              </Button>
            </View>
          </View>
        )}
        <TouchableOpacity
          style={donateStyles.detailsWrapper}
          onPress={() => setExpand(!expand)}>
          <View style={donateStyles.detailsBtn}>
            <Text style={{fontSize: 15}}>Description</Text>
            <DownArrowIcn
              styles={expand ? {transform: [{rotate: '180deg'}]} : {}}
            />
          </View>
          {expand && (
            <View style={donateStyles.detailsTxt}>
              {data.fundimage && data.fundimage.toLowerCase() !== 'noimage' && (
                <Image
                  source={{uri: DONATION_APP_URL + data.fundimage}}
                  style={{
                    ...donateStyles.causeImg,
                    aspectRatio:
                      data.fundtitle.toLowerCase() === 'khums' ? 2.5 : 1.5,
                  }}
                  resizeMode="contain"
                />
              )}
              <DisplayHTML html={data.funddetail} navigation={navigation} />
            </View>
          )}
        </TouchableOpacity>
        <Button onPress={addItemToCart} rightIcn={<RightArrowIcn />}>
          Continue
        </Button>
      </ScrollView>
      <CartBtn navigation={navigation} />
    </View>
  );
};

export default SubTypes;
