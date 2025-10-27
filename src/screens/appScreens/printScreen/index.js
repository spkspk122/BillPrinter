import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  PermissionsAndroid,
  Platform,
} from "react-native";
import { BLEPrinter } from "react-native-thermal-receipt-printer";
import RNPrint from "react-native-print";
import { useDispatch } from "react-redux";
import { addSales } from "../../../redux/slice/authSlice"; // adjust path
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app'; 
import { store } from "../../../redux/store";
import navigationServices from "../../../navigation/navigationServices";
import { SCREENS } from "../../../navigation/screens";

export default function CheckoutScreen({ route }) {
  const { cartItems } = route.params || { cartItems: [] };
  const [connectedPrinter, setConnectedPrinter] = useState(true);
  const dispatch = useDispatch();

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.quantity * item.price,
    0
  );

  const orderId = `ORD-${Date.now().toString().slice(-6)}`;
  const todayDate = new Date().toISOString().slice(0, 10);

  // ======= Bluetooth Permissions =======
  const requestBluetoothPermissions = async () => {
    if (Platform.OS === "android") {
      try {
        if (Platform.Version >= 31) {
          const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          ]);
          return Object.values(granted).every(
            (status) => status === PermissionsAndroid.RESULTS.GRANTED
          );
        } else {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
      } catch (err) {
        console.warn("Permission error:", err);
        return false;
      }
    }
    return true;
  };

  // ======= Connect Bluetooth Printer =======
  const connectBluetoothPrinter = async () => {
    try {
      const hasPermission = await requestBluetoothPermissions();
      if (!hasPermission) return;

      await BLEPrinter.init();
      const printers = await BLEPrinter.getDeviceList();

      if (!printers || printers.length === 0) {
        Alert.alert("No Bluetooth Printers Found");
        return;
      }

      const printer = printers[0];
   await BLEPrinter.connectPrinter(
  printer.macAddress || printer.inner_mac_address
);
      setConnectedPrinter(printer);

      Alert.alert("Connected", `Bluetooth Printer: ${printer.device_name}`);
    } catch (error) {
      console.error("Bluetooth Printer Connection Failed:", error);
        setConnectedPrinter(true);
      Alert.alert("Error", "Failed to connect to Bluetooth Printer.");
    }
  };

// ======= Print Bluetooth Receipt =======
const printBluetoothReceipt = async () => {
  try {
    if (!connectedPrinter) {
      
     Alert.alert(
  "Printer Not Connected",
  "Please connect a printer first.",
  [
    {
      text: "Cancel",
      style: "cancel",
    },
    {
      text: "Connect Now",
      onPress: () => {
    
    connectBluetoothPrinter()
      }
    }
  ]
);
      
      return;
    }

    let printData = `<C>===== ORDER RECEIPT =====</C>\n`;
    printData += `<C>Order ID: ${orderId}</C>\n`;
    printData += `Date: ${todayDate}\n`;
    printData += `--------------------------\n`;
    cartItems.forEach((item) => {
      printData += `<L>${item.quantity} x ${item.name} - ₹${item.price * item.quantity}</L>\n`;
    });
    printData += `--------------------------\n`;
    printData += `<R><B>Total: ₹ ${totalPrice}</B></R>\n`;
    printData += `<C>Thank you for your order!</C>\n`;

    await BLEPrinter.printText(printData);

    // ✅ Save sale data to Firestore
    await firestore().collection("sales").add({
      orderId,
      items: cartItems,
      totalPrice,
      date: todayDate,
    });

    Alert.alert("Success", "Printed & Saved Successfully ✅");
navigationServices.navigate(SCREENS.HOME)
  } catch (error) {
    console.error("Bluetooth Printing Error:", error);
    Alert.alert("Error", "Failed to print via Bluetooth printer.");
  }
};

  // ======= Print Wi-Fi Receipt =======
  const printWiFiReceipt = async () => {
    let printHTML = `
      <h2 style="text-align:center;">===== ORDER RECEIPT =====</h2>
      <p style="text-align:center;">Order ID: <b>${orderId}</b></p>
      <hr />
      <ul>
    `;
    cartItems.forEach((item) => {
      printHTML += `<li>${item.quantity} x ${item.name} - ₹${
        item.price * item.quantity
      }</li>`;
    });
    printHTML += `
      </ul>
      <hr />
      <p style="text-align:right;"><b>Total: ₹ ${totalPrice}</b></p>
      <p style="text-align:center;">Thank you for your order!</p>
    `;

    try {
      await RNPrint.print({ html: printHTML });
      Alert.alert("Printed", "Receipt printed successfully via Wi-Fi.");

    
    } catch (error) {
      console.error("Wi-Fi Printing Error:", error);
      Alert.alert("Error", "Failed to print via Wi-Fi printer.");
    }
  };

  // ======= Render UI =======
  const renderItem = ({ item }) => (
    <View style={styles.itemRow}>
      <Text style={styles.itemText}>
        {item.name} x {item.quantity}
      </Text>
      <Text style={styles.itemPrice}>
        ₹{(item.quantity * item.price).toFixed(2)}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Checkout</Text>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Order Summary</Text>
        <FlatList
          data={cartItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
        <View style={styles.totalRow}>
          <Text style={styles.totalText}>Total:</Text>
          <Text style={styles.totalPrice}>₹{totalPrice.toFixed(2)}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.connectBtn} onPress={connectBluetoothPrinter}>
        <Text style={styles.connectText}>Connect Bluetooth Printer</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.printBtn} onPress={printBluetoothReceipt}>
        <Text style={styles.printBtnText}>Print via Bluetooth</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.printBtn, { backgroundColor: "#3498db" }]}
        onPress={printWiFiReceipt}
      >
        <Text style={styles.printBtnText}>Print via Wi-Fi</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// ======= STYLES =======
const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#fff" },
  heading: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  summaryTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  itemText: { fontSize: 16 },
  itemPrice: { fontSize: 16, color: "#FF5A5F", fontWeight: "bold" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingTop: 10,
  },
  totalText: { fontSize: 16, fontWeight: "bold" },
  totalPrice: { fontSize: 16, fontWeight: "bold", color: "#FF5A5F" },
  connectBtn: {
    backgroundColor: "#27ae60",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  connectText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  printBtn: {
    backgroundColor: "#FF5A5F",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  printBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
