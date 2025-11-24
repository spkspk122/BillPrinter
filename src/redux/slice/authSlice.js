import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  salesData: [],
  loading: false,
  error: null,
  role:null,
  // Finance Management State
  monthlySalary: null,
  expenses: [], // Array of expense objects
  bills: [], // Array of bill/reminder objects
  budgets: {} // Category-wise budgets
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },    setError: (state, action) => {
      state.error = action.payload;
    },

    // 🔥 Replace investment data from Firestore snapshot
    addOrUpdateInvestment: (state, action) => {
      state.data = Array.isArray(action.payload) ? action.payload : [action.payload];
    },

    // 🔥 Replace sales data from Firestore snapshot
    addSales: (state, action) => {
      state.salesData = Array.isArray(action.payload) ? action.payload : [action.payload];
    },
     setUserRole: (state, action) => {
      state.role = action.payload;
    },

    clearData: (state) => {
      state.data = [];
      state.salesData = [];
      state.role=null
    },

    // Finance Management Actions
    setMonthlySalary: (state, action) => {
      state.monthlySalary = action.payload;
    },

    addExpense: (state, action) => {
      state.expenses = Array.isArray(action.payload) ? action.payload : [...state.expenses, action.payload];
    },

    updateExpenses: (state, action) => {
      state.expenses = action.payload;
    },

    deleteExpense: (state, action) => {
      state.expenses = state.expenses.filter(exp => exp.id !== action.payload);
    },

    addBill: (state, action) => {
      state.bills = Array.isArray(action.payload) ? action.payload : [...state.bills, action.payload];
    },

    updateBills: (state, action) => {
      state.bills = action.payload;
    },

    deleteBill: (state, action) => {
      state.bills = state.bills.filter(bill => bill.id !== action.payload);
    },

    setBudgets: (state, action) => {
      state.budgets = action.payload;
    },
  },
});

export const {
  setLoading,
  setError,
  addOrUpdateInvestment,
  addSales,
  clearData,
  setUserRole,
  setMonthlySalary,
  addExpense,
  updateExpenses,
  deleteExpense,
  addBill,
  updateBills,
  deleteBill,
  setBudgets
} = authSlice.actions;

export const selectInvestments = (state) => state.authSlice.data;
export const selectSales = (state) => state.authSlice.salesData;
export const selectLoading = (state) => state.authSlice.loading;
export const selectMonthlySalary = (state) => state.authSlice.monthlySalary;
export const selectExpenses = (state) => state.authSlice.expenses;
export const selectBills = (state) => state.authSlice.bills;
export const selectBudgets = (state) => state.authSlice.budgets;

export default authSlice.reducer;
