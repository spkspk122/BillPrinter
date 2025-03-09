import React from "react";
import { 
  StyleSheet, Text, View, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard 
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { colors } from "../../../utlis/colors";
import LinearGradient from "react-native-linear-gradient";
import TextInputComponent from "../../../components/TextInput";
import CustomSafeArea from "../../../components/CustomSafeArea";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { baseStyle } from "../../../utlis/baseStyle.js/theme";
import Button from "../../../components/Button";
import navigationServices from "../../../navigation/navigationServices";
import { SCREENS } from "../../../navigation/screens";

// Validation Schema
const validationSchema = Yup.object().shape({
  phoneNumber: Yup.string()
    .matches(/^[0-9]+$/, "Only numeric values allowed")
    .min(10, "Phone number must be at least 10 digits")
    .required("Phone number is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function Login() {
  return (
    <CustomSafeArea backgroundColor={colors.redFF} style={styles.container}>
      {/* Dismiss keyboard when tapping outside */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <LinearGradient colors={["#FF939B", "#EF2A39"]} style={styles.container}>
          
          {/* Prevent bottom sheet from moving when keyboard appears */}
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"} 
            style={styles.bottomSheetContainer}
          >
            <View style={styles.bottomSheet}>
              <Text style={baseStyle.txtStyleIntersBold('3.5%', colors.black, baseStyle.marginBottom('5%'))}>
                Login
              </Text>

              {/* Formik Form */}
              <Formik
                initialValues={{ phoneNumber: "", password: "" }}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                  console.log("Login Data:", values);
                  navigationServices.navigateAndReset(SCREENS.HOME)
                }}
              >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                  <>
                    {/* Phone Number Input */}
                    <TextInputComponent 
                      placeholder="Phone Number"
                      keyboardType="numeric"
                      value={values.phoneNumber}
                      onChangeText={handleChange("phoneNumber")}
                      onBlur={handleBlur("phoneNumber")}
                      enableErrorMsg={touched.phoneNumber && errors.phoneNumber ? errors.phoneNumber : ""}
                      errorMsg={errors?.phoneNumber}
                      maxLength={10}
                    />

                    {/* Password Input */}
                    <TextInputComponent 
                      placeholder="Password"
                      secureTextEntry
                      value={values.password}
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      enableErrorMsg={touched.password && errors.password ? errors.password : ""}
                      errorMsg={errors?.password}
                      containerStyle={baseStyle.marginTop(5)}
                    />

                    {/* Login Button */}
                    <Button btnLabel="Login" isPrimaryButton onPress={handleSubmit} buttonStyle={baseStyle.marginTop(5)} />
                  </>
                )}
              </Formik>

            </View>
          </KeyboardAvoidingView>
        </LinearGradient>
      </TouchableWithoutFeedback>
    </CustomSafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomSheetContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  bottomSheet: {
    width: "100%",
    height: hp("60%"),
    backgroundColor: colors.whiteFF,
    borderTopLeftRadius: wp("10%"),
    borderTopRightRadius: wp("10%"),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    alignItems: "center",
    padding: 20,
  },
});

