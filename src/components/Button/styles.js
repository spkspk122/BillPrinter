import { Platform, StyleSheet } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { baseStyle } from "../../utlis/baseStyle.js/theme";
import { colors } from "../../utlis/colors";
const styles = StyleSheet.create({
  primaryblueButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingRight: wp("4%"),
    paddingLeft: wp("4%"),
    borderRadius: wp("1%"),
    width: "100%",
    height: Platform.OS === "android" ? hp("6.5%") : hp("5.6%"),
  },
  emptyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingRight: wp("4%"),
    paddingLeft: wp("4%"),
    borderRadius: wp("1%"),
    width: "100%",
     height: Platform.OS === "android" ? hp("6.5%") : hp("5.6%"),
    backgroundColor: colors.whiteFF,
    borderWidth: 1,
    borderColor: colors.red00
  },

  icon: {
    width: wp("6%"),
    height: wp("6%"),
    resizeMode: "contain",
  },
  whiteBtnColor: {
    color: colors.whiteFF,

    ...baseStyle.font16px,
    fontFamily: baseStyle.fontInterSemiBold,
  },
  redBtnColor: {
    color: colors.red00,
    ...baseStyle.font16px,
    fontFamily: baseStyle.fontInterSemiBold,
  },
  shineOverlay: {
    ...StyleSheet.absoluteFillObject, // Fill button space
  },
  gradient: {
    width: 200, // Width of the gradient "shine"
    height: "100%",
  },
  // prefixIcon: {
  //   position: "absolute",
  //   backgroundColor: colors.whiteFF,
  //   borderRadius: wp("1%"),
  //   left:2,
  //   padding: Platform.OS === "android" ? hp("1.5%") : hp("1.4%"),
  // }
});

export default styles;
