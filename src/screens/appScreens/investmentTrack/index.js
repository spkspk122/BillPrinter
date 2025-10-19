import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { useSelector } from "react-redux";
import { BarChart, XAxis, YAxis, Grid } from "react-native-svg-charts";
import * as scale from "d3-scale";

const filters = ["weekly", "monthly", "yearly"];
const { width: screenWidth } = Dimensions.get("window");

export default function InvestmentReport() {
  const [selectedFilter, setSelectedFilter] = useState("weekly");
  const investmentData = useSelector(state => state.authSlice?.data || []);
  console.log(investmentData,"!!!!")

  const getWeekNumber = (date) => Math.ceil(date.getDate() / 7);

  const filteredData = useMemo(() => {
    if (!investmentData.length) return [];

    if (selectedFilter === "weekly") {
      const weekData = {};
      investmentData.forEach(item => {
        const itemDate = new Date(item.date);
        const weekStart = new Date(itemDate);
        weekStart.setDate(itemDate.getDate() - ((itemDate.getDay() + 6) % 7)); // Monday start
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        const key = `${weekStart.toISOString().slice(0,10)}_${weekEnd.toISOString().slice(0,10)}`;

        if (!weekData[key]) {
          weekData[key] = {
            invested: 0,
            returns: 0,
            label: `${weekStart.getDate()}-${weekEnd.getDate()} ${weekStart.toLocaleString("default", { month: "short" })}`
          };
        }
        weekData[key].invested += item.invested;
        weekData[key].returns += item.returns;
      });
      return Object.values(weekData);
    }

    if (selectedFilter === "monthly") {
      const monthData = {};
      investmentData.forEach(item => {
        const itemDate = new Date(item.date);
        const weekNumber = getWeekNumber(itemDate);
        const key = `${itemDate.getFullYear()}-${itemDate.getMonth()}-W${weekNumber}`;
        if (!monthData[key]) {
          monthData[key] = {
            invested: 0,
            returns: 0,
            label: `Week ${weekNumber}`
          };
        }
        monthData[key].invested += item.invested;
        monthData[key].returns += item.returns;
      });
      return Object.values(monthData);
    }

    if (selectedFilter === "yearly") {
      const yearData = {};
      investmentData.forEach(item => {
        const itemDate = new Date(item.date);
        const key = `${itemDate.getFullYear()}-${itemDate.getMonth()}`;
        if (!yearData[key]) {
          yearData[key] = {
            invested: 0,
            returns: 0,
            label: itemDate.toLocaleString("default", { month: "short" })
          };
        }
        yearData[key].invested += item.invested;
        yearData[key].returns += item.returns;
      });
      return Object.values(yearData);
    }

    return [];
  }, [selectedFilter, investmentData]);

  const labels = filteredData.map(i => i.label);
  const invested = filteredData.map(i => i.invested);
  const returns = filteredData.map(i => i.returns);

  const maxValue = Math.max(...[...invested, ...returns, 1]);
  const barWidth = 20;
  const spacing = 10;
  const groupWidth = barWidth * 2 + spacing;
  const chartWidth = Math.max(filteredData.length * groupWidth, screenWidth - 80);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Investment vs Returns</Text>

      <View style={styles.tabsContainer}>
        {filters.map(filter => (
          <TouchableOpacity
            key={filter}
            style={[styles.tab, selectedFilter === filter && styles.activeTab]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text style={[styles.tabText, selectedFilter === filter && styles.activeTabText]}>
              {filter.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredData.length === 0 ? (
        <Text style={styles.noData}>No data for selected filter</Text>
      ) : (
        <ScrollView horizontal>
          <View style={{ flexDirection: "row", paddingRight: 10, height: 300 }}>
            <YAxis
              data={[...invested, ...returns]}
              contentInset={{ top: 30, bottom: 20 }}
              svg={{ fontSize: 10, fill: "gray" }}
              numberOfTicks={6}
              style={{ width: 40, marginBottom: 40 }}
            />

            <View style={{ flexDirection: "row" }}>
              {/* Invested Bars */}
              <BarChart
                style={{ height: 300, width: chartWidth / 2 }}
                data={invested}
                svg={{ fill: "#4caf50" }}
                contentInset={{ top: 30, bottom: 20 }}
                spacingInner={0.4}
                yMax={maxValue}
              />
              {/* Returns Bars */}
              <BarChart
                style={{ height: 300, width: chartWidth / 2, marginLeft: -barWidth }}
                data={returns}
                svg={{ fill: "#ff5722" }}
                contentInset={{ top: 30, bottom: 20 }}
                spacingInner={0.4}
                yMax={maxValue}
              />
            </View>

            <XAxis
              style={{ marginTop: 10, height: 50, width: chartWidth }}
              data={labels}
              formatLabel={(value, index) => labels[index]}
              scale={scale.scaleBand}
              svg={{ fontSize: 12, fill: "gray", rotation: 60, originY: 15, y: 5 }}
            />
          </View>
        </ScrollView>
      )}

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
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  tabsContainer: { flexDirection: "row", marginBottom: 15 },
  tab: { paddingVertical: 8, paddingHorizontal: 15, backgroundColor: "#EAEAEA", borderRadius: 8, marginRight: 10 },
  activeTab: { backgroundColor: "#FF5A5F" },
  tabText: { color: "#333", fontWeight: "600" },
  activeTabText: { color: "#fff" },
  noData: { textAlign: "center", color: "gray", marginTop: 50 },
  legendContainer: { flexDirection: "row", marginTop: 20 },
  legendBox: { flexDirection: "row", alignItems: "center", marginRight: 20 },
  colorBox: { width: 20, height: 20, marginRight: 5 },
});
