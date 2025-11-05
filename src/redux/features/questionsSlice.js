
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import requestWrapper from "../../api/axiosInstance";

// // Add Question (same)
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

// // Edit Question (PUT)
// export const editQuestion = createAsyncThunk(
//   "questions/editQuestion",
//   async ({ id, question, section_id }, { rejectWithValue }) => {
//     try {
//       const response = await fetch(`http://localhost:4000/admin/questions/${id}`, {
//         method: "PUT",
//         headers: {"Content-Type": "application/json"},
//         body: JSON.stringify({ question, section_id })
//       });
//       const data = await response.json();
//       if (!response.ok) return rejectWithValue(data.error || data.message);
//       return { id, question, section_id };
//     } catch (error) {
//       return rejectWithValue(error.message || "Network error");
//     }
//   }
// );

// // Delete Question
// export const deleteQuestion = createAsyncThunk(
//   "questions/deleteQuestion",
//   async (id, { rejectWithValue }) => {
//     try {
//       const response = await fetch(`http://localhost:4000/admin/questions/${id}`, {
//         method: "DELETE"
//       });
//       const data = await response.json();
//       if (!response.ok) return rejectWithValue(data.error || data.message);
//       return id;
//     } catch (error) {
//       return rejectWithValue(error.message || "Network error");
//     }
//   }
// );

// // Fetch questions by section
// // export const fetchQuestionsBySection = createAsyncThunk(
// //   "questions/fetchQuestionsBySection",
// //   async (section_id, { rejectWithValue }) => {
// //     try {
// //       const response = await fetch(`http://localhost:4000/admin/questions?section_id=${section_id}`);
// //       const data = await response.json();
// //       if (!response.ok) return rejectWithValue(data.error || data.message);
// //       return data.questions;
// //     } catch (error) {
// //       return rejectWithValue(error.message || "Network error");
// //     }
// //   }
// // );


// export const fetchQuestionsBySection = createAsyncThunk(
//   "questions/fetchQuestionsBySection",
//   async (section_id, { rejectWithValue }) => {
//     try {
//       const res = await requestWrapper({
//         method: "GET",
//         url: `admin/questions/?section_id=${section_id}`,
//       });
//       return res;
//     } catch (error) {
//       console.error("Fetch questions error:", error);
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );



// export const fetchAllQuestions = createAsyncThunk(
//   "squestions/fetchAllQuestions",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await requestWrapper({
//         method: "GET",
//         url: "admin/questions",
//       });
//       return res;
//     } catch (error) {
//       console.error("Fetch questions error:", error);
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );



// const questionsSlice = createSlice({
//   name: "questions",
//   initialState: { items: [], loading: false, error: null },
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
//         });
//       })
//       // New: handle edit
//       .addCase(editQuestion.fulfilled, (state, action) => {
//         const idx = state.items.findIndex(q => q.id === action.payload.id);
//         if (idx !== -1) {
//           state.items[idx].question = action.payload.question;
//           state.items[idx].section_id = action.payload.section_id;
//         }
//       })
//       // New: handle delete (remove from list)
//       .addCase(deleteQuestion.fulfilled, (state, action) => {
//         state.items = state.items.filter(q => q.id !== action.payload);
//       });
//   },
// });

// export default questionsSlice.reducer;






















import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import requestWrapper from "../../api/axiosInstance";

// Add Question (POST)
export const addQuestion = createAsyncThunk(
  "questions/addQuestion",
  async ({ question, section_id,options}, { rejectWithValue }) => {
    try {
      const response = await requestWrapper({
        method: "POST",
        url: "admin/questions",
        data: { text : question, section_id ,options : options.map(o => ({label : o.option_text , score : o.score}))},
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.data || error.message || "Network error");
    }
  }
);

// Edit Question (PUT)
export const editQuestion = createAsyncThunk(
  "questions/editQuestion",
  async ({ id, text, section_id }, { rejectWithValue }) => {
    try {
      const response = await requestWrapper({
        method: "PUT",
        url: `admin/questions/${id}`,
        data: { text, section_id },
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.data || error.message || "Network error");
    }
  }
);

// Delete Question (DELETE)
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

// Fetch questions by section (GET)
export const fetchQuestionsBySection = createAsyncThunk(
  "questions/fetchQuestionsBySection",
  async (section_id, { rejectWithValue }) => {
    try {
      const res = await requestWrapper({
        method: "GET",
        url: `admin/questions?section_id=${section_id}`,
      });
      return res;
    } catch (error) {
      return rejectWithValue(error.data || error.message);
    }
  }
);

// Fetch all questions (GET)
export const fetchAllQuestions = createAsyncThunk(
  "questions/fetchAllQuestions",
  async (_, { rejectWithValue }) => {
    try {
      const res = await requestWrapper({
        method: "GET",
        url: "admin/questions",
      });
      return res;
    } catch (error) {
      return rejectWithValue(error.data || error.message);
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
        const q = action.payload;
        state.items.push({
          id: q.id,
          text: q.text,
          section_id: q.section_id,
        });
      })
      .addCase(editQuestion.fulfilled, (state, action) => {
        const idx = state.items.findIndex((q) => q.id === action.payload.id);
        if (idx !== -1) {
          state.items[idx] = {
            id: action.payload.id,
            text: action.payload.text,
            section_id: action.payload.section_id,
          };
        }
      })
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        state.items = state.items.filter((q) => q.id !== action.payload);
      });
  },
});

export default questionsSlice.reducer;
