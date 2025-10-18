// src/screens/Investment.js
import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";

export default function Investment() {
  const [invested, setInvested] = useState("");
  const [days, setDays] = useState("");
  const [returns, setReturns] = useState(null);

  const calculateReturn = () => {
    if (!invested || !days) return;
    const principal = parseFloat(invested);
    const dayCount = parseFloat(days);

    // Example: 0.5% daily growth rate
    const dailyRate = 0.005;
    const totalReturn = principal * Math.pow(1 + dailyRate, dayCount);
    const profit = totalReturn - principal;

    setReturns({ totalReturn: totalReturn.toFixed(2), profit: profit.toFixed(2) });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Investment Calculator</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter invested amount"
        keyboardType="numeric"
        value={invested}
        onChangeText={setInvested}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter number of days"
        keyboardType="numeric"
        value={days}
        onChangeText={setDays}
      />

      <TouchableOpacity style={styles.button} onPress={calculateReturn}>
        <Text style={styles.buttonText}>Calculate Return</Text>
      </TouchableOpacity>

      {returns && (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>Total Return: ₹{returns.totalReturn}</Text>
          <Text style={styles.resultText}>Profit: ₹{returns.profit}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#FF5A5F",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  resultBox: {
    backgroundColor: "#F5F5F5",
    marginTop: 20,
    borderRadius: 10,
    padding: 15,
  },
  resultText: { fontSize: 16, fontWeight: "bold", color: "#333" },
});
