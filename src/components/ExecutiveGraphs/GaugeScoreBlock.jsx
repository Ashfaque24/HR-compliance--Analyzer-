import React from "react";
import { Box, Typography } from "@mui/material";

export function GaugeScoreBlock({ score, maxScore }) {
  const percent = (score / maxScore) * 100;
  const endAngle = (percent / 100) * 180;
  const angle = Math.PI * (endAngle / 180);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg width={240} height={120}>
        <path
          d="M 30 110 A 90 90 0 0 1 210 110"
          fill="none"
          stroke="#e0e0e0"
          strokeWidth="10"
        />
        <path
          d={`M 30 110 A 90 90 0 0 1 ${120 + 90 * Math.cos(Math.PI - angle)} ${110 - 90 * Math.sin(angle)}`}
          fill="none"
          stroke="#ff9300"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <line
          x1="120" y1="110"
          x2={120 + 60 * Math.cos(Math.PI - angle)}
          y2={110 - 60 * Math.sin(angle)}
          stroke="#ffd600"
          strokeWidth="4"
        />
        <text x="120" y="102" fontSize="28" fill="#ff9300" textAnchor="middle" fontWeight="700">{score}</text>
      </svg>
    </Box>
  );
}
