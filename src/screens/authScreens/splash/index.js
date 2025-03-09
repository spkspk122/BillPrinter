import React, { useEffect } from "react";
import {
  Button,
  Image,
  StyleSheet,
  Text,
  View,
  ImageBackground,
} from "react-native";
import { string } from "../../../constant/strings";
import { baseStyle } from "../../../utlis/baseStyle.js/theme";
import { colors } from "../../../utlis/colors";
import { NativeModules } from "react-native";
import CustomSafeArea from "../../../components/CustomSafeArea";
import { iconpathurl } from "../../../assest/iconpath";
import { moderateVerticalScale } from "react-native-size-matters";
import { heightPercentageToDP } from "react-native-responsive-screen";
import navigationServices from "../../../navigation/navigationServices";
import { SCREENS } from "../../../navigation/screens";
const Splash = () => {
  useEffect(() => {
    setTimeout(() => {
      navigationServices.navigateAndReset(SCREENS.LOGIN);
    }, 3000);
  }, []);
  return (
    <CustomSafeArea backgroundColor={colors?.redFF} style={styles?.container}>
      <ImageBackground source={iconpathurl.Splash} style={styles?.container}>
        <View style={styles?.subContainer}>
          <Text
            style={[
              baseStyle.txtStyleIntersBold("3%", colors.whiteFF),
              { fontWeight: "900" },
            ]}
          >
            {string?.splash}
          </Text>
        </View>
      </ImageBackground>
    </CustomSafeArea>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subContainer: {
    alignItems: "center",
    flex: 0.25,
    justifyContent: "flex-end",
  },
});
export default Splash;
