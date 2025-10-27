import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  salesData: [],
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
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

    clearData: (state) => {
      state.data = [];
      state.salesData = [];
    },
  },
});

export const { setLoading, setError, addOrUpdateInvestment, addSales, clearData } =
  authSlice.actions;

export const selectInvestments = (state) => state.auth.data;
export const selectSales = (state) => state.auth.salesData;
export const selectLoading = (state) => state.auth.loading;

export default authSlice.reducer;
