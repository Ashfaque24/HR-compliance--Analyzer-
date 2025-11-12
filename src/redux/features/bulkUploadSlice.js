import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import requestWrapper from "../../api/axiosInstance";

//  Async thunk for bulk uploading questions
export const bulkUploadQuestions = createAsyncThunk(
  "bulkUpload/bulkUploadQuestions",
  async (payload, { rejectWithValue }) => {
    try {
      // Send POST request to backend
      const response = await requestWrapper({
        method: "POST",
        url: "admin/questions/bulk", 
        data: payload,
      });

      // Axios responses have .data property
      return response.data || response;
    } catch (error) {
      console.error(" Bulk upload error:", error);

      // Extract a clean, readable error message
      const message =
        error.response?.data?.message ||
        error.message ||
        "No response from server";

      return rejectWithValue(message);
    }
  }
);

const bulkUploadSlice = createSlice({
  name: "bulkUpload",
  initialState: {
    loading: false,
    error: null,
    success: false,
    result: null,
  },
  reducers: {
    // Reset state between uploads
    resetBulkUpload: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.result = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Request started
      .addCase(bulkUploadQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      // Request successful
      .addCase(bulkUploadQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.result = action.payload;
      })

      // Request failed
      .addCase(bulkUploadQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { resetBulkUpload } = bulkUploadSlice.actions;
export default bulkUploadSlice.reducer;
