import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import navigationServices from '../../../navigation/navigationServices';
import { SCREENS } from '../../../navigation/screens';
import { addOrUpdateInvestment } from '../../../redux/slice/authSlice';

const buttons = [
  { name: 'Take Order', color: '#FF5A5F', screen: SCREENS?.OREDERTAKING },
  { name: 'Reports', color: '#3498DB', screen: SCREENS?.Report },
  { name: 'Inventory', color: '#3498DB', screen: SCREENS.INVESTEDAMOUNT },
];

export default function HomeScreen() {
  const dispatch = useDispatch();

  const [invested, setInvested] = useState('');
  const [returns, setReturns] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!invested || !returns) {
      Alert.alert('Validation', 'Enter both invested and returns amounts');
      return;
    }

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const investmentData = {
      date: today,
      invested: Number(invested),
      returns: Number(returns),
      createdAt: firestore.FieldValue.serverTimestamp(),
    };

    try {
      setLoading(true);

      // 1️⃣ Add to Firestore
      const docRef = await firestore().collection('investments').add(investmentData);

      // 2️⃣ Dispatch to Redux
      dispatch(addOrUpdateInvestment({ id: docRef.id, ...investmentData }));

      Alert.alert('Success', 'Investment saved successfully!');
      setInvested('');
      setReturns('');
    } catch (error) {
      console.error('🔥 Firestore save error:', error);
      Alert.alert('Error', 'Failed to save investment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Store Dashboard</Text>

      {/* Navigation Buttons */}
      {buttons.map((btn, index) => (
        <View key={index} style={{ marginBottom: 10 }}>
          <IconButton button={btn} onPress={() => navigationServices?.navigate(btn?.screen)} />
        </View>
      ))}

      <Text style={styles.subHeading}>Daily Investment</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Invested Amount"
          keyboardType="numeric"
          value={invested}
          onChangeText={setInvested}
        />
        <TextInput
          style={styles.input}
          placeholder="Returns Amount"
          keyboardType="numeric"
          value={returns}
          onChangeText={setReturns}
        />
        <TouchableOpacity
          style={[styles.saveButton, { opacity: loading ? 0.6 : 1 }]}
          disabled={loading}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>{loading ? 'Saving...' : 'Save'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function IconButton({ button, onPress }) {
  return (
    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={onPress}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: button.color,
          padding: 15,
          borderRadius: 10,
          flex: 1,
        }}
      >
        <Text style={{ color: '#FFF', fontWeight: 'bold', marginLeft: 10 }}>{button.name}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', padding: 15 },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
  subHeading: { fontSize: 20, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  inputContainer: { marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#FF5A5F',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});
