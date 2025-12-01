import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import ShieldIcon from "@mui/icons-material/Shield";
import DescriptionIcon from "@mui/icons-material/Description";
import { useNavigate } from "react-router-dom";
import requestWrapper from "../api/axiosInstance";
import LoadingSpinner from "../components/common/LoadingSpinner";

export default function Landing() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    phone: "",
  });

  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  }

  const handleApiSubmit = async () => {
    try {
      const response = await requestWrapper({
        method: "POST",
        url: "user/response/start",
        data: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
        },
      });

      if (response.session_uuid) {
        localStorage.setItem("session_uuid", response.session_uuid);
      } else {
        throw new Error("No session_uuid in response");
      }
      return response;
    } catch (error) {
      console.error("Failed to submit form:", error);

      // requestWrapper returns { status, data, message }
      const backendMessage =
        error?.data?.message || // e.g. "Submission limit reached for email (2 max)."
        error?.message ||
        "Failed to submit form. Please try again.";

      setApiError(backendMessage);
      throw error;
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError("");
    setErrors({ fullName: "", phone: "" });

    let valid = true;
    const nameValue = formData.fullName.trim();
    if (nameValue.length < 3) {
      setErrors((prev) => ({
        ...prev,
        fullName: "Name must be at least 3 letters.",
      }));
      valid = false;
    } else if (/\d/.test(nameValue)) {
      setErrors((prev) => ({
        ...prev,
        fullName: "Name cannot contain numbers.",
      }));
      valid = false;
    }

    if (!/^\d{10}$/.test(formData.phone.trim())) {
      setErrors((prev) => ({
        ...prev,
        phone: "Phone number must be exactly 10 digits.",
      }));
      valid = false;
    }

    if (!valid) return;

    setSubmitting(true);
    try {
      await handleApiSubmit();
      navigate("/assessment", { state: formData });
    } catch {
      // error message already set in handleApiSubmit
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        minHeight: "100vh",
        fontFamily: "Helvetica, Arial, sans-serif",
        width: "100%",
      }}
    >
      {/* Left information panel */}
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
            m: { xs: "auto", md: "unset" },
          }}
        >
          Our AI-powered analysis evaluates your organization across 5 critical
          compliance areas and provides actionable recommendations.
        </Typography>

        <Stack
          spacing={2}
          sx={{
            maxWidth: { xs: "100%", md: 400 },
            m: { xs: "auto", md: "unset" },
          }}
          direction="column"
          alignItems="flex-start"
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Paper
              elevation={3}
              sx={{
                p: 1,
                borderRadius: "50%",
                bgcolor: "primary.main",
                color: "white",
              }}
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
              sx={{
                p: 1,
                borderRadius: "50%",
                bgcolor: "primary.main",
                color: "white",
              }}
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
              sx={{
                p: 1,
                borderRadius: "50%",
                bgcolor: "primary.main",
                color: "white",
              }}
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

      {/* Right form panel */}
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

          <Typography>
            Enter your details to begin the compliance evaluation
          </Typography>

          <TextField
            label="Full Name *"
            name="fullName"
            variant="outlined"
            value={formData.fullName}
            onChange={handleChange}
            required
            fullWidth
            error={!!errors.fullName}
            helperText={errors.fullName}
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
            error={!!errors.phone}
            helperText={errors.phone}
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

          {apiError && (
            <Typography color="error" variant="body2">
              {apiError}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{ mt: 2, background: "#18a16e" }}
            disabled={submitting}
          >
            {submitting ? <LoadingSpinner size={24} /> : "Start Compliance Assessment"}
          </Button>

          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            Your information is secure and will only be used for generating your
            compliance report.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
