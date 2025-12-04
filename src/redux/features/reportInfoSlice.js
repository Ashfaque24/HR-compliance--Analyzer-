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
      
      
      
      // Return the entire response as it contains all needed data
      return response;
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
    setCurrentPage(state, action) {
      state.pagination.page = action.payload;
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
        

        
        // The API returns: { page, pageSize, total, totalPages, data: [...], meta: {...} }
        const response = action.payload;

        // Update submissions from the 'data' array
        state.submissions = Array.isArray(response.data)
          ? response.data
          : [];
        
        // Update pagination info - API returns it at root level AND in meta
        state.pagination = {
          page: response.page || response.meta?.currentPage || 1,
          pageSize: response.pageSize || 20,
          total: response.total || response.meta?.totalRecords || 0,
          totalPages: response.totalPages || response.meta?.totalPages || 0,
        };
        

      })
      .addCase(fetchAllSubmissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.submissions = [];
      });
  },
});

export const { clearReportInfo, setCurrentPage } = reportInfoSlice.actions;
export default reportInfoSlice.reducer;