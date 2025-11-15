import React from "react";
import { Box, Typography } from "@mui/material";

// GaugeScoreBlock with clear max score and text below the needle
export function GaugeScoreBlock({ score, maxScore }) {
  const percent = (score / maxScore) * 100;
  const angle = (percent / 100) * Math.PI; // 0 to PI (left to right)
  const cx = 120, cy = 110, r = 90;

  // Needle endpoint
  const needleLength = 60;
  const needleX = cx + needleLength * Math.cos(Math.PI - angle);
  const needleY = cy - needleLength * Math.sin(angle);

  // Arc endpoint for progress
  const arcX = cx + r * Math.cos(Math.PI - angle);
  const arcY = cy - r * Math.sin(angle);
  const largeArc = percent > 50 ? 1 : 0;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg width={240} height={130} style={{ display: "block" }}>
        {/* Background arc */}
        <path
          d="M 30 110 A 90 90 0 0 1 210 110"
          fill="none"
          stroke="#e0e0e0"
          strokeWidth="10"
        />
        {/* Progress arc */}
        <path
          d={`M 30 110 A 90 90 0 ${largeArc} 1 ${arcX} ${arcY}`}
          fill="none"
          stroke="#ff9300"
          strokeWidth="10"
          strokeLinecap="round"
        />
        {/* Needle */}
        <line
          x1={cx}
          y1={cy}
          x2={needleX}
          y2={needleY}
          stroke="#ffd600"
          strokeWidth="4"
        />
      </svg>
      {/* Score below the gauge */}
      <Box sx={{ textAlign: "center", mt: -2 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: "#ff9300", lineHeight: 1 }}>
          {score}
          <span style={{ color: "#aaa", fontWeight: 500, fontSize: 22 }}> / {maxScore}</span>
        </Typography>
      </Box>
    </Box>
  );
}
