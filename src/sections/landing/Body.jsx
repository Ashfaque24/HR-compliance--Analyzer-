import React from "react";
import { Grid, Box } from "@mui/material";
import LeftSection from "./LeftSection";
import RightSection from "./RightSection";

const Body = () => {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", p: 1 }}>
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          p: 4,
        }}
      >
        <LeftSection />
      </Box>

      <Box
        sx={{
          bgcolor: "#f9f9f9",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          p: 4,
        }}
      >
        <RightSection />
      </Box>
    </Box>
  );
};

export default Body;
