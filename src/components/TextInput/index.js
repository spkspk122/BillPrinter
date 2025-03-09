import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
//packages
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
//assets and constants
import { iconpathurl } from "../../asset/iconpath";

// import EYECLSOE from '../../asset/svg/eyeclose.svg'
// import EYEOPEN from '../../asset/svg/Eye.svg'
import { colors } from "../../utlis/colors";
import { string } from "../../constant/strings";
import { baseStyle } from "../../utlis/baseStyle.js/theme";

const TextInputComponent = ({
  onChangeText,
  value,
  maxLength,
  placeholder = string.enterHere,
  placeholderTextColor = colors.blue63,
  keyboardType,
  containerStyle,
  secureKey = false,
  textCaptitalize,
  errorTextStyle,
  enableErrorMsg,
  errorMsg,
  inputTextStyle,
  returnKeyType,
  editable,
  disabled,
  isPrefixValue,
  isSuffixValue,
  prefixIcon,
  multiline,
  TextBoxLabel,
  customStyle = {},
  onBlur,
  ref
}) => {

  const [show, setShow] = useState(secureKey);
  const onPressSecure = () => {
    setShow(!show)
  }
  return (
    <View style={customStyle}>
      {Boolean(TextBoxLabel) && <Text style={styles.TextBoxLabel}>{TextBoxLabel}</Text>}
      <View style={{ ...styles.container, ...containerStyle, backgroundColor: !disabled ? colors.greyE8 :colors.whiteFF}}>
        {Boolean(prefixIcon) && (

          <View style={styles.suffixIconImg}>{prefixIcon}</View>
        )}
        <TextInput
          secureTextEntry={show}
          style={[
            styles.inputStyle,
            inputTextStyle,
            { width: secureKey ? "90%" : "95%" },
            {
              width: isPrefixValue || isSuffixValue ? "75%" : "95%",
              color: value !== "" && colors.black,
            },
          ]}
          ref={ref}
          onChangeText={onChangeText}
          maxLength={maxLength}
          keyboardType={keyboardType}
          autoCorrect={false}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          value={value}
          autoCapitalize={textCaptitalize}
          returnKeyType={returnKeyType}
          editable={disabled}
          multiline={multiline}
          onBlur={onBlur}

        />

        {secureKey && (
          <TouchableOpacity onPress={onPressSecure} disabled={editable}>
            {!show ? (
            <></>
            ) : (
             <></>
            )}
          </TouchableOpacity>
        )}
      </View>
      {enableErrorMsg && Boolean(errorMsg) && (
        <Text style={{ ...styles.errorText, ...errorTextStyle }}>
          {errorMsg}
        </Text>
      )}
    </View>
  );
};

TextInputComponent.propTypes = {
  onChangeText: PropTypes.func,
  value: PropTypes.string,
  maxLength: PropTypes.number,
  placeholder: PropTypes.string,
  placeholderTextColor: PropTypes.string,
  keyboardType: PropTypes.string,
  containerStyle: PropTypes.object,
  secureKey: PropTypes.bool,
  textCaptitalize: PropTypes.string,
  onPressSecure: PropTypes.func,
  hidden: PropTypes.bool,
  errorTextStyle: PropTypes.object,
  enableErrorMsg: PropTypes.bool,
  errorMsg: PropTypes.string,
  inputTextStyle: PropTypes.object,
  returnKeyType: PropTypes.string,
  editable: PropTypes.bool,
  disabled: PropTypes.bool,
  isCountryCode: PropTypes.bool,
  isPrefixValue: PropTypes.string,
  isSuffixValue: PropTypes.string,
  suffixIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  locationImg: PropTypes.bool,
  multiline: PropTypes.bool,
  prefixIcon: PropTypes.any,
  TextBoxLabel: PropTypes.string,
  onBlur: PropTypes?.func
};

TextInputComponent.defaultProps = {
  onChangeText: () => { },
  value: "",
  maxLength: 250,
  placeholder: string.enterHere,
  placeholderTextColor: colors.blue63,
  keyboardType: "default",
  containerStyle: {},
  secureKey: false,
  textCaptitalize: "none",
  onPressSecure: () => { },
  hidden: false,
  errorTextStyle: {},
  enableErrorMsg: false,
  errorMsg: "",
  inputTextStyle: {},
  returnKeyType: "default",
  editable: false,
  disabled: true,
  isCountryCode: false,
  isPrefixValue: "",
  isSuffixValue: "",
  suffixIcon: null,
  prefixIcon: null,
  locationImg: false,
  multiline: false,
  TextBoxLabel: null
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    borderRadius: 4,
    paddingHorizontal: 12,
    alignItems: "center",
    height:
      Platform.OS === "ios"
        ? widthPercentageToDP("11%")
        : widthPercentageToDP("11%"),
    backgroundColor: colors.grey48,
    borderColor: colors.greyC6,
    borderWidth: 0.5
  },
  TextBoxLabel: {
    ...baseStyle.txtStyleInterMedium("1.8%", colors.whiteFF),
    marginBottom: heightPercentageToDP("1%"),
    marginTop: heightPercentageToDP("2%"),
    textTransform:"capitalize"
  },
  inputStyle: {
    width: "95%",
    ...baseStyle.txtStyleInterMedium("1.5%", colors.blue63),
    textAlignVertical: "center",
    letterSpacing: 0.18,
    paddingVertical: 6,
  },
  hideshowLabel: {
    ...baseStyle.fontInter_regular,
    letterSpacing: 0.18,
    color: colors.blue_B3,
  },
  errorText: {
    ...baseStyle.txtStyleInterMedium("1.6%", colors.red00),
    ...baseStyle.alignSelfFS,
    ...baseStyle.marginTop("1%"),
  },

  suffixIconImg: {
    width: widthPercentageToDP("5%"),
    height: widthPercentageToDP("5%"),
    resizeMode: "contain",
    marginLeft: 5,
    marginRight: 6,
  }
});

export default TextInputComponent;
