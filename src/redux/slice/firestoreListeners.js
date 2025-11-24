import firestore from '@react-native-firebase/firestore';
import {
  addOrUpdateInvestment,
  addSales,
  setMonthlySalary,
  updateExpenses,
  updateBills,
  setBudgets
} from './authSlice';
import { store } from '../store';

export const startFirestoreListeners = () => {
  try {
    // Check if Firestore is available
    const db = firestore();
    if (!db) {
      console.error('❌ Firestore is not initialized. Please check Firebase configuration.');
      return;
    }

    // Investments listener
    db.collection('investments')
      .onSnapshot(
        snapshot => {
          const items = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          store.dispatch(addOrUpdateInvestment(items));
        },
        error => console.error('❌ Firestore investments listener error:', error)
      );

    // Sales listener
    db.collection('sales')
      .onSnapshot(
        snapshot => {
          const items = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          console.log('💰 Sales updated:', items.length);
          store.dispatch(addSales(items));
        },
        error => console.error('❌ Firestore sales listener error:', error)
      );

    // Salary listener
    db.collection('settings')
      .doc('salary')
      .onSnapshot(
        doc => {
          if (doc.exists) {
            store.dispatch(setMonthlySalary(doc.data()));
          }
        },
        error => console.error('❌ Firestore salary listener error:', error)
      );

    // Expenses listener
    db.collection('expenses')
      .onSnapshot(
        snapshot => {
          const items = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          store.dispatch(updateExpenses(items));
        },
        error => console.error('❌ Firestore expenses listener error:', error)
      );

    // Bills/Reminders listener
    db.collection('bills')
      .onSnapshot(
        snapshot => {
          const items = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          store.dispatch(updateBills(items));
        },
        error => console.error('❌ Firestore bills listener error:', error)
      );

    // Budgets listener
    db.collection('settings')
      .doc('budgets')
      .onSnapshot(
        doc => {
          if (doc.exists) {
            store.dispatch(setBudgets(doc.data()));
          }
        },
        error => console.error('❌ Firestore budgets listener error:', error)
      );
  } catch (err) {
    console.error('🔥 Firestore listener setup failed:', err);
  }
};
