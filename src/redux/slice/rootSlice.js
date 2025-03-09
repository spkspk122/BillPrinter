import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "./authSlice";

const rootSlice = combineReducers({
  authSlice: authSlice,
});

export default rootSlice;