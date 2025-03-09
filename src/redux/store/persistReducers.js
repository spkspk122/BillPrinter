import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistReducer } from "redux-persist";

export default (reducers) => {
  const persistedReducer = persistReducer(
    {
      key: "eds",
      storage: AsyncStorage,
      // whitelist: ["authSlice"],
    //   blacklist: ['booking'],
    },
    reducers
  );

  return persistedReducer;
};
