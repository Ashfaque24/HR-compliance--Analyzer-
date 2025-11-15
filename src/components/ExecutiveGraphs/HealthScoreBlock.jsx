import React from "react";
import { Box, Typography } from "@mui/material";

export function HealthScoreBlock({ score, maxScore }) {
  const percent = Math.round((score / maxScore) * 100);
  return (
    <Box sx={{
      border: "2px solid #2681cc",
      borderRadius: 3,
      bgcolor: "#f6fbff",
      m: "auto",
      p: 3,
      maxWidth: 340,
      mt:2
    }}>
      <Typography align="center" sx={{ color: "#2681cc", fontWeight: 700, mb: 2 }}>Compliance Vitals</Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
        <Typography>Health Score:</Typography>
        <Box sx={{
          width: 60, height: 8, bgcolor: "#e0e0e0", borderRadius: 2, overflow:"hidden", mr:1
        }}>
          <Box sx={{
            width: `${percent}%`, height: "100%", bgcolor: "#f94343"
          }}/>
        </Box>
        <Typography sx={{minWidth:20}}>{score}</Typography>
      </Box>
      <Typography align="center" sx={{ fontWeight: 700, color: "#2681cc", fontSize: 32 }}>
        {score}/{maxScore}
      </Typography>
      <Typography align="center" sx={{ color: "#68b5fe", fontSize: 16 }}>Compliance Index</Typography>
    </Box>
  );
}
