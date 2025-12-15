import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
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
  const [searchQuery, setSearchQuery] = useState('');

  const increment = id => setCart(prev => ({ ...prev, [id]: prev[id] + 1 }));
  const decrement = id => setCart(prev => ({ ...prev, [id]: prev[id] > 0 ? prev[id] - 1 : 0 }));

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const query = searchQuery.toLowerCase().trim();
    return products.filter(item =>
      item.name.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const totalPrice = useMemo(
    () =>
      products.reduce((total, item) => total + cart[item.id] * item.price, 0),
    [cart]
  );

  const renderItem = ({ item }) => {
    const quantity = cart[item.id];
    const hasItems = quantity > 0;

    return (
      <View style={[styles.card, hasItems && styles.cardWithItems]}>
        <View style={styles.cardHeader}>
          <Text style={styles.name}>{item.name}</Text>
          {hasItems && <View style={styles.badge}><Text style={styles.badgeText}>{quantity}</Text></View>}
        </View>
        <Text style={styles.category}>📦 {item.category.replace(/_/g, ' ')}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{item.price}</Text>
          {hasItems && <Text style={styles.subtotal}>= ₹{item.price * quantity}</Text>}
        </View>
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={() => decrement(item.id)} style={styles.btnMinus}>
            <Text style={styles.btnText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{cart[item.id]}</Text>
          <TouchableOpacity onPress={() => increment(item.id)} style={styles.btnPlus}>
            <Text style={styles.btnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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
      <View style={styles.header}>
        <Text style={styles.heading}>🛒 My Cart</Text>
        <View style={styles.cartSummary}>
          <Text style={styles.itemCount}>
            {Object.values(cart).reduce((sum, qty) => sum + qty, 0)} items
          </Text>
        </View>
      </View>
      <TextInput
        style={styles.searchInput}
        placeholder="🔍 Search products by name or category..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        clearButtonMode="while-editing"
        placeholderTextColor="#95A5A6"
      />
      <FlatList
        data={filteredProducts}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
      />
      {totalPrice > 0 && (
        <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
          <View style={styles.checkoutContent}>
            <Text style={styles.checkoutText}>Proceed to Checkout</Text>
            <Text style={styles.checkoutAmount}>₹{totalPrice.toFixed(2)}</Text>
          </View>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#F8F9FA'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  cartSummary: {
    backgroundColor: '#8E44AD',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  itemCount: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  searchInput: {
    height: 50,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 15,
    fontSize: 15,
    backgroundColor: '#FFF',
    color: '#2C3E50',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  listContainer: {
    paddingBottom: 100,
  },
  card: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 12,
    margin: 6,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cardWithItems: {
    borderColor: '#27ae60',
    backgroundColor: '#F0FFF4',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  badge: {
    backgroundColor: '#27ae60',
    borderRadius: 10,
    minWidth: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'left',
    color: '#2C3E50',
    flex: 1,
    marginRight: 4,
  },
  category: {
    fontSize: 11,
    color: '#7F8C8D',
    textAlign: 'left',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E74C3C',
  },
  subtotal: {
    fontSize: 13,
    fontWeight: '600',
    color: '#27ae60',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  btnMinus: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E74C3C',
    shadowColor: '#E74C3C',
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  btnPlus: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#27ae60',
    shadowColor: '#27ae60',
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  btnText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 20,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
    color: '#2C3E50',
    minWidth: 30,
    textAlign: 'center',
  },
  checkoutBtn: {
    backgroundColor: '#8E44AD',
    padding: 18,
    borderRadius: 14,
    position: 'absolute',
    bottom: 20,
    left: 15,
    right: 15,
    shadowColor: '#8E44AD',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  checkoutContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkoutText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 17,
  },
  checkoutAmount: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 22,
  },
});
