// import { configureStore } from "@reduxjs/toolkit";
// import authReducer from "./features/authSlice";
// import sectionsReducer from "./features/sectionsSlice";
// import questionsReducer from "./features/questionsSlice";
// import answersReducer from "./features/answersSlice";
// import assessmentQuestionsReducer from "./features/assessmentSlice";
// import adminReportReducer from "./features/adminReportSlice";
// import reportInfoReducer from "./features/reportInfoSlice";
// import editReportReducer from "./features/editReportSlice";
// import bulkUploadReducer from "./features/bulkUploadSlice"; // ✅ import added

// const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     sections: sectionsReducer,
//     questions: questionsReducer,
//     answers: answersReducer,
//     assessment: assessmentQuestionsReducer,
//     adminReport: adminReportReducer,
//     reportInfo: reportInfoReducer,
//     editReport: editReportReducer,
//     bulkUpload: bulkUploadReducer, // ✅ registered here
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
import editReportReducer from "./features/editReportSlice";
import bulkUploadReducer from "./features/bulkUploadSlice";
import coverPageReducer from "./features/coverPageSlice";  
import userReportReducer from "./features/userReportSlice";


const store = configureStore({
  reducer: {
    auth: authReducer,
    sections: sectionsReducer,
    questions: questionsReducer,
    answers: answersReducer,
    assessment: assessmentQuestionsReducer,
    adminReport: adminReportReducer,
    reportInfo: reportInfoReducer,
    editReport: editReportReducer,
    bulkUpload: bulkUploadReducer,
    coverPage: coverPageReducer,
    userReport: userReportReducer,
  },
});

export default store;
