import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";

import { AppStack } from "./navigation";
import { startFirestoreListeners } from "./redux/slice/firestoreListeners";
import { LogBox } from "react-native";

const App = () => {
  useEffect(() => {
    startFirestoreListeners(); // start listening to Firestore
    LogBox.ignoreLogs([
  'new NativeEventEmitter()',
  'removeListeners',
  'addListener'
]);
  }, []);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <AppStack />
      </PersistGate>
    </Provider>
  );
};

export default App;
