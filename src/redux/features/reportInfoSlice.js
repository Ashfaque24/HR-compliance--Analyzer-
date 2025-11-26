import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import requestWrapper from "../../api/axiosInstance";

export const fetchAllSubmissions = createAsyncThunk(
  "reportInfo/fetchAllSubmissions",
  async ({ page = 1, pageSize = 20, search = "" }, { rejectWithValue }) => {
    try {
      const params = {
        page,
        pageSize,
      };
      
      // Only add search param if it has a value
      if (search && search.trim()) {
        params.search = search.trim();
      }

      const response = await requestWrapper({
        method: "GET",
        url: "user/response/all-submissions",
        params,
      });
      
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.data || error.message || "Network error");
    }
  }
);

const reportInfoSlice = createSlice({
  name: "reportInfo",
  initialState: {
    submissions: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 20,
      total: 0,
      totalPages: 0,
    },
  },
  reducers: {
    clearReportInfo(state) {
      state.submissions = [];
      state.loading = false;
      state.error = null;
      state.pagination = {
        page: 1,
        pageSize: 20,
        total: 0,
        totalPages: 0,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllSubmissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllSubmissions.fulfilled, (state, action) => {
        state.loading = false;
        // Handle the response structure with 'data' property
        state.submissions = Array.isArray(action.payload.data)
          ? action.payload.data
          : Array.isArray(action.payload)
          ? action.payload
          : [];
        
        // Update pagination info
        state.pagination = {
          page: action.payload.page || 1,
          pageSize: action.payload.pageSize || 20,
          total: action.payload.total || 0,
          totalPages: action.payload.totalPages || 0,
        };
      })
      .addCase(fetchAllSubmissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearReportInfo } = reportInfoSlice.actions;
export default reportInfoSlice.reducer;