import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View, Platform } from 'react-native';
import { SCREENS } from '../screens';
import screenNames from '../screenNames';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Home from '../../screens/appScreens/home';
import AddExpenseScreen from '../../screens/appScreens/addExpense';
import ExpenseListScreen from '../../screens/appScreens/expenseList';
import ExpenseReportsScreen from '../../screens/appScreens/expenseReports';
import BillsRemindersScreen from '../../screens/appScreens/billsReminders';

const Tab = createBottomTabNavigator();

const AppTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#FF5A5F',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E5EA',
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          paddingTop: 8,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}>
      <Tab.Screen
        name={SCREENS.HOME}
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              <MaterialIcons name="home" color={color} size={focused ? 28 : 24} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name={SCREENS.EXPENSELIST}
        component={ExpenseListScreen}
        options={{
          tabBarLabel: 'Expenses',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              <MaterialIcons name="receipt-long" color={color} size={focused ? 28 : 24} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name={SCREENS.ADDEXPENSE}
        component={AddExpenseScreen}
        options={{
          tabBarLabel: 'Add',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.centerIconContainer, focused && styles.centerIconContainerActive]}>
              <MaterialIcons name="add-circle" color="#FFF" size={36} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name={SCREENS.EXPENSEREPORTS}
        component={ExpenseReportsScreen}
        options={{
          tabBarLabel: 'Reports',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              <MaterialIcons name="pie-chart" color={color} size={focused ? 28 : 24} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name={SCREENS.BILLSREMINDERS}
        component={BillsRemindersScreen}
        options={{
          tabBarLabel: 'Bills',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              <MaterialIcons name="notifications-active" color={color} size={focused ? 28 : 24} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
  iconContainerActive: {
    backgroundColor: '#FFF0F1',
    borderRadius: 12,
  },
  centerIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
    height: 56,
    backgroundColor: '#FF5A5F',
    borderRadius: 28,
    marginTop: -20,
    borderWidth: 4,
    borderColor: '#FFF',
    elevation: 8,
    shadowColor: '#FF5A5F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  centerIconContainerActive: {
    backgroundColor: '#E74C3C',
    transform: [{ scale: 1.1 }],
  },
});

export default AppTabs;
