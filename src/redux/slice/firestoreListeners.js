import firestore from '@react-native-firebase/firestore';
import { addOrUpdateInvestment, addSales } from './authSlice';
import { store } from '../store';

export const startFirestoreListeners = () => {
 

  try {
    // Investments listener
    firestore()
      .collection('investments')
      .onSnapshot(
        snapshot => {
          const items = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          console.log('📊 Investments updated:', items.length);
          store.dispatch(addOrUpdateInvestment(items));
        },
        error => console.error('❌ Firestore investments listener error:', error)
      );

    // Sales listener
    firestore()
      .collection('sales')
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
  } catch (err) {
    console.error('🔥 Firestore listener setup failed:', err);
  }
};
