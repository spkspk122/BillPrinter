import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  FlatList,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import { selectBills, addBill, deleteBill } from '../../../redux/slice/authSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';
import notifee, { TimestampTrigger, TriggerType, AndroidImportance } from '@notifee/react-native';

export default function BillsRemindersScreen() {
  const dispatch = useDispatch();
  const bills = useSelector(selectBills);

  const [showAddForm, setShowAddForm] = useState(false);
  const [billName, setBillName] = useState('');
  const [billAmount, setBillAmount] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reminderDays, setReminderDays] = useState('1');

  const onDateChange = (event, date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setDueDate(date);
    }
  };

  const scheduleNotification = async (bill) => {
    try {
      // Request notification permission
      await notifee.requestPermission();

      // Create notification channel for Android
      const channelId = await notifee.createChannel({
        id: 'bills-reminders',
        name: 'Bills & Reminders',
        importance: AndroidImportance.HIGH,
        sound: 'default',
      });

      // Schedule notification for due date
      const dueDateTimestamp = new Date(bill.dueDate).getTime();

      // Schedule notification 1 day before
      const reminderDate = new Date(dueDateTimestamp);
      reminderDate.setDate(reminderDate.getDate() - parseInt(reminderDays || 1));

      if (reminderDate.getTime() > Date.now()) {
        const trigger: TimestampTrigger = {
          type: TriggerType.TIMESTAMP,
          timestamp: reminderDate.getTime(),
        };

        await notifee.createTriggerNotification(
          {
            id: `${bill.id}_reminder`,
            title: '💰 Bill Reminder',
            body: `${bill.name} is due tomorrow! Amount: ₹${bill.amount}`,
            android: {
              channelId,
              importance: AndroidImportance.HIGH,
              pressAction: {
                id: 'default',
              },
              smallIcon: 'ic_launcher',
              color: '#FF5A5F',
            },
            ios: {
              sound: 'default',
            },
          },
          trigger
        );
      }

      // Schedule notification on due date
      if (dueDateTimestamp > Date.now()) {
        const dueTrigger: TimestampTrigger = {
          type: TriggerType.TIMESTAMP,
          timestamp: dueDateTimestamp,
        };

        await notifee.createTriggerNotification(
          {
            id: `${bill.id}_due`,
            title: '⚠️ Bill Due Today!',
            body: `${bill.name} is due today! Amount: ₹${bill.amount}`,
            android: {
              channelId,
              importance: AndroidImportance.HIGH,
              pressAction: {
                id: 'default',
              },
              smallIcon: 'ic_launcher',
              color: '#FF5A5F',
              vibrationPattern: [300, 500],
            },
            ios: {
              sound: 'default',
              critical: true,
            },
          },
          dueTrigger
        );
      }
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  };

  const handleAddBill = async () => {
    if (!billName.trim()) {
      Alert.alert('Validation', 'Please enter bill name');
      return;
    }

    if (!billAmount || isNaN(billAmount) || Number(billAmount) <= 0) {
      Alert.alert('Validation', 'Please enter a valid amount');
      return;
    }

    const billId = `bill_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const billData = {
      id: billId,
      name: billName.trim(),
      amount: Number(billAmount),
      dueDate: dueDate.toISOString(),
      reminderDays: parseInt(reminderDays || 1),
      isPaid: false,
      createdAt: new Date().toISOString(),
    };

    try {
      setLoading(true);

      // Save to Redux (persisted automatically)
      dispatch(addBill(billData));

      // Schedule notification
      await scheduleNotification(billData);

      Alert.alert('Success', 'Bill reminder added successfully!');
      setBillName('');
      setBillAmount('');
      setDueDate(new Date());
      setReminderDays('1');
      setShowAddForm(false);
    } catch (error) {
      console.error('Error saving bill:', error);
      Alert.alert('Error', `Failed to save: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsPaid = (billId) => {
    // Find and update the bill in Redux
    const updatedBills = bills.map(bill =>
      bill.id === billId
        ? { ...bill, isPaid: true, paidAt: new Date().toISOString() }
        : bill
    );
    dispatch(addBill(updatedBills));
    Alert.alert('Success', 'Bill marked as paid!');
  };

  const handleDeleteBill = (billId, billName) => {
    Alert.alert(
      'Delete Bill',
      `Are you sure you want to delete "${billName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            dispatch(deleteBill(billId));
            Alert.alert('Success', 'Bill deleted successfully!');
          },
        },
      ]
    );
  };

  const sortedBills = [...bills].sort((a, b) => {
    if (a.isPaid !== b.isPaid) return a.isPaid ? 1 : -1;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  const upcomingBills = sortedBills.filter(b => !b.isPaid);
  const paidBills = sortedBills.filter(b => b.isPaid);

  const renderBillItem = ({ item }) => {
    const dueDate = new Date(item.dueDate);
    const today = new Date();
    const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
    const isOverdue = daysUntilDue < 0 && !item.isPaid;
    const isDueToday = daysUntilDue === 0 && !item.isPaid;

    return (
      <View style={[
        styles.billCard,
        item.isPaid && styles.billCardPaid,
        isOverdue && styles.billCardOverdue,
      ]}>
        <View style={styles.billHeader}>
          <View style={styles.billTitleContainer}>
            <Text style={[styles.billName, item.isPaid && styles.billNamePaid]}>
              {item.name}
            </Text>
            {isOverdue && <Text style={styles.overdueLabel}>OVERDUE</Text>}
            {isDueToday && <Text style={styles.dueTodayLabel}>DUE TODAY</Text>}
          </View>
          {!item.isPaid && (
            <TouchableOpacity onPress={() => handleDeleteBill(item.id, item.name)}>
              <Icon name="delete" size={24} color="#FF3B30" />
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.billAmount}>₹{item.amount.toLocaleString()}</Text>
        <Text style={styles.billDueDate}>
          Due: {dueDate.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
          {!item.isPaid && ` (${daysUntilDue > 0 ? `in ${daysUntilDue} days` : 'today'})`}
        </Text>

        {!item.isPaid && (
          <TouchableOpacity
            style={styles.markPaidButton}
            onPress={() => handleMarkAsPaid(item.id)}
          >
            <Icon name="check-circle" size={20} color="#FFF" />
            <Text style={styles.markPaidText}>Mark as Paid</Text>
          </TouchableOpacity>
        )}

        {item.isPaid && (
          <View style={styles.paidBadge}>
            <Icon name="check-circle" size={18} color="#27AE60" />
            <Text style={styles.paidText}>Paid</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Bills & Reminders</Text>

      {/* Add Bill Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAddForm(!showAddForm)}
      >
        <Icon name={showAddForm ? 'remove' : 'add'} size={24} color="#FFF" />
        <Text style={styles.addButtonText}>
          {showAddForm ? 'Cancel' : 'Add New Bill'}
        </Text>
      </TouchableOpacity>

      {/* Add Bill Form */}
      {showAddForm && (
        <View style={styles.addFormCard}>
          <Text style={styles.formTitle}>Add New Bill Reminder</Text>

          <TextInput
            style={styles.input}
            placeholder="Bill Name (e.g., Electricity Bill)"
            value={billName}
            onChangeText={setBillName}
            placeholderTextColor="#999"
          />

          <TextInput
            style={styles.input}
            placeholder="Amount (₹)"
            keyboardType="numeric"
            value={billAmount}
            onChangeText={setBillAmount}
            placeholderTextColor="#999"
          />

          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Icon name="calendar-today" size={20} color="#3498DB" />
            <Text style={styles.dateButtonText}>
              Due Date: {dueDate.toLocaleDateString('en-IN')}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={dueDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
              minimumDate={new Date()}
            />
          )}

          <View style={styles.reminderContainer}>
            <Text style={styles.reminderLabel}>Remind me (days before):</Text>
            <TextInput
              style={styles.reminderInput}
              keyboardType="numeric"
              value={reminderDays}
              onChangeText={setReminderDays}
            />
          </View>

          <TouchableOpacity
            style={[styles.saveButton, { opacity: loading ? 0.6 : 1 }]}
            disabled={loading}
            onPress={handleAddBill}
          >
            <Text style={styles.saveButtonText}>
              {loading ? 'Saving...' : 'Save Bill Reminder'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Upcoming Bills */}
      {upcomingBills.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Upcoming Bills ({upcomingBills.length})</Text>
          <FlatList
            data={upcomingBills}
            renderItem={renderBillItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        </>
      )}

      {/* Paid Bills */}
      {paidBills.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Paid Bills ({paidBills.length})</Text>
          <FlatList
            data={paidBills}
            renderItem={renderBillItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        </>
      )}

      {bills.length === 0 && !showAddForm && (
        <View style={styles.emptyState}>
          <Icon name="receipt" size={64} color="#CCC" />
          <Text style={styles.emptyText}>No bills or reminders yet</Text>
          <Text style={styles.emptySubtext}>Tap "Add New Bill" to get started</Text>
        </View>
      )}

      <View style={{ height: 30 }} />
    </ScrollView>
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
    marginBottom: 20,
    marginTop: 10,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#FF5A5F',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  addFormCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A4563',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#FFF',
  },
  dateButton: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#3498DB',
    backgroundColor: '#E8F4F8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    alignItems: 'center',
  },
  dateButtonText: {
    color: '#3498DB',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  reminderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  reminderLabel: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  reminderInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 10,
    width: 60,
    textAlign: 'center',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#27AE60',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A4563',
    marginBottom: 15,
    marginTop: 10,
  },
  billCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#3498DB',
  },
  billCardPaid: {
    backgroundColor: '#F8F8F8',
    borderLeftColor: '#27AE60',
  },
  billCardOverdue: {
    borderLeftColor: '#FF3B30',
  },
  billHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  billTitleContainer: {
    flex: 1,
  },
  billName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A4563',
    marginBottom: 4,
  },
  billNamePaid: {
    color: '#999',
    textDecorationLine: 'line-through',
  },
  overdueLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FF3B30',
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  dueTodayLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FF9500',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  billAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF5A5F',
    marginBottom: 4,
  },
  billDueDate: {
    fontSize: 14,
    color: '#777',
    marginBottom: 12,
  },
  markPaidButton: {
    flexDirection: 'row',
    backgroundColor: '#27AE60',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markPaidText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 6,
  },
  paidBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paidText: {
    fontSize: 14,
    color: '#27AE60',
    fontWeight: '600',
    marginLeft: 6,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 40,
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
});
