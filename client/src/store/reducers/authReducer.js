import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";
import jwt from "jwt-decode";

export const customer_register = createAsyncThunk(
  "auth/customer_register",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/customer/customer-register", info);
      localStorage.setItem("customerToken", data.token);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const customer_login = createAsyncThunk(
  "auth/customer_login",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/customer/customer-login", info);
      localStorage.setItem("customerToken", data.token);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const get_support_info = createAsyncThunk(
  "auth/get_support_info",
  async (sellerId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/get-support-info-by-seller/${sellerId}`);
      return fulfillWithValue(data.supportInfo);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const decodeToken = (token) => {
  if (token) {
    const userInfo = jwt(token);
    return userInfo;
  } else {
    return "";
  }
};

export const get_seller_id = createAsyncThunk(
  "auth/get_seller_id",
  async (sellerName, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/search-seller?name=${sellerName}`);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const authReducer = createSlice({
  name: "auth",
  initialState: {
    loader: false,
    userInfo: decodeToken(localStorage.getItem("customerToken")),
    errorMessage: "",
    successMessage: "",
    sellerId: null,
    sellerIdLoading: false,
    sellerIdError: null,
    supportInfo: {
      mobileNo: "",
      email: "",
      address: "",
      logo: "",
    },
  },
  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
    user_reset: (state, _) => {
      state.userInfo = "";
    },
  },
  extraReducers: {
    [customer_register.pending]: (state, _) => {
      state.loader = true;
    },
    [customer_register.rejected]: (state, { payload }) => {
      state.errorMessage = payload.error;
      state.loader = false;
    },
    [customer_register.fulfilled]: (state, { payload }) => {
      const userInfo = decodeToken(payload.token);
      state.successMessage = payload.message;
      state.loader = false;
      state.userInfo = userInfo;
    },
    [customer_login.pending]: (state, _) => {
      state.loader = true;
    },
    [customer_login.rejected]: (state, { payload }) => {
      state.errorMessage = payload.error;
      state.loader = false;
    },
    [customer_login.fulfilled]: (state, { payload }) => {
      const userInfo = decodeToken(payload.token);
      state.successMessage = payload.message;
      state.loader = false;
      state.userInfo = userInfo;
    },
    [get_support_info.pending]: (state, _) => {
      state.loader = true;
    },
    [get_support_info.rejected]: (state, { payload }) => {
      state.errorMessage = payload.error;
      state.loader = false;
    },
    [get_support_info.fulfilled]: (state, { payload }) => {
      state.supportInfo = payload;
      state.loader = false;
    },
    /// testing
    [get_seller_id.pending]: (state, _) => {
      state.sellerIdLoading = true;
      state.sellerIdError = null;
    },
    [get_seller_id.rejected]: (state, { payload }) => {
      state.sellerIdLoading = false;
      state.sellerIdError = payload
        ? payload.error
        : "Failed to fetch seller ID";
    },
    [get_seller_id.fulfilled]: (state, { payload }) => {
        console.log("payload--> ",payload)
      state.sellerIdLoading = false;
      state.sellerId = payload.seller.id;
    },
  },
});

export const { messageClear, user_reset } = authReducer.actions;
export default authReducer.reducer;
