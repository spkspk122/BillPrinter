import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import navigationServices from '../../../navigation/navigationServices';
import { SCREENS } from '../../../navigation/screens';

// Flattened products from JSON
export const productsJSON = [
  {
    category: 'STARTERS_MENU_NON_VEG',
    items: [
      { id: 1, name: 'Chicken 65', price: 120 },
      { id: 2, name: 'Chicken Wings', price: 140 },
      { id: 3, name: 'Chicken Lollypop', price: 140 },
      { id: 4, name: 'Chilly Chicken', price: 140 },
      { id: 5, name: 'Pepper Chicken', price: 140 },
      { id: 6, name: 'Chicken Manchurian', price: 140 },
      { id: 7, name: 'Chicken Saucey Lollypop', price: 160 },
      { id: 8, name: 'Chicken Saucey Wings', price: 160 },
      { id: 9, name: 'Honey Chicken', price: 150 },
      { id: 10, name: 'Chicken Pepper Salt', price: 140 },
    ],
  },
  {
    category: 'STARTERS_MENU_VEG',
    items: [
      { id: 11, name: 'Gobi 65', price: 100 },
      { id: 12, name: 'Mushroom 65', price: 120 },
    ],
  },
  {
    category: 'MAIN_COURSE_MENU_NON_VEG',
    items: [
      { id: 13, name: 'Egg Rice', price: 100 },
      { id: 14, name: 'Chicken Rice', price: 120 },
      { id: 15, name: 'Shawarma Rice', price: 140 },
      { id: 16, name: 'Chicken Noodles', price: 130 },
      { id: 17, name: 'Chicken Schezwan Noodles', price: 140 },
      { id: 18, name: 'Chicken Schezwan Rice', price: 140 },
    ],
  },
  {
    category: 'MAIN_COURSE_MENU_VEG',
    items: [
      { id: 19, name: 'Veg Rice', price: 90 },
      { id: 20, name: 'Gopi Rice', price: 110 },
      { id: 21, name: 'Veg Noodles', price: 110 },
      { id: 22, name: 'Panner Rice', price: 120 },
      { id: 23, name: 'Mushroom Rice', price: 120 },
      { id: 24, name: 'Mixed Veg Rice', price: 140 },
      { id: 25, name: 'Schezwan Flavour', price: 140 },
      { id: 26, name: 'Shawarma Panner 65', price: 120 },
      { id: 27, name: 'Regular Shawarma', price: 80 },
      { id: 28, name: 'Special Shawarma', price: 100 },
      { id: 29, name: 'Regular Peri Peri Shawarma', price: 90 },
      { id: 30, name: 'Special Peri Peri Shawarma', price: 120 },
      { id: 31, name: 'Chilly Mushroom', price: 130 },
      { id: 32, name: 'Special Mexian Shawarma', price: 120 },
      { id: 33, name: 'Chilly Panner', price: 140 },
      { id: 34, name: 'Regular Plate Shawarma', price: 140 },
      { id: 35, name: 'Special Plate Shawarma', price: 160 },
      { id: 36, name: 'Kuboos', price: 10 },
      { id: 37, name: 'Extra Mayonaise', price: 10 },
      { id: 38, name: 'Mushroom Pepper Salt', price: 160 },
      { id: 39, name: 'Special Pepper Shawarma', price: 120 },
    ],
  },
  {
    category: 'BBQ_MENU',
    items: [
      { id: 40, name: 'Classic Full', price: 420 },
      { id: 41, name: 'Classic Half', price: 220 },
      { id: 42, name: 'Classic Quater', price: 120 },
      { id: 43, name: 'Pepper Full', price: 440 },
      { id: 44, name: 'Pepper Half', price: 240 },
      { id: 45, name: 'Pepper Quater', price: 130 },
      { id: 46, name: 'Peri Peri Full', price: 440 },
      { id: 47, name: 'Peri Peri Half', price: 240 },
      { id: 48, name: 'Peri Peri Quater', price: 130 },
      { id: 49, name: 'Chicken Tikka', price: 130 },
    ],
  },
];

// Flatten array with category in each item
const products = productsJSON.flatMap(cat =>
  cat.items.map(item => ({ ...item, category: cat.category }))
);

export default function CartScreen() {
  const [cart, setCart] = useState(
    products.reduce((acc, item) => ({ ...acc, [item.id]: 0 }), {})
  );

  const increment = id => setCart(prev => ({ ...prev, [id]: prev[id] + 1 }));
  const decrement = id => setCart(prev => ({ ...prev, [id]: prev[id] > 0 ? prev[id] - 1 : 0 }));

  const totalPrice = useMemo(
    () =>
      products.reduce((total, item) => total + cart[item.id] * item.price, 0),
    [cart]
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.category}>{item.category}</Text>
      <Text style={styles.price}>₹{item.price}</Text>
      <View style={styles.quantityContainer}>
        <TouchableOpacity onPress={() => decrement(item.id)} style={styles.btnMinus}>
          <Text style={styles.btnText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{cart[item.id]}</Text>
        <TouchableOpacity onPress={() => increment(item.id)} style={styles.btnPlus}>
          <Text style={styles.btnText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

 const handleCheckout = () => {
  const selectedItems = products
    .filter(item => cart[item.id] > 0)
    .map(item => ({ ...item, quantity: cart[item.id] }));

  if (!selectedItems.length) {
    alert('Please select at least one product before checkout.');
    return;
  }

  // Navigate to print screen with selected items
  navigationServices.navigate(SCREENS.PRINT, { cartItems: selectedItems });

  // ✅ Reset cart after checkout
  setCart(products.reduce((acc, item) => ({ ...acc, [item.id]: 0 }), {}));
};

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>My Cart</Text>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
      />
      {totalPrice > 0 && (
        <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
          <Text style={styles.checkoutText}>Checkout - ₹{totalPrice}</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#FFF' },
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
  name: { fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  category: { fontSize: 12, color: '#555', textAlign: 'center' },
  price: { fontSize: 14, fontWeight: 'bold', color: '#FF5A5F', marginVertical: 5 },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '60%',
    marginTop: 5,
  },
  btnMinus: { width: 30, height: 30, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ADD8E6' },
  btnPlus: { width: 30, height: 30, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FF7F7F' },
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
