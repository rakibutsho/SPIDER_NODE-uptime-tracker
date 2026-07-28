import { combineReducers } from "@reduxjs/toolkit";
import baseApi from "../api/baseApi";
import authReducer from "@/redux/features/auth/authSlice";

const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  auth: authReducer,
});

export default rootReducer;
