import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import navigationServices from '../../../navigation/navigationServices';
import { SCREENS } from '../../../navigation/screens';
import { clearData } from '../../../redux/slice/authSlice';

const buttons = [
  { name: 'Take Order', icon: '🛒', color: '#FF5A5F', screen: SCREENS?.OREDERTAKING },
  { name: 'Orders', icon: '📋', color: '#8E44AD', screen: SCREENS?.ORDERLIST },
  { name: 'Reports', icon: '📊', color: '#3498DB', screen: SCREENS?.Report },
  { name: 'Inventory', icon: '📦', color: '#27ae60', screen: SCREENS.INVESTEDAMOUNT },
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
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>👋 Welcome!</Text>
          <Text style={styles.heading}>Store Dashboard</Text>
        </View>
        {/* ✅ Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>🚪 Logout</Text>
        </TouchableOpacity>
      </View>

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
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>💵</Text>
            <Text style={styles.subHeading}>Daily Investment</Text>
          </View>

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
    <TouchableOpacity style={styles.buttonWrapper} onPress={onPress}>
      <View style={[styles.iconButton, { backgroundColor: button.color }]}>
        <View style={styles.iconCircle}>
          <Text style={styles.buttonIcon}>{button.icon}</Text>
        </View>
        <Text style={styles.buttonText}>{button.name}</Text>
        <Text style={styles.buttonArrow}>›</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 15
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 25,
  },
  greeting: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 4,
    fontWeight: '500',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  logoutButton: {
    backgroundColor: '#E74C3C',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    shadowColor: '#E74C3C',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  logoutText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  buttonWrapper: {
    marginBottom: 15,
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  iconCircle: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  buttonIcon: {
    fontSize: 22,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 17,
    flex: 1,
  },
  buttonArrow: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: '300',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 15,
  },
  sectionIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  subHeading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  inputContainer: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  dateButton: {
    borderWidth: 2,
    borderColor: '#3498DB',
    backgroundColor: '#EBF5FB',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    alignItems: 'center',
  },
  dateButtonText: {
    color: '#3498DB',
    fontSize: 16,
    fontWeight: '700',
  },
  input: {
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#FFF',
    color: '#2C3E50',
  },
  saveButton: {
    backgroundColor: '#27ae60',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#27ae60',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 17,
  },
});
