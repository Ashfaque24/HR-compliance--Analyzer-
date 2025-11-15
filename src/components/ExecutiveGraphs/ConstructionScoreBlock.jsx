import React from "react";
import { Box, Typography } from "@mui/material";

export function ConstructionScoreBlock({ score, maxScore }) {
  const percent = Math.round((score / maxScore) * 100);
  return (
    <Box sx={{
      textAlign: "center",
      color: "#ffd700",
      bgcolor: "#fffde8",
      maxWidth: 430,
      borderRadius: 2,
      p: 2,
      m: "auto",
      mt: 2
    }}>
      <Typography sx={{ fontWeight: 700, color: "#ffd700", fontSize: 22, mb: 1 }}>Construction Progress</Typography>
      <Box sx={{
        width: "100%",
        height: 24,
        bgcolor: "#e0e0e0",
        borderRadius: 13,
        overflow: "hidden",
        mx: "auto"
      }}>
        <Box sx={{
          width: `${percent}%`,
          height: "100%",
          bgcolor: "#ffd700",
          color: "#191b3a",
          fontWeight: 700,
          fontSize: 17,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>{percent}%</Box>
      </Box>
      <Typography sx={{ mt: 1, color: "#ffd700", fontWeight: 700 }}>
        Building Compliance: {score}/{maxScore}
      </Typography>
    </Box>
  );
}
