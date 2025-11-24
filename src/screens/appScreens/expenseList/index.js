import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Platform,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { selectExpenses, updateExpenses, deleteExpense } from '../../../redux/slice/authSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';

const EXPENSE_CATEGORIES = [
  { id: 'basic', name: 'Basic Expenses', icon: '🏠', color: '#FF5A5F' },
  { id: 'food', name: 'Food & Groceries', icon: '🍔', color: '#FF9500' },
  { id: 'transport', name: 'Transportation', icon: '🚗', color: '#007AFF' },
  { id: 'utilities', name: 'Utilities', icon: '💡', color: '#5856D6' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#FF2D55' },
  { id: 'healthcare', name: 'Healthcare', icon: '🏥', color: '#AF52DE' },
  { id: 'education', name: 'Education', icon: '📚', color: '#34C759' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️', color: '#FF3B30' },
  { id: 'others', name: 'Others', icon: '📦', color: '#8E8E93' },
];

export default function ExpenseListScreen() {
  const dispatch = useDispatch();
  const expenses = useSelector(selectExpenses);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [editAmount, setEditAmount] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategory, setEditCategory] = useState(null);
  const [editDate, setEditDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const sortedExpenses = [...expenses].sort((a, b) =>
    new Date(b.date) - new Date(a.date)
  );

  const handleEdit = (expense) => {
    setSelectedExpense(expense);
    setEditAmount(expense.amount.toString());
    setEditDescription(expense.description);
    setEditCategory(EXPENSE_CATEGORIES.find(cat => cat.name === expense.category));
    setEditDate(new Date(expense.date));
    setEditModalVisible(true);
  };

  const handleDelete = (expense) => {
    Alert.alert(
      'Delete Expense',
      `Are you sure you want to delete this expense?\n\n"${expense.description}" - ₹${expense.amount}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            dispatch(deleteExpense(expense.id));
            Alert.alert('Success', 'Expense deleted successfully!');
          },
        },
      ]
    );
  };

  const handleSaveEdit = () => {
    if (!editAmount || isNaN(editAmount) || Number(editAmount) <= 0) {
      Alert.alert('Validation', 'Please enter a valid amount');
      return;
    }

    if (!editCategory) {
      Alert.alert('Validation', 'Please select a category');
      return;
    }

    if (!editDescription.trim()) {
      Alert.alert('Validation', 'Please enter a description');
      return;
    }

    const updatedExpenses = expenses.map(exp =>
      exp.id === selectedExpense.id
        ? {
            ...exp,
            amount: Number(editAmount),
            description: editDescription.trim(),
            category: editCategory.name,
            categoryId: editCategory.id,
            date: editDate.toISOString(),
            updatedAt: new Date().toISOString(),
          }
        : exp
    );

    dispatch(updateExpenses(updatedExpenses));
    setEditModalVisible(false);
    Alert.alert('Success', 'Expense updated successfully!');
  };

  const onDateChange = (event, date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setEditDate(date);
    }
  };

  const renderExpenseItem = ({ item }) => {
    const expenseDate = new Date(item.date);
    const categoryInfo = EXPENSE_CATEGORIES.find(cat => cat.name === item.category);

    return (
      <View style={styles.expenseCard}>
        <View style={styles.expenseHeader}>
          <View style={styles.expenseInfo}>
            <Text style={styles.categoryIcon}>{categoryInfo?.icon || '📦'}</Text>
            <View style={styles.expenseDetails}>
              <Text style={styles.expenseDescription}>{item.description}</Text>
              <Text style={styles.expenseCategory}>{item.category}</Text>
              <Text style={styles.expenseDate}>
                {expenseDate.toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </Text>
            </View>
          </View>
          <Text style={styles.expenseAmount}>₹{item.amount.toLocaleString()}</Text>
        </View>

        <View style={styles.expenseActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => handleEdit(item)}
          >
            <Icon name="edit" size={18} color="#FFF" />
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDelete(item)}
          >
            <Icon name="delete" size={18} color="#FFF" />
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>All Expenses</Text>
      <Text style={styles.subheading}>Total: {expenses.length} expense(s)</Text>

      {expenses.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="receipt" size={64} color="#CCC" />
          <Text style={styles.emptyText}>No expenses yet</Text>
          <Text style={styles.emptySubtext}>Add your first expense to get started</Text>
        </View>
      ) : (
        <FlatList
          data={sortedExpenses}
          renderItem={renderExpenseItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Expense</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {/* Amount Input */}
            <Text style={styles.label}>Amount (₹)</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              keyboardType="numeric"
              value={editAmount}
              onChangeText={setEditAmount}
            />

            {/* Date Picker */}
            <Text style={styles.label}>Date</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateButtonText}>
                {editDate.toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={editDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onDateChange}
                maximumDate={new Date()}
              />
            )}

            {/* Category Selection */}
            <Text style={styles.label}>Category</Text>
            <View style={styles.categoriesGrid}>
              {EXPENSE_CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryChip,
                    editCategory?.id === category.id && styles.categoryChipSelected,
                    { borderColor: category.color },
                  ]}
                  onPress={() => setEditCategory(category)}
                >
                  <Text style={styles.categoryChipIcon}>{category.icon}</Text>
                  <Text style={styles.categoryChipText}>{category.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Description Input */}
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.descriptionInput}
              placeholder="What did you spend on?"
              value={editDescription}
              onChangeText={setEditDescription}
              multiline
            />

            {/* Save Button */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveEdit}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A4563',
    marginTop: 10,
    marginBottom: 5,
  },
  subheading: {
    fontSize: 14,
    color: '#777',
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  expenseCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  expenseInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  categoryIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  expenseDetails: {
    flex: 1,
  },
  expenseDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  expenseCategory: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  expenseDate: {
    fontSize: 12,
    color: '#999',
  },
  expenseAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF5A5F',
  },
  expenseActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 8,
    gap: 5,
  },
  editButton: {
    backgroundColor: '#3498DB',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  actionButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginTop: 15,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#CCC',
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A4563',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    padding: 15,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A4563',
    textAlign: 'center',
  },
  dateButton: {
    backgroundColor: '#E8F4F8',
    borderWidth: 1,
    borderColor: '#3498DB',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  dateButtonText: {
    color: '#3498DB',
    fontSize: 15,
    fontWeight: '600',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 6,
  },
  categoryChipSelected: {
    backgroundColor: '#E8F4F8',
    borderWidth: 2,
  },
  categoryChipIcon: {
    fontSize: 16,
  },
  categoryChipText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  descriptionInput: {
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: '#333',
    height: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#27AE60',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
