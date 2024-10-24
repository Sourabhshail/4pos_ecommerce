import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const add_banner = createAsyncThunk(
  "banner/add_banner",
  async (info, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.post("/banner/add", info, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const delete_banner = createAsyncThunk(
  "banner/delete_banner",
  async (bannerId, { fulfillWithValue, rejectWithValue }) => {
    console.log(bannerId);
    try {
      const { data } = await api.delete(`/banner/delete/${bannerId}`, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


export const get_banner = createAsyncThunk(
  "banner/get_banner",
  async (sellerId, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.get(`/banner/get/${sellerId}`, {
        withCredentials: true,
      });
      console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const bannerReducer = createSlice({
  name: "category",
  initialState: {
    successMessage: "",
    errorMessage: "",
    loader: false,
    banners: [],
    banner: "",
  },
  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: {
    [add_banner.pending]: (state, _) => {
      state.loader = true;
    },
    [add_banner.rejected]: (state, { payload }) => {
      state.loader = false;
      state.errorMessage = payload.message;
    },
    [add_banner.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.successMessage = payload.message;
      state.banner = payload.banner;
    },
    [get_banner.fulfilled]: (state, { payload }) => {
      state.banner = payload.banner;
    },
    [delete_banner.pending]: (state, _) => {
      state.loader = true;
    },
    [delete_banner.rejected]: (state, { payload }) => {
      state.loader = false;
      state.errorMessage = payload.message;
    },
    [delete_banner.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.successMessage = payload.message;
      state.banner = payload.banner;
    },
  },
});
export const { messageClear } = bannerReducer.actions;
export default bannerReducer.reducer;
