
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Add Answer
export const addAnswer = createAsyncThunk(
  "answers/addAnswer",
  async ({ question_id, option_text }, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:4000/admin/answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question_id, option_text }),
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.error || data.message);
      return { ...data, question_id, option_text };
    } catch (error) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

// Edit Answer
export const editAnswer = createAsyncThunk(
  "answers/editAnswer",
  async ({ id, option_text }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:4000/admin/answers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ option_text }),
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.error || data.message);
      return { id, option_text };
    } catch (error) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

// Delete Answer
export const deleteAnswer = createAsyncThunk(
  "answers/deleteAnswer",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:4000/admin/answers/${id}`, {
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

// Fetch all answers for a question
export const fetchAnswersByQuestion = createAsyncThunk(
  "answers/fetchAnswersByQuestion",
  async (question_id, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:4000/admin/answers?question_id=${question_id}`);
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.error || data.message);
      return data.answers;
    } catch (error) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

const answersSlice = createSlice({
  name: "answers",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnswersByQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnswersByQuestion.fulfilled, (state, action) => {
        state.loading = false;
        // Append new answers for question to existing list, avoid duplicates
        const existingAnswerIds = new Set(state.items.map((a) => a.id));
        const newAnswers = action.payload.filter((a) => !existingAnswerIds.has(a.id));
        state.items = [...state.items, ...newAnswers];
      })
      .addCase(fetchAnswersByQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addAnswer.fulfilled, (state, action) => {
        state.items.push({
          id: action.payload.id,
          question_id: action.payload.question_id,
          option_text: action.payload.option_text,
        });
      })
      .addCase(editAnswer.fulfilled, (state, action) => {
        const idx = state.items.findIndex(a => a.id === action.payload.id);
        if (idx !== -1) {
          state.items[idx].option_text = action.payload.option_text;
        }
      })
      .addCase(deleteAnswer.fulfilled, (state, action) => {
        state.items = state.items.filter(a => a.id !== action.payload);
      });
  },
});

export default answersSlice.reducer;
