import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import navigationServices from '../../../navigation/navigationServices';
import { SCREENS } from '../../../navigation/screens';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigationServices?.navigateAndReset(SCREENS?.LOGIN)
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require('../../../assest/images/logo.png')} style={styles.logo} />
      <Text style={styles.text}>Billing</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
  logo: { width: 120, height: 120 },
  text: { marginTop: 20, fontSize: 28, fontWeight: 'bold', color: '#FF5A5F' }
});
