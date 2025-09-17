import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ShieldIcon from "@mui/icons-material/Shield";
import DescriptionIcon from "@mui/icons-material/Description";

const LeftSection = () => {
  return (
    <Box sx={{minHeight:'100vh'}} >
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Get Your HR Compliance <br /> Score in Minutes
      </Typography>
      <Typography variant="body1" color="rgba(255,255,255,0.9)" mb={4}>
        Our AI-powered analysis evaluates your organization across 5 critical
        compliance areas and provides actionable recommendations.
      </Typography>

      <Stack spacing={3}>
        <Box display="flex" gap={2} alignItems="flex-start">
          <AssignmentIcon fontSize="large" />
          <Box>
            <Typography fontWeight="bold">Registration & Licensing</Typography>
            <Typography variant="body2">
              MCA, ESIC, EPFO, and regulatory compliance
            </Typography>
          </Box>
        </Box>

        <Box display="flex" gap={2} alignItems="flex-start">
          <ShieldIcon fontSize="large" />
          <Box>
            <Typography fontWeight="bold">
              Employee Welfare & Benefits
            </Typography>
            <Typography variant="body2">
              Statutory benefits and welfare compliance
            </Typography>
          </Box>
        </Box>

        <Box display="flex" gap={2} alignItems="flex-start">
          <DescriptionIcon fontSize="large" />
          <Box>
            <Typography fontWeight="bold">Documentation & Governance</Typography>
            <Typography variant="body2">
              Policies, POSH compliance, and workplace governance
            </Typography>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};

export default LeftSection;
