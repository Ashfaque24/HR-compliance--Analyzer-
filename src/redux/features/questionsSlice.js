// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// // Add Question
// export const addQuestion = createAsyncThunk(
//   "questions/addQuestion",
//   async ({ question, section_id }, { rejectWithValue }) => {
//     try {
//       const response = await fetch("http://localhost:4000/admin/questions", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ question, section_id })
//       });
//       const data = await response.json();
//       if (!response.ok) return rejectWithValue(data.error || data.message);
//       return { ...data, question, section_id };
//     } catch (error) {
//       return rejectWithValue(error.message || "Network error");
//     }
//   }
// );

// // Fetch all questions for a section (existing)
// export const fetchQuestionsBySection = createAsyncThunk(
//   "questions/fetchQuestionsBySection",
//   async (section_id, { rejectWithValue }) => {
//     try {
//       const response = await fetch(`http://localhost:4000/admin/questions?section_id=${section_id}`);
//       const data = await response.json();
//       if (!response.ok) return rejectWithValue(data.error || data.message);
//       return data.questions;
//     } catch (error) {
//       return rejectWithValue(error.message || "Network error");
//     }
//   }
// );

// // NEW: Fetch all questions regardless of section (for overview, counts, etc.)
// export const fetchAllQuestions = createAsyncThunk(
//   "questions/fetchAllQuestions",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await fetch("http://localhost:4000/admin/questions");
//       const data = await response.json();
//       if (!response.ok) return rejectWithValue(data.error || data.message);
//       return data.questions;
//     } catch (error) {
//       return rejectWithValue(error.message || "Network error");
//     }
//   }
// );

// const questionsSlice = createSlice({
//   name: "questions",
//   initialState: {
//     items: [],
//     loading: false,
//     error: null
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchAllQuestions.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchAllQuestions.fulfilled, (state, action) => {
//         state.loading = false;
//         state.items = action.payload;
//       })
//       .addCase(fetchAllQuestions.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(fetchQuestionsBySection.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchQuestionsBySection.fulfilled, (state, action) => {
//         state.loading = false;
//         state.items = action.payload;
//       })
//       .addCase(fetchQuestionsBySection.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(addQuestion.fulfilled, (state, action) => {
//         state.items.push({
//           id: action.payload.id,
//           question: action.payload.question,
//           section_id: action.payload.section_id,
//           options: []
//         });
//       });
//   }
// });

// export default questionsSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Add Question (same)
export const addQuestion = createAsyncThunk(
  "questions/addQuestion",
  async ({ question, section_id }, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:4000/admin/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, section_id })
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.error || data.message);
      return { ...data, question, section_id };
    } catch (error) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

// Fetch questions for a specific section
export const fetchQuestionsBySection = createAsyncThunk(
  "questions/fetchQuestionsBySection",
  async (section_id, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:4000/admin/questions?section_id=${section_id}`);
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.error || data.message);
      return data.questions;
    } catch (error) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

// NEW: Fetch all questions regardless of section
export const fetchAllQuestions = createAsyncThunk(
  "questions/fetchAllQuestions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:4000/admin/all-questions");
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.error || data.message);
      return data.questions;
    } catch (error) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

const questionsSlice = createSlice({
  name: "questions",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAllQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchQuestionsBySection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestionsBySection.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchQuestionsBySection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addQuestion.fulfilled, (state, action) => {
        state.items.push({
          id: action.payload.id,
          question: action.payload.question,
          section_id: action.payload.section_id,
        });
      });
  },
});

export default questionsSlice.reducer;

