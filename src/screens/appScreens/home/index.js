import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Platform, Animated } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import navigationServices from '../../../navigation/navigationServices';
import { SCREENS } from '../../../navigation/screens';
import { clearData, selectMonthlySalary, selectExpenses, setMonthlySalary } from '../../../redux/slice/authSlice';

export default function HomeScreen() {
  const dispatch = useDispatch();
  const role = useSelector(state => state.authSlice.role);
  const monthlySalary = useSelector(selectMonthlySalary);
  const expenses = useSelector(selectExpenses);

  const [salary, setSalary] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSalarySetup, setShowSalarySetup] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (monthlySalary) {
      setSalary(monthlySalary.amount?.toString() || '');
    }
  }, [monthlySalary]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Calculate total expenses for current month
  const getCurrentMonthExpenses = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return expenses
      .filter(exp => {
        const expDate = new Date(exp.date);
        return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
      })
      .reduce((total, exp) => total + (exp.amount || 0), 0);
  };

  // Calculate expenses by category
  const getExpensesByCategory = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyExpenses = expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
    });

    const categories = {};
    monthlyExpenses.forEach(exp => {
      const cat = exp.category || 'Others';
      categories[cat] = (categories[cat] || 0) + exp.amount;
    });

    return categories;
  };

  const totalExpenses = getCurrentMonthExpenses();
  const remaining = (monthlySalary?.amount || 0) - totalExpenses;
  const expenseCategories = getExpensesByCategory();

  const handleLogout = () => {
    dispatch(clearData());
    navigationServices.navigate(SCREENS.LOGIN);
  };

  const handleSaveSalary = () => {
    if (!salary || isNaN(salary) || Number(salary) <= 0) {
      Alert.alert('Validation', 'Please enter a valid salary amount');
      return;
    }

    const salaryData = {
      amount: Number(salary),
      updatedAt: new Date().toISOString(),
      currency: 'INR',
    };

    // Save to Redux (persisted automatically)
    dispatch(setMonthlySalary(salaryData));
    Alert.alert('Success', 'Monthly salary saved successfully!');
    setShowSalarySetup(false);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFE5E7', '#F8F9FA', '#F8F9FA']}
        style={styles.gradient}
      >
        <ScrollView style={styles.scrollView}>
      <Animated.View
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.heading}>MoneyWise</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Monthly Summary Card */}
      <Animated.View
        style={[
          styles.summaryCard,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Monthly Salary</Text>
          <TouchableOpacity onPress={() => setShowSalarySetup(!showSalarySetup)}>
            <Text style={styles.editButton}>Edit</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.summaryAmount}>₹{(monthlySalary?.amount || 0).toLocaleString()}</Text>

        <View style={styles.divider} />

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Expenses</Text>
          <Text style={[styles.summaryAmount, styles.expenseAmount]}>
            ₹{totalExpenses.toLocaleString()}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Remaining</Text>
          <Text style={[styles.summaryAmount, remaining >= 0 ? styles.positiveAmount : styles.negativeAmount]}>
            ₹{remaining.toLocaleString()}
          </Text>
        </View>
      </Animated.View>

      {/* Salary Setup Form */}
      {showSalarySetup && (
        <Animated.View style={styles.salarySetupCard}>
          <Text style={styles.subHeading}>Set Monthly Salary</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your monthly salary"
            keyboardType="numeric"
            value={salary}
            onChangeText={setSalary}
          />
          <TouchableOpacity
            style={[styles.saveButton, { opacity: loading ? 0.6 : 1 }]}
            disabled={loading}
            onPress={handleSaveSalary}
          >
            <Text style={styles.saveButtonText}>{loading ? 'Saving...' : 'Save Salary'}</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Expense Categories Summary */}
      {Object.keys(expenseCategories).length > 0 && (
        <Animated.View
          style={[
            styles.categoriesCard,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <Text style={styles.subHeading}>Expenses by Category</Text>
          {Object.entries(expenseCategories).map(([category, amount]) => (
            <View key={category} style={styles.categoryRow}>
              <Text style={styles.categoryName}>{category}</Text>
              <Text style={styles.categoryAmount}>₹{amount.toLocaleString()}</Text>
            </View>
          ))}
        </Animated.View>
      )}
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: Platform.OS === 'ios' ? 10 : 0,
  },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  logoutText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14
  },
  summaryCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 15,
    color: '#666',
    fontWeight: '600'
  },
  summaryAmount: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  expenseAmount: {
    fontSize: 20,
    color: '#FF5A5F',
    fontWeight: '700',
  },
  positiveAmount: {
    fontSize: 20,
    color: '#27AE60',
    fontWeight: '700',
  },
  negativeAmount: {
    fontSize: 20,
    color: '#E74C3C',
    fontWeight: '700',
  },
  editButton: {
    color: '#FF5A5F',
    fontSize: 15,
    fontWeight: '700'
  },
  divider: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginVertical: 16,
  },
  salarySetupCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  categoriesCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  categoryName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600'
  },
  categoryAmount: {
    fontSize: 16,
    color: '#FF5A5F',
    fontWeight: '700'
  },
  subHeading: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 16,
    color: '#1A1A1A',
    letterSpacing: -0.3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#FFF',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#FF5A5F',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#FF5A5F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
