
// import React from "react";
// import Summary_Repo from "../../components/Summary_Repo";
// import reportsData from "../../data/reports.json"; // The path is correct (2 dots up from /pages/assessment)

// const currentReport = reportsData[0]; // Pick for user

// export default function AssessmentSummary() {
//   return <Summary_Repo data={currentReport.details} showFull={false} />;
// }



import React from "react";
import Summary_Repo from "../../components/Summary_Repo";
import reportsData from "../../data/reports.json"; // default data

export default function AssessmentSummary() {
  // ✅ Load from localStorage or fallback to default JSON
  let storedReports = JSON.parse(localStorage.getItem("reportsData"));
  if (!storedReports) {
    localStorage.setItem("reportsData", JSON.stringify(reportsData));
    storedReports = reportsData;
  }

  const currentReport = storedReports[0]; // pick first report (or whichever logic you use)

  return <Summary_Repo data={currentReport.details} showFull={false} />;
}


