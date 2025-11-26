// React + Router + Redux imports
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "../components/common/LoadingSpinner";

// Redux actions for editing report
import {
  fetchEditReport,
  clearEditReport,
  saveEditReport,
} from "../redux/features/editReportSlice";

// MUI imports
import {
  Box,
  Paper,
  Typography,
  Stack,
  TextField,
  Button,
  MenuItem,
  Select,
  Grid,
  Chip,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";

// Cover image upload component
import CoverImageUploader from "../components/common/CoverImageUploader";

// Available graph options
const graphTypes = ["None", "Gauge Chart", "Star Chart", "Circular Chart"];

// Shared chip styling
const chipStyles = { fontWeight: 600, fontSize: 13, px: 1.2 };

export default function EditReportPage() {
  // Get session UUID from URL
  const { id: session_uuid } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get edit report data and statuses
  const { report, loading, error, saving, saveError } = useSelector(
    (state) => state.editReport
  );

  // Entire form state
  const [form, setForm] = useState(null);

  // Modal control for cover images
  const [coverModalOpen, setCoverModalOpen] = useState(false);

  // Local states to store selected images
  const [frontImage, setFrontImage] = useState("");
  const [backImage, setBackImage] = useState("");

  // Fetch report on mount, clear on unmount
  useEffect(() => {
    if (session_uuid) {
      dispatch(fetchEditReport(session_uuid));
    }
    return () => {
      dispatch(clearEditReport());
    };
  }, [dispatch, session_uuid]);

  // Populate form when report is fetched
  useEffect(() => {
    if (report) {
      // Deep clone the report to avoid mutation
      let updatedReport = JSON.parse(JSON.stringify(report));

      // Normalize recommended next steps (backend sends different naming sometimes)
      const backendSteps =
        updatedReport.details?.recommendedNextSteps ||
        updatedReport.recommendedNextSteps ||
        {};

      updatedReport.recommendedNextSteps = {
        immediate: backendSteps.immediate || [],
        shortTerm: backendSteps.shortTerm || backendSteps.short_term || [],
        longTerm: backendSteps.longTerm || backendSteps.long_term || [],
      };

      // Fix graph types in each section
      if (
        updatedReport.details?.summary &&
        updatedReport.details?.sectionRatings
      ) {
        updatedReport.details.summary = updatedReport.details.summary.map(
          (section) => {
            const ratingData = updatedReport.details.sectionRatings.find(
              (rating) => rating.sectionName === section.name
            );
            return {
              ...section,
              graphType: ratingData?.graphType ?? section.graphType ?? "None",
            };
          }
        );
      }

      // FIX: Extract cover images from details object
      const frontPageImg = updatedReport.details?.frontPageImage || "";
      const backPageImg = updatedReport.details?.backPageImage || "";

      // Ensure both images exist at top level for saving
      updatedReport.frontPageImage = frontPageImg;
      updatedReport.backPageImage = backPageImg;

      // Update form state
      setForm(updatedReport);

      // FIX: Set local image states from the fetched report
      setFrontImage(frontPageImg);
      setBackImage(backPageImg);
    }
  }, [report]);

  // Render states
  if (loading)
    return <LoadingSpinner message="Loading report for editing..." />;
  if (error) return <Box sx={{ p: 4, color: "red" }}>{error}</Box>;
  if (!form && !loading && !error) return <Box sx={{ p: 4 }}>Loading...</Box>;

  // update top-level form fields
  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  // update score / graphType for a specific section
  const handleSectionChange = (idx, field) => (e) => {
    const value = field === "score" ? Number(e.target.value) : e.target.value;
    setForm((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        summary: prev.details.summary.map((sec, i) =>
          i === idx ? { ...sec, [field]: value } : sec
        ),
      },
    }));
  };

  // update strengths / gaps / recommendations (arrays)
  const handleSectionArrayChange = (idx, field) => (e) => {
    const value = e.target.value.split("\n");
    setForm((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        summary: prev.details.summary.map((sec, i) =>
          i === idx ? { ...sec, [field]: value } : sec
        ),
      },
    }));
  };

  // handle next steps
  const handleNextStepChange = (type) => (e) => {
    setForm((prev) => ({
      ...prev,
      recommendedNextSteps: {
        ...prev.recommendedNextSteps,
        [type]: e.target.value.split("\n"),
      },
    }));
  };

  // Save action (send updated report + images)
  const handleSave = async () => {
    if (!form || !session_uuid) return;

    try {
      const updatedForm = {
        ...form,
        frontPageImage: frontImage || null,
        backPageImage: backImage || null,
      };

      await dispatch(
        saveEditReport({ session_uuid, reportData: updatedForm })
      ).unwrap();

      // Redirect after save
      navigate("/admin/report", { replace: true });
    } catch (err) {
      alert("❌ Save failed: " + err);
    }
  };

  // Navigate back
  const handleBackToReports = () => {
    navigate("/admin/report");
  };

  // Checking if both images are selected
  const coverPagesUploaded = Boolean(frontImage && backImage);

  // Main return component UI
  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        py: { xs: 2, md: 4 },
        px: { xs: 1, md: 0 },
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Back button */}
      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={handleBackToReports}
          sx={{
            mb: 2,
            width: { xs: "100%", sm: "auto" },
            whiteSpace: "nowrap",
            background: "#18a16e",
          }}
        >
          Back to Reports
        </Button>
      </Box>

      {/* Top form section */}
      <Paper elevation={6} sx={{ p: { xs: 2, md: 4 }, mb: 3, borderRadius: 3 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          mb={1}
          color="primary.dark"
          sx={{ fontSize: { xs: "1.5rem", md: "2.125rem" } }}
        >
          Edit HR Compliance Report
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Grid container spacing={3} mt={1}>
          {/* Input fields */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Company"
              value={form.company}
              onChange={handleChange("company")}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Contact"
              value={form.contact}
              onChange={handleChange("contact")}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="Date Submitted"
              value={form.submitted || ""}
              onChange={handleChange("submitted")}
            />
          </Grid>

          <Grid item xs={6} md={1.5}>
            <Select
              fullWidth
              value={form.status || ""}
              onChange={handleChange("status")}
              displayEmpty
            >
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Enhanced">Enhanced</MenuItem>
              <MenuItem value="In Review">In Review</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
            </Select>
          </Grid>

          <Grid item xs={6} md={0.5}>
            <TextField
              fullWidth
              label="Score"
              type="number"
              value={form.score || 0}
              onChange={handleChange("score")}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Cover Page Image Modal Button */}
      <Box sx={{ mb: 3, display: "flex", justifyContent: "center" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setCoverModalOpen(true)}
          sx={{ fontWeight: 700, background: "#18a16e" }}
        >
          Edit Cover Page Images {coverPagesUploaded && "✓"}
        </Button>
      </Box>

      {/* Cover Image Modal */}
      <Dialog open={coverModalOpen} onClose={() => setCoverModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Edit Cover Page Images
          <IconButton
            aria-label="close"
            onClick={() => setCoverModalOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {/* Image upload component */}
          <CoverImageUploader
            session_uuid={session_uuid}
            frontImage={frontImage}
            backImage={backImage}
            setFrontImage={setFrontImage}
            setBackImage={setBackImage}
            onDone={() => setCoverModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* SECTION ACCORDIONS */}
      <Box>
        {form?.details?.summary?.map((section, idx) => (
          <Accordion key={section.name} defaultExpanded sx={{ mb: 2, boxShadow: 3, borderRadius: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: "#f2f6ff", mb: 3 }}>
              {/* Section Header */}
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                }}
              >
                <Typography sx={{ fontWeight: 600 }}>{section.name}</Typography>

                {/* Section chips */}
                <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                  <Chip label={`Score: ${section.score} / ${section.maxScore}`} color="primary" sx={chipStyles} />
                  <Chip label={`Completion: ${section.completionRate}`} color="success" sx={chipStyles} />
                  <Chip label={`Graph: ${section.graphType || "None"}`} color="warning" sx={chipStyles} />
                </Stack>
              </Box>
            </AccordionSummary>

            <AccordionDetails sx={{ pt: 0 }}>
              <Grid container spacing={3}>
                {/* Score + Graph type */}
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    type="number"
                    label={`Section Score (Max: ${section.maxScore})`}
                    value={section.score}
                    inputProps={{ min: 0, max: section.maxScore }}
                    onChange={handleSectionChange(idx, "score")}
                  />

                  <Select
                    fullWidth
                    sx={{ mt: 2 }}
                    value={section.graphType || ""}
                    onChange={handleSectionChange(idx, "graphType")}
                    displayEmpty
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
                    value={section.strengths?.join("\n") || ""}
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
                    value={section.gaps?.join("\n") || ""}
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
                    value={section.recommendations?.join("\n") || ""}
                    onChange={handleSectionArrayChange(idx, "recommendations")}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {/* NEXT STEPS SECTION */}
      <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 3, bgcolor: "#f8fcff" }}>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
          Recommended Next Steps
        </Typography>

        <Grid container spacing={2}>
          {/* Immediate */}
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 2 }}>
              <Typography fontWeight="bold" sx={{ mb: 1, color: "#b80e0e" }}>
                Immediate (0-30 days)
              </Typography>
              <TextField
                multiline
                minRows={4}
                fullWidth
                value={form.recommendedNextSteps?.immediate?.join("\n") || ""}
                onChange={handleNextStepChange("immediate")}
              />
            </Box>
          </Grid>

          {/* Short-term */}
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 2 }}>
              <Typography fontWeight="bold" sx={{ mb: 1, color: "#cc9700" }}>
                Short-term (1-3 months)
              </Typography>
              <TextField
                multiline
                minRows={4}
                fullWidth
                value={form.recommendedNextSteps?.shortTerm?.join("\n") || ""}
                onChange={handleNextStepChange("shortTerm")}
              />
            </Box>
          </Grid>

          {/* Long-term */}
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 2 }}>
              <Typography fontWeight="bold" sx={{ mb: 1, color: "#229e83" }}>
                Long-term (3-6 months)
              </Typography>
              <TextField
                multiline
                minRows={4}
                fullWidth
                value={form.recommendedNextSteps?.longTerm?.join("\n") || ""}
                onChange={handleNextStepChange("longTerm")}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* SAVE + CANCEL BUTTONS */}
      <Paper elevation={0} sx={{ mt: 3, p: 2, bgcolor: "#fafcff", borderRadius: 2 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="flex-end">
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving}
            sx={{
              px: 4,
              fontWeight: 700,
              width: { xs: "100%", sm: "auto" },
              background: "#18a16e",
            }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>

          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate(-1)}
            sx={{ px: 4, width: { xs: "100%", sm: "auto" }, background: "#18a16e" }}
          >
            Cancel
          </Button>
        </Stack>

        {/* Save error message */}
        {saveError && (
          <Typography color="error" sx={{ mt: 2 }}>
            Save error: {saveError}
          </Typography>
        )}
      </Paper>
    </Box>
  );
}