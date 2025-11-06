
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import requestWrapper from "../../api/axiosInstance";

// Fetch questions with nested options (supports optional section_id filter)
export const fetchQuestionsWithOptions = createAsyncThunk(
  "questions/fetchQuestionsWithOptions",
  async (section_id = null, { rejectWithValue }) => {
    try {
      const url = "user/assessment/questions";
      const response = await requestWrapper({
        method: "GET",
        url,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.data || error.message || "Network error");
    }
  }
);

// Create question with options in one API call
export const addQuestion = createAsyncThunk(
  "questions/addQuestion",
  async ({ section_id, text, help_text, sort_order = 0, is_active = true, options = [] }, { rejectWithValue }) => {
    try {
      const response = await requestWrapper({
        method: "POST",
        url: "admin/questions",
        data: { section_id, text, help_text, sort_order, is_active, options },
      });
      return response; // full question object with options
    } catch (error) {
      return rejectWithValue(error.data || error.message || "Network error");
    }
  }
);

// Update question and nested options in one API call
export const editQuestion = createAsyncThunk(
  "questions/editQuestion",
  async ({ id, section_id, text, help_text, sort_order, is_active, options }, { rejectWithValue }) => {
    try {
      const response = await requestWrapper({
        method: "PUT",
        url: `admin/questions/${id}`,
        data: { section_id, text, help_text, sort_order, is_active, options },
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.data || error.message || "Network error");
    }
  }
);

// Delete question and cascade delete options
export const deleteQuestion = createAsyncThunk(
  "questions/deleteQuestion",
  async (id, { rejectWithValue }) => {
    try {
      await requestWrapper({
        method: "DELETE",
        url: `admin/questions/${id}`,
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.data || error.message || "Network error");
    }
  }
);

// New thunk: Submit user answers for a given session_uuid
export const submitAssessmentAnswers = createAsyncThunk(
  "assessment/submitAssessmentAnswers",
  async ({ session_uuid, answers }, { rejectWithValue }) => {
    try {
      const response = await requestWrapper({
        method: "POST",
        url: `response/${session_uuid}/submit`,
        data: { answers },
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.data || error.message || "Network error");
    }
  }
);

const questionsSlice = createSlice({
  name: "assessment-questions",
  initialState: {
    items: [],
    loading: false,
    error: null,
    submitLoading: false,
    submitError: null,
    submitSuccess: false,
  },
  reducers: {
    resetSubmitStatus(state) {
      state.submitLoading = false;
      state.submitError = null;
      state.submitSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestionsWithOptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestionsWithOptions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload; // full array of questions with nested options
      })
      .addCase(fetchQuestionsWithOptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addQuestion.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(editQuestion.fulfilled, (state, action) => {
        const idx = state.items.findIndex((q) => q.id === action.payload.id);
        if (idx !== -1) {
          state.items[idx] = action.payload;
        }
      })
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        state.items = state.items.filter((q) => q.id !== action.payload);
      })
      .addCase(submitAssessmentAnswers.pending, (state) => {
        state.submitLoading = true;
        state.submitError = null;
        state.submitSuccess = false;
      })
      .addCase(submitAssessmentAnswers.fulfilled, (state, action) => {
        state.submitLoading = false;
        state.submitSuccess = true;
      })
      .addCase(submitAssessmentAnswers.rejected, (state, action) => {
        state.submitLoading = false;
        state.submitError = action.payload;
      });
  },
});

export const { resetSubmitStatus } = questionsSlice.actions;

export default questionsSlice.reducer;
