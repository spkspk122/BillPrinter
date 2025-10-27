import firestore from '@react-native-firebase/firestore';

// Firestore collections
export const investmentsCollection = firestore().collection('investments');
export const salesCollection = firestore().collection('sales');
