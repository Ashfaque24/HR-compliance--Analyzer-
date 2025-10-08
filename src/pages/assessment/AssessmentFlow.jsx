

import React, { useState } from "react";

import {
  Box, Typography, Paper, Button, Stepper, Step, StepLabel, LinearProgress,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import surveySections from "../../data/surveySections.json";

export default function AssessmentFlow() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state || {};

  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const [responses, setResponses] = useState(
    surveySections.map(section =>
      section.questions.map(() => "")
    )
  );

  // Calculate overall completion progress percent
  const totalAnswers = responses.flat().length;
  const answered = responses.flat().filter((r) => r !== "").length;
  const progress = Math.round((answered / totalAnswers) * 100);

  const section = surveySections[currentSectionIdx];

  // Check if option selected per question for styling
  const isSelected = (qIdx, opt) => responses[currentSectionIdx][qIdx] === opt;

  // Update answer on click
  const handleChange = (questionIdx, value) => {
    const newResponses = responses.map(arr => [...arr]);
    newResponses[currentSectionIdx][questionIdx] = value;
    setResponses(newResponses);
  };

  // Navigation between sections
  const handleNext = () => setCurrentSectionIdx(idx => idx + 1);
  const handlePrev = () => setCurrentSectionIdx(idx => idx - 1);

  // Submit and navigate to summary page with data
  const handleSubmit = () => {
    navigate("/assessment/summary", {
      state: {
        userInfo: user,
        responses,
        surveySections,
      }
    });
  };

  return (
    <>
      {/* Progress Bar below global Navbar */}
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

      <Box sx={{ maxWidth: 900, mx: "auto", py: 5 }}>
        {/* Stepper */}
        <Stepper activeStep={currentSectionIdx} alternativeLabel sx={{ mb: 4 }}>
          {surveySections.map((section) => (
            <Step key={section.title}>
              <StepLabel>{section.title}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Typography variant="h6" align="center" sx={{ mb: 3 }}>
          Please answer the following questions to assess your organization's compliance in this area.
        </Typography>

        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
            {section.title}
          </Typography>
          {section.questions.map((q, qi) => (
            <Box
              key={q.id}
              sx={{
                mb: 4,
                p: 2,
                border: "1px solid #eaeaea",
                borderRadius: 3,
                background: "#fff"
              }}
            >
              <Typography fontWeight="medium" mb={2}>
                {qi + 1}. {q.text}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  mt: 1
                }}
              >
                {q.options.map((opt) => (
                  <Button
                    key={opt}
                    onClick={() => handleChange(qi, opt)}
                    sx={{
                      minWidth: 150,
                      minHeight: 48,
                      border: isSelected(qi, opt) ? "2px solid #1e3a8a" : "1px solid #eaeaea",
                      bgcolor: isSelected(qi, opt) ? "#f0f4ff" : "#fff",
                      borderRadius: 2,
                      boxShadow: isSelected(qi, opt) ? 2 : 0,
                      fontWeight: isSelected(qi, opt) ? "bold" : "normal",
                      color: "#222",
                      textAlign: "center"
                    }}
                    variant="outlined"
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1
                      }}
                    >
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

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            disabled={currentSectionIdx === 0}
            onClick={handlePrev}
            variant="outlined"
          >
            Previous
          </Button>
          {currentSectionIdx < surveySections.length - 1 ? (
            <Button
              onClick={handleNext}
              variant="contained"
              disabled={responses[currentSectionIdx].includes("")}
            >
              Next Section
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={responses[currentSectionIdx].includes("")}
            >
              Finish & See Summary
            </Button>
          )}
        </Box>
      </Box>
    </>
  );
}
