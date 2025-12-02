import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import userReducer from './ducks/user';

// const createNoopStorage: () => WebStorage = () => {
//   return {
//     getItem() {
//       return Promise.resolve(null);
//     },
//     setItem() {
//       return Promise.resolve();
//     },
//     removeItem() {
//       return Promise.resolve();
//     }
//   };
// };

// const storage: WebStorage = createNoopStorage();
const persistConfig = {
  key: 'demo',
  storage: storage,
  whitelist: ['user']
};

const rootReducer = combineReducers({
  user: userReducer
});

export default persistReducer(persistConfig, rootReducer);
