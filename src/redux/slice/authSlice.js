import { createSlice } from "@reduxjs/toolkit";
import endpoints from "../../apiServices/endpoint";
import request from "../../apiServices";

const initialState = {
  data: [],
   salesData: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    addOrUpdateInvestment: (state, action) => {
      const newItems = Array.isArray(action.payload) ? action.payload : [action.payload];

      // Merge existing data with new items based on unique id
      const updatedData = [...state.data];

      newItems.forEach(item => {
        const existingIndex = updatedData.findIndex(i => i.id === item.id);
        if (existingIndex >= 0) {
          // Update existing item if id matches
          updatedData[existingIndex] = { ...updatedData[existingIndex], ...item };
        } else {
          // Append new item if id is unique
          updatedData.push({ ...item });
        }
      });

      // Return new state immutably
      return { ...state, data: updatedData };
    },
    addSales: (state, action) => {
      console.log(action.payload,"add salse")
      // action.payload should be an array of { product, date, count }
      state.salesData.push(...action.payload);
    },
  },
});

/*--------------------- API call example --------------------------*/
export const loginApi = async (data) => {
  try {
    const res = await request({
      url: endpoints?.EndPoints?.products,
      method: endpoints.ApiMethods.GET,
      headers: { data },
    });
    return res;
  } catch (error) {
    console.error("Error in loginApi:", error);
    throw error;
  }
};

// Export actions
export const { addOrUpdateInvestment,addSales } = authSlice.actions;

// Selector example
export const selectInvestments = (state) => state.auth.data;

export default authSlice.reducer;
