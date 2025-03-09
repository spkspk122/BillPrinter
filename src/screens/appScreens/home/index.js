// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   Image,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
// } from "react-native";
// import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
// import { iconpathurl } from "../../../assest/iconpath";
// import { Icon } from "react-native-elements";
// import { baseStyle } from "../../../utlis/baseStyle.js/theme";

// const foodItems = [
//   { id: 1, name: "Cheeseburger", type: "Wendy's Burger", price: 100, image: iconpathurl.shawarma },
//   { id: 2, name: "Hamburger", type: "Veggie Burger", price: 120, image: iconpathurl.shawarma },
//   { id: 3, name: "Chicken Burger", type: "Chicken Burger", price: 140, image: iconpathurl.shawarma },
//   { id: 4, name: "Fried Chicken Burger", type: "Fried Chicken", price: 160, image: iconpathurl.shawarma },
// ];

// export default function Home() {
//   const [cart, setCart] = useState({});

//   // Increase quantity
//   const increaseQuantity = (id, price) => {
//     setCart((prev) => ({
//       ...prev,
//       [id]: { quantity: (prev[id]?.quantity || 0) + 1, price },
//     }));
//   };

//   // Decrease quantity
//   const decreaseQuantity = (id) => {
//     setCart((prev) => {
//       if (!prev[id]) return prev;
//       const updatedQuantity = prev[id].quantity - 1;
//       if (updatedQuantity <= 0) {
//         const newCart = { ...prev };
//         delete newCart[id];
//         return newCart;
//       }
//       return { ...prev, [id]: { ...prev[id], quantity: updatedQuantity } };
//     });
//   };

//   // Calculate total price
//   const totalPrice = Object.values(cart).reduce((sum, item) => sum + item.quantity * item.price, 0);

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.logo}>Foodgo</Text>
//         <Image source={{ uri: "https://via.placeholder.com/50" }} style={styles.profileImage} />
//       </View>

//       <Text style={styles.subtitle}>Order your favourite food!</Text>

//       {/* Search Bar */}
//       <View style={styles.searchContainer}>
//         <TextInput placeholder="Search" style={styles.searchInput} />
//       </View>

//       {/* Scrollable Food Items List */}
//       <KeyboardAwareScrollView>
//         <FlatList
//           data={foodItems}
//           numColumns={2}
//           keyExtractor={(item) => item.id.toString()}
//           contentContainerStyle={{ paddingVertical: 20 }}
//           renderItem={({ item }) => (
//             <View style={styles.foodCard}>
//               <Image source={item.image} style={styles.foodImage} />
//               <Text style={styles.foodName}>{item.name}</Text>
//               <Text style={styles.foodType}>{item.type}</Text>
//               <Text style={styles.foodPrice}>{`₹ ${item.price}`}</Text>

//               {/* Quantity Controls */}
//               <View style={styles.quantityContainer}>
//                 <TouchableOpacity
//                   onPress={() => decreaseQuantity(item.id)}
//                   style={styles.quantityButton}
//                 >
//                   <Text style={styles.buttonText}>-</Text>
//                 </TouchableOpacity>
//                 <Text style={styles.quantityText}>{cart[item.id]?.quantity || 0}</Text>
//                 <TouchableOpacity
//                   onPress={() => increaseQuantity(item.id, item.price)}
//                   style={styles.quantityButton}
//                 >
//                   <Text style={styles.buttonText}>+</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           )}
//         />
//       </KeyboardAwareScrollView>

//       {/* Order Now Button */}
//       <View style={styles.footer}>
//         <Text style={styles.totalPriceText}>Total: ₹ {totalPrice}</Text>
//         <TouchableOpacity style={styles.orderNowButton} disabled={totalPrice === 0}>
//           <Text style={styles.orderNowText}>Order Now</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// // Styles
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     padding: 15,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   logo: {
//     fontSize: 24,
//     fontWeight: "bold",
//     fontStyle: "italic",
//   },
//   profileImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: "gray",
//     marginVertical: 10,
//   },
//   searchContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#F5F5F5",
//     borderRadius: 10,
//     paddingHorizontal: 10,
//     marginVertical: 10,
//   },
//   searchInput: {
//     flex: 1,
//     padding: 10,
//   },
//   foodCard: {
//     flex: 1,
//     backgroundColor: "#FFF",
//     borderRadius: 10,
//     padding: 10,
//     margin: 5,
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 3,
//   },
//   foodImage: {
//     width: 100,
//     height: 100,
//     resizeMode: "contain",
//   },
//   foodName: {
//     fontSize: 16,
//     fontWeight: "bold",
//     textAlign: "center",
//   },
//   foodType: {
//     fontSize: 12,
//     color: "gray",
//     textAlign: "center",
//   },
//   foodPrice: {
//     fontSize: 14,
//     fontWeight: "bold",
//     marginVertical: 5,
//     color: "#FF5A5F",
//   },
//   quantityContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 10,
//     backgroundColor: "#F5F5F5",
//     borderRadius: 20,
//     paddingVertical: 5,
//     paddingHorizontal: 15,
//   },
//   quantityButton: {
//     backgroundColor: "#FF5A5F",
//     width: 35,
//     height: 35,
//     borderRadius: 17.5,
//     justifyContent: "center",
//     alignItems: "center",
//     marginHorizontal: 10,
//   },
//   buttonText: {
//     fontSize: 20,
//     color: "white",
//     fontWeight: "bold",
//   },
//   quantityText: {
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   footer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     paddingVertical: 15,
//     paddingHorizontal: 20,
//     borderTopWidth: 1,
//     borderTopColor: "#E5E5E5",
//   },
//   totalPriceText: {
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   orderNowButton: {
//     backgroundColor: "#FF5A5F",
//     paddingVertical: 15,
//     paddingHorizontal: 25,
//     borderRadius: 10,
//   },
//   orderNowText: {
//     color: "white",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
// });

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { NetPrinter, BLEPrinter } from "react-native-printer";
import { NetworkInfo } from "react-native-network-info";
import { iconpathurl } from "../../../assest/iconpath";

// Sample Food Data
const foodItems = [
  {
    id: 1,
    name: "Cheeseburger",
    type: "Wendy's Burger",
    price: 100,
    image: iconpathurl.shawarma,
  },
  {
    id: 2,
    name: "Hamburger",
    type: "Veggie Burger",
    price: 120,
    image: iconpathurl.shawarma,
  },
  {
    id: 3,
    name: "Chicken Burger",
    type: "Chicken Burger",
    price: 140,
    image: iconpathurl.shawarma,
  },
  {
    id: 4,
    name: "Fried Chicken Burger",
    type: "Fried Chicken",
    price: 160,
    image: iconpathurl.shawarma,
  },
];

export default function Home() {
  const [cart, setCart] = useState({});
  const [printerIP, setPrinterIP] = useState(null);
  const [printerConnected, setPrinterConnected] = useState(false);

  useEffect(() => {
    fetchDynamicIP();
  }, []);

  // Fetch dynamic IP address
  const fetchDynamicIP = async () => {
    try {
      const ip = await NetworkInfo.getGatewayIPAddress(); // Get router's IP
      if (ip) {
        const dynamicPrinterIP = ip.replace(/\d+$/, "100"); // Example: Change last octet to `100`
        setPrinterIP(dynamicPrinterIP);
      } else {
        Alert.alert("Error", "Unable to fetch network IP.");
      }
    } catch (error) {
      console.error("Failed to fetch dynamic IP:", error);
    }
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

  // Connect to Wi-Fi Printer
  const connectWiFiPrinter = async () => {
    if (!printerIP) {
      Alert.alert(
        "Error",
        "No printer IP available. Please check your network."
      );
      return;
    }
    try {
      await NetPrinter.init();
      await NetPrinter.connectPrinter(printerIP, 9100);
      setPrinterConnected(true);
      Alert.alert("Connected", `Wi-Fi Printer connected: ${printerIP}`);
    } catch (error) {
      console.error("Wi-Fi Printer Connection Failed:", error);
      Alert.alert("Error", "Failed to connect to Wi-Fi Printer.");
    }
  };

  // Connect to Bluetooth Printer
  const connectBluetoothPrinter = async () => {
    try {
      await BLEPrinter.init();
      const printers = await BLEPrinter.getDeviceList();
      if (printers.length === 0) {
        Alert.alert("No Bluetooth Printers Found");
        return;
      }

      await BLEPrinter.connectPrinter(printers[0].inner_mac_address);
      setPrinterConnected(true);
      Alert.alert(
        "Connected",
        `Bluetooth Printer connected: ${printers[0].device_name}`
      );
    } catch (error) {
      console.error("Bluetooth Printer Connection Failed:", error);
      Alert.alert("Error", "Failed to connect to Bluetooth Printer.");
    }
  };

  // Print Receipt
  const printReceipt = async () => {
    if (!printerConnected) {
      Alert.alert("Printer Not Connected", "Please connect a printer first.");
      return;
    }

    try {
      let printData = "===== ORDER RECEIPT =====\n";
      Object.keys(cart).forEach((key) => {
        const item = cart[key];
        const foodItem = foodItems.find((f) => f.id == key);
        printData += `${item.quantity} x ${foodItem.name} - ₹${
          item.price * item.quantity
        }\n`;
      });
      printData += "--------------------------\n";
      printData += `Total: ₹ ${totalPrice}\n`;
      printData += "==========================\n";

      await NetPrinter.printText(printData, {
        fontSize: 24,
        align: "CENTER",
        bold: true,
      });

      Alert.alert("Success", "Receipt printed successfully!");
    } catch (error) {
      console.error("Printing error:", error);
      Alert.alert("Error", "Failed to print receipt.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>Foodgo</Text>
      </View>

      <Text style={styles.subtitle}>Order your favourite food!</Text>

      {/* Printer Connection Buttons */}
      <View style={styles.printerContainer}>
        <TouchableOpacity
          style={styles.connectButton}
          onPress={connectWiFiPrinter}
        >
          <Text style={styles.buttonText}>Connect Wi-Fi Printer</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.connectButton}
          onPress={connectBluetoothPrinter}
        >
          <Text style={styles.buttonText}>Connect Bluetooth Printer</Text>
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
                <TouchableOpacity
                  onPress={() => decreaseQuantity(item.id)}
                  style={styles.quantityButton}
                >
                  <Text style={styles.buttonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>
                  {cart[item.id]?.quantity || 0}
                </Text>
                <TouchableOpacity
                  onPress={() => increaseQuantity(item.id, item.price)}
                  style={styles.quantityButton}
                >
                  <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </KeyboardAwareScrollView>

      {/* Order Now Button */}
      <View style={styles.footer}>
        <Text style={styles.totalPriceText}>Total: ₹ {totalPrice}</Text>
        <TouchableOpacity
          style={styles.orderNowButton}
          disabled={totalPrice === 0}
          onPress={printReceipt}
        >
          <Text style={styles.orderNowText}>Order Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 15 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: { fontSize: 24, fontWeight: "bold", fontStyle: "italic" },
  subtitle: { fontSize: 16, color: "gray", marginVertical: 10 },
  printerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  connectButton: { backgroundColor: "#3498db", padding: 10, borderRadius: 8 },
  buttonText: { color: "white", fontWeight: "bold" },
  foodCard: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 10,
    margin: 5,
    alignItems: "center",
    elevation: 3,
  },
  totalPriceText: { fontSize: 18, fontWeight: "bold" },
  orderNowButton: {
    backgroundColor: "#FF5A5F",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  orderNowText: { color: "white", fontSize: 18, fontWeight: "bold" },
  foodImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  quantityButton: {
    backgroundColor: "#FF5A5F",
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },
});
