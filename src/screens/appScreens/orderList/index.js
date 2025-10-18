// src/screens/OrderList.js
import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

const mockOrders = [
  { id: "1", item: "Cheeseburger", quantity: 2, total: 200, date: "2025-10-16" },
  { id: "2", item: "Fried Chicken Burger", quantity: 1, total: 160, date: "2025-10-15" },
];

export default function OrderList() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Orders</Text>
      <FlatList
        data={mockOrders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.item}</Text>
            <Text>Qty: {item.quantity}</Text>
            <Text>Total: ₹{item.total}</Text>
            <Text>Date: {item.date}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 15 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  card: {
    backgroundColor: "#F8F8F8",
    borderRadius: 10,
    padding: 10,
    marginVertical: 6,
    elevation: 2,
  },
  name: { fontWeight: "bold", fontSize: 16 },
});
