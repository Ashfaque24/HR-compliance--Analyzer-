
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import requestWrapper from "../../api/axiosInstance";

// Async thunk to fetch existing image filenames for a given report/session
export const fetchExistingCoverImages = createAsyncThunk(
  "coverPage/fetchExistingCoverImages",
  async (session_uuid, { rejectWithValue }) => {
    try {
      const response = await requestWrapper({
        method: "GET",
        url: `/admin/report/${session_uuid}/cover-images`,
      });
      // Expected response: { frontImages: [{filename, url}, ...], backImages: [{filename, url}, ...] }
      return response.data || response;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "No response from server";
      return rejectWithValue(message);
    }
  }
);

// Async thunk to save cover images as files using FormData
export const saveCoverImages = createAsyncThunk(
  "coverPage/saveCoverImages",
  async ({ session_uuid, formData }, { rejectWithValue }) => {
    try {
      const response = await requestWrapper({
        method: "POST",
        url: `/admin/report/${session_uuid}/cover-images`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Expected response: { frontImage: {filename, url}, backImage: {filename, url} }
      return response.data || response;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "No response from server";
      return rejectWithValue(message);
    }
  }
);

const coverPageSlice = createSlice({
  name: "coverPage",
  initialState: {
    frontImage: "", // Currently selected front image filename
    backImage: "", // Currently selected back image filename
    existingFrontImages: [], // Array of {filename, url} objects
    existingBackImages: [], // Array of {filename, url} objects
    loading: false,
    error: null,
    saveLoading: false,
    saveError: null,
    saveSuccess: false,
  },
  reducers: {
    setFrontImage(state, action) {
      state.frontImage = action.payload;
    },
    setBackImage(state, action) {
      state.backImage = action.payload;
    },
    setExistingFrontImages(state, action) {
      state.existingFrontImages = action.payload;
    },
    setExistingBackImages(state, action) {
      state.existingBackImages = action.payload;
    },
    resetCoverPage(state) {
      state.frontImage = "";
      state.backImage = "";
      state.existingFrontImages = [];
      state.existingBackImages = [];
      state.loading = false;
      state.error = null;
      state.saveLoading = false;
      state.saveError = null;
      state.saveSuccess = false;
    },
    resetSaveStatus(state) {
      state.saveLoading = false;
      state.saveError = null;
      state.saveSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch existing image filenames
      .addCase(fetchExistingCoverImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExistingCoverImages.fulfilled, (state, action) => {
        state.loading = false;
        // Store arrays of {filename, url} objects
        state.existingFrontImages = action.payload.frontImages || [];
        state.existingBackImages = action.payload.backImages || [];
      })
      .addCase(fetchExistingCoverImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Save cover images upload lifecycle
      .addCase(saveCoverImages.pending, (state) => {
        state.saveLoading = true;
        state.saveError = null;
        state.saveSuccess = false;
      })
      .addCase(saveCoverImages.fulfilled, (state, action) => {
        state.saveLoading = false;
        state.saveSuccess = true;
        
        // Add newly uploaded images to the existing images arrays
        if (action.payload.frontImage) {
          const newFrontImage = {
            filename: action.payload.frontImage.filename,
            url: action.payload.frontImage.url
          };
          // Add to list if not already present
          const exists = state.existingFrontImages.some(
            img => img.filename === newFrontImage.filename
          );
          if (!exists) {
            state.existingFrontImages.push(newFrontImage);
          }
          // Auto-select the newly uploaded image
          state.frontImage = newFrontImage.filename;
        }
        
        if (action.payload.backImage) {
          const newBackImage = {
            filename: action.payload.backImage.filename,
            url: action.payload.backImage.url
          };
          // Add to list if not already present
          const exists = state.existingBackImages.some(
            img => img.filename === newBackImage.filename
          );
          if (!exists) {
            state.existingBackImages.push(newBackImage);
          }
          // Auto-select the newly uploaded image
          state.backImage = newBackImage.filename;
        }
      })
      .addCase(saveCoverImages.rejected, (state, action) => {
        state.saveLoading = false;
        state.saveError = action.payload;
        state.saveSuccess = false;
      });
  },
});

export const {
  setFrontImage,
  setBackImage,
  setExistingFrontImages,
  setExistingBackImages,
  resetCoverPage,
  resetSaveStatus,
} = coverPageSlice.actions;

export default coverPageSlice.reducer;