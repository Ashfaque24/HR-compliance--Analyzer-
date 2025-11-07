import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import requestWrapper from "../../api/axiosInstance";

// Fetch summarized admin report by session_uuid
export const fetchAdminReport = createAsyncThunk(
  "adminReport/fetchAdminReport",
  async (session_uuid, { rejectWithValue }) => {
    try {
      const response = await requestWrapper({
        method: "GET",
        url: `user/response/${session_uuid}/summary`,
      });
      return response;  // Assuming axios returns response.data directly, else use response.data
    } catch (error) {
      return rejectWithValue(error.data || error.message || "Network error");
    }
  }
);

const adminReportSlice = createSlice({
  name: "adminReport",
  initialState: {
    report: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearReport(state) {
      state.report = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminReport.fulfilled, (state, action) => {
        state.loading = false;
        state.report = action.payload;
      })
      .addCase(fetchAdminReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearReport } = adminReportSlice.actions;

export default adminReportSlice.reducer;
