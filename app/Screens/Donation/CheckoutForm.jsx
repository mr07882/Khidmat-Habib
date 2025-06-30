import React, {useEffect, useState} from 'react';
import {ScrollView, View} from 'react-native';
import donateStyles from '../../Styles/donateStyles';
import {
  Button,
  Chip,
  CountryPhoneInput,
  Dropdown,
  Input,
  Label,
  Text,
  TextArea,
} from '../../Components/core';
import {countryObjInArray} from '../../Config/AppConfigData';
import {useDispatch, useSelector} from 'react-redux';
import {
  getPaymentMethods,
  headers,
  updateDonationCart,
  updateDonationUser,
} from '../../Redux/actions/donationAction';
import {RightArrowIcn} from '../../Helpers/icons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import {DONATION_APP_URL, DONATION_BASE_URI} from '../../Config/core';
import Loader from '../../Components/Loader';
import {calculateTotal} from '../../Functions/Functions';
import BankInfo from './Components/BankInfo';
import ImageCropPicker from 'react-native-image-crop-picker';

const donorObj = {
  firstName: '',
  lastName: '',
  email: '',
  cnic: '',
  remarks: '',
};

const selectedPayModeObj = {
  gateway: '',
  method: '',
};

const phoneObj = {
  countryCode: 'PK',
  dialingCode: '92',
  number: '',
};

const transferDetailsObj = {
  id: '',
  image: {},
};

const CheckoutForm = ({navigation}) => {
  const [total, setTotal] = useState(0);
  const [items, setItems] = useState(countryObjInArray);
  const [country, setCountry] = useState('Pakistan');
  const [phone, setPhone] = useState(phoneObj);
  const [donor, setDonor] = useState(donorObj);
  const [transferDetails, setTransferDetails] = useState(transferDetailsObj);
  const [loading, setLoading] = useState(true);
  const [selectedPayMode, setSelectedPayMode] = useState(selectedPayModeObj);
  const {payMethods, cart, user} = useSelector(state => state.donation);
  const {networkStatuse} = useSelector(state => state.reducer);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user && user.firstName) {
      let {firstName, lastName, email, phone, country, cnic, remarks} = user;
      setDonor({
        firstName,
        lastName,
        email,
        cnic,
        remarks,
      });
      setPhone(phone);
      setCountry(country);
    }
  }, [user]);

  useEffect(() => {
    dispatch(getPaymentMethods());
  }, []);

  useEffect(() => {
    if (cart.length > 0) {
      setTotal(calculateTotal(cart, 'amount'));
    }
  }, [cart]);

  useEffect(() => {
    if (payMethods.length > 0) {
      setSelectedPayMode({
        gateway: payMethods[0].payment_gateway.name,
        method: payMethods[0].payment_method.name,
      });
      setLoading(false);
    }
  }, [payMethods]);

  const validateForm = () => {
    let requiredFields = ['firstName', 'lastName', 'email'];
    let message = {
      firstName: 'first name',
      lastName: 'last name',
      email: 'email address',
    };

    if (!networkStatuse) {
      alert(
        `A network error has occurred. Please ensure you have a stable internet connection and try again later.`,
      );
      return false;
    }

    for (const key in donor) {
      if (requiredFields.includes(key)) {
        if (!donor[key]) {
          alert(`Please enter your ${message[key]}`);
          return false;
        }
      }
    }

    if (!phone.number) {
      alert(`Please enter your phone number`);
      return false;
    }

    if (!country) {
      alert(`Please select the country name`);
      return false;
    }

    if (!selectedPayMode.method || !selectedPayMode.gateway) {
      alert(`Please select the payment method`);
      return false;
    }

    if (
      !transferDetails.id &&
      !transferDetails.image.filename &&
      selectedPayMode.gateway.toLowerCase() === 'default'
    ) {
      alert(`Please enter the transfer id or upload the transfer image`);
      return false;
    }

    if (+total === 0) {
      alert(`Please add items to your cart to continue.`);
      return false;
    }

    return true;
  };

  const resetState = () => {
    setDonor(donorObj);
    setPhone(phoneObj);
    setTransferDetails(transferDetailsObj);
    setCountry('Pakistan');
  };

  const handleCheckout = async () => {
    setLoading(true);
    if (validateForm()) {
      try {
        const response = await axios.post(
          `${DONATION_BASE_URI}/donate`,
          {
            first_name: donor.firstName,
            last_name: donor.lastName,
            email: donor.email,
            phone: '+' + phone.dialingCode + phone.number,
            country: country,
            cnic: donor.cnic,
            remarks: donor.remarks,
            recurring: 0,
            payment_gateway: selectedPayMode.gateway,
            payment_method: selectedPayMode.method,
            platform: 'mobile',
            total_amount: total.replaceAll(',', ''),
            cart: cart,
            refference_id: transferDetails.id,
            refference_file: transferDetails.image,
          },
          headers,
        );

        if (response.data && response.data.success === true) {
          dispatch(updateDonationCart([]));
          dispatch(
            updateDonationUser({
              ...donor,
              phone,
              country,
            }),
          );

          let data = response.data.data;
          navigation.navigate('WebViewByLink', {
            WebViewLink:
              selectedPayMode.gateway.toLowerCase() === 'default'
                ? `${DONATION_APP_URL}swich/success`
                : data.url,
            navigate: 'DonationCauses',
            html: '',
            label: 'Go Back',
            isLink: true,
            isHtml: false,
          });

          resetState();
        }
      } catch (error) {
        alert('An error occurred! Please try again.');
      }
    }
    setLoading(false);
  };

  const selectImage = () => {
    ImageCropPicker.openPicker({includeBase64: true}).then(async image => {
      setTransferDetails({...transferDetails, image});
    });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <ScrollView
      style={{...donateStyles.subScreen, paddingHorizontal: 0}}
      contentContainerStyle={{paddingBottom: 20}}
      keyboardShouldPersistTaps="handled">
      <View style={{paddingHorizontal: 23}}>
        <Text style={{...donateStyles.heading, textAlign: 'left'}}>
          Personal Details:
        </Text>
        <Input
          label="First Name"
          placeholder="Enter First Name"
          inputWrapperStyles={{marginTop: 15}}
          value={donor.firstName}
          onChangeText={val => setDonor({...donor, firstName: val})}
        />
        <Input
          label="Last Name"
          placeholder="Enter Last Name"
          value={donor.lastName}
          onChangeText={val => setDonor({...donor, lastName: val})}
        />
        <Input
          label="Email Address"
          placeholder="Enter Email Address"
          value={donor.email}
          onChangeText={val => setDonor({...donor, email: val})}
        />
        <CountryPhoneInput
          label="Phone Number"
          placeholder="Enter Phone Number"
          defaultCode={phone.countryCode}
          defaultValue={phone.number}
          value={phone.number}
          onChangeCountry={val =>
            setPhone({
              ...phone,
              countryCode: val.cca2,
              dialingCode: val.callingCode[0],
            })
          }
          onChangeText={val => setPhone({...phone, number: val})}
        />
        <Dropdown
          label="Country"
          title="Select Country Name"
          items={items}
          value={country}
          setItems={setItems}
          setValue={setCountry}
          searchable={true}
        />
        {country.toLowerCase() === 'pakistan' && (
          <Input
            label="CNIC"
            placeholder="Enter CNIC Number"
            keyboardType="numeric"
            required={false}
            value={donor.cnic}
            onChangeText={val => setDonor({...donor, cnic: val})}
          />
        )}
        <TextArea
          label="Remarks"
          placeholder="Enter Remarks"
          required={false}
          value={donor.remarks}
          onChangeText={val => setDonor({...donor, remarks: val})}
        />
        <Text style={{...donateStyles.heading, textAlign: 'left'}}>
          Payment Methods:
        </Text>
      </View>
      <ScrollView
        style={{marginVertical: 10, paddingHorizontal: 20}}
        contentContainerStyle={{paddingRight: 20}}
        showsHorizontalScrollIndicator={false}
        horizontal={true}>
        {payMethods.map((ele, ind) => {
          let methodName = ele.payment_method.name;
          let gatewayName = ele.payment_gateway.name;

          return (
            <Chip
              key={ind}
              label={methodName}
              checked={selectedPayMode.method === methodName}
              onPress={() =>
                setSelectedPayMode({
                  method: methodName,
                  gateway: gatewayName,
                })
              }
            />
          );
        })}
      </ScrollView>
      <View style={{paddingHorizontal: 23}}>
        {selectedPayMode.gateway.toLowerCase() === 'default' && (
          <>
            <BankInfo />
            <Input
              label="Transfer ID"
              placeholder="Enter Transfer ID"
              keyboardType="numeric"
              required={true}
              value={transferDetails.id}
              onChangeText={val =>
                setTransferDetails({...transferDetails, id: val})
              }
            />
            <View>
              <Label>Transfer Image</Label>
              <Button
                btnStyles={{
                  marginTop: 0,
                  marginBottom: 3,
                }}
                rightIcn={
                  <FontAwesome5
                    name="cloud-upload-alt"
                    style={{color: '#ffffff', fontSize: 18}}
                  />
                }
                onPress={selectImage}>
                Upload Image
              </Button>
              <Text>
                {transferDetails.image.filename
                  ? transferDetails.image.filename
                  : 'No image uploaded'}
              </Text>
            </View>
          </>
        )}
        <View
          style={{
            ...donateStyles.cartAmountWrapper,
            borderTopWidth: 1,
            borderColor: '#808080',
            marginTop: 10,
            paddingTop: 18,
          }}>
          <Text style={donateStyles.cartAmountHeading}>Total Amount</Text>
          <Text style={donateStyles.cartAmount}>PKR {total}</Text>
        </View>
        <Button onPress={handleCheckout} rightIcn={<RightArrowIcn />}>
          Donate Now
        </Button>
      </View>
    </ScrollView>
  );
};

export default CheckoutForm;
