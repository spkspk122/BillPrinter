import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import navigationServices from '../../../navigation/navigationServices';
import { SCREENS } from '../../../navigation/screens';
import { clearData } from '../../../redux/slice/authSlice';

const buttons = [
  { name: 'Take Order', color: '#FF5A5F', screen: SCREENS?.OREDERTAKING },
  { name: 'Reports', color: '#3498DB', screen: SCREENS?.Report },
  { name: 'Inventory', color: '#3498DB', screen: SCREENS.INVESTEDAMOUNT },
];

export default function HomeScreen() {
  const dispatch = useDispatch();
  const role = useSelector(state => state.authSlice.role);
  const [invested, setInvested] = useState('');
  const [returns, setReturns] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleLogout = () => {
    dispatch(clearData()); // Clear role
    navigationServices.navigate(SCREENS.LOGIN); // Go to login
  };

  const onDateChange = (event, date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleSave = async () => {
    if (!invested || !returns) {
      Alert.alert('Validation', 'Enter both invested and returns amounts');
      return;
    }

    const formattedDate = selectedDate.toISOString().split('T')[0];

    // Generate unique ID manually
    const docId = `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const investmentData = {
      date: formattedDate,
      invested: Number(invested),
      returns: Number(returns),
      createdAt: new Date().toISOString(),
    };

    console.log('📊 Saving investment:', investmentData);

    try {
      setLoading(true);

      // Use .set() instead of .add() to avoid hanging
      await firestore()
        .collection('investments')
        .doc(docId)
        .set(investmentData);

      console.log('✅ Investment saved with ID:', docId);

      Alert.alert('Success', 'Investment saved successfully!');
      setInvested('');
      setReturns('');
      setSelectedDate(new Date());
    } catch (error) {
      console.error('🔥 Firestore save error:', error);
      Alert.alert('Error', `Failed to save: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Store Dashboard</Text>

      {/* ✅ Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* Navigation Buttons */}
      {buttons
        .filter(btn => !(role === 'owner' && btn.name === 'Take Order'))
        .map((btn, index) => (
          <View key={index} style={{ marginBottom: 10 }}>
            <IconButton button={btn} onPress={() => navigationServices?.navigate(btn?.screen)} />
          </View>
        ))}

      {role !== 'owner' && (
        <>
          <Text style={styles.subHeading}>Daily Investment</Text>

          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateButtonText}>
                Date: {selectedDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onDateChange}
                maximumDate={new Date()}
              />
            )}

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
        </>
      )}
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
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  logoutButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#ff3b30',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 15,
  },
  logoutText: { color: '#FFF', fontWeight: 'bold' },
  subHeading: { fontSize: 20, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  inputContainer: { marginTop: 10 },
  dateButton: {
    borderWidth: 1,
    borderColor: '#3498DB',
    backgroundColor: '#E8F4F8',
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
  },
  dateButtonText: {
    color: '#3498DB',
    fontSize: 16,
    fontWeight: '600',
  },
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
