// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// // Add Section
// export const addSection = createAsyncThunk(
//   "sections/addSection",
//   async (section_name, { rejectWithValue }) => {
//     try {
//       const response = await fetch("http://localhost:4000/admin/sections", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ section_name })
//       });
//       const data = await response.json();
//       if (!response.ok) return rejectWithValue(data.error || data.message);
//       return { ...data, section_name };
//     } catch (error) {
//       return rejectWithValue(error.message || "Network error");
//     }
//   }
// );

// // Fetch all sections
// export const fetchSections = createAsyncThunk(
//   "sections/fetchSections",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await fetch("http://localhost:4000/admin/sections");
//       const data = await response.json();
//       if (!response.ok) return rejectWithValue(data.error || data.message);
//       return data.sections;
//     } catch (error) {
//       return rejectWithValue(error.message || "Network error");
//     }
//   }
// );

// const sectionsSlice = createSlice({
//   name: "sections",
//   initialState: { items: [], loading: false, error: null },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchSections.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchSections.fulfilled, (state, action) => {
//         state.loading = false;
//         state.items = action.payload;
//       })
//       .addCase(fetchSections.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(addSection.fulfilled, (state, action) => {
//         state.items.push({ 
//           id: action.payload.id, 
//           section_name: action.payload.section_name,
//           questions: [] // Initialize with empty questions array
//         });
//       });
//   },
// });

// export default sectionsSlice.reducer;




import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Add Section - no change
export const addSection = createAsyncThunk(
  "sections/addSection",
  async (section_name, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:4000/admin/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section_name }),
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.error || data.message);
      return { ...data, section_name };
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
        // Optionally append newly added section (questionCount = 0 by default)
        state.items.push({
          id: action.payload.id,
          section_name: action.payload.section_name,
          questionCount: 0,
        });
      });
  },
});

export default sectionsSlice.reducer;
