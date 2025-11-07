

// import { configureStore } from "@reduxjs/toolkit";
// import authReducer from "./features/authSlice";
// import sectionsReducer from "./features/sectionsSlice";
// import questionsReducer from "./features/questionsSlice";
// import answersReducer from "./features/answersSlice";
// import assessmentQuestionsReducer from "./features/assessmentSlice";
// import adminReportReducer from "./features/adminReportSlice";
// import reportInfoReducer from "./features/reportInfoSlice"; 

// const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     sections: sectionsReducer,
//     questions: questionsReducer,
//     answers: answersReducer,
//     assessment: assessmentQuestionsReducer,
//     adminReport: adminReportReducer,
//     reportInfo: reportInfoReducer, // Add new slice here
//   },
// });

// export default store;



import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import sectionsReducer from "./features/sectionsSlice";
import questionsReducer from "./features/questionsSlice";
import answersReducer from "./features/answersSlice";
import assessmentQuestionsReducer from "./features/assessmentSlice";
import adminReportReducer from "./features/adminReportSlice";
import reportInfoReducer from "./features/reportInfoSlice"; 
import editReportReducer from "./features/editReportSlice";  // Import edit report slice

const store = configureStore({
  reducer: {
    auth: authReducer,
    sections: sectionsReducer,
    questions: questionsReducer,
    answers: answersReducer,
    assessment: assessmentQuestionsReducer,
    adminReport: adminReportReducer,
    reportInfo: reportInfoReducer,
    editReport: editReportReducer,  // Add edit report slice here
  },
});

export default store;
