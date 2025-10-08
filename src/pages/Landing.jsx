

import React, { useState } from "react";
import { Box, Typography, TextField, Button, Paper, Stack } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import ShieldIcon from "@mui/icons-material/Shield";
import DescriptionIcon from "@mui/icons-material/Description";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
  });

  const navigate = useNavigate();

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Navigate to /assessment passing user details and dynamically loaded sections
    navigate("/assessment", { state: formData });
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
        width: "100vw",
      }}
    >
      <Box
        sx={{
          flex: 1,
          bgcolor: "primary.dark",
          color: "white",
          p: { xs: 4, md: 8 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 3,
          background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
          textAlign: { xs: "center", md: "left" },
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Get Your HR Compliance Score in Minutes
        </Typography>
        <Typography
          sx={{
            maxWidth: { xs: "100%", md: 400 },
            margin: { xs: "auto", md: "unset" },
          }}
        >
          Our AI-powered analysis evaluates your organization across 5 critical
          compliance areas and provides actionable recommendations.
        </Typography>
        <Stack
          spacing={2}
          sx={{
            maxWidth: { xs: "100%", md: 400 },
            margin: { xs: "auto", md: "unset" },
          }}
          direction="column"
          alignItems={{ xs: "center", md: "flex-start" }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Paper
              elevation={3}
              sx={{ p: 1, borderRadius: "50%", bgcolor: "primary.main", color: "white" }}
            >
              <PeopleIcon />
            </Paper>
            <Box>
              <Typography fontWeight="bold">Registration & Licensing</Typography>
              <Typography variant="caption" color="grey.300">
                MCA, ESIC, EPFO, and regulatory compliance
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Paper
              elevation={3}
              sx={{ p: 1, borderRadius: "50%", bgcolor: "primary.main", color: "white" }}
            >
              <ShieldIcon />
            </Paper>
            <Box>
              <Typography fontWeight="bold">Employee Welfare & Benefits</Typography>
              <Typography variant="caption" color="grey.300">
                Statutory benefits and welfare compliance
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Paper
              elevation={3}
              sx={{ p: 1, borderRadius: "50%", bgcolor: "primary.main", color: "white" }}
            >
              <DescriptionIcon />
            </Paper>
            <Box>
              <Typography fontWeight="bold">Documentation & Governance</Typography>
              <Typography variant="caption" color="grey.300">
                Policies, POSH compliance, and workplace governance
              </Typography>
            </Box>
          </Box>
        </Stack>
      </Box>

      <Box
        sx={{
          flex: 1,
          p: { xs: 4, md: 8 },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "background.paper",
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: "100%",
            maxWidth: 480,
            bgcolor: "background.paper",
            boxShadow: 3,
            borderRadius: 2,
            p: 4,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            Start Your Assessment
          </Typography>
          <Typography>Enter your details to begin the compliance evaluation</Typography>
          <TextField
            label="Full Name *"
            name="fullName"
            variant="outlined"
            value={formData.fullName}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Email Address *"
            name="email"
            type="email"
            variant="outlined"
            value={formData.email}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Phone Number *"
            name="phone"
            type="tel"
            variant="outlined"
            value={formData.phone}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Company Name *"
            name="company"
            variant="outlined"
            value={formData.company}
            onChange={handleChange}
            required
            fullWidth
          />
          <Button type="submit" variant="contained" size="large" sx={{ mt: 2 }}>
            Start Compliance Assessment
          </Button>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            Your information is secure and will only be used for generating your compliance report.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
