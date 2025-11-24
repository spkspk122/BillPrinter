import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  Animated,
} from 'react-native';
import { useDispatch } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import LinearGradient from 'react-native-linear-gradient';
import navigationServices from '../../../navigation/navigationServices';
import { addExpense } from '../../../redux/slice/authSlice';

// Expense Categories
const EXPENSE_CATEGORIES = [
  { id: 'basic', name: 'Basic Expenses', icon: '🏠', color: '#FF5A5F' },
  { id: 'food', name: 'Food & Groceries', icon: '🍔', color: '#FF9500' },
  { id: 'transport', name: 'Transportation', icon: '🚗', color: '#007AFF' },
  { id: 'utilities', name: 'Utilities', icon: '💡', color: '#5856D6' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#FF2D55' },
  { id: 'healthcare', name: 'Healthcare', icon: '🏥', color: '#AF52DE' },
  { id: 'education', name: 'Education', icon: '📚', color: '#34C759' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️', color: '#FF3B30' },
  { id: 'savings', name: 'Savings', icon: '💰', color: '#27AE60' },
  { id: 'others', name: 'Others', icon: '📦', color: '#8E8E93' },
];

// Function to extract amount from text
const extractAmountFromText = (text) => {
  // Match patterns like: ₹500, Rs.500, Rs 500, 500, spent 500, paid 500
  const patterns = [
    /₹\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/,  // ₹500 or ₹1,000.50
    /[Rr][Ss]\.?\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/,  // Rs.500 or Rs 500
    /(?:spent|paid|cost|costs|price|amount)\s*[:\-]?\s*₹?\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/i,  // spent 500
    /\b(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:rupees|rs|inr)/i,  // 500 rupees
    /(?:^|\s)(\d{2,}(?:,\d{3})*(?:\.\d{2})?)\b/,  // standalone numbers (2+ digits)
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      // Remove commas and parse
      const amount = match[1].replace(/,/g, '');
      const parsed = parseFloat(amount);
      if (!isNaN(parsed) && parsed > 0) {
        return parsed.toString();
      }
    }
  }
  return null;
};

export default function AddExpenseScreen() {
  const dispatch = useDispatch();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Auto-detect amount from description
  const handleDescriptionChange = (text) => {
    let updatedText = text;

    // Auto-insert ₹ symbol after keywords when user types space after number
    const keywords = ['spent', 'paid', 'cost', 'costs', 'price', 'amount', 'rs', 'rupees'];

    // Check if text ends with a space (user just finished typing a word)
    if (text.endsWith(' ') && text.length > 1) {
      const words = text.trim().toLowerCase().split(' ');
      const lastWord = words[words.length - 1];
      const secondLastWord = words.length > 1 ? words[words.length - 2] : '';

      // If user just typed a keyword followed by space and then a number followed by space
      if (keywords.includes(secondLastWord) && /^\d+$/.test(lastWord)) {
        // Check if ₹ is not already there
        const beforeNumber = text.substring(0, text.lastIndexOf(lastWord));
        if (!beforeNumber.includes('₹')) {
          updatedText = beforeNumber + '₹' + lastWord + ' ';
        }
      }
    }

    setDescription(updatedText);

    // Only auto-fill amount field if it's empty and text contains space (word completed)
    if (!amount && updatedText.includes(' ')) {
      const detectedAmount = extractAmountFromText(updatedText);
      if (detectedAmount) {
        setAmount(detectedAmount);
      }
    }
  };

  const onDateChange = (event, date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleSaveExpense = () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      Alert.alert('Validation', 'Please enter a valid amount');
      return;
    }

    if (!selectedCategory) {
      Alert.alert('Validation', 'Please select a category');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Validation', 'Please enter a description');
      return;
    }

    const expenseData = {
      id: `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount: Number(amount),
      description: description.trim(),
      category: selectedCategory.name,
      categoryId: selectedCategory.id,
      date: selectedDate.toISOString(),
      createdAt: new Date().toISOString(),
    };

    // Save to Redux (persisted automatically)
    dispatch(addExpense(expenseData));

    Alert.alert('Success', 'Expense added successfully!', [
      {
        text: 'OK',
        onPress: () => {
          setAmount('');
          setDescription('');
          setSelectedCategory(null);
          setSelectedDate(new Date());
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#E8F5E9', '#F8F9FA', '#F8F9FA']}
        style={styles.gradient}
      >
        <ScrollView style={styles.scrollView}>
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }}
      >
        <Text style={styles.heading}>Add New Expense</Text>
      </Animated.View>

      {/* Date Picker */}
      <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
        <Text style={styles.label}>Date</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateButtonText}>
            {selectedDate.toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
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
      </Animated.View>

      {/* Amount Input */}
      <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
        <Text style={styles.label}>Amount (₹)</Text>
        <TextInput
          style={styles.amountInput}
          placeholder="0"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          placeholderTextColor="#999"
        />
      </Animated.View>

      {/* Category Selection */}
      <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
        <Text style={styles.label}>Category</Text>
        <View style={styles.categoriesGrid}>
          {EXPENSE_CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryCard,
                selectedCategory?.id === category.id && styles.categoryCardSelected,
                { borderColor: category.color },
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={styles.categoryText}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      {/* Description Input */}
      <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
        <Text style={styles.label}>Description</Text>
        <Text style={styles.helperText}>Tip: Include amount in description (e.g., "Spent ₹500 on groceries")</Text>
        <TextInput
          style={styles.descriptionInput}
          placeholder="What did you spend on? (e.g., Paid ₹500 for groceries)"
          value={description}
          onChangeText={handleDescriptionChange}
          multiline
          numberOfLines={3}
          placeholderTextColor="#999"
        />
      </Animated.View>

      {/* Save Button */}
      <Animated.View style={{ opacity: fadeAnim }}>
        <TouchableOpacity
          style={[styles.saveButton, { opacity: loading ? 0.6 : 1 }]}
          disabled={loading}
          onPress={handleSaveExpense}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Saving...' : 'Save Expense'}
          </Text>
        </TouchableOpacity>

        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigationServices.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>Cancel</Text>
        </TouchableOpacity>
      </Animated.View>
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
    padding: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 30,
    marginTop: Platform.OS === 'ios' ? 10 : 0,
    letterSpacing: -0.5,
  },
  section: {
    marginBottom: 28,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  helperText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#27AE60',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  dateButton: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#FF5A5F',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#FF5A5F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dateButtonText: {
    color: '#FF5A5F',
    fontSize: 16,
    fontWeight: '700',
  },
  amountInput: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 18,
    fontSize: 32,
    fontWeight: '800',
    color: '#1A1A1A',
    textAlign: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderRadius: 14,
    padding: 14,
    width: '31%',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  categoryCardSelected: {
    backgroundColor: '#FFF0F1',
    borderWidth: 3,
    elevation: 4,
    transform: [{ scale: 1.05 }],
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 6,
  },
  categoryText: {
    fontSize: 11,
    color: '#333',
    textAlign: 'center',
    fontWeight: '600',
  },
  descriptionInput: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
    height: 90,
    textAlignVertical: 'top',
    fontWeight: '500',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  saveButton: {
    backgroundColor: '#FF5A5F',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    elevation: 4,
    shadowColor: '#FF5A5F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  backButton: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  backButtonText: {
    color: '#666',
    fontWeight: '700',
    fontSize: 16,
  },
});
