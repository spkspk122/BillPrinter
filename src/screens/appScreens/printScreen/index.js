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

export default function CheckoutScreen({ route }) {
  const { cartItems } = route.params || { cartItems: [] };
  const [connectedPrinter, setConnectedPrinter] = useState(null);
  const dispatch = useDispatch();

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.quantity * item.price,
    0
  );

  const orderId = `ORD-${Date.now().toString().slice(-6)}`;
  const todayDate = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

  // ======= Permissions & Printer Connection =======
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
      await BLEPrinter.connectPrinter(printer.inner_mac_address);
      setConnectedPrinter(printer);

      Alert.alert("Connected", `Bluetooth Printer: ${printer.device_name}`);
    } catch (error) {
      console.error("Bluetooth Printer Connection Failed:", error);
      Alert.alert("Error", "Failed to connect to Bluetooth Printer.");
    }
  };

  // ======= Dispatch sales data to Redux =======
  const storeSalesInRedux = () => {
    const salesPayload = cartItems.map((item) => ({
      product: item.name,
      date: todayDate,
      count: item.quantity,
    }));

    dispatch(addSales(salesPayload));
  };

  // ======= Print Functions =======
  const printBluetoothReceipt = async () => {
      // ✅ Store sales in Redux after successful print
      storeSalesInRedux();
    if (!connectedPrinter) {
      Alert.alert("Printer Not Connected", "Please connect a printer first.");
      return;
    }

    try {
      let printData = `<C>===== ORDER RECEIPT =====</C>\n`;
      printData += `<C>Order ID: ${orderId}</C>\n`;
      printData += `--------------------------\n`;
      cartItems.forEach((item) => {
        printData += `<L>${item.quantity} x ${item.name} - ₹${item.price * item.quantity}</L>\n`;
      });
      printData += `--------------------------\n`;
      printData += `<R>Total: ₹ ${totalPrice}</R>\n`;
      printData += `<C>Thank you for your order!</C>\n`;

      await BLEPrinter.printText(printData);

    

      Alert.alert("Success", `Receipt Printed via Bluetooth!\nOrder ID: ${orderId}`);
    } catch (error) {
      console.error("Bluetooth Printing Error:", error);
      Alert.alert("Error", "Failed to print via Bluetooth printer.");
    }
  };

  const printWiFiReceipt = async () => {
    let printHTML = `
      <h2 style="text-align:center;">===== ORDER RECEIPT =====</h2>
      <p style="text-align:center;">Order ID: <b>${orderId}</b></p>
      <hr />
      <ul>
    `;
    cartItems.forEach((item) => {
      printHTML += `<li>${item.quantity} x ${item.name} - ₹${item.price * item.quantity}</li>`;
    });
    printHTML += `
      </ul>
      <hr />
      <p style="text-align:right;"><b>Total: ₹ ${totalPrice}</b></p>
      <p style="text-align:center;">Thank you for your order!</p>
    `;

    try {
      await RNPrint.print({ html: printHTML });

      // ✅ Store sales in Redux after successful print
      storeSalesInRedux();

      Alert.alert("Success", `Receipt Printed via Wi-Fi!\nOrder ID: ${orderId}`);
    } catch (error) {
      console.error("Wi-Fi Printing Error:", error);
      Alert.alert("Error", "Failed to print via Wi-Fi printer.");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemRow}>
      <Text style={styles.itemText}>
        {item.name} x {item.quantity}
      </Text>
      <Text style={styles.itemPrice}>₹{(item.quantity * item.price).toFixed(2)}</Text>
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
