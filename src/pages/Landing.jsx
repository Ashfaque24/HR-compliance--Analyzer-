import React from "react";
import { Box } from "@mui/material";
import Navbar from "../sections/landing/Navbar";
import Body from "../sections/landing/Body";

const LandingPage = () => {
  return (
    <Box display="flex" flexDirection="column"bgcolor="#fff">
      <Navbar />
      <Body />
    </Box>
  );
};

export default LandingPage;
