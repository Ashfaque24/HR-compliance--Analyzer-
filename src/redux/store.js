import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import sectionsReducer from "./features/sectionsSlice";
import questionsReducer from "./features/questionsSlice";
import answersReducer from "./features/answersSlice";
import assessmentQuestionsReducer from "./features/assessmentSlice"


const store = configureStore({
  reducer: {
    auth: authReducer,
    sections: sectionsReducer,
    questions: questionsReducer,
    answers: answersReducer,
    assessment: assessmentQuestionsReducer,
  },
});

export default store;

