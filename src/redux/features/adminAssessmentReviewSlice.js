import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import requestWrapper from "../../api/axiosInstance";

// Fetch assessment details by session_uuid
export const fetchAssessmentDetails = createAsyncThunk(
  "assessment/fetchAssessmentDetails",
  async (session_uuid, { rejectWithValue }) => {
    try {
      const response = await requestWrapper({
        method: "GET",
        url: `admin/submissions/${session_uuid}/details`,
      });
      return response; // expected to return assessment data
    } catch (error) {
      return rejectWithValue(error.data || error.message || "Network error");
    }
  }
);

const assessmentSlice = createSlice({
  name: "assessment",
  initialState: {
    assessment: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearAssessment(state) {
      state.assessment = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssessmentDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssessmentDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.assessment = action.payload;
      })
      .addCase(fetchAssessmentDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAssessment } = assessmentSlice.actions;
export default assessmentSlice.reducer;
