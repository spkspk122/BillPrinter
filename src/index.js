import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";

import { AppStack } from "./navigation";
import { startFirestoreListeners } from "./redux/slice/firestoreListeners";
import notificationService from "./services/notificationService";
import { rescheduleAllNotifications } from "./services/bootReceiver";
import { LogBox } from "react-native";

const App = () => {
  useEffect(() => {
    // Firestore disabled - using Redux Persist for local storage
    // Uncomment below when Firestore is enabled in Firebase Console
    // try {
    //   startFirestoreListeners();
    // } catch (error) {
    //   console.error('Failed to start Firestore listeners:', error);
    // }

    // Initialize notification service
    const initNotifications = async () => {
      try {
        await notificationService.setupBackgroundHandler();
        await notificationService.requestPermission();

        // Reschedule all notifications (useful after device reboot or app reinstall)
        await rescheduleAllNotifications();
      } catch (error) {
        console.error('Failed to initialize notifications:', error);
      }
    };

    initNotifications();

    LogBox.ignoreLogs([
  'new NativeEventEmitter()',
  'removeListeners',
  'addListener',
  'Firestore component is not present'
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
