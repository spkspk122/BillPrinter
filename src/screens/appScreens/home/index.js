import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  PermissionsAndroid,
  Platform,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { BLEPrinter } from "react-native-thermal-receipt-printer";
import RNPrint from "react-native-print"; // for Wi-Fi / network printing
import { iconpathurl } from "../../../assest/iconpath";
import { colors } from "../../../utlis/colors";

// ✅ Suppress harmless event warning
import { LogBox } from "react-native";
LogBox.ignoreLogs([
  "new NativeEventEmitter() was called with a non-null argument",
]);

// Sample Food Data
const foodItems = [
  { id: 1, name: "Cheeseburger", type: "Wendy's Burger", price: 100, image: iconpathurl.shawarma },
  { id: 2, name: "Hamburger", type: "Veggie Burger", price: 120, image: iconpathurl.shawarma },
  { id: 3, name: "Chicken Burger", type: "Chicken Burger", price: 140, image: iconpathurl.shawarma },
  { id: 4, name: "Fried Chicken Burger", type: "Fried Chicken", price: 160, image: iconpathurl.shawarma },
];

export default function Home() {
  const [cart, setCart] = useState({});
  const [printerConnected, setPrinterConnected] = useState(false);
  const [connectedPrinter, setConnectedPrinter] = useState(null);

  // ✅ Request Bluetooth + Location permissions for Android 12+
  const requestBluetoothPermissions = async () => {
    if (Platform.OS === "android") {
      try {
        if (Platform.Version >= 31) {
          const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          ]);

          const allGranted = Object.values(granted).every(
            (status) => status === PermissionsAndroid.RESULTS.GRANTED
          );

          if (!allGranted) {
            Alert.alert(
              "Permission Required",
              "Bluetooth permissions are required to scan and connect to printers."
            );
            return false;
          }
        } else {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert(
              "Permission Required",
              "Location permission is required to scan Bluetooth printers."
            );
            return false;
          }
        }
        return true;
      } catch (err) {
        console.warn("Permission error:", err);
        return false;
      }
    }
    return true; // iOS handles automatically
  };

  // Increase Quantity
  const increaseQuantity = (id, price) => {
    setCart((prev) => ({
      ...prev,
      [id]: { quantity: (prev[id]?.quantity || 0) + 1, price },
    }));
  };

  // Decrease Quantity
  const decreaseQuantity = (id) => {
    setCart((prev) => {
      if (!prev[id]) return prev;
      const updatedQuantity = prev[id].quantity - 1;
      if (updatedQuantity <= 0) {
        const newCart = { ...prev };
        delete newCart[id];
        return newCart;
      }
      return { ...prev, [id]: { ...prev[id], quantity: updatedQuantity } };
    });
  };

  // Calculate Total Price
  const totalPrice = Object.values(cart).reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  // ✅ Connect to Bluetooth Printer
  const connectBluetoothPrinter = async () => {
    try {
      const hasPermission = await requestBluetoothPermissions();
      if (!hasPermission) return;

      await BLEPrinter.init();
      const printers = await BLEPrinter.getDeviceList();
      console.log(printers, "Available Bluetooth Devices");

      if (!printers || printers.length === 0) {
        Alert.alert("No Bluetooth Printers Found");
        return;
      }

      const printer = printers[0]; // connect to first printer found
      await BLEPrinter.connectPrinter(printer.inner_mac_address);
      setPrinterConnected(true);
      setConnectedPrinter(printer);

      Alert.alert("Connected", `Bluetooth Printer: ${printer.device_name}`);
    } catch (error) {
      console.error("Bluetooth Printer Connection Failed:", error);
      Alert.alert("Error", "Failed to connect to Bluetooth Printer.");
    }
  };

  // ✅ Print via Bluetooth Printer
  const printBluetoothReceipt = async () => {
    if (!printerConnected || !connectedPrinter) {
      Alert.alert("Printer Not Connected", "Please connect a printer first.");
      return;
    }

    try {
      let printData = "<C>===== ORDER RECEIPT =====</C>\n";
      Object.keys(cart).forEach((key) => {
        const item = cart[key];
        const foodItem = foodItems.find((f) => f.id == key);
        printData += `<L>${item.quantity} x ${foodItem.name} - ₹${item.price * item.quantity}</L>\n`;
      });
      printData += "--------------------------\n";
      printData += `<R>Total: ₹ ${totalPrice}</R>\n`;
      printData += "<C>==========================</C>\n";

      await BLEPrinter.printText(printData);
      Alert.alert("Success", "Receipt printed via Bluetooth!");
    } catch (error) {
      console.error("Bluetooth Printing error:", error);
      Alert.alert("Error", "Failed to print via Bluetooth printer.");
    }
  };

  // ✅ Print via Wi-Fi / Network Printer
  const printWiFiReceipt = async () => {
    if (!cart || Object.keys(cart).length === 0) {
      Alert.alert("Cart Empty", "Please add items to cart first.");
      return;
    }

    let printHTML = `<h2 style="text-align:center;">===== ORDER RECEIPT =====</h2><ul>`;
    Object.keys(cart).forEach((key) => {
      const item = cart[key];
      const foodItem = foodItems.find((f) => f.id == key);
      printHTML += `<li>${item.quantity} x ${foodItem.name} - ₹${item.price * item.quantity}</li>`;
    });
    printHTML += `</ul><hr /><p style="text-align:right;"><b>Total: ₹ ${totalPrice}</b></p>
                  <p style="text-align:center;">===========================</p>`;

    try {
      await RNPrint.print({ html: printHTML });
      Alert.alert("Success", "Receipt printed via Wi-Fi printer!");
    } catch (error) {
      console.error("Wi-Fi Printing Error:", error);
      Alert.alert("Error", "Failed to print via Wi-Fi printer.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>Foodgo</Text>
      </View>

      <Text style={styles.subtitle}>Order your favourite food!</Text>

      {/* Printer Buttons */}
      <View style={styles.printerContainer}>
        <TouchableOpacity style={styles.connectButton} onPress={printWiFiReceipt}>
          <Text style={styles.buttonText}>Print via Wi-Fi</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.connectButton} onPress={connectBluetoothPrinter}>
          <Text style={styles.buttonText}>Connect Bluetooth Printer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.connectButton} onPress={printBluetoothReceipt}>
          <Text style={styles.buttonText}>Print via Bluetooth</Text>
        </TouchableOpacity>
      </View>

      {/* Food List */}
      <KeyboardAwareScrollView>
        <FlatList
          data={foodItems}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingVertical: 20 }}
          renderItem={({ item }) => (
            <View style={styles.foodCard}>
              <Image source={item.image} style={styles.foodImage} />
              <Text style={styles.foodName}>{item.name}</Text>
              <Text style={styles.foodType}>{item.type}</Text>
              <Text style={styles.foodPrice}>{`₹ ${item.price}`}</Text>

              {/* Quantity Controls */}
              <View style={styles.quantityContainer}>
                <TouchableOpacity onPress={() => decreaseQuantity(item.id)} style={styles.quantityButton}>
                  <Text style={styles.buttonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{cart[item.id]?.quantity || 0}</Text>
                <TouchableOpacity onPress={() => increaseQuantity(item.id, item.price)} style={styles.quantityButton}>
                  <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </KeyboardAwareScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.totalPriceText}>Total: ₹ {totalPrice}</Text>
      </View>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 15 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  logo: { fontSize: 24, fontWeight: "bold", fontStyle: "italic" },
  subtitle: { fontSize: 16, color: "gray", marginVertical: 10 },
printerContainer: {
  flexDirection: "column", // stack vertically
  alignItems: "center",
  marginVertical: 10,
},
connectButton: {
  backgroundColor: "#3498db",
  padding: 10,
  borderRadius: 8,
  marginVertical: 5, // spacing between buttons
  width: "80%", // makes buttons take most of screen width
  alignItems: "center",
},
  buttonText: { color: "white", fontWeight: "bold" },
  foodCard: { flex: 1, backgroundColor: "#FFF", borderRadius: 10, padding: 10, margin: 5, alignItems: "center", elevation: 3 },
  totalPriceText: { fontSize: 18, fontWeight: "bold" },
  foodImage: { width: 100, height: 100, resizeMode: "contain" },
  quantityButton: { backgroundColor: "#FF5A5F", width: 35, height: 35, borderRadius: 17.5, justifyContent: "center", alignItems: "center", marginHorizontal: 10 },
  quantityContainer: { flexDirection: "row", alignItems: "center", marginTop: 10, backgroundColor: "#F5F5F5", borderRadius: 20, paddingVertical: 5, paddingHorizontal: 15 },
  footer: { flexDirection: "row", justifyContent: "flex-end", alignItems: "center", backgroundColor: "#fff", paddingVertical: 15, paddingHorizontal: 20, borderTopWidth: 1, borderTopColor: "#E5E5E5" },
  foodName: { fontSize: 16, fontWeight: "bold", textAlign: "center" },
  foodType: { fontSize: 12, color: "gray", textAlign: "center" },
  foodPrice: { fontSize: 14, fontWeight: "bold", marginVertical: 5, color: "#FF5A5F" },
  quantityText: { fontSize: 16, fontWeight: "bold", color:'#000' },
});
