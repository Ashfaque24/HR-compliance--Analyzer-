import React from "react";
import { Box, Typography } from "@mui/material";
import { blue, grey } from "@mui/material/colors";

export function DefaultScoreBlock({ score, maxScore }) {
  return (
    <React.Fragment>
      {/* Main score block */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "baseline",
          gap: 2,
          mb: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: 48, sm: 66 },
            fontWeight: 800,
            color: blue[600],
          }}
        >
          {score}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: 34, sm: 48 },
            fontWeight: 500,
            color: grey[400],
          }}
        >
          / {maxScore}
        </Typography>
      </Box>

      {/* Label row */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 4,
          mb: 3,
        }}
      >
        <Typography sx={{ fontSize: 15, color: grey[600] }}>
          Overall Score
        </Typography>
        <Typography sx={{ fontSize: 15, color: grey[600] }}>
          Maximum
        </Typography>
      </Box>
    </React.Fragment>
  );
}
