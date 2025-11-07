// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import requestWrapper from "../../api/axiosInstance";

// // Async thunk to fetch all submissions
// export const fetchAllSubmissions = createAsyncThunk(
//   "reportInfo/fetchAllSubmissions",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await requestWrapper({
//         method: "GET",
//         url: "user/response/all-submissions",
//       });
//       return response;
//     } catch (error) {
//       return rejectWithValue(error.data || error.message || "Network error");
//     }
//   }
// );

// const reportInfoSlice = createSlice({
//   name: "reportInfo",
//   initialState: {
//     submissions: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {
//     clearReportInfo(state) {
//       state.submissions = [];
//       state.loading = false;
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchAllSubmissions.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchAllSubmissions.fulfilled, (state, action) => {
//         state.loading = false;
//         state.submissions = action.payload;
//       })
//       .addCase(fetchAllSubmissions.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const { clearReportInfo } = reportInfoSlice.actions;
// export default reportInfoSlice.reducer;




import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import requestWrapper from "../../api/axiosInstance";

export const fetchAllSubmissions = createAsyncThunk(
  "reportInfo/fetchAllSubmissions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await requestWrapper({
        method: "GET",
        url: "user/response/all-submissions",
      });
      // Depending on your API response shape:
      // If response.data contains the array:
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
  },
  reducers: {
    clearReportInfo(state) {
      state.submissions = [];
      state.loading = false;
      state.error = null;
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
        state.submissions = Array.isArray(action.payload)
          ? action.payload
          : []; // ensure it's an array
      })
      .addCase(fetchAllSubmissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearReportInfo } = reportInfoSlice.actions;
export default reportInfoSlice.reducer;
