import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";
import { LineChart, Grid, XAxis, YAxis } from "react-native-svg-charts";
import * as shape from "d3-shape";
import { G, Circle, Text as SVGText } from "react-native-svg";
import { useSelector } from "react-redux";
import RNFS from "react-native-fs";
import XLSX from "xlsx";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const filters = ["weekly", "monthly", "yearly"];
const { width } = Dimensions.get("window");

export default function InvestmentReport() {
  const [selectedFilter, setSelectedFilter] = useState("weekly");
  const investmentData = useSelector((state) => state?.authSlice?.data || []);

  // 📊 Filtered & Grouped Data
  const filteredData = useMemo(() => {
    const grouped = {};

    investmentData.forEach((item) => {
      const d = new Date(item.date);
      let key, label;

      if (selectedFilter === "weekly") {
        // Get start of week (Sunday)
        const weekStart = new Date(d);
        weekStart.setDate(d.getDate() - d.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);

        key = `${weekStart.toISOString().split("T")[0]}_${weekEnd
          .toISOString()
          .split("T")[0]}`;
        label = `${weekStart.toLocaleString("default", {
          month: "short",
        })} ${weekStart.getDate()}–${weekEnd.getDate()}`;
      } else if (selectedFilter === "monthly") {
        key = `${d.getMonth()}-${d.getFullYear()}`;
        label = d.toLocaleString("default", { month: "short" });
      } else {
        key = `${d.getFullYear()}`;
        label = `${d.getFullYear()}`;
      }

      if (!grouped[key]) grouped[key] = { invested: 0, returns: 0, label };
      grouped[key].invested += item.invested;
      grouped[key].returns += item.returns;
    });

    return Object.values(grouped);
  }, [selectedFilter, investmentData]);

  const labels = filteredData.map((i) => i.label);
  const invested = filteredData.map((i) => i.invested);
  const returns = filteredData.map((i) => i.returns);

  const contentInset = { top: 30, bottom: 30, left: 20, right: 20 };

  // 🎯 Decorator (value points on chart)
  const Decorator = ({ x, y, data, color }) => (
    <G>
      {data.map((value, index) => (
        <React.Fragment key={index}>
          <Circle
            cx={x(index)}
            cy={y(value)}
            r={4}
            stroke={color}
            fill="white"
            strokeWidth={2}
          />
          <SVGText
            x={x(index)}
            y={y(value) - 12}
            fontSize={10}
            fill={color}
            fontWeight="600"
            alignmentBaseline="middle"
            textAnchor="middle"
          >
            {value.toLocaleString()}
          </SVGText>
        </React.Fragment>
      ))}
    </G>
  );

  // 📥 Export Function (Excel)
  const exportToExcel = () => {
    try {
      if (!investmentData || investmentData.length === 0) {
        Alert.alert("No Data", "No investment data to export.");
        return;
      }

      const exportData = investmentData.map((item) => ({
        Date: item.date,
        Invested: item.invested,
        Returns: item.returns,
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Investments");

      const wbout = XLSX.write(wb, { type: "binary", bookType: "xlsx" });
      const path = `${RNFS.DownloadDirectoryPath}/Investment_Report_${selectedFilter}_${Date.now()}.xlsx`;

      const buffer = new ArrayBuffer(wbout.length);
      const view = new Uint8Array(buffer);
      for (let i = 0; i < wbout.length; ++i) {
        view[i] = wbout.charCodeAt(i) & 0xff;
      }

      RNFS.writeFile(path, String.fromCharCode(...view), "ascii")
        .then(() => {
          Alert.alert("Export Successful", `File saved to:\n${path}`);
        })
        .catch((err) => {
          console.error("File write error", err);
          Alert.alert("Error", "Failed to save Excel file.");
        });
    } catch (error) {
      console.error("Export Error:", error);
      Alert.alert("Error", "An unexpected error occurred while exporting.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header + Export */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Investment vs Returns</Text>

        <TouchableOpacity onPress={exportToExcel} style={styles.exportButton}>
          <Icon name="file-excel" size={22} color="#2e7d32" />
          <Text style={styles.exportText}>Export</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabsContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[styles.tab, selectedFilter === filter && styles.activeTab]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text
              style={[
                styles.tabText,
                selectedFilter === filter && styles.activeTabText,
              ]}
            >
              {filter.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Chart Section */}
      <View style={{ height: 320, flexDirection: "row", paddingRight: 10 }}>
        <YAxis
          data={[...invested, ...returns]}
          contentInset={contentInset}
          svg={{ fontSize: 10, fill: "gray" }}
          numberOfTicks={6}
          formatLabel={(value) => value.toLocaleString()}
          style={{ marginBottom: 30 }}
        />

        <View style={{ flex: 1, marginLeft: 10 }}>
          <LineChart
            style={{ flex: 1 }}
            data={invested}
            svg={{ stroke: "#4caf50", strokeWidth: 3 }}
            contentInset={contentInset}
            curve={shape.curveMonotoneX}
            yMin={0}
            yMax={Math.max(...invested, ...returns) * 1.15}
          >
            <Grid />
            <Decorator data={invested} color="#4caf50" />
          </LineChart>

          <LineChart
            style={StyleSheet.absoluteFill}
            data={returns}
            svg={{ stroke: "#ff5722", strokeWidth: 3 }}
            contentInset={contentInset}
            curve={shape.curveMonotoneX}
            yMin={0}
            yMax={Math.max(...invested, ...returns) * 1.15}
          >
            <Decorator data={returns} color="#ff5722" />
          </LineChart>

          <XAxis
            style={{ marginHorizontal: -10, height: 30 }}
            data={labels}
            formatLabel={(value, index) => labels[index]}
            contentInset={{ left: 20, right: 20 }}
            svg={{ fontSize: 12, fill: "gray" }}
          />
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legendContainer}>
        <View style={styles.legendBox}>
          <View style={[styles.colorBox, { backgroundColor: "#4caf50" }]} />
          <Text>Invested</Text>
        </View>
        <View style={styles.legendBox}>
          <View style={[styles.colorBox, { backgroundColor: "#ff5722" }]} />
          <Text>Returns</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#F9FAFB" },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  title: { fontSize: 22, fontWeight: "bold" },
  exportButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  exportText: {
    color: "#2e7d32",
    fontWeight: "600",
    marginLeft: 5,
    fontSize: 14,
  },
  tabsContainer: { flexDirection: "row", marginBottom: 15 },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: "#EAEAEA",
    borderRadius: 8,
    marginRight: 10,
  },
  activeTab: { backgroundColor: "#FF5A5F" },
  tabText: { color: "#333", fontWeight: "600" },
  activeTabText: { color: "#fff" },
  legendContainer: {
    flexDirection: "row",
    marginTop: 20,
    alignSelf: "center",
  },
  legendBox: { flexDirection: "row", alignItems: "center", marginRight: 20 },
  colorBox: { width: 20, height: 20, marginRight: 5 },
});
