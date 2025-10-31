

// import React, { useEffect, useState, useMemo, useRef } from "react";
// import {
//   Box,
//   Typography,
//   Paper,
//   Button,
//   Stepper,
//   Step,
//   StepLabel,
//   LinearProgress,
// } from "@mui/material";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchSectionsWithQuestionCount } from "../../redux/features/sectionsSlice";
// import { fetchAllQuestions } from "../../redux/features/questionsSlice";
// import { fetchAnswersByQuestion } from "../../redux/features/answersSlice";

// export default function AssessmentFlow() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const user = location.state || {};

//   // ================================
//   // Step 1: Fetch initial data
//   // ================================
//   useEffect(() => {
//     dispatch(fetchSectionsWithQuestionCount());
//     dispatch(fetchAllQuestions());
//   }, [dispatch]);

//   const sections = useSelector((state) => state.sections.items);
//   const questions = useSelector((state) => state.questions.items);
//   const answers = useSelector((state) => state.answers.items);

//   // ================================
//   // Step 2: Fetch answers safely (avoid infinite loops)
//   // ================================
//   const fetchedOnce = useRef(false);

//   useEffect(() => {
//     if (!fetchedOnce.current && questions.length > 0) {
//       fetchedOnce.current = true;
//       questions.forEach((q) => {
//         dispatch(fetchAnswersByQuestion(q.id));
//       });
//     }
//   }, [questions, dispatch]);

//   // ================================
//   // Step 3: Build nested survey structure
//   // ================================
//   const surveySections = useMemo(() => {
//     if (!sections.length || !questions.length) return [];
//     return sections.map((section) => ({
//       id: section.id,
//       title: section.section_name,
//       questions: questions
//         .filter((q) => q.section_id === section.id)
//         .map((q) => ({
//           id: q.id,
//           text: q.question,
//           options: answers
//             .filter((a) => a.question_id === q.id)
//             .map((a) => a.option_text),
//         })),
//     }));
//   }, [sections, questions, answers]);

//   // ================================
//   // Step 4: Initialize and manage responses
//   // ================================
//   const [responses, setResponses] = useState([]);
//   const [currentSectionIdx, setCurrentSectionIdx] = useState(0);

//   useEffect(() => {
//     if (surveySections.length > 0 && responses.length === 0) {
//       setResponses(
//         surveySections.map((section) =>
//           section.questions.map(() => "")
//         )
//       );
//     }
//   }, [surveySections, responses.length]);

//   // ================================
//   // Step 5: Progress tracking
//   // ================================
//   const totalAnswers = responses.flat().length;
//   const answered = responses.flat().filter((r) => r !== "").length;
//   const progress =
//     totalAnswers > 0 ? Math.round((answered / totalAnswers) * 100) : 0;

//   const section = surveySections[currentSectionIdx];

//   // ================================
//   // Step 6: Handle selection
//   // ================================
//   const isSelected = (qIdx, opt) =>
//     responses[currentSectionIdx]?.[qIdx] === opt;

//   const handleChange = (questionIdx, value) => {
//     setResponses((prev) => {
//       const newResponses = prev.map((arr) => [...arr]);
//       newResponses[currentSectionIdx][questionIdx] = value;
//       return newResponses;
//     });
//   };

//   // ================================
//   // Step 7: Navigation handlers
//   // ================================
//   const handleNext = () => setCurrentSectionIdx((idx) => idx + 1);
//   const handlePrev = () => setCurrentSectionIdx((idx) => idx - 1);

//   const handleSubmit = () => {
//     navigate("/assessment/summary", {
//       state: {
//         userInfo: user,
//         responses,
//         surveySections,
//       },
//     });
//   };

//   // ================================
//   // Step 8: Loading and Error UI
//   // ================================
//   if (!sections.length || !questions.length) {
//     return (
//       <Box sx={{ py: 10, textAlign: "center" }}>
//         <LinearProgress color="primary" />
//         <Typography variant="h6" mt={3}>
//           Loading assessment...
//         </Typography>
//       </Box>
//     );
//   }

//   if (!surveySections.length || !section) {
//     return (
//       <Box sx={{ py: 10, textAlign: "center" }}>
//         <Typography variant="h6" color="error">
//           No assessment data defined. Please contact the administrator.
//         </Typography>
//       </Box>
//     );
//   }

//   // ================================
//   // Step 9: UI Layout
//   // ================================
//   return (
//     <>
//       {/* Progress Bar */}
//       <Box sx={{ minWidth: 200, my: 2, mx: "auto", maxWidth: 300 }}>
//         <Typography
//           variant="caption"
//           color="primary"
//           fontWeight="bold"
//           gutterBottom
//         >
//           Overall Progress: {progress}%
//         </Typography>
//         <LinearProgress
//           variant="determinate"
//           value={progress}
//           sx={{ borderRadius: 5, height: 8 }}
//           color="primary"
//         />
//       </Box>

//       {/* Assessment Content */}
//       <Box sx={{ maxWidth: 900, mx: "auto", py: 5 }}>
//         {/* Stepper */}
//         <Stepper activeStep={currentSectionIdx} alternativeLabel sx={{ mb: 4 }}>
//           {surveySections.map((section) => (
//             <Step key={section.title}>
//               <StepLabel>{section.title}</StepLabel>
//             </Step>
//           ))}
//         </Stepper>

//         <Typography variant="h6" align="center" sx={{ mb: 3 }}>
//           Please answer the following questions to assess your organization's
//           compliance in this area.
//         </Typography>

//         {/* Question Section */}
//         <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
//           <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
//             {section.title}
//           </Typography>

//           {section.questions.map((q, qi) => (
//             <Box
//               key={q.id}
//               sx={{
//                 mb: 4,
//                 p: 2,
//                 border: "1px solid #eaeaea",
//                 borderRadius: 3,
//                 background: "#fff",
//               }}
//             >
//               <Typography fontWeight="medium" mb={2}>
//                 {qi + 1}. {q.text}
//               </Typography>

//               <Box
//                 sx={{
//                   display: "flex",
//                   flexWrap: "wrap",
//                   gap: 2,
//                   mt: 1,
//                 }}
//               >
//                 {q.options.map((opt) => (
//                   <Button
//                     key={opt}
//                     onClick={() => handleChange(qi, opt)}
//                     sx={{
//                       minWidth: 150,
//                       minHeight: 48,
//                       border: isSelected(qi, opt)
//                         ? "2px solid #1e3a8a"
//                         : "1px solid #eaeaea",
//                       bgcolor: isSelected(qi, opt) ? "#f0f4ff" : "#fff",
//                       borderRadius: 2,
//                       boxShadow: isSelected(qi, opt) ? 2 : 0,
//                       fontWeight: isSelected(qi, opt) ? "bold" : "normal",
//                       color: "#222",
//                       textAlign: "center",
//                     }}
//                     variant="outlined"
//                   >
//                     <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                       <span
//                         style={{
//                           width: 18,
//                           height: 18,
//                           display: "inline-block",
//                           borderRadius: "50%",
//                           border: "2px solid #ccc",
//                           marginRight: 8,
//                           background: isSelected(qi, opt)
//                             ? "#2563eb"
//                             : "#fff",
//                           borderColor: isSelected(qi, opt)
//                             ? "#2563eb"
//                             : "#ccc",
//                         }}
//                       />
//                       {opt}
//                     </Box>
//                   </Button>
//                 ))}
//               </Box>
//             </Box>
//           ))}
//         </Paper>

//         {/* Navigation */}
//         <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//           <Button
//             disabled={currentSectionIdx === 0}
//             onClick={handlePrev}
//             variant="outlined"
//           >
//             Previous
//           </Button>
//           {currentSectionIdx < surveySections.length - 1 ? (
//             <Button
//               onClick={handleNext}
//               variant="contained"
//               disabled={responses[currentSectionIdx]?.includes("")}
//             >
//               Next Section
//             </Button>
//           ) : (
//             <Button
//               onClick={handleSubmit}
//               variant="contained"
//               disabled={responses[currentSectionIdx]?.includes("")}
//             >
//               Get Report 
//             </Button>
//           )}
//         </Box>
//       </Box>
//     </>
//   );
// }

import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSectionsWithQuestionCount } from "../../redux/features/sectionsSlice";
import { fetchAllQuestions } from "../../redux/features/questionsSlice";
import { fetchAnswersByQuestion } from "../../redux/features/answersSlice";

export default function AssessmentFlow() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state || {};

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    dispatch(fetchSectionsWithQuestionCount());
    dispatch(fetchAllQuestions());
  }, [dispatch]);

  const sections = useSelector((state) => state.sections.items);
  const questions = useSelector((state) => state.questions.items);
  const answers = useSelector((state) => state.answers.items);

  const fetchedOnce = useRef(false);

  useEffect(() => {
    if (!fetchedOnce.current && questions.length > 0) {
      fetchedOnce.current = true;
      questions.forEach((q) => {
        dispatch(fetchAnswersByQuestion(q.id));
      });
    }
  }, [questions, dispatch]);

  const surveySections = useMemo(() => {
    if (!sections.length || !questions.length) return [];
    return sections.map((section) => ({
      id: section.id,
      title: section.section_name,
      questions: questions
        .filter((q) => q.section_id === section.id)
        .map((q) => ({
          id: q.id,
          text: q.question,
          options: answers
            .filter((a) => a.question_id === q.id)
            .map((a) => a.option_text),
        })),
    }));
  }, [sections, questions, answers]);

  const [responses, setResponses] = useState([]);
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);

  useEffect(() => {
    if (surveySections.length > 0 && responses.length === 0) {
      setResponses(
        surveySections.map((section) => section.questions.map(() => ""))
      );
    }
  }, [surveySections, responses.length]);

  const totalAnswers = responses.flat().length;
  const answered = responses.flat().filter((r) => r !== "").length;
  const progress =
    totalAnswers > 0 ? Math.round((answered / totalAnswers) * 100) : 0;

  const section = surveySections[currentSectionIdx];

  const isSelected = (qIdx, opt) =>
    responses[currentSectionIdx]?.[qIdx] === opt;

  const handleChange = (questionIdx, value) => {
    setResponses((prev) => {
      const newResponses = prev.map((arr) => [...arr]);
      newResponses[currentSectionIdx][questionIdx] = value;
      return newResponses;
    });
  };

  const handleNext = () => setCurrentSectionIdx((idx) => idx + 1);
  const handlePrev = () => setCurrentSectionIdx((idx) => idx - 1);

  const handleSubmit = () => {
    navigate("/assessment/summary", {
      state: { userInfo: user, responses, surveySections },
    });
  };

  if (!sections.length || !questions.length) {
    return (
      <Box sx={{ py: 10, textAlign: "center" }}>
        <LinearProgress color="primary" />
        <Typography variant="h6" mt={3}>
          Loading assessment...
        </Typography>
      </Box>
    );
  }

  if (!surveySections.length || !section) {
    return (
      <Box sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          No assessment data defined. Please contact the administrator.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      {/* Progress Bar */}
      <Box sx={{ minWidth: 200, my: 2, mx: "auto", maxWidth: 300 }}>
        <Typography
          variant="caption"
          color="primary"
          fontWeight="bold"
          gutterBottom
        >
          Overall Progress: {progress}%
        </Typography>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ borderRadius: 5, height: 8 }}
          color="primary"
        />
      </Box>

      {/* Assessment Content */}
      <Box sx={{ maxWidth: 900, mx: "auto", py: { xs: 3, sm: 5 }, px: { xs: 1, sm: 0 } }}>
        {/* Show full Stepper on desktop, single current step label on mobile */}
        {isMobile ? (
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography variant="h6" fontWeight="bold">
              {section.title}
            </Typography>
          </Box>
        ) : (
          <Stepper activeStep={currentSectionIdx} alternativeLabel sx={{ mb: 4 }}>
            {surveySections.map((section) => (
              <Step key={section.title}>
                <StepLabel>{section.title}</StepLabel>
              </Step>
            ))}
          </Stepper>
        )}

        <Typography variant="h6" align="center" sx={{ mb: 3 }}>
          Please answer the following questions to assess your organization's
          compliance in this area.
        </Typography>

        <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
            {section.title}
          </Typography>

          {section.questions.map((q, qi) => (
            <Box
              key={q.id}
              sx={{
                mb: 4,
                p: { xs: 1, sm: 2 },
                border: "1px solid #eaeaea",
                borderRadius: 3,
                background: "#fff",
              }}
            >
              <Typography fontWeight="medium" mb={2} fontSize={{ xs: 14, sm: 16 }}>
                {qi + 1}. {q.text}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  mt: 1,
                }}
              >
                {q.options.map((opt) => (
                  <Button
                    key={opt}
                    onClick={() => handleChange(qi, opt)}
                    sx={{
                      minWidth: { xs: "100%", sm: 150 },
                      minHeight: 48,
                      border: isSelected(qi, opt) ? "2px solid #1e3a8a" : "1px solid #eaeaea",
                      bgcolor: isSelected(qi, opt) ? "#f0f4ff" : "#fff",
                      borderRadius: 2,
                      boxShadow: isSelected(qi, opt) ? 2 : 0,
                      fontWeight: isSelected(qi, opt) ? "bold" : "normal",
                      color: "#222",
                      textAlign: "center",
                    }}
                    variant="outlined"
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <span
                        style={{
                          width: 18,
                          height: 18,
                          display: "inline-block",
                          borderRadius: "50%",
                          border: "2px solid #ccc",
                          marginRight: 8,
                          background: isSelected(qi, opt) ? "#2563eb" : "#fff",
                          borderColor: isSelected(qi, opt) ? "#2563eb" : "#ccc",
                        }}
                      />
                      {opt}
                    </Box>
                  </Button>
                ))}
              </Box>
            </Box>
          ))}
        </Paper>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Button
            disabled={currentSectionIdx === 0}
            onClick={handlePrev}
            variant="outlined"
            sx={{ flex: { xs: "1 1 100%", sm: "auto" } }}
          >
            Previous
          </Button>
          {currentSectionIdx < surveySections.length - 1 ? (
            <Button
              onClick={handleNext}
              variant="contained"
              disabled={responses[currentSectionIdx]?.includes("")}
              sx={{ flex: { xs: "1 1 100%", sm: "auto" } }}
            >
              Next Section
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={responses[currentSectionIdx]?.includes("")}
              sx={{ flex: { xs: "1 1 100%", sm: "auto" } }}
            >
              Get Report
            </Button>
          )}
        </Box>
      </Box>
    </>
  );
}
