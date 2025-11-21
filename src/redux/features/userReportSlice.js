// userReportSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import requestWrapper from "../../api/axiosInstance";

// Thunk for requesting full report
export const requestFullReport = createAsyncThunk(
  "userReport/requestFullReport",
  async (session_uuid, { rejectWithValue }) => {
    try {
      const response = await requestWrapper({
        method: "POST",
        url: `admin/enquire/${session_uuid}`,
        // If backend expects some extra data, pass in 'data:' property here
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.data || error.message || "Network error");
    }
  }
);

const userReportSlice = createSlice({
  name: "userReport",
  initialState: {
    loading: false,
    error: null,
    success: false,
    reportData: null, // In case backend responds with report details
  },
  reducers: {
    resetUserReportStatus(state) {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.reportData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestFullReport.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(requestFullReport.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.reportData = action.payload;
      })
      .addCase(requestFullReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { resetUserReportStatus } = userReportSlice.actions;
export default userReportSlice.reducer;
