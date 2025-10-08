import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import sectionsReducer from "./features/sectionsSlice";
import questionsReducer from "./features/questionsSlice";
import answersReducer from "./features/answersSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    sections: sectionsReducer,
    questions: questionsReducer,
    answers: answersReducer,
  },
});

export default store;

