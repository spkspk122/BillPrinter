import {persistStore} from 'redux-persist';
import configureStore from './configureStore';
import persistReducers from './persistReducers';
import rootSlice from '../slice/rootSlice';

const store = configureStore(persistReducers(rootSlice));
const persistor = persistStore(store);

export {store, persistor};
