import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import firestore from '@react-native-firebase/firestore';

export default function OrderList() {
  const [activeTab, setActiveTab] = useState("pending");
  const [pendingOrders, setPendingOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalDeliveredSales, setTotalDeliveredSales] = useState(0);

  // Fetch orders from Firebase
  useEffect(() => {
    const unsubscribe = firestore()
      .collection("sales")
      .orderBy("createdAt", "desc")
      .onSnapshot(
        (snapshot) => {
          const pending = [];
          const delivered = [];

          // Get today's date in YYYY-MM-DD format
          const today = new Date().toISOString().slice(0, 10);

          snapshot.forEach((doc) => {
            const order = { id: doc.id, ...doc.data() };
            if (order.status === "delivered") {
              delivered.push(order);
            } else {
              pending.push(order);
            }
          });

          // Calculate total sales from only today's delivered orders
          const totalSales = delivered.reduce((sum, order) => {
            // Only count orders from today
            if (order.date === today) {
              return sum + (order.totalPrice || 0);
            }
            return sum;
          }, 0);

          setPendingOrders(pending);
          setDeliveredOrders(delivered);
          setTotalDeliveredSales(totalSales);
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching orders:", error);
          setLoading(false);
          Alert.alert("Error", "Failed to load orders");
        }
      );

    return () => unsubscribe();
  }, []);

  // Mark order as delivered
  const markAsDelivered = async (orderId) => {
    try {
      await firestore().collection("sales").doc(orderId).update({
        status: "delivered",
        deliveredAt: firestore.FieldValue.serverTimestamp(),
      });
      Alert.alert("Success", "Order marked as delivered!");
    } catch (error) {
      console.error("Error updating order:", error);
      Alert.alert("Error", "Failed to update order status");
    }
  };

  // Delete order
  const deleteOrder = async (orderId, orderNumber) => {
    Alert.alert(
      "Delete Order",
      `Are you sure you want to delete order #${orderNumber}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await firestore().collection("sales").doc(orderId).delete();
              Alert.alert("Success", "Order deleted successfully!");
            } catch (error) {
              console.error("Error deleting order:", error);
              Alert.alert("Error", "Failed to delete order");
            }
          },
        },
      ]
    );
  };

  // Edit order - navigate to edit screen
  const editOrder = (order) => {
    // We'll create an edit screen, for now just show alert
    Alert.alert(
      "Edit Order",
      "Edit functionality will open order details for modification",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: () => {
            // TODO: Navigate to edit screen with order data
            console.log("Edit order:", order);
          },
        },
      ]
    );
  };

  // Render order card
  const renderOrderCard = ({ item }) => {
    const isPending = activeTab === "pending";

    return (
      <View style={[styles.orderCard, isPending ? styles.pendingCard : styles.deliveredCard]}>
        <View style={styles.orderHeader}>
          <View style={styles.orderHeaderLeft}>
            <Text style={styles.orderBadge}>{isPending ? "⏳" : "✅"}</Text>
            <Text style={styles.orderId}>#{item.orderId}</Text>
          </View>
          <Text style={styles.orderDate}>📆 {item.date}</Text>
        </View>

        <View style={styles.itemsContainer}>
          {item.items?.map((product, index) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemText}>
                {product.quantity}x {product.name}
              </Text>
              <Text style={styles.itemPrice}>
                ₹{(product.quantity * product.price).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalPrice}>₹{item.totalPrice?.toFixed(2)}</Text>
        </View>

        {isPending && (
          <TouchableOpacity
            style={styles.deliverBtn}
            onPress={() => markAsDelivered(item.id)}
          >
            <Text style={styles.deliverBtnText}>✓ Mark as Delivered</Text>
          </TouchableOpacity>
        )}

        {!isPending && item.deliveredAt && (
          <View style={styles.deliveredBadge}>
            <Text style={styles.deliveredText}>
              ✅ Delivered: {new Date(item.deliveredAt?.toDate()).toLocaleString('en-IN', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Text>
          </View>
        )}

        {/* Edit and Delete buttons - only for pending orders */}
        {isPending && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => editOrder(item)}
            >
              <Text style={styles.editBtnText}>✏️ Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => deleteOrder(item.id, item.orderId)}
            >
              <Text style={styles.deleteBtnText}>🗑️ Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  // Render tab content
  const renderTabContent = () => {
    const orders = activeTab === "pending" ? pendingOrders : deliveredOrders;

    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#FF5A5F" />
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      );
    }

    if (orders.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyIcon}>
            {activeTab === "pending" ? "📋" : "🎉"}
          </Text>
          <Text style={styles.emptyText}>
            {activeTab === "pending"
              ? "No pending orders"
              : "No delivered orders yet"}
          </Text>
          <Text style={styles.emptySubtext}>
            {activeTab === "pending"
              ? "New orders will appear here"
              : "Completed orders will appear here"}
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrderCard}
        contentContainerStyle={styles.listContainer}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Orders</Text>

      {/* Total Sales Card */}
      <View style={styles.totalSalesCard}>
        <View style={styles.salesIconContainer}>
          <Text style={styles.salesIcon}>💰</Text>
        </View>
        <Text style={styles.totalSalesLabel}>Today's Sales</Text>
        <Text style={styles.totalSalesAmount}>₹{totalDeliveredSales.toFixed(2)}</Text>
        <Text style={styles.totalSalesDate}>
          📅 {new Date().toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "pending" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("pending")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "pending" && styles.activeTabText,
            ]}
          >
            ⏳ Pending ({pendingOrders.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "delivered" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("delivered")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "delivered" && styles.activeTabText,
            ]}
          >
            ✅ Delivered ({deliveredOrders.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {renderTabContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 15
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#2C3E50",
  },
  totalSalesCard: {
    backgroundColor: "#8E44AD",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#8E44AD",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  salesIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  salesIcon: {
    fontSize: 24,
  },
  totalSalesLabel: {
    fontSize: 13,
    color: "#fff",
    fontWeight: "600",
    marginBottom: 8,
    opacity: 0.95,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  totalSalesAmount: {
    fontSize: 38,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 6,
  },
  totalSalesDate: {
    fontSize: 13,
    color: "#fff",
    marginTop: 4,
    opacity: 0.9,
    fontWeight: "500",
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: "#fff",
    padding: 5,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: "#FF5A5F",
    shadowColor: "#FF5A5F",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  tabText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#7F8C8D",
  },
  activeTabText: {
    color: "#fff",
  },
  listContainer: {
    paddingBottom: 20,
  },
  orderCard: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  pendingCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#FFA726",
  },
  deliveredCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#27ae60",
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  orderHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  orderBadge: {
    fontSize: 20,
  },
  orderId: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  orderDate: {
    fontSize: 13,
    color: "#95A5A6",
    fontWeight: "500",
  },
  itemsContainer: {
    marginBottom: 12,
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    padding: 10,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  itemText: {
    fontSize: 14,
    color: "#34495E",
    flex: 1,
    fontWeight: "500",
  },
  itemPrice: {
    fontSize: 14,
    color: "#E74C3C",
    fontWeight: "700",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 2,
    borderTopColor: "#E8E8E8",
    backgroundColor: "#FFF9E6",
    padding: 10,
    borderRadius: 8,
    marginHorizontal: -6,
  },
  totalLabel: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#E74C3C",
  },
  deliverBtn: {
    backgroundColor: "#27ae60",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
    shadowColor: "#27ae60",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  deliverBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
    letterSpacing: 0.3,
  },
  deliveredBadge: {
    backgroundColor: "#D5F5E3",
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#A9DFBF",
  },
  deliveredText: {
    fontSize: 12,
    color: "#27ae60",
    fontWeight: "600",
    textAlign: "center",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#7F8C8D",
    fontWeight: "500",
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    color: "#7F8C8D",
    textAlign: "center",
    fontWeight: "600",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#BDC3C7",
    textAlign: "center",
    fontWeight: "400",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    gap: 10,
  },
  editBtn: {
    flex: 1,
    backgroundColor: "#3498DB",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#3498DB",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  editBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: "#E74C3C",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#E74C3C",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  deleteBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
