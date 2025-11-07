import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import requestWrapper from "../../api/axiosInstance";

// Async thunk to fetch user report by session_uuid
export const fetchUserReport = createAsyncThunk(
  "userReport/fetchUserReport",
  async (session_uuid, { rejectWithValue }) => {
    try {
      const response = await requestWrapper({
        method: "GET",
        url: `user/response/${session_uuid}/summary`, // same backend endpoint
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
    report: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearReport: (state) => {
      state.report = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUserReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserReport.fulfilled, (state, action) => {
        state.loading = false;
        state.report = action.payload;
      })
      .addCase(fetchUserReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearReport } = userReportSlice.actions;
export default userReportSlice.reducer;




// needed to deteate ----------------------------------------------------------------------------------