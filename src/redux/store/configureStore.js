import {configureStore} from '@reduxjs/toolkit';

export default reducers => {
  return configureStore({
    reducer: reducers,
    // middleware: getDefaultMiddleware({
    //   serializableCheck: false,
    // }),
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
      serializableCheck: false,
    }),
  
    devTools: true,
  });
};