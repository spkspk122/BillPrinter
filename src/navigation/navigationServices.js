import { createNavigationContainerRef } from "@react-navigation/native";

const navigationRef = createNavigationContainerRef();

function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

function navigateAndReset(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.resetRoot({
      index: 0,
      routes: [{ name: name, params: params }],
    });
  }
}

function goBack() {
  if (navigationRef.isReady()) {
    navigationRef.goBack();
  }
}

export default {
  navigationRef,
  navigate,
  navigateAndReset,
  goBack,
};
