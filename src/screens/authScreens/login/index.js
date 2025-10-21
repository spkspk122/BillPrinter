import React from 'react';
import { View, TextInput, Text, StyleSheet, Image } from 'react-native';
import { Formik } from 'formik';
import Button from '../../../components/Button';
import * as Yup from 'yup';
import navigationServices from '../../../navigation/navigationServices';
import { SCREENS } from '../../../navigation/screens';

export default function LoginScreen({ navigation }) {
  const loginValidation = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password too short').required('Password is required'),
  });

  return (
    <View style={styles.container}>
      {/* Logo Image */}
      <Image source={require('../../../assest/images/logo.png')} style={styles.logoImage} />

      {/* App Name */}
      <Text style={styles.logoText}> Billing</Text>

      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={loginValidation}
        onSubmit={values => navigationServices?.navigate(SCREENS.HOME)}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <>
            <TextInput
              style={styles.input}
              placeholder="Email"
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
