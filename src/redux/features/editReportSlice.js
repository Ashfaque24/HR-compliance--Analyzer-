// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import requestWrapper from "../../api/axiosInstance";

// // Async thunk to fetch report summary for editing by session_uuid
// export const fetchEditReport = createAsyncThunk(
//   "editReport/fetchEditReport",
//   async (session_uuid, { rejectWithValue }) => {
//     try {
//       const response = await requestWrapper({
//         method: "GET",
//         url: `user/response/${session_uuid}/summary`,
//       });
//       // Assuming response contains the report data directly
//       return response;
//     } catch (error) {
//       return rejectWithValue(error.data || error.message || "Network error");
//     }
//   }
// );

// const editReportSlice = createSlice({
//   name: "editReport",
//   initialState: {
//     report: null,
//     loading: false,
//     error: null,
//   },
//   reducers: {
//     clearEditReport(state) {
//       state.report = null;
//       state.loading = false;
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchEditReport.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchEditReport.fulfilled, (state, action) => {
//         state.loading = false;
//         state.report = action.payload;
//       })
//       .addCase(fetchEditReport.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const { clearEditReport } = editReportSlice.actions;
// export default editReportSlice.reducer;






import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import requestWrapper from "../../api/axiosInstance";

// Async thunk to fetch report summary for editing by session_uuid
export const fetchEditReport = createAsyncThunk(
  "editReport/fetchEditReport",
  async (session_uuid, { rejectWithValue }) => {
    try {
      const response = await requestWrapper({
        method: "GET",
        url: `user/response/${session_uuid}/summary`,
      });
      return response;  // Expecting full report object
    } catch (error) {
      return rejectWithValue(error.data || error.message || "Network error");
    }
  }
);

// Async thunk to save edited report via PUT API
export const saveEditReport = createAsyncThunk(
  "editReport/saveEditReport",
  async ({ session_uuid, reportData }, { rejectWithValue }) => {
    try {
      const response = await requestWrapper({
        method: "PUT",
        url: `user/response/${session_uuid}/edit`,
        data: reportData,
      });
      return response; // Expecting updated report or status
    } catch (error) {
      return rejectWithValue(error.data || error.message || "Network error");
    }
  }
);

const editReportSlice = createSlice({
  name: "editReport",
  initialState: {
    report: null,
    loading: false,
    saving: false,
    saveError: null,
    error: null,
  },
  reducers: {
    clearEditReport(state) {
      state.report = null;
      state.loading = false;
      state.error = null;
      state.saving = false;
      state.saveError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEditReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEditReport.fulfilled, (state, action) => {
        state.loading = false;
        state.report = action.payload;
      })
      .addCase(fetchEditReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(saveEditReport.pending, (state) => {
        state.saving = true;
        state.saveError = null;
      })
      .addCase(saveEditReport.fulfilled, (state, action) => {
        state.saving = false;
        state.report = action.payload;  // Update report with saved data
      })
      .addCase(saveEditReport.rejected, (state, action) => {
        state.saving = false;
        state.saveError = action.payload;
      });
  },
});

export const { clearEditReport } = editReportSlice.actions;
export default editReportSlice.reducer;
