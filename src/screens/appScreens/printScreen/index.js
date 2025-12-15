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
  const [connectedPrinter, setConnectedPrinter] = useState(null);
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
      setConnectedPrinter(null);
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
      status: "pending",
      createdAt: firestore.FieldValue.serverTimestamp(),
    });

    Alert.alert("Success", "Printed & Saved Successfully ✅");
navigationServices.navigate(SCREENS.HOME)
  } catch (error) {
    console.error("Bluetooth Printing Error:", error);
    Alert.alert("Error", "Failed to print via Bluetooth printer.");
  }
};

  // ======= Save to Firebase Only =======
  const saveToFirebase = async () => {
    try {
      // ✅ Save sale data to Firestore
      await firestore().collection("sales").add({
        orderId,
        items: cartItems,
        totalPrice,
        date: todayDate,
        status: "pending",
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      Alert.alert(
        "Success",
        "Order saved to Firebase successfully! ✅",
        [
          {
            text: "OK",
            onPress: () => navigationServices.navigate(SCREENS.HOME)
          }
        ]
      );
    } catch (error) {
      console.error("Firebase Save Error:", error);
      Alert.alert("Error", "Failed to save order to Firebase.");
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
      <View style={styles.itemLeft}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemQuantity}>Qty: {item.quantity} × ₹{item.price}</Text>
      </View>
      <Text style={styles.itemPrice}>
        ₹{(item.quantity * item.price).toFixed(2)}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>💳 Checkout</Text>
        <Text style={styles.orderId}>Order #{orderId}</Text>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <Text style={styles.summaryIcon}>📝</Text>
          <Text style={styles.summaryTitle}>Order Summary</Text>
        </View>
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

      <View style={styles.actionSection}>
        <Text style={styles.actionTitle}>Choose an action:</Text>

        <TouchableOpacity style={styles.saveBtn} onPress={saveToFirebase}>
          <Text style={styles.saveBtnIcon}>💾</Text>
          <View style={styles.btnContent}>
            <Text style={styles.saveBtnText}>Save Order</Text>
            <Text style={styles.btnSubtext}>Without printing</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.connectBtn} onPress={connectBluetoothPrinter}>
          <Text style={styles.connectIcon}>📡</Text>
          <Text style={styles.connectText}>Connect Bluetooth Printer</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.printBtn} onPress={printBluetoothReceipt}>
          <Text style={styles.printBtnIcon}>🖨️</Text>
          <View style={styles.btnContent}>
            <Text style={styles.printBtnText}>Print via Bluetooth</Text>
            <Text style={styles.btnSubtext}>Thermal printer</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.wifiBtn} onPress={printWiFiReceipt}>
          <Text style={styles.wifiBtnIcon}>📶</Text>
          <View style={styles.btnContent}>
            <Text style={styles.wifiBtnText}>Print via Wi-Fi</Text>
            <Text style={styles.btnSubtext}>Network printer</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ======= STYLES =======
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#F8F9FA"
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  orderId: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7F8C8D",
    backgroundColor: "#E8E8E8",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryIcon: {
    fontSize: 22,
    marginRight: 8,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  itemLeft: {
    flex: 1,
    marginRight: 10,
  },
  itemName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 13,
    color: "#7F8C8D",
  },
  itemPrice: {
    fontSize: 16,
    color: "#E74C3C",
    fontWeight: "bold",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 2,
    borderTopColor: "#E8E8E8",
    backgroundColor: "#FFF9E6",
    padding: 12,
    borderRadius: 8,
    marginHorizontal: -6,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  totalPrice: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#E74C3C",
  },
  actionSection: {
    marginTop: 10,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#7F8C8D",
    marginBottom: 15,
  },
  saveBtn: {
    backgroundColor: "#8E44AD",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#8E44AD",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  saveBtnIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  btnContent: {
    flex: 1,
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 2,
  },
  btnSubtext: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
  },
  connectBtn: {
    backgroundColor: "#27ae60",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowColor: "#27ae60",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  connectIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  connectText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  printBtn: {
    backgroundColor: "#E74C3C",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#E74C3C",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  printBtnIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  printBtnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 2,
  },
  wifiBtn: {
    backgroundColor: "#3498DB",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#3498DB",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  wifiBtnIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  wifiBtnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 2,
  },
});
