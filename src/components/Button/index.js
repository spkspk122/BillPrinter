import React, { useRef, useEffect } from "react";
import { Text, TouchableOpacity, Animated, View, Image } from "react-native";
import PropTypes from "prop-types"; // Import PropTypes
import LinearGradient from "react-native-linear-gradient"; // Import LinearGradient
import styles from "./styles";
import { colors } from "../../utlis/colors";
// Helper function to get button styles
const getButtonStyles = (isPrimaryButton, isEmptyButton, disabled, buttonStyle) => {
  let baseStyle;

  if (isPrimaryButton) {
    baseStyle = [
      styles.primaryblueButton,
      { backgroundColor: disabled ? colors.red2e : colors.redFF }
    ];
  } else if (isEmptyButton) {
    baseStyle = styles.emptyButton;
  } else {
    baseStyle = styles.secondaryButton; // Default to secondaryButton style
  }

  return [baseStyle, buttonStyle];
};

// Helper function to get text styles
const getTextStyles = (isPrimaryButton, isEmptyButton, textColor) => {
  let baseStyle;

  if (isPrimaryButton) {
    baseStyle = styles.whiteBtnColor;
  } else if (isEmptyButton) {
    baseStyle = styles.redBtnColor;
  } else {
    baseStyle = styles.whiteBtnColor; // Default to whiteBtnColor style
  }

  return [baseStyle, textColor];
};

export default function Button(props) {
  const {
    onPress = () => { },
    btnLabel = "",
    textColor = {},
    disabled = false,
    buttonStyle = {},
    isPrimaryButton = false,
    isEmptyButton = false,
    activeOpacity = 0.7,
    shineEnabled = false,
    prefixIcon ,
    preFixIconStyle
  } = props;

  const buttonStyles = getButtonStyles(isPrimaryButton, isEmptyButton, disabled, buttonStyle);
  const textStyles = getTextStyles(isPrimaryButton, isEmptyButton, textColor);

  // Shine effect animation setup
  const shineAnim = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shineAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
  }, [shineAnim]);

  const translateX = shineAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-200, 200], // Adjust based on button width
  });

  return (
    <TouchableOpacity
      style={buttonStyles}
      disabled={disabled}
      onPress={onPress}
      activeOpacity={activeOpacity}
    >
      {
        Boolean(prefixIcon) &&
        (
          <View style={preFixIconStyle}>
            {prefixIcon}
          </View>
        )
      }
      {Boolean(btnLabel) && (
        <Text style={textStyles}>
          {btnLabel}
        </Text>
      )}
      {/* Shine Effect */}
      {shineEnabled && <Animated.View style={[styles.shineOverlay, { transform: [{ translateX }] }]}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        />
      </Animated.View>}
    </TouchableOpacity>
  );
}

// Define prop types for the Button component
Button.propTypes = {
  onPress: PropTypes.func,
  btnLabel: PropTypes.string,
  textColor: PropTypes.object,
  disabled: PropTypes.bool,
  buttonStyle: PropTypes.object,
  isPrimaryButton: PropTypes.bool,
  isEmptyButton: PropTypes.bool,
  activeOpacity: PropTypes.number,
  shineEnabled: PropTypes.bool,
  prefixIcon: PropTypes.any

};
