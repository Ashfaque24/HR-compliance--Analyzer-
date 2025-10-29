

// EditReportPage.jsx (admin side)
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import reportsData from "../data/reports.json";
import {
  Box, Paper, Typography, Stack, TextField, Button, MenuItem, Select, Grid, Chip, Divider,
  Accordion, AccordionSummary, AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const graphTypes = ["Pie Chart", "Bar Chart", "Line Chart", "Radar Chart", "Donut Chart"];
const chipStyles = { fontWeight: 600, fontSize: 13, px: 1.2 };

export default function EditReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Robust localStorage fetch
  let storedReports;
  try {
    storedReports = JSON.parse(localStorage.getItem("reportsData"));
    if (!Array.isArray(storedReports)) throw new Error();
  } catch {
    localStorage.setItem("reportsData", JSON.stringify(reportsData));
    storedReports = reportsData;
  }

  // Reliable find by ID
  const report = storedReports.find((r) => String(r.id) === String(id));
  const [form, setForm] = useState(report ? { ...report } : null);

  // Save to localStorage on edit
  useEffect(() => {
    if (form) {
      const updatedReports = storedReports.map((r) =>
        String(r.id) === String(form.id) ? form : r
      );
      localStorage.setItem("reportsData", JSON.stringify(updatedReports));
    }
  }, [form]);

  if (!form)
    return (
      <Box p={4}>
        <Paper sx={{ p: 3 }}>
          <Typography color="error">Report not found.</Typography>
        </Paper>
      </Box>
    );

  // Handlers
  const handleChange = (field) => (event) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const handleSectionChange = (idx, field) => (event) => {
    const updated = { ...form };
    updated.details.summary[idx][field] =
      field === "score" ? Number(event.target.value) : event.target.value;
    setForm(updated);
  };

  const handleSectionArrayChange = (idx, field) => (event) => {
    const value = event.target.value.split("\n");
    setForm((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        summary: prev.details.summary.map((section, i) =>
          i === idx ? { ...section, [field]: value } : section
        ),
      },
    }));
  };

  const handleSave = () => {
    const updatedReports = storedReports.map((r) =>
      String(r.id) === String(form.id) ? form : r
    );
    localStorage.setItem("reportsData", JSON.stringify(updatedReports));
    alert("✅ Changes saved successfully (stored in localStorage).");
    navigate(-1);
  };

  const handleBackToReports = () => {
    navigate("/admin/report");
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", py: { xs: 2, md: 4 }, px: { xs: 1, md: 0 } }}>
      {/* Back Button */}
      <Box sx={{ mb: 2 }}>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBackToReports} sx={{ mb: 2 }}>
          Back to Reports
        </Button>
      </Box>
      <Paper elevation={6} sx={{ p: { xs: 2, md: 4 }, mb: 3, borderRadius: 3 }}>
        <Typography variant="h4" fontWeight="bold" mb={1} color="primary.dark">
          Edit HR Compliance Report
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={3} mt={1}>
          <Grid item xs={12} md={4}>
            <TextField fullWidth label="Company" value={form.company} onChange={handleChange("company")} sx={{ mb: 2 }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField fullWidth label="Contact" value={form.contact} onChange={handleChange("contact")} sx={{ mb: 2 }} />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField fullWidth label="Date Submitted" value={form.submitted} onChange={handleChange("submitted")} sx={{ mb: 2 }} />
          </Grid>
          <Grid item xs={6} md={1.5}>
            <Select fullWidth value={form.status} onChange={handleChange("status")} displayEmpty>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Enhanced">Enhanced</MenuItem>
              <MenuItem value="In Review">In Review</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={6} md={0.5}>
            <TextField fullWidth label="Score" type="number" value={form.score} onChange={handleChange("score")} sx={{ mb: 2 }} />
          </Grid>
        </Grid>
      </Paper>
      {/* Sections */}
      <Box>
        <Typography variant="h5" fontWeight={700} color="primary" sx={{ mb: 2 }}>
          Section Details
        </Typography>
        {form.details.summary.map((section, idx) => (
          <Accordion key={section.name} defaultExpanded sx={{ mb: 2, boxShadow: 3, borderRadius: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}
              sx={{ bgcolor: "#f2f6ff", mb: 3, "& .MuiAccordionSummary-content": { alignItems: "center" } }}>
              <Box sx={{ width: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography sx={{ fontWeight: 600, fontSize: "1.1rem" }}>{section.name}</Typography>
                <Stack direction="row" spacing={2}>
                  <Chip label={`Score: ${section.score} / ${section.maxScore}`} color="primary" sx={{ ...chipStyles }} />
                  <Chip label={`Completion: ${section.completionRate}`} color="success" sx={{ ...chipStyles }} />
                </Stack>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label={`Section Score (Max: ${section.maxScore})`}
                    type="number"
                    value={section.score}
                    onChange={handleSectionChange(idx, "score")}
                    inputProps={{ min: 0, max: section.maxScore }}
                  />
                  <Select
                    fullWidth
                    sx={{ mt: 2 }}
                    value={section.graphType || ""}
                    displayEmpty
                    onChange={handleSectionChange(idx, "graphType")}
                  >
                    <MenuItem value="">Select graph type</MenuItem>
                    {graphTypes.map((gt) => (
                      <MenuItem key={gt} value={gt}>
                        {gt}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                {/* Strengths */}
                <Grid item xs={12} md={3}>
                  <Typography fontWeight="bold" sx={{ mb: 1 }}>
                    Strengths
                  </Typography>
                  <TextField
                    multiline
                    minRows={4}
                    fullWidth
                    placeholder="Enter strengths, one per line..."
                    value={section.strengths ? section.strengths.join("\n") : ""}
                    onChange={handleSectionArrayChange(idx, "strengths")}
                  />
                </Grid>
                {/* Gaps */}
                <Grid item xs={12} md={3}>
                  <Typography fontWeight="bold" sx={{ mb: 1 }}>
                    Gaps
                  </Typography>
                  <TextField
                    multiline
                    minRows={4}
                    fullWidth
                    placeholder="Describe gaps/weaknesses, one per line..."
                    value={section.gaps ? section.gaps.join("\n") : ""}
                    onChange={handleSectionArrayChange(idx, "gaps")}
                  />
                </Grid>
                {/* Recommendations */}
                <Grid item xs={12} md={3}>
                  <Typography fontWeight="bold" sx={{ mb: 1 }}>
                    Actionable Recommendations
                  </Typography>
                  <TextField
                    multiline
                    minRows={4}
                    fullWidth
                    placeholder="Provide recommendations, one per line..."
                    value={section.recommendations ? section.recommendations.join("\n") : ""}
                    onChange={handleSectionArrayChange(idx, "recommendations")}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
      {/* ACTIONS */}
      <Paper elevation={0} sx={{ mt: 3, p: 2, bgcolor: "#fafcff", borderRadius: 2 }}>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="contained" color="primary" onClick={handleSave} sx={{ px: 4, fontWeight: 700 }}>
            Save Changes
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => navigate(-1)} sx={{ px: 4 }}>
            Cancel
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}








