import React, {useEffect} from 'react';
import donateStyles from '../../../Styles/donateStyles';
import {View} from 'react-native';
import {Text} from '../../../Components/core';
import {useDispatch, useSelector} from 'react-redux';
import {getBankInfo} from '../../../Redux/actions/donationAction';

const AccountInfo = ({details}) => (
  <View style={donateStyles.accountInfo}>
    <Text>
      <Text style={donateStyles.subheading}>Bank: </Text>
      {details.bank_name}
    </Text>
    <Text>
      <Text style={donateStyles.subheading}>Account Title: </Text>
      {details.name}
    </Text>
    <Text>
      <Text style={donateStyles.subheading}>Account #: </Text>
      {details.number}
    </Text>
    <Text>
      <Text style={donateStyles.subheading}>IBAN #: </Text>
      {details.iban_no}
    </Text>
    {details.swift_code && (
      <Text>
        <Text style={donateStyles.subheading}>SWIFT Code: </Text>
        {details.swift_code}
      </Text>
    )}
    <Text>
      <Text style={donateStyles.subheading}>Currency: </Text>
      {details.currency}
    </Text>
  </View>
);

const BankInfo = () => {
  const {bankInfo} = useSelector(state => state.donation);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getBankInfo());
  }, []);

  return (
    <View style={donateStyles.bankInfo}>
      <Text style={donateStyles.heading}>Account Information</Text>
      {bankInfo &&
        bankInfo.map((ele, ind) => <AccountInfo key={ind} details={ele} />)}
      <Text>
        Please transfer your donation amount in our provided bank account and
        share transfer confirmation text or screenshot below.
      </Text>
    </View>
  );
};

export default BankInfo;
