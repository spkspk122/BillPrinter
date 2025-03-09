import React from "react";
import { StatusBar, View } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

function CustomSafeArea({
  style,
  children,
  backgroundColor,
  barStyle = "light-content",
}) {
  const CustomStatusBar = ({
    backgroundColor,
    barStyle = "light-content",
  }) => {
    const insets = useSafeAreaInsets();

    return (
      <View style={{ height: insets.top, backgroundColor }}>
        <StatusBar
          animated={true}
          backgroundColor={backgroundColor}
          barStyle={barStyle}
        />
      </View>
    );
  };

  return (
    <SafeAreaProvider>
      <CustomStatusBar backgroundColor={backgroundColor} barStyle={barStyle} />
      <View style={style}>{children}</View>
    </SafeAreaProvider>
  );
}
export default CustomSafeArea;
