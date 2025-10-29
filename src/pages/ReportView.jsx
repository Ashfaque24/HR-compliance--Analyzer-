
// ReportView.jsx (admin side)
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import reportsData from "../data/reports.json";
import Summary_Repo from "../components/Summary_Repo";
import { Box, Button, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function ReportView() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Always ensure localStorage is initialized correctly
  let storedReports;
  try {
    storedReports = JSON.parse(localStorage.getItem("reportsData"));
    if (!Array.isArray(storedReports)) throw new Error();
  } catch {
    localStorage.setItem("reportsData", JSON.stringify(reportsData));
    storedReports = reportsData;
  }

  // Find by ID (force string comparison)
  const report = storedReports.find((r) => String(r.id) === String(id));

  if (!report)
    return (
      <div>
        <Box sx={{ p: 5 }}>
          <Typography color="error" variant="h6">Report not found</Typography>
        </Box>
      </div>
    );

  return (
    <Box sx={{ p: 4 }}>
      <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 3 }} startIcon={<ArrowBackIcon />}>
        Back to Reports
      </Button>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {report.company}
        </Typography>
        <Typography gutterBottom>
          <b>ID:</b> {report.id} | <b>Status:</b> {report.status} | <b>Submitted:</b> {report.submitted}
        </Typography>
        <Typography gutterBottom>
          <b>Contact:</b> {report.contact}
        </Typography>
      </Box>
      <Summary_Repo data={report.details} showFull={true} />
    </Box>
  );
}
