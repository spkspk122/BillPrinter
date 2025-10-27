import React from 'react';
import { View, TextInput, Text, StyleSheet, Image, Alert } from 'react-native';
import { Formik } from 'formik';
import Button from '../../../components/Button';
import * as Yup from 'yup';
import navigationServices from '../../../navigation/navigationServices';
import { SCREENS } from '../../../navigation/screens';
import { useDispatch } from 'react-redux';
import { setUserRole } from '../../../redux/slice/authSlice';

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();

  const loginValidation = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password too short').required('Password is required'),
  });

  const handleLogin = (values) => {
    let role = null;

    if (values.email === 'owner@gmail.com' && values.password === '123456') {
      role = 'owner';
    } else if (values.email === 'user@gmail.com' && values.password === '123456') {
      role = 'user';
    } else {
      Alert.alert('Login Failed', 'Invalid email or password');
      return;
    }

    // ✅ Save role in Redux
    dispatch(setUserRole(role));

    // ✅ Navigate to HOME
    navigationServices.navigateAndReset(SCREENS.HOME);
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../../assest/images/logo.png')} style={styles.logoImage} />
      <Text style={styles.logoText}> Billing</Text>

      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={loginValidation}
        onSubmit={handleLogin}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <>
            <TextInput
              style={styles.input}
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
            />
            {errors.email && touched.email && <Text style={styles.error}>{errors.email}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
            />
            {errors.password && touched.password && <Text style={styles.error}>{errors.password}</Text>}

            <Button text="Login" onPress={handleSubmit} />
          </>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#FFF' },
  logoImage: { width: 120, height: 120, alignSelf: 'center', marginBottom: 20 },
  logoText: { fontSize: 28, fontWeight: 'bold', color: '#FF5A5F', textAlign: 'center', marginBottom: 40 },
  input: { borderWidth: 1, borderColor: '#CCC', borderRadius: 8, padding: 10, marginBottom: 10 },
  error: { color: 'red', marginBottom: 5 }
});
