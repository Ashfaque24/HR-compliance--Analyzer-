import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import requestWrapper from "../../api/axiosInstance";

// Add Section (POST)
export const addSection = createAsyncThunk(
  "sections/addSection",
  async (section_name, { rejectWithValue }) => {
    try {
      const response = await requestWrapper({
        method: "POST",
        url: "admin/sections",
        data: { title: section_name }, // backend expects title
      });
      // Normalize backend response to use section_name and questionCount keys consistently
      return {
        id: response.id,
        section_name: response.title,
        questionCount: response.questionCount ?? 0,
      };
    } catch (error) {
      return rejectWithValue(error.data || error.message || "Network error");
    }
  }
);

// Edit Section (PUT)
export const editSection = createAsyncThunk(
  "sections/editSection",
  async ({ id, section_name, is_active }, { rejectWithValue }) => {
    try {
      const response = await requestWrapper({
        method: "PUT",
        url: `admin/sections/${id}`,
        data: { title: section_name, is_active },
      });
      // Normalize keys
      return {
        id: response.id,
        section_name: response.title,
        is_active: response.is_active,
      };
    } catch (error) {
      return rejectWithValue(error.data || error.message || "Network error");
    }
  }
);

// Delete Section (DELETE)
export const deleteSection = createAsyncThunk(
  "sections/deleteSection",
  async (id, { rejectWithValue }) => {
    try {
      await requestWrapper({
        method: "DELETE",
        url: `admin/sections/${id}`,
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.data || error.message || "Network error");
    }
  }
);

// Fetch Sections with question count (GET)
export const fetchSectionsWithQuestionCount = createAsyncThunk(
  "sections/fetchSectionsWithQuestionCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await requestWrapper({
        method: "GET",
        url: "admin/sections",
      });
      // Normalize each section to expected keys
      return response.map((section) => ({
        id: section.id,
        section_name: section.section_name || section.title, // react to backend potentially providing title
        questionCount: section.questionCount ?? 0,
        is_active: section.is_active,
      }));
    } catch (error) {
      return rejectWithValue(error.data || error.message || "Network error");
    }
  }
);

const sectionsSlice = createSlice({
  name: "sections",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSectionsWithQuestionCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSectionsWithQuestionCount.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchSectionsWithQuestionCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addSection.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(editSection.fulfilled, (state, action) => {
        const idx = state.items.findIndex((s) => s.id === action.payload.id);
        if (idx !== -1) {
          state.items[idx].section_name = action.payload.section_name;
          state.items[idx].is_active = action.payload.is_active;
        }
      })
      .addCase(deleteSection.fulfilled, (state, action) => {
        state.items = state.items.filter((s) => s.id !== action.payload);
      });
  },
});

export default sectionsSlice.reducer;










