import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const fetchContent = createAsyncThunk(
  "content/fetchContent",
  async (sellerId, { rejectWithValue, fulfillWithValue }) => {
    console.log("fetchContent thunk started");
    try {
      const { data } = await api.get(`/content/${sellerId}`, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const updateContent = createAsyncThunk(
  "content/updateContent",
  async ({ sellerId, tab, content }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post(
        `/content/${sellerId}`,
        { tab, content },
        {
          withCredentials: true,
        }
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const linksReducer = createSlice({
  name: "content",
  initialState: {
    tabContent: {},
    activeTab: "About Us",
    isAdmin: false,
    editContent: "",
    status: "idle",
    error: null,
    successMessage: "",
    errorMessage: "",
    loader: false,
  },
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
      state.editContent = state.tabContent[action.payload] || "";
    },
    toggleAdminMode: (state) => {
      state.isAdmin = !state.isAdmin;
    },
    setEditContent: (state, action) => {
      state.editContent = action.payload;
    },
    messageClear: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContent.pending, (state) => {
        console.log("fetchContent.pending");
        state.status = "loading";
        state.loader = true;
      })
      .addCase(fetchContent.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loader = false;
        state.tabContent = action.payload;
        // state.successMessage = "Content fetched successfully";
      })
      .addCase(fetchContent.rejected, (state, action) => {
        state.status = "failed";
        state.loader = false;
        state.error = action.error.message;
        state.errorMessage = "Failed to fetch content";
      })
      .addCase(updateContent.pending, (state) => {
        state.loader = true;
      })
      .addCase(updateContent.fulfilled, (state, action) => {
        state.tabContent = { ...state.tabContent, ...action.payload };
        state.loader = false;
        state.successMessage = "Content updated successfully";
      })
      .addCase(updateContent.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage = "Failed to update content";
        state.error = action.error.message;
      });
  },
});

export const { setActiveTab, toggleAdminMode, setEditContent, messageClear } =
  linksReducer.actions;
export default linksReducer.reducer;
