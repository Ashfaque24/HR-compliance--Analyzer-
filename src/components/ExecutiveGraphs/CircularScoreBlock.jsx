import React from "react";
import { Box, Typography } from "@mui/material";

export function CircularScoreBlock({ score, maxScore }) {
  const percent = (score / maxScore) * 100;
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 2, mb: 2 }}>
      <svg width={110} height={110}>
        <circle
          cx="55" cy="55" r="48"
          stroke="#e0e0e0" strokeWidth="10"
          fill="none"
        />
        <circle
          cx="55" cy="55" r="48"
          stroke="#0a3974"
          strokeWidth="10"
          fill="none"
          strokeDasharray={2 * Math.PI * 48}
          strokeDashoffset={(1 - percent / 100) * 2 * Math.PI * 48}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s' }}
        />
        <text x="55" y="60" textAnchor="middle" fontSize="26" fill="#0a3974" fontWeight="700">{score}</text>
        <text x="55" y="82" textAnchor="middle" fontSize="15" fill="#666">/ {maxScore}</text>
      </svg>
    </Box>
  );
}
