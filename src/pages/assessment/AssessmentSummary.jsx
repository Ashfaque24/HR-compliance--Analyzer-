// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import {
//   Box,
//   Typography,
//   Paper,
//   Button,
//   Divider,
//   List,
//   ListItem,
//   ListItemText,
//   Chip,
// } from "@mui/material";

// export default function AssessmentSummary() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { answers = {}, userInfo = {} } = location.state || {};

//   // Calculate simple overall score out of 100 (you can customize)
//   const getScore = () => {
//     // Count all "Yes" or positive answers
//     let score = 0;
//     Object.values(answers).forEach((val) => {
//       if (
//         val === "Yes" ||
//         val === "Private Limited" ||
//         val === "Compliant" ||
//         val === "Maintained" ||
//         val === "Written and Communicated" ||
//         val === "On Time and Accurate"
//       ) {
//         score += 4; // Each positive answer = 4 points (example)
//       }
//     });
//     return score > 100 ? 100 : score;
//   };

//   // Example categories and mapping answers to strengths/gaps/actions for demo
//   const categories = [
//     {
//       name: "Registration & Licensing",
//       keys: ["q1", "q2", "q3", "q4", "q5", "q6"],
//       strengths: ["Business registered", "Valid licenses"],
//       gaps: ["Incomplete registrations"],
//       actions: [
//         "Improve MCA registration compliance",
//         "Obtain necessary licenses promptly",
//       ],
//     },
//     {
//       name: "Employee Welfare & Benefits",
//       keys: ["q1", "q2", "q3", "q4"],
//       strengths: [],
//       gaps: ["Incomplete welfare registrations"],
//       actions: ["Set up Welfare Fund contributions", "Ensure minimum wage compliance"],
//     },
//     {
//       name: "Policy & Documentation",
//       keys: ["q1", "q2", "q3", "q4", "q5"],
//       strengths: [],
//       gaps: ["Incomplete HR policies communication"],
//       actions: ["Develop and communicate HR policies"],
//     },
//     {
//       name: "Statutory Payments & Returns",
//       keys: ["q1", "q2"],
//       strengths: [],
//       gaps: ["Delayed statutory dues payment"],
//       actions: ["File Form 16 and remit dues timely"],
//     },
//     {
//       name: "Workplace Governance",
//       keys: ["q1", "q2"],
//       strengths: [],
//       gaps: ["Unformed Internal Complaints Committee"],
//       actions: ["Form ICC under POSH Act", "Conduct annual labour audits"],
//     },
//   ];

//   const score = getScore();
//   const riskLevel = score > 70 ? "Low Risk" : score > 40 ? "Medium Risk" : "High Risk";

//   return (
//     <Box sx={{ maxWidth: 1000, mx: "auto", py: 5 }}>
//       <Typography variant="h4" fontWeight="bold" gutterBottom>
//         Executive Summary
//       </Typography>
//       <Typography variant="h6" gutterBottom>
//         Overall Compliance Score: {score} / 100
//       </Typography>
//       <Chip label={riskLevel} color={riskLevel === "High Risk" ? "error" : "success"} />

//       <Box sx={{ mt: 4 }}>
//         <Typography variant="h6" gutterBottom>
//           User Details
//         </Typography>
//         <Typography>Full Name: {userInfo.fullName || "N/A"}</Typography>
//         <Typography>Email: {userInfo.email || "N/A"}</Typography>
//         <Typography>Phone: {userInfo.phone || "N/A"}</Typography>
//         <Typography>Company: {userInfo.company || "N/A"}</Typography>
//       </Box>

//       <Divider sx={{ my: 4 }} />

//       {categories.map((category) => (
//         <Paper key={category.name} elevation={3} sx={{ p: 3, mb: 3 }}>
//           <Typography variant="h5" fontWeight="bold" gutterBottom>
//             {category.name}
//           </Typography>
//           <Typography variant="subtitle1" color="green">
//             Strengths
//           </Typography>
//           {category.strengths.length ? (
//             <List dense>
//               {category.strengths.map((s, i) => (
//                 <ListItem key={i}>
//                   <ListItemText primary={s} />
//                 </ListItem>
//               ))}
//             </List>
//           ) : (
//             <Typography variant="body2">No strengths identified</Typography>
//           )}

//           <Typography variant="subtitle1" color="error" sx={{ mt: 2 }}>
//             Gaps
//           </Typography>
//           {category.gaps.length ? (
//             <List dense>
//               {category.gaps.map((g, i) => (
//                 <ListItem key={i}>
//                   <ListItemText primary={g} />
//                 </ListItem>
//               ))}
//             </List>
//           ) : (
//             <Typography variant="body2">No gaps identified</Typography>
//           )}

//           <Typography variant="subtitle1" color="info.main" sx={{ mt: 2 }}>
//             Action Recommendations
//           </Typography>
//           {category.actions.length ? (
//             <List dense>
//               {category.actions.map((a, i) => (
//                 <ListItem key={i}>
//                   <ListItemText primary={a} />
//                 </ListItem>
//               ))}
//             </List>
//           ) : (
//             <Typography variant="body2">No recommendations available</Typography>
//           )}
//         </Paper>
//       ))}

//       <Button
//         variant="contained"
//         onClick={() => navigate("/")}
//         sx={{ mt: 3 }}
//       >
//         Back to Home
//       </Button>
//     </Box>
//   );
// }


import React from "react";
import { Box, Typography, Chip, Paper, List, ListItem, ListItemText, Divider, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

// Utility functions for evaluation (can be customized)
function getStrengths(section, answers) {
  // Treat "Yes"/"Compliant"/"On Time and Accurate" etc as strengths
  return section.questions
    .map((q, i) => {
      if (
        answers[i] === "Yes" ||
        answers[i] === "Compliant" ||
        answers[i] === "On Time and Accurate" ||
        answers[i] === "Written and Communicated" ||
        answers[i] === "Defined" ||
        answers[i] === "Maintained"
      ) {
        return q.text;
      }
      return null;
    })
    .filter(Boolean);
}

function getGaps(section, answers) {
  // Treat "No"/"Non-Compliant"/"Not Maintained" etc as gaps
  return section.questions
    .map((q, i) => {
      if (
        answers[i] === "No" ||
        answers[i] === "Non-Compliant" ||
        answers[i] === "Delayed" ||
        answers[i] === "Not Defined" ||
        answers[i] === "Not Maintained" ||
        answers[i] === "Not Applicable" ||
        answers[i] === "Partially" ||
        answers[i] === "Under Review"
      ) {
        return q.text;
      }
      return null;
    })
    .filter(Boolean);
}

function getRecommendations(gaps) {
  // Recommend further audit for any gaps
  return gaps.map((g) => `Review and address: ${g}`);
}

function getScore(flatAnswers) {
  // Give 15 points for every "Yes"-like answer, max 100
  let score = 0;
  flatAnswers.forEach((ans) => {
    if (
      ans === "Yes" ||
      ans === "Compliant" ||
      ans === "On Time and Accurate" ||
      ans === "Written and Communicated" ||
      ans === "Defined" ||
      ans === "Maintained"
    )
      score += 15;
  });
  return Math.min(100, score);
}

export default function AssessmentSummary() {
  const location = useLocation();
  const navigate = useNavigate();

  const { userInfo, responses, surveySections } = location.state || {};

  // Prepare category-level summaries
  const categories = surveySections.map((section, sectionIdx) => {
    const answers = responses[sectionIdx];
    const strengths = getStrengths(section, answers);
    const gaps = getGaps(section, answers);
    const actions = getRecommendations(gaps);
    return {
      name: section.title,
      strengths,
      gaps,
      actions,
    };
  });

  // Flatten all answers to compute score
  const score = getScore(responses.flat());
  const riskLevel = score > 70 ? "Low Risk" : score > 40 ? "Medium Risk" : "High Risk";

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", py: 5 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Executive Summary
      </Typography>
      <Typography variant="h6" gutterBottom>
        Overall Compliance Score: {score} / 100
      </Typography>
      <Chip
        label={riskLevel}
        color={riskLevel === "High Risk" ? "error" : "success"}
        sx={{ mb: 2 }}
      />

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          User Details
        </Typography>
        <Typography>Full Name: {userInfo?.fullName || "N/A"}</Typography>
        <Typography>Email: {userInfo?.email || "N/A"}</Typography>
        <Typography>Phone: {userInfo?.phone || "N/A"}</Typography>
        <Typography>Company: {userInfo?.company || "N/A"}</Typography>
      </Box>

      <Divider sx={{ my: 4 }} />

      {categories.map((category) => (
        <Paper key={category.name} elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            {category.name}
          </Typography>
          <Typography variant="subtitle1" color="green">
            Strengths
          </Typography>
          {category.strengths.length ? (
            <List dense>
              {category.strengths.map((s, i) => (
                <ListItem key={i}>
                  <ListItemText primary={s} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2">No strengths identified</Typography>
          )}

          <Typography variant="subtitle1" color="error" sx={{ mt: 2 }}>
            Gaps
          </Typography>
          {category.gaps.length ? (
            <List dense>
              {category.gaps.map((g, i) => (
                <ListItem key={i}>
                  <ListItemText primary={g} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2">No gaps identified</Typography>
          )}

          <Typography variant="subtitle1" color="info.main" sx={{ mt: 2 }}>
            Action Recommendations
          </Typography>
          {category.actions.length ? (
            <List dense>
              {category.actions.map((a, i) => (
                <ListItem key={i}>
                  <ListItemText primary={a} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2">No recommendations available</Typography>
          )}
        </Paper>
      ))}

      <Button
        variant="contained"
        onClick={() => navigate("/")}
        sx={{ mt: 3 }}
      >
        Back to Home
      </Button>
    </Box>
  );
}


