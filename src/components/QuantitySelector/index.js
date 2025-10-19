import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '../Button';


export default function QuantitySelector() {
  const [quantity, setQuantity] = useState(1);

  return (
    <View style={styles.container}>
      <Button variant="Secondary" text="-" onPress={() => setQuantity(Math.max(0, quantity - 1))} style={styles.btn} />
      <Text style={styles.quantity}>{quantity}</Text>
      <Button variant="Primary" text="+" onPress={() => setQuantity(quantity + 1)} style={styles.btn} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 40,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 5
  },
  quantity: { fontSize: 16, fontWeight: 'bold' },
  btn: { width: 30, height: 30, padding: 0 }
});
