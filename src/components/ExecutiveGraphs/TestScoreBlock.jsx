// TestScoreBlock (Ed-Tech)
import React from "react";
import { Box, Typography } from "@mui/material";

export function TestScoreBlock({ score, maxScore }) {
  const grade = score > 80 ? "A" : score > 60 ? "B" : score > 40 ? "C" : "D";
  const percent = Math.round((score / maxScore) * 100);
  return (
    <Box sx={{
      border: "2px solid #102b75",
      borderRadius: 2,
      bgcolor: "#f8faff",
      maxWidth: 390,
      m: "auto",
      p: 2,
      textAlign: "center",
      mt: 2
    }}>
      <Typography sx={{ fontWeight: 700, color: "#193285", fontSize: 27, mb: 1 }}>Test Score</Typography>
      <Typography sx={{ fontWeight: 700, color: "#193285", fontSize: 40 }}>
        {score}
      </Typography>
      <Typography sx={{ color: "#444", fontSize: 16, mb: 1 }}>out of {maxScore}</Typography>
      <Box sx={{
        width: "100%",
        height: 16,
        bgcolor: "#e0e0e0",
        borderRadius: 10,
        overflow: "hidden",
        mx: "auto"
      }}>
        <Box sx={{
          width: `${percent}%`,
          height: "100%",
          bgcolor: "#ffb300"
        }} />
      </Box>
      <Typography sx={{ color: "#666", mt: 1 }}>Grade: <span style={{fontWeight:700}}>{grade}</span></Typography>
    </Box>
  );
}
