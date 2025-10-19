import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import navigationServices from '../../../navigation/navigationServices';
import { SCREENS } from '../../../navigation/screens';

export const products = [
  { id: '1', name: 'Latte', type: 'Beverage', price: 4.5, image: require('../../../assest/images/shawarma.png') },
  { id: '2', name: 'Green Tea', type: 'Beverage', price: 3.0, image:  require('../../../assest/images/shawarma.png') },
  { id: '3', name: 'Croissant', type: 'Pastry', price: 2.5, image:  require('../../../assest/images/shawarma.png') },
  { id: '4', name: 'Club Sandwich', type: 'Food', price: 5.0, image:  require('../../../assest/images/shawarma.png')},
];

export default function CartScreen() {
  const [cart, setCart] = useState(
    products.reduce((acc, item) => ({ ...acc, [item.id]: 0 }), {})
  );

  const increment = id => setCart(prev => ({ ...prev, [id]: prev[id] + 1 }));
  const decrement = id => setCart(prev => ({ ...prev, [id]: prev[id] > 0 ? prev[id] - 1 : 0 }));

  // Calculate total price
  const totalPrice = products.reduce((total, item) => {
    return total + cart[item.id] * item.price;
  }, 0);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.type}>{item.type}</Text>
      <Text style={styles.price}>${item.price.toFixed(2)}</Text>
      <View style={styles.quantityContainer}>
        <TouchableOpacity onPress={() => decrement(item.id)} style={[styles.btn, { backgroundColor: '#ADD8E6' }]}>
          <Text style={styles.btnText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{cart[item.id]}</Text>
        <TouchableOpacity onPress={() => increment(item.id)} style={[styles.btn, { backgroundColor: '#FF7F7F' }]}>
          <Text style={styles.btnText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

 const handleCheckout = () => {
  // Filter selected products with quantity > 0
  const selectedItems = products
    .filter(item => cart[item.id] > 0)
    .map(item => ({
      ...item,
      quantity: cart[item.id],
    }));

  if (selectedItems.length === 0) {
    alert('Please select at least one product before checkout.');
    return;
  }

  navigationServices.navigate(SCREENS.PRINT, { cartItems: selectedItems });
};


  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>My Cart</Text>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
      />
      {totalPrice > 0 && (
        <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
          <Text style={styles.checkoutText}>Checkout - ${totalPrice.toFixed(2)}</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', padding: 15 },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  listContainer: { paddingBottom: 20 },
  card: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    margin: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  image: { width: 100, height: 100, marginBottom: 5, borderRadius: 10 },
  name: { fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  type: { fontSize: 12, color: '#555', textAlign: 'center' },
  price: { fontSize: 14, fontWeight: 'bold', color: '#FF5A5F', marginVertical: 5 },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '60%',
    marginTop: 5,
  },
  btn: { width: 30, height: 30, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },
  quantityText: { fontSize: 16, fontWeight: 'bold', marginHorizontal: 10 },
  checkoutBtn: {
    backgroundColor: '#FF5A5F',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  checkoutText: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },
});
