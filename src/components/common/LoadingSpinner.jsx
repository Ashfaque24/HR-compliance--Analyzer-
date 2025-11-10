
import React from "react";
import { CircularProgress, Box } from "@mui/material";

export default function LoadingSpinner({ size = 40, message }) {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" p={2}>
      <CircularProgress size={size} />
      {message && <span style={{ marginTop: 12 }}>{message}</span>}
    </Box>
  );
}
