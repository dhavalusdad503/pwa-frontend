import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/es/storage';

import userReducer from './ducks/user';

const persistConfig = {
  key: 'demo',
  storage,
  whitelist: ['user']
};

const rootReducer = combineReducers({
  user: userReducer
});

export default persistReducer(persistConfig, rootReducer);
