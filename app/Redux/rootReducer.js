import {combineReducers} from 'redux';

import reducer from './reducers/authReducers.js';
import {donationReducer} from './reducers/donationReducers.js';

export default combineReducers({
  donation: donationReducer,
  reducer,
});
