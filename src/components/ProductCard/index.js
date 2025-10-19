import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import QuantitySelector from '../QuantitySelector';

export default function ProductCard({ product }) {
  return (
    <View style={styles.card}>
      <Image source={product.image} style={styles.image} />
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.type}>{product.type}</Text>
      <Text style={styles.price}>{product.price}</Text>
      <QuantitySelector />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 160,
    height: 220,
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
    margin: 10
  },
  image: { width: 100, height: 100, marginBottom: 5 },
  name: { fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  type: { fontSize: 12, color: '#555', textAlign: 'center' },
  price: { fontSize: 14, fontWeight: 'bold', color: '#FF5A5F', textAlign: 'center' }
});
