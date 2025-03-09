import { Dimensions } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
const screenWidth = Dimensions.get("window").width;
const screenwHeight = Dimensions.get("window").height;
//get width dimension
export const WidthDimension = (value) => {
  return screenWidth * value;
};

//get height dimension
export const HeightDimension = (value) => {
  return screenwHeight * value;
};

//horizontal spacing (width spacing (left,right))
//4px=>0.01 8px=>0,02 12=>0.03 16px=>0.04 20px=>0.05
//24=>0.06 28px=>0.07 32px=>0.08 36px=>0.09 40px=>0.1
export const horizontal = {
  _2px: WidthDimension(0.005),
  _4px: WidthDimension(0.01),
  _8px: WidthDimension(0.02),
  _10px: WidthDimension(0.025),
  _12px: WidthDimension(0.03),
  _14px: WidthDimension(0.035),
  _16px: WidthDimension(0.04),
  _20px: WidthDimension(0.05),
  _24px: WidthDimension(0.06),
  _28px: WidthDimension(0.017),
  _32px: WidthDimension(0.08),
  _36px: WidthDimension(0.09),
  _40px: WidthDimension(0.1),
};

//vertical spacing (height spacing (top ,bottom))
//4px=>0.007 8px=>0.012 12=>0.017 16px=>0.022 20px=>0.027
//24=>0.032 28px=>0.037 32px=>0.042 36px=>0.047 40px=>0.052
export const vertical = {
  _2px: HeightDimension(0.0045),
  _4px: HeightDimension(0.007),
  _6px: HeightDimension(0.0095),
  _8px: HeightDimension(0.012),
  _10px: HeightDimension(0.0145),
  _12px: HeightDimension(0.017),
  _16px: HeightDimension(0.022),
  _20px: HeightDimension(0.027),
  _24px: HeightDimension(0.032),
  _28px: HeightDimension(0.037),
  _32px: HeightDimension(0.042),
  _36px: HeightDimension(0.047),
  _40px: HeightDimension(0.052),
};

// textalignMent
const textAlignment = {
  textAlignRight: () => ({
    textAlign: "right",
  }),
  textAlignLeft: () => ({
    textAlign: "left",
  }),
  textAlignCenter: () => ({
    textAlign: "center",
  }),
};

// textTransformation
const textTransformation = {
  textUpperCase: () => ({
    textTransform: "uppercase",
  }),
};

const baseStyle = {
  // 400
  txtStyleInterRegular: (fontSize, fontColor) => ({
    fontFamily: "Inter-Regular",
    fontSize: hp(fontSize),
    color: fontColor,
  }),

  // 500
  txtStyleInterMedium: (fontSize, fontColor) => ({
    fontFamily: "Inter-Medium",
    fontSize: hp(fontSize),
    color: fontColor,
  }),

  // 700
  txtStyleInterSemiBold: (fontSize, fontColor) => ({
    fontFamily: "Inter-SemiBold",
    fontSize: hp(fontSize),
    color: fontColor,
  }),

  // bold
  txtStyleIntersBold: (fontSize, fontColor) => ({
    fontFamily: "Inter-Bold",
    fontSize: hp(fontSize),
    color: fontColor,
  }),

  //fontWeight
  fontWeight400: {
    fontWeight: "400",
  },
  fontWeight500: {
    fontWeight: "500",
  },
  fontWeight600: {
    fontWeight: "600",
  },
  fontWeight700: {
    fontWeight: "700",
  },
  fontWeight800: {
    fontWeight: "800",
  },
  fontWeight900: {
    fontWeight: "900",
  },
  fontWeight_Bold: {
    fontWeight: "bold",
  },

  //letterSpacing
  letterSpacing_1_2: {
    letterSpacing: 1.2,
  },

  //color
  textColor: (fontColor) => ({
    color: fontColor,
  }),
  // position
  relative: {
    position: "relative",
  },
  absolute: {
    position: "absolute",
  },

  //alignments
  alignSelfFS: {
    alignSelf: "flex-start",
  },
  alignSelfCenter: {
    alignSelf: "center",
  },
  alignSelfFE: {
    alignSelf: "flex-end",
  },
  alignSelfStetch: {
    alignSelf: "stretch",
  },

  alignItemsFS: {
    alignItems: "flex-start",
  },
  alignItemsCenter: {
    alignItems: "center",
  },
  alignItemsFE: {
    alignItems: "flex-end",
  },

  justifyContentFS: {
    justifyContent: "flex-start",
  },
  justifyContentCenter: {
    justifyContent: "center",
  },
  justifyContentFE: {
    justifyContent: "flex-end",
  },
  justifyContentSA: {
    justifyContent: "space-around",
  },
  justifyContentSB: {
    justifyContent: "space-between",
  },
  justifyContentSE: {
    justifyContent: "space-evenly",
  },

  textAlignCenter: {
    textAlign: "center",
  },
  textAlignLeft: {
    textAlign: "left",
  },
  textAlignRight: {
    textAlign: "right",
  },
  textAlignJustify: {
    textAlign: "justify",
  },
  textAlignVerticalCenter: {
    textAlignVertical: "center",
  },

  marginRightAuto: {
    marginRight: "auto",
  },
  marginLeftAuto: {
    marginLeft: "auto",
  },

  //margin
  margin: (value = 1) => ({
    margin: hp(value),
  }),
  marginTop: (value = 1) => ({
    marginTop: hp(value),
  }),
  marginBottom: (value = 1) => ({
    marginBottom: hp(value),
  }),
  marginLeft: (value = 1) => ({
    marginLeft: hp(value),
  }),
  marginRight: (value = 1) => ({
    marginRight: hp(value),
  }),
  marginHorizontal: (value = 1) => ({
    marginHorizontal: hp(value),
  }),
  marginVertical: (value = 1) => ({
    marginVertical: hp(value),
  }),

  //padding
  padding: (value = 1) => ({
    padding: hp(value),
  }),
  paddingTop: (value = 1) => ({
    paddingTop: hp(value),
  }),
  paddingBottom: (value = 1) => ({
    paddingBottom: hp(value),
  }),
  paddingLeft: (value = 1) => ({
    paddingLeft: hp(value),
  }),
  paddingRight: (value = 1) => ({
    paddingRight: hp(value),
  }),
  paddingHorizontal: (value = 1) => ({
    paddingHorizontal: hp(value),
  }),
  paddingVertical: (value = 1) => ({
    paddingVertical: hp(value),
  }),

  //flex
  flex0_9: {
    flex: 0.9,
  },
  flex0_8: {
    flex: 0.8,
  },
  flex0_7: {
    flex: 0.7,
  },
  flex0_6: {
    flex: 0.6,
  },
  flex0_5: {
    flex: 0.5,
  },
  flex0_4: {
    flex: 0.4,
  },
  flex1: {
    flex: 1,
  },
  flex2: {
    flex: 2,
  },
  flex3: {
    flex: 3,
  },
  flexDirectionRow: {
    flexDirection: "row",
    // backgroundColor: colors.white_FF,
  },
  flexDirectionColumn: {
    flexDirection: "column",
  },

  //custom shadow
  shadowBlack: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
  },

  shadowBlack_1: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },

  // border radius
  borderRadius4px: {
    borderRadius: 4,
  },
  borderRadius8px: {
    borderRadius: 8,
  },

  //font sizes
  font8px: {
    fontSize: WidthDimension(0.02),
  },
  font10px: {
    fontSize: WidthDimension(0.026),
  },
  font12px: {
    fontSize: WidthDimension(0.03),
  },
  font13px: {
    fontSize: WidthDimension(0.031),
  },
  font14px: {
    fontSize: WidthDimension(0.034),
  },
  font15px: {
    fontSize: WidthDimension(0.036),
  },
  font16px: {
    fontSize: WidthDimension(0.038),
  },
  font18px: {
    fontSize: WidthDimension(0.043),
  },
  font20px: {
    fontSize: WidthDimension(0.047),
  },
  font22px: {
    fontSize: WidthDimension(0.05),
  },
  font24px: {
    fontSize: WidthDimension(0.055),
  },
  font26px: {
    fontSize: WidthDimension(0.06),
  },

  //font family
  fontInterRegular: "Inter-Regula",
  fontInterSemiBold: "Inter-SemiBold",
  fontInterBold: "Inter-Bold",

  fontInter_bold: {
    fontFamily: "Inter-Bold",
  },
  fontInter_medium: {
    fontFamily: "Inter-Medium",
  },
  fontInter_regular: {
    fontFamily: "Inter-Regular",
  },
  fontInter_semibold: {
    fontFamily: "Inter-SemiBold",
  },

  // width
  width10Percentage: {
    width: "10%",
  },
  width20Percentage: {
    width: "20%",
  },
  width30Percentage: {
    width: "30%",
  },
  width33Percentage: {
    width: "33%",
  },
  width40Percentage: {
    width: "40%",
  },
  width50Percentage: {
    width: "50%",
  },
  width60Percentage: {
    width: "60%",
  },
  width70Percentage: {
    width: "70%",
  },
  width80Percentage: {
    width: "80%",
  },
  width90Percentage: {
    width: "90%",
  },
  width92Percentage: {
    width: "92%",
  },
  width94Percentage: {
    width: "94%",
  },
  width96Percentage: {
    width: "96%",
  },
  width98Percentage: {
    width: "98%",
  },
  width100Percentage: {
    width: "100%",
  },
  screenContainer: {
    width: "90%",
    alignSelf: "center",
  },
};

export { baseStyle, textAlignment, textTransformation };
