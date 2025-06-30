import AT from '../constants';

const INITIAL_STATE = {
  payMethods: [],
  causes: [],
  cart: [],
  user: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: 'Pakistan',
    cnic: '',
    remarks: '',
  },
  bankInfo: [],
};

export const donationReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case AT.DONATION.CAUSES.GET:
      return {...state, causes: action.payload};
    case AT.DONATION.CART.ADD:
      return {...state, cart: action.payload};
    case AT.DONATION.CART.UPDATE:
      return {...state, cart: action.payload};
    case AT.DONATION.PAY_METHODS.GET:
      return {...state, payMethods: action.payload};
    case AT.DONATION.BANK_INFO.GET:
      return {...state, bankInfo: action.payload};
    case AT.DONATION.USER.UPDATE:
      return {...state, user: action.payload};
    default:
      return state;
  }
};
