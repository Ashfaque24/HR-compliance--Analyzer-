import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminReport, clearReport } from "../redux/features/adminReportSlice";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Summary_Repo from "../components/Summary_Repo";
import ReportPdfGenerator from "../components/common/ReportPdfGenerator";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Divider,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress, // Added for loader inside button
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import themeConfig from "../components/themeConfig.json";

export default function ReportView() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const contentRef = useRef();

  const dropdownOptions = Object.keys(themeConfig);
  const [selectedDomain, setSelectedDomain] = useState("Default");

  const { report, loading, error } = useSelector((state) => state.adminReport);

  const [generatePdfFunc, setGeneratePdfFunc] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false); // Loader only in the button

  useEffect(() => {
    if (id) dispatch(fetchAdminReport(id));
    return () => dispatch(clearReport());
  }, [id, dispatch]);

  // Show loading spinner while fetching report (full page)
  if (loading)
    return <LoadingSpinner message="Loading report..." />;

  // Show error if report fetch failed
  if (error)
    return (
      <Box sx={{ p: 5 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );

  // Show error if report not found
  if (!report)
    return (
      <Box sx={{ p: 5 }}>
        <Typography color="error">Report not found</Typography>
      </Box>
    );

  const details = report.details || {};
  const currentThemeConfig = themeConfig[selectedDomain] || themeConfig["Default"];
  const submittedDate = report.submitted || "N/A";
  const contactInfo = report.contact || "N/A";

  const frontCoverPresent = !!details.frontPageImage;
  const backCoverPresent = !!details.backPageImage;

  // Download PDF button click handler
  const onDownloadClick = () => {
    if (generatePdfFunc) {
      setPdfLoading(true);
      generatePdfFunc();
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, maxWidth: 1200, mx: "auto", width: "100%" }}>
      {/* Toolbar */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          flexWrap: "wrap",
          gap: 2,
          justifyContent: { xs: "center", sm: "space-between" },
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            width: { xs: "100%", sm: "auto" },
          }}
        >
          <Button
            variant="contained"
            onClick={() => navigate(-1)}
            startIcon={<ArrowBackIcon />}
            sx={{ width: { xs: "100%", sm: "auto" }, background: "#18a16e" }}
          >
            Back to Reports
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={onDownloadClick}
            disabled={pdfLoading} // Disable while generating PDF
            sx={{
              width: { xs: "100%", sm: "auto" },
              background: "#18a16e",
              position: "relative",
            }}
          >
            {pdfLoading ? (
              <>
                Generating...
                <CircularProgress
                  size={18}
                  color="inherit"
                  sx={{ ml: 1 }}
                />
              </>
            ) : (
              "Download PDF"
            )}
          </Button>
        </Box>

        <FormControl sx={{ minWidth: { xs: "100%", sm: 200 }, width: { xs: "100%", sm: 200 } }}>
          <InputLabel id="domain-select-label">Themes</InputLabel>
          <Select
            labelId="domain-select-label"
            value={selectedDomain}
            label="Themes"
            onChange={(e) => setSelectedDomain(e.target.value)}
            size="small"
          >
            {dropdownOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Cover Status Chips */}
      <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 3 }}>
        {frontCoverPresent && (
          <Chip
            label="Front Cover Added"
            color="success"
            variant="outlined"
            size="small"
            icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
          />
        )}
        {backCoverPresent && (
          <Chip
            label="Back Cover Added"
            color="success"
            variant="outlined"
            size="small"
            icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
          />
        )}
        {!frontCoverPresent && !backCoverPresent && (
          <Chip label="No Cover Pages Added" color="warning" variant="outlined" size="small" />
        )}
      </Stack>

      {/* Main Report Content */}
      <Box
        ref={contentRef}
        sx={{
          width: "100%",
          p: 2,
          boxSizing: "border-box",
        }}
      >
        <Card elevation={4} sx={{ p: 3, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {report.company}
            </Typography>

            <Divider sx={{ my: 1 }} />

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={3}
              alignItems={{ xs: "flex-start", sm: "center" }}
              sx={{ mb: 1 }}
            >
              <Typography>
                <b>ID:</b> {report.id}
              </Typography>
              <Typography>
                <b>Status:</b> {report.status}
              </Typography>
              <Typography>
                <b>Submitted:</b> {submittedDate}
              </Typography>
            </Stack>

            <Typography sx={{ mb: 1 }}>
              <b>Contact:</b> {contactInfo}
            </Typography>
          </CardContent>
        </Card>

        <Summary_Repo data={details} showFull themeConfig={currentThemeConfig} />
      </Box>

      {/* PDF Generator */}
      <ReportPdfGenerator
  report={report}
  details={details}
  contentRef={contentRef}
  onGeneratePdf={(h) => setGeneratePdfFunc(() => h)}
  onPdfDone={() => setPdfLoading(false)}
/>

    </Box>
  );
}
