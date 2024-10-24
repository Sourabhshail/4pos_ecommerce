import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const save_contact = createAsyncThunk(
  "contact/save_contact",
  async (contactData, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/save-contact", contactData);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const contactReducer = createSlice({
  name: "contact",
  initialState: {
    loader: false,
    errorMessage: "",
    successMessage: "",
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: {
    [save_contact.pending]: (state) => {
      state.loader = true;
    },
    [save_contact.rejected]: (state, { payload }) => {
      state.loader = false;
      state.errorMessage = payload.error;
    },
    [save_contact.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.successMessage = payload.message;
    },
  },
});

export const { messageClear } = contactReducer.actions;
export default contactReducer.reducer;