
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

// Edit Question (PUT)
export const editQuestion = createAsyncThunk(
  "questions/editQuestion",
  async ({ id, question, section_id }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:4000/admin/questions/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ question, section_id })
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.error || data.message);
      return { id, question, section_id };
    } catch (error) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

// Delete Question
export const deleteQuestion = createAsyncThunk(
  "questions/deleteQuestion",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:4000/admin/questions/${id}`, {
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

// Fetch questions by section
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

// Fetch all questions
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
      })
      // New: handle edit
      .addCase(editQuestion.fulfilled, (state, action) => {
        const idx = state.items.findIndex(q => q.id === action.payload.id);
        if (idx !== -1) {
          state.items[idx].question = action.payload.question;
          state.items[idx].section_id = action.payload.section_id;
        }
      })
      // New: handle delete (remove from list)
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        state.items = state.items.filter(q => q.id !== action.payload);
      });
  },
});

export default questionsSlice.reducer;
