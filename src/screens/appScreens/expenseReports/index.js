import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { useSelector } from 'react-redux';
import { PieChart } from 'react-native-chart-kit';
import { selectExpenses, selectMonthlySalary } from '../../../redux/slice/authSlice';
import RNFS from 'react-native-fs';
import XLSX from 'xlsx';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const screenWidth = Dimensions.get('window').width;

const filters = ['monthly', 'yearly', 'all'];

// Color palette for categories
const CATEGORY_COLORS = {
  'Basic Expenses': '#FF5A5F',
  'Food & Groceries': '#FF9500',
  'Transportation': '#007AFF',
  'Utilities': '#5856D6',
  'Entertainment': '#FF2D55',
  'Healthcare': '#AF52DE',
  'Education': '#34C759',
  'Shopping': '#FF3B30',
  'Others': '#8E8E93',
};

export default function ExpenseReportsScreen() {
  const [selectedFilter, setSelectedFilter] = useState('monthly');
  const expenses = useSelector(selectExpenses);
  const monthlySalary = useSelector(selectMonthlySalary);

  const filteredExpenses = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return expenses.filter(exp => {
      const expDate = new Date(exp.date);

      if (selectedFilter === 'monthly') {
        return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
      } else if (selectedFilter === 'yearly') {
        return expDate.getFullYear() === currentYear;
      }
      return true; // 'all'
    });
  }, [expenses, selectedFilter]);

  // Calculate expenses by category for pie chart
  const categoryData = useMemo(() => {
    const categories = {};

    filteredExpenses.forEach(exp => {
      const cat = exp.category || 'Others';
      categories[cat] = (categories[cat] || 0) + exp.amount;
    });

    return Object.entries(categories)
      .map(([name, amount]) => ({
        name,
        amount,
        color: CATEGORY_COLORS[name] || '#999',
        legendFontColor: '#333',
        legendFontSize: 14,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [filteredExpenses]);

  const totalExpenses = useMemo(() => {
    return filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  }, [filteredExpenses]);

  const basicExpenses = useMemo(() => {
    return filteredExpenses
      .filter(exp => exp.category === 'Basic Expenses')
      .reduce((sum, exp) => sum + exp.amount, 0);
  }, [filteredExpenses]);

  const otherExpenses = totalExpenses - basicExpenses;

  // Export to Excel
  const exportToExcel = async () => {
    try {
      if (!filteredExpenses || filteredExpenses.length === 0) {
        Alert.alert('No Data', 'No expenses to export for this period');
        return;
      }

      const sortedData = [...filteredExpenses].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

      const formattedData = sortedData.map(exp => ({
        Date: new Date(exp.date).toLocaleDateString('en-IN'),
        Category: exp.category,
        Description: exp.description,
        Amount: exp.amount,
      }));

      // Add summary rows
      formattedData.push({});
      formattedData.push({
        Date: 'SUMMARY',
        Category: '',
        Description: 'Total Expenses',
        Amount: totalExpenses,
      });
      formattedData.push({
        Date: '',
        Category: '',
        Description: 'Basic Expenses',
        Amount: basicExpenses,
      });
      formattedData.push({
        Date: '',
        Category: '',
        Description: 'Other Expenses',
        Amount: otherExpenses,
      });

      const ws = XLSX.utils.json_to_sheet(formattedData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Expenses');

      const wbout = XLSX.write(wb, { type: 'binary', bookType: 'xlsx' });

      const filePath = `${RNFS.DownloadDirectoryPath}/Expenses_${Date.now()}.xlsx`;

      await RNFS.writeFile(filePath, wbout, 'ascii');

      Alert.alert('Success', `Excel file saved to:\n${filePath}`);
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Error', 'Failed to export data');
    }
  };

  const chartConfig = {
    backgroundColor: '#FFF',
    backgroundGradientFrom: '#FFF',
    backgroundGradientTo: '#FFF',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Expense Reports</Text>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {filters.map(filter => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter && styles.filterTextActive,
              ]}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Expenses</Text>
          <Text style={styles.summaryAmount}>₹{totalExpenses.toLocaleString()}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Basic Expenses</Text>
          <Text style={styles.basicAmount}>₹{basicExpenses.toLocaleString()}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Other Expenses</Text>
          <Text style={styles.otherAmount}>₹{otherExpenses.toLocaleString()}</Text>
        </View>
      </View>

      {/* Pie Chart */}
      {categoryData.length > 0 ? (
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Expenses by Category</Text>
          <PieChart
            data={categoryData}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No expenses recorded for this period</Text>
        </View>
      )}

      {/* Category Breakdown */}
      {categoryData.length > 0 && (
        <View style={styles.breakdownCard}>
          <Text style={styles.subHeading}>Category Breakdown</Text>
          {categoryData.map((cat, index) => (
            <View key={index} style={styles.categoryRow}>
              <View style={styles.categoryInfo}>
                <View style={[styles.colorDot, { backgroundColor: cat.color }]} />
                <Text style={styles.categoryName}>{cat.name}</Text>
              </View>
              <View style={styles.categoryStats}>
                <Text style={styles.categoryAmount}>₹{cat.amount.toLocaleString()}</Text>
                <Text style={styles.categoryPercentage}>
                  {((cat.amount / totalExpenses) * 100).toFixed(1)}%
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Export Button */}
      {filteredExpenses.length > 0 && (
        <TouchableOpacity style={styles.exportButton} onPress={exportToExcel}>
          <Icon name="file-excel" size={24} color="#FFF" />
          <Text style={styles.exportButtonText}>Export to Excel</Text>
        </TouchableOpacity>
      )}

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A4563',
    marginBottom: 20,
    marginTop: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  filterButton: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E8E8E8',
  },
  filterButtonActive: {
    backgroundColor: '#FF5A5F',
    borderColor: '#FF5A5F',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  filterTextActive: {
    color: '#FFF',
  },
  summaryCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#777',
    fontWeight: '500',
  },
  summaryAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A4563',
  },
  basicAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF5A5F',
  },
  otherAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3498DB',
  },
  divider: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginVertical: 10,
  },
  chartCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A4563',
    marginBottom: 15,
  },
  emptyState: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 40,
    marginBottom: 15,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  breakdownCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A4563',
    marginBottom: 15,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  categoryName: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  categoryStats: {
    alignItems: 'flex-end',
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A4563',
  },
  categoryPercentage: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  exportButton: {
    flexDirection: 'row',
    backgroundColor: '#27AE60',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  exportButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
});
