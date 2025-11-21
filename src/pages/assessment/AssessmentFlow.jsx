import React, { useEffect, useState, useMemo } from "react";
import {
  Box, Typography, Paper, Button, Stepper, Step, StepLabel,
  LinearProgress, useTheme, useMediaQuery,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuestionsWithOptions, submitAssessmentAnswers } from "../../redux/features/assessmentSlice";

export default function AssessmentFlow() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const user = location.state || {};

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const questions = useSelector((state) => state.assessment.items || []);
  const submitLoading = useSelector((state) => state.assessment.submitLoading);
  const submitError = useSelector((state) => state.assessment.submitError);

  const [responses, setResponses] = useState([]);
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);

  useEffect(() => {
    dispatch(fetchQuestionsWithOptions());
  }, [dispatch]);

  const surveySections = useMemo(() => {
    if (!questions.length) return [];

    const sectionMap = new Map();

    questions.forEach((q) => {
      const sectionId = q.section_id;
      const sectionTitle = q.Section?.title || q.section_name || `Section ${sectionId}`;

      if (!sectionMap.has(sectionId)) {
        sectionMap.set(sectionId, { id: sectionId, title: sectionTitle, questions: [] });
      }

      sectionMap.get(sectionId).questions.push({
        id: q.id,
        text: q.text,
        options: (q.Options || []).map(opt => ({ label: opt.label, id: opt.id })),
      });
    });

    return Array.from(sectionMap.values());
  }, [questions]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentSectionIdx]);

  useEffect(() => {
    if (surveySections.length > 0 && responses.length === 0) {
      setResponses(surveySections.map(section => section.questions.map(() => "")));
    }
  }, [surveySections]);

  const totalAnswers = responses.flat().length;
  const answered = responses.flat().filter(r => r !== "").length;
  const progress = totalAnswers > 0 ? Math.round((answered / totalAnswers) * 100) : 0;

  const section = surveySections[currentSectionIdx];

  const isSelected = (qIdx, optId) => responses[currentSectionIdx]?.[qIdx] === optId;

  const handleChange = (questionIdx, optionId) => {
    setResponses(prev => {
      const newResponses = prev.map(arr => [...arr]);

      // Initialize nested array if missing to prevent 'Cannot set properties of undefined'
      if (!newResponses[currentSectionIdx]) {
        newResponses[currentSectionIdx] = [];
      }

      newResponses[currentSectionIdx][questionIdx] = optionId;
      return newResponses;
    });
  };

  const handleNext = () => setCurrentSectionIdx(idx => idx + 1);
  const handlePrev = () => setCurrentSectionIdx(idx => idx - 1);

  const handleSubmit = async () => {
    const session_uuid = localStorage.getItem("session_uuid");
    if (!session_uuid) {
      alert("Session expired or not found. Please restart the assessment.");
      return;
    }

    const answers = surveySections.flatMap((section, secIdx) =>
      section.questions.map((q, qIdx) => ({
        question_id: q.id,
        option_id: responses[secIdx][qIdx],
      }))
    );

    try {
      const result = await dispatch(submitAssessmentAnswers({ session_uuid, answers })).unwrap();

      navigate("/assessment/summary", {
        state: { userInfo: user, reportSummary: result.summary },
      });
    } catch (error) {
      alert("Failed to submit your answers. Please try again.");
      console.error(error);
    }
  };

  if (!questions.length) {
    return (
      <Box sx={{ py: 10, textAlign: "center", fontFamily: "Helvetica, Arial, sans-serif" }}>
        <LinearProgress color="primary" />
        <Typography variant="h6" mt={3}>Loading assessment...</Typography>
      </Box>
    );
  }

  if (!surveySections.length || !section) {
    return (
      <Box sx={{ py: 10, textAlign: "center", fontFamily: "Helvetica, Arial, sans-serif" }}>
        <Typography variant="h6" color="error">
          No assessment data defined. Please contact the administrator.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        fontFamily: "Helvetica, Arial, sans-serif",
        px: 2,
      }}
    >
      {/* Progress bar */}
      <Box sx={{ minWidth: 200, my: 2, mx: "auto", maxWidth: 300 }}>
        <Typography variant="caption" color="primary" fontWeight="bold" gutterBottom>
          Overall Progress: {progress}%
        </Typography>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ borderRadius: 5, height: 8 }}
          color="primary"
        />
      </Box>

      <Box sx={{ maxWidth: 900, mx: "auto", py: { xs: 3, sm: 5 } }}>
        {isMobile ? (
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography variant="h6" fontWeight="bold">{section.title}</Typography>
          </Box>
        ) : (
          <Stepper activeStep={currentSectionIdx} alternativeLabel sx={{ mb: 4 }}>
            {surveySections.map(section => (
              <Step key={section.id}>
                <StepLabel>{section.title}</StepLabel>
              </Step>
            ))}
          </Stepper>
        )}

        <Typography variant="h6" align="center" sx={{ mb: 3 }}>
          Please answer the following questions to assess your organization's compliance in this area.
        </Typography>

        <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
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
              <Typography
                fontWeight="medium"
                mb={2}
                fontSize={{ xs: 14, sm: 16 }}
              >
                {qi + 1}. {q.text}
              </Typography>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 1 }}>
                {q.options.map((opt) => (
                  <Button
                    key={opt.id}
                    onClick={() => handleChange(qi, opt.id)}
                    sx={{
                      minWidth: { xs: "100%", sm: 150 },
                      minHeight: 48,
                      border: isSelected(qi, opt.id) ? "2px solid #1e3a8a" : "1px solid #eaeaea",
                      bgcolor: isSelected(qi, opt.id) ? "#f0f4ff" : "#fff",
                      borderRadius: 2,
                      boxShadow: isSelected(qi, opt.id) ? 2 : 0,
                      fontWeight: isSelected(qi, opt.id) ? "bold" : "normal",
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
                          background: isSelected(qi, opt.id) ? "#2563eb" : "#fff",
                          borderColor: isSelected(qi, opt.id) ? "#2563eb" : "#ccc",
                        }}
                      />
                      {opt.label}
                    </Box>
                  </Button>
                ))}
              </Box>
            </Box>
          ))}
        </Paper>

        {/* Navigation Buttons */}
        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 1 }}>
          <Button
            disabled={currentSectionIdx === 0}
            onClick={handlePrev}
            variant="contained"
            sx={{ flex: { xs: "1 1 100%", sm: "auto" }, background: "#18a16e" }}
          >
            Previous
          </Button>

          {currentSectionIdx < surveySections.length - 1 ? (
            <Button
              onClick={handleNext}
              variant="contained"
              disabled={!responses[currentSectionIdx] || responses[currentSectionIdx].includes("")}
              sx={{ flex: { xs: "1 1 100%", sm: "auto" }, background: "#18a16e" }}
            >
              Next Section
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={!responses[currentSectionIdx] || responses[currentSectionIdx].includes("") || submitLoading}
              sx={{ flex: { xs: "1 1 100%", sm: "auto" }, background: "#18a16e" }}
            >
              {submitLoading ? "Submitting..." : "Get Report"}
            </Button>
          )}
        </Box>

        {submitError && (
          <Typography color="error" sx={{ mt: 2, textAlign: "center" }}>
            Error submitting answers: {submitError}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
