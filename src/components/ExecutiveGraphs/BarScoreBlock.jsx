import React from "react";
import { Box, Typography } from "@mui/material";

export function BarScoreBlock({ score, maxScore }) {
  const percent = Math.round((score / maxScore) * 100);
  return (
    <Box sx={{
      maxWidth: 420,
      border: "2px solid #641991",
      bgcolor: "#faf5fd",
      borderRadius: 2,
      p: 2,
      m: "auto"
    }}>
      <Typography align="center" sx={{ fontWeight: 700, color: "#641991" }}>Funding Goal: Compliance</Typography>
      <Box sx={{position:"relative", display:"flex", alignItems:"center", mt:2, mb:1}}>
        <Box sx={{
          width: "100%",
          height: 26,
          bgcolor: "#e0e0e0",
          borderRadius: 18,
          overflow: "hidden",
          display: "flex"
        }}>
          <Box sx={{
            width: `${percent}%`,
            bgcolor: "#641991",
            color: "#fff",
            fontWeight: 700,
            fontSize: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>{percent}%</Box>
        </Box>
      </Box>
    </Box>
  );
}
