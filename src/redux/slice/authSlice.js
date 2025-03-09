import { createSlice } from "@reduxjs/toolkit";
import endpoints from "../../apiServices/endpoint";
import request from "../../apiServices";


export const authSlice = createSlice({
  name: "auth",
  initialState: {
    userData:[],
    token: "",
  },
  reducers: {
    login: (state, action) => {
      state.userData = { ...action.payload };
      state.token = action?.payload;
    },
  },
});
/*---------------------auth api calls--------------------------*/
export const loginApi = async (data) => {
  try {
    const res = await request({
      url: endpoints?.EndPoints?.products,
      method: endpoints.ApiMethods.GET,
      headers: {
        data,
      },
    });
    return res;
  } catch (error) {
    // Handle errors if needed
    console.error("Error in loginApi:", error);
    throw error; // Re-throw the error to be caught by the caller
  }
};

export const {
login
} = authSlice.actions;

// export const token = (state) => state?.authSlice?.accessToken;

export default authSlice.reducer;
