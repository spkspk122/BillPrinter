import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
  PermissionsAndroid,
} from "react-native";
import { BarChart, XAxis, YAxis, Grid } from "react-native-svg-charts";
import * as scale from "d3-scale";
import RNFS from "react-native-fs";
import XLSX from "xlsx";
import { useSelector } from "react-redux";

export default function SalesReportScreen() {
  const [viewType, setViewType] = useState("daily");
  const salesData = useSelector((state) => state.authSlice?.salesData || []);

  // ===== Request storage permission on Android =====
  const requestStoragePermission = async () => {
    if (Platform.OS === "android") {
      try {
        if (Platform.Version >= 33) {
          // Android 13+ doesn't need WRITE_EXTERNAL_STORAGE for Downloads
          return true;
        } else if (Platform.Version >= 29) {
          // Android 10-12 use scoped storage, still need WRITE_EXTERNAL_STORAGE
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        } else {
          const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          ]);
          return Object.values(granted).every(
            (status) => status === PermissionsAndroid.RESULTS.GRANTED
          );
        }
      } catch (err) {
        console.warn("Storage permission error:", err);
        return false;
      }
    }
    return true;
  };

  const groupedData = useMemo(() => {
    const today = new Date();
    const filtered = salesData.filter((item) => {
      const date = new Date(item.date);
      if (viewType === "daily") return date.toDateString() === today.toDateString();
      if (viewType === "weekly")
        return date >= new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      if (viewType === "monthly") return date.getMonth() === today.getMonth();
      if (viewType === "yearly") return date.getFullYear() === today.getFullYear();
    });

    const productCounts = {};
    filtered.forEach((item) => {
      productCounts[item.product] = (productCounts[item.product] || 0) + item.count;
    });

    return Object.entries(productCounts).map(([product, count]) => ({
      product,
      count,
    }));
  }, [viewType, salesData]);

  const data = groupedData.map((i) => i.count);
  const labels = groupedData.map((i) => i.product);

  const exportToExcel = async () => {
    if (groupedData.length === 0) {
      Alert.alert("No Data", "No sales data for the selected period.");
      return;
    }

    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      Alert.alert("Permission Denied", "Storage permission is required to export Excel.");
      return;
    }

    try {
      const wsData = [["Product", "Count", "Period"]];
      groupedData.forEach((row) => wsData.push([row.product, row.count, viewType]));

      const ws = XLSX.utils.aoa_to_sheet(wsData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "ProductCounts");

      // Generate base64 string
      const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" });

      const fileName = `Product_Count_Report_${viewType}_${Date.now()}.xlsx`;
      const filePath =
        Platform.OS === "android"
          ? `${RNFS.DownloadDirectoryPath}/${fileName}`
          : `${RNFS.DocumentDirectoryPath}/${fileName}`;

      await RNFS.writeFile(filePath, wbout, "base64");

      Alert.alert("Success", `Report exported to:\n${filePath}`);
    } catch (error) {
      console.log("Excel export error:", error);
      Alert.alert("Error", "Failed to export file");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Sales Report (Product Count)</Text>

      {/* Filter Tabs */}
      <View style={styles.tabsContainer}>
        {["daily", "weekly", "monthly", "yearly"].map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.tab, viewType === type && styles.activeTab]}
            onPress={() => setViewType(type)}
          >
            <Text style={[styles.tabText, viewType === type && styles.activeTabText]}>
              {type.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Scrollable Chart */}
      <View style={styles.card}>
        <Text style={styles.chartTitle}>
          {viewType.charAt(0).toUpperCase() + viewType.slice(1)} Product Count
        </Text>
        {groupedData.length === 0 ? (
          <Text style={styles.noData}>No data available</Text>
        ) : (
          <ScrollView horizontal>
            <View style={{ flexDirection: "row", height: 260, paddingRight: 10 }}>
              <YAxis
                data={data}
                contentInset={{ top: 20, bottom: 20 }}
                svg={{ fontSize: 10, fill: "gray" }}
                numberOfTicks={5}
                style={{ marginBottom: 40, width: 40 }}
              />
              <View style={{ flexDirection: "column" }}>
                <BarChart
                  style={{ height: 260, width: data.length * 60 }}
                  data={data}
                  svg={{ fill: "#FF5A5F" }}
                  contentInset={{ top: 20, bottom: 20 }}
                  spacingInner={0.4}
                >
                  <Grid />
                </BarChart>
                <XAxis
                  style={{ marginTop: 10, height: 50, width: data.length * 60 }}
                  data={data}
                  formatLabel={(value, index) => labels[index]}
                  scale={scale.scaleBand}
                  svg={{
                    fontSize: 10,
                    fill: "gray",
                    rotation: 60,
                    originY: 15,
                    y: 5,
                  }}
                />
              </View>
            </View>
          </ScrollView>
        )}
      </View>

      {/* Summary */}
      <View style={styles.summaryContainer}>
        {groupedData.map((item, idx) => (
          <View key={idx} style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>{item.product}</Text>
            <Text style={styles.summaryValue}>{item.count}</Text>
          </View>
        ))}
      </View>

      {/* Export Button */}
      <TouchableOpacity style={styles.exportButton} onPress={exportToExcel}>
        <Text style={styles.exportText}>Export Product Count</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB", padding: 15 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  tabsContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
  tab: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: "#EAEAEA",
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: "center",
  },
  activeTab: { backgroundColor: "#FF5A5F" },
  tabText: { color: "#333", fontWeight: "600" },
  activeTabText: { color: "#fff" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
  },
  chartTitle: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
  noData: { textAlign: "center", color: "gray", paddingVertical: 20 },
  summaryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  summaryBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    width: "48%",
    alignItems: "center",
    marginBottom: 10,
    elevation: 2,
  },
  summaryTitle: { fontSize: 15, color: "#333" },
  summaryValue: { fontSize: 18, fontWeight: "bold", color: "#FF5A5F" },
  exportButton: {
    backgroundColor: "#27ae60",
    marginTop: 25,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  exportText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
