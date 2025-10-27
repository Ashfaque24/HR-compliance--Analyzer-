

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Add Section (same as before)
export const addSection = createAsyncThunk(
  "sections/addSection",
  async (section_name, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:4000/admin/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section_name })
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.error || data.message);
      return { ...data, section_name };
    } catch (error) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

// Edit Section (PUT)
export const editSection = createAsyncThunk(
  "sections/editSection",
  async ({ id, section_name, is_active }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:4000/admin/sections/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section_name, is_active })
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.error || data.message);
      return { id, section_name, is_active };
    } catch (error) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

// Delete Section (logical: is_active=0)
export const deleteSection = createAsyncThunk(
  "sections/deleteSection",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:4000/admin/sections/${id}`, {
        method: "DELETE"
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.error || data.message);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

// Fetch sections WITH question count
export const fetchSectionsWithQuestionCount = createAsyncThunk(
  "sections/fetchSectionsWithQuestionCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:4000/admin/sections-with-question-counts");
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.error || data.message);
      return data.sections;
    } catch (error) {
      return rejectWithValue(error.message || "Network error");
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
        state.items.push({
          id: action.payload.id,
          section_name: action.payload.section_name,
          questionCount: 0,
        });
      })
      // New: handle edit
      .addCase(editSection.fulfilled, (state, action) => {
        const idx = state.items.findIndex(s => s.id === action.payload.id);
        if (idx !== -1) {
          state.items[idx].section_name = action.payload.section_name;
          state.items[idx].is_active = action.payload.is_active;
        }
      })
      // New: handle delete (remove from list)
      .addCase(deleteSection.fulfilled, (state, action) => {
        state.items = state.items.filter(s => s.id !== action.payload);
      });
  },
});

export default sectionsSlice.reducer;
