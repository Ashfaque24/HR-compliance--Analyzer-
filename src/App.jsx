import AppRouter from './routes/AppRouter'

function App() {
  return (
    <>
       <AppRouter />
    </>
  )
}

export default App


// import React, { useEffect } from "react";
// import AppRouter from "./routes/AppRouter";
// import { initializeSurveyData } from "./utils/initSurveyData";

// function App() {
//   useEffect(() => {
//     initializeSurveyData();
//   }, []);

//   return <AppRouter />;
// }

// export default App;
