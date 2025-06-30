import axios from 'axios';
import AT from '../constants';
import {DONATION_BASE_URI} from '../../Config/core';

export const headers = {
  headers: {
    Authorization:
      '$2a$12$j.4oY1z/81KM.rjbdQ7Dhe7PJ..ngZdL63H22Gc8iWiOZpYs7xZEa',
  },
};

// Causes
export const getDonationCauses = () => {
  return async dispatch => {
    let causes = [];
    const response = await axios.get(
      `${DONATION_BASE_URI}/donation/causes`,
      headers,
    );
    if (response.data && response.data.success) {
      causes = response.data.data;
    }
    dispatch({type: AT.DONATION.CAUSES.GET, payload: causes});
  };
};

// Payment Methods
export const getPaymentMethods = () => {
  return async dispatch => {
    let payment = [];
    const response = await axios.get(
      `${DONATION_BASE_URI}/payment/methods`,
      headers,
    );
    if (response.data && response.data.success) {
      payment = response.data.data;
    }
    dispatch({type: AT.DONATION.PAY_METHODS.GET, payload: payment});
  };
};

// Bank Info
export const getBankInfo = () => {
  return async dispatch => {
    let bankInfo = [];
    const response = await axios.get(`${DONATION_BASE_URI}/bank/info`, headers);
    if (response.data && response.data.success) {
      bankInfo = response.data.data;
    }
    dispatch({type: AT.DONATION.BANK_INFO.GET, payload: bankInfo});
  };
};

// Cart
export const addItemInDonationCart = item => {
  return (dispatch, getState) => {
    let {cart} = getState().donation;

    dispatch({
      type: AT.DONATION.CART.ADD,
      payload: [...cart, item],
    });
  };
};

export const updateDonationCart = cart => {
  return dispatch => {
    dispatch({
      type: AT.DONATION.CART.UPDATE,
      payload: cart,
    });
  };
};

// User
export const updateDonationUser = user => {
  return dispatch => {
    dispatch({
      type: AT.DONATION.USER.UPDATE,
      payload: user,
    });
  };
};
