// import React, { useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   Box,
//   Typography,
//   Button,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   List,
//   ListItem,
//   ListItemText,
// } from "@mui/material";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchAssessmentDetails } from "../redux/features/adminAssessmentReviewSlice";

// // Convert array to CSV (without sectionId, questionId, answerId)
// const exportToCSV = (data, filename = "assessment.csv") => {
//   if (!data || data.length === 0) return;

//   const rows = data.flatMap((section) =>
//     section.questions.map((question) => ({
//       sectionName: section.sectionName,
//       question: question.question,
//       questionScore: question.questionScore,
//       selectedAnswer: question.selectedAnswer.answer,
//       selectedAnswerScore: question.selectedAnswer.answerScore,
//     }))
//   );

//   const headers = Object.keys(rows[0]);
//   const csvContent = [
//     headers.join(","),
//     ...rows.map((row) => headers.map((header) => `"${row[header]}"`).join(",")),
//   ].join("\n");

//   const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//   const link = document.createElement("a");
//   const url = URL.createObjectURL(blob);
//   link.setAttribute("href", url);
//   link.setAttribute("download", filename);
//   link.style.visibility = "hidden";
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// };

// export default function AdminAssessmentReview() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { assessment, loading, error } = useSelector(
//     (state) => state.adminAssessmentReview
//   );

//   useEffect(() => {
//     dispatch(fetchAssessmentDetails(id));
//   }, [dispatch, id]);

//   if (loading) return <Typography>Loading...</Typography>;
//   if (error) return <Typography color="error">{error}</Typography>;

//   const groupedAssessment = assessment?.reduce((acc, item) => {
//     const sectionKey = `${item.sectionId}-${item.sectionName}`;
//     if (!acc[sectionKey]) {
//       acc[sectionKey] = {
//         sectionId: item.sectionId,
//         sectionName: item.sectionName,
//         questions: [],
//       };
//     }
//     acc[sectionKey].questions.push({
//       questionId: item.questionId,
//       question: item.question,
//       questionScore: item.questionScore,
//       selectedAnswer: {
//         answerId: item.answerId,
//         answer: item.answer,
//         answerScore: item.answerScore,
//       },
//     });
//     return acc;
//   }, {});

//   const sectionsArray = Object.values(groupedAssessment || {});

//   return (
//     <Box
//       p={{ xs: 1, sm: 2, md: 4 }}
//       sx={{
//         maxWidth: "100%",
//         overflowX: "hidden",
//       }}
//     >
//       {/* MOBILE FRIENDLY BUTTONS */}
//       <Box
//         display="flex"
//         flexDirection={{ xs: "column", sm: "row" }}
//         gap={2}
//         mb={3}
//       >
//         <Button
//           fullWidth={{ xs: true, sm: false }}
//           variant="contained"
//           sx={{ background: "#18a16e" }}
//           onClick={() => navigate(-1)}
//         >
//           Back
//         </Button>

//         <Button
//           fullWidth={{ xs: true, sm: false }}
//           variant="contained"
//           sx={{ background: "#18a16e" }}
//           onClick={() => exportToCSV(sectionsArray, "assessment.csv")}
//         >
//           Export to CSV
//         </Button>
//       </Box>

//       {/* TITLE RESPONSIVE */}
//       <Typography
//         variant="h5"
//         fontWeight="bold"
//         mb={2}
//         sx={{
//           fontSize: { xs: "1.2rem", sm: "1.5rem", md: "2rem" },
//           textAlign: { xs: "center", sm: "left" },
//         }}
//       >
//         Assessment Review
//       </Typography>

//       {/* ACCORDIONS */}
//       {sectionsArray.map((section) => (
//         <Accordion key={section.sectionId} sx={{ width: "100%" }}>
//           <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//             <Typography
//               sx={{
//                 fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
//                 fontWeight: 600,
//               }}
//             >
//               {section.sectionName}
//             </Typography>
//           </AccordionSummary>

//           <AccordionDetails>
//             <List>
//               {section.questions.map((question) => (
//                 <ListItem
//                   key={question.questionId}
//                   sx={{
//                     display: "flex",
//                     flexDirection: "column",
//                     alignItems: "flex-start",
//                     gap: 1,
//                   }}
//                 >
//                   <ListItemText
//                     primary={
//                       <Box
//                         display="flex"
//                         flexDirection="column"
//                         sx={{
//                           wordBreak: "break-word",
//                         }}
//                       >
//                         <Typography variant="body1">
//                           {question.question}
//                         </Typography>
//                         <Typography variant="body2" color="textSecondary">
//                           (Score: {question.questionScore})
//                         </Typography>
//                       </Box>
//                     }
//                     secondary={
//                       <Box
//                         display="flex"
//                         flexDirection="column"
//                         sx={{
//                           wordBreak: "break-word",
//                         }}
//                       >
//                         <Typography variant="body2">
//                           Selected: {question.selectedAnswer.answer}
//                         </Typography>
//                         <Typography variant="body2" color="textSecondary">
//                           (Score: {question.selectedAnswer.answerScore})
//                         </Typography>
//                       </Box>
//                     }
//                   />
//                 </ListItem>
//               ))}
//             </List>
//           </AccordionDetails>
//         </Accordion>
//       ))}
//     </Box>
//   );
// }






import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useDispatch, useSelector } from "react-redux";
import { fetchAssessmentDetails } from "../redux/features/adminAssessmentReviewSlice";
import LoadingSpinner from "../components/common/LoadingSpinner"; // adjust path if needed

// Convert array to CSV (without sectionId, questionId, answerId)
const exportToCSV = (data, filename = "assessment.csv") => {
  if (!data || data.length === 0) return;

  const rows = data.flatMap((section) =>
    section.questions.map((question) => ({
      sectionName: section.sectionName,
      question: question.question,
      questionScore: question.questionScore,
      selectedAnswer: question.selectedAnswer.answer,
      selectedAnswerScore: question.selectedAnswer.answerScore,
    }))
  );

  const headers = Object.keys(rows[0]);
  const csvContent = [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => `"${row[header]}"`).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default function AdminAssessmentReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { assessment, loading, error } = useSelector(
    (state) => state.adminAssessmentReview
  );

  useEffect(() => {
    dispatch(fetchAssessmentDetails(id));
  }, [dispatch, id]);

  // Use loader component while fetching
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LoadingSpinner message="Loading assessment review..." />
      </Box>
    );
  }

  if (error)
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );

  const groupedAssessment = assessment?.reduce((acc, item) => {
    const sectionKey = `${item.sectionId}-${item.sectionName}`;
    if (!acc[sectionKey]) {
      acc[sectionKey] = {
        sectionId: item.sectionId,
        sectionName: item.sectionName,
        questions: [],
      };
    }
    acc[sectionKey].questions.push({
      questionId: item.questionId,
      question: item.question,
      questionScore: item.questionScore,
      selectedAnswer: {
        answerId: item.answerId,
        answer: item.answer,
        answerScore: item.answerScore,
      },
    });
    return acc;
  }, {});

  const sectionsArray = Object.values(groupedAssessment || {});

  return (
    <Box
      p={{ xs: 1, sm: 2, md: 4 }}
      sx={{
        maxWidth: "100%",
        overflowX: "hidden",
      }}
    >
      {/* MOBILE FRIENDLY BUTTONS */}
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        gap={2}
        mb={3}
      >
        <Button
          fullWidth={{ xs: true, sm: false }}
          variant="contained"
          sx={{ background: "#18a16e" }}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>

        <Button
          fullWidth={{ xs: true, sm: false }}
          variant="contained"
          sx={{ background: "#18a16e" }}
          onClick={() => exportToCSV(sectionsArray, "assessment.csv")}
        >
          Export to CSV
        </Button>
      </Box>

      {/* TITLE RESPONSIVE */}
      <Typography
        variant="h5"
        fontWeight="bold"
        mb={2}
        sx={{
          fontSize: { xs: "1.2rem", sm: "1.5rem", md: "2rem" },
          textAlign: { xs: "center", sm: "left" },
        }}
      >
        Assessment Review
      </Typography>

      {/* ACCORDIONS */}
      {sectionsArray.map((section) => (
        <Accordion key={section.sectionId} sx={{ width: "100%" }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography
              sx={{
                fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
                fontWeight: 600,
              }}
            >
              {section.sectionName}
            </Typography>
          </AccordionSummary>

          <AccordionDetails>
            <List>
              {section.questions.map((question) => (
                <ListItem
                  key={question.questionId}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 1,
                  }}
                >
                  <ListItemText
                    primary={
                      <Box
                        display="flex"
                        flexDirection="column"
                        sx={{
                          wordBreak: "break-word",
                        }}
                      >
                        <Typography variant="body1">
                          {question.question}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          (Score: {question.questionScore})
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box
                        display="flex"
                        flexDirection="column"
                        sx={{
                          wordBreak: "break-word",
                        }}
                      >
                        <Typography variant="body2">
                          Selected: {question.selectedAnswer.answer}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          (Score: {question.selectedAnswer.answerScore})
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}

