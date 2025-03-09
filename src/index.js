import React from "react";
import { PersistGate } from "redux-persist/integration/react";

import { Provider } from "react-redux";
import { AppStack } from "./navigation";
import { persistor, store } from "./redux/store";

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <AppStack />
      </PersistGate>
    </Provider>
  );
};

export default App;