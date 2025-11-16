// // EditReportPage.jsx
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import LoadingSpinner from "../components/common/LoadingSpinner";
// import { fetchEditReport, clearEditReport, saveEditReport } from "../redux/features/editReportSlice";
// import {
//   Box, Paper, Typography, Stack, TextField, Button, MenuItem, Select, Grid, Chip, Divider, Accordion, AccordionSummary, AccordionDetails,
// } from "@mui/material";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// const graphTypes = ["None","Gauge Chart", "Star Chart", "Circular Chart"];
// const chipStyles = { fontWeight: 600, fontSize: 13, px: 1.2 };

// // Helper structure for recommended next steps
// const blankNextSteps = {
//   immediate: [],
//   shortTerm: [],
//   longTerm: [],
// };

// export default function EditReportPage() {
//   const { id: session_uuid } = useParams();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { report, loading, error, saving, saveError } = useSelector((state) => state.editReport);
//   const [form, setForm] = useState(null);

//   useEffect(() => {
//     if (session_uuid) {
//       dispatch(fetchEditReport(session_uuid));
//     }
//     return () => {
//       dispatch(clearEditReport());
//     };
//   }, [dispatch, session_uuid]);

//   useEffect(() => {
//     if (report) {
//       let updatedReport = JSON.parse(JSON.stringify(report));
//       // Ensure recommendedNextSteps is present in form
//       updatedReport.recommendedNextSteps = updatedReport.recommendedNextSteps || blankNextSteps;

//       if (updatedReport.details?.summary && updatedReport.details?.sectionRatings) {
//         updatedReport.details.summary = updatedReport.details.summary.map((section) => {
//           const ratingData = updatedReport.details.sectionRatings.find(
//             (rating) => rating.sectionName === section.name
//           );
//           return {
//             ...section,
//             graphType: ratingData?.graphType ?? section.graphType ?? "None",
//           };
//         });
//       }

//       setForm(updatedReport);
//     }
//   }, [report]);

//   if (loading) return <LoadingSpinner message="Loading report for editing..." />;
//   if (error) return <Box sx={{ p: 4, color: "red" }}>{error}</Box>;
//   if (!form && !loading && !error) return <Box sx={{ p: 4 }}>Report not found.</Box>;

//   const handleChange = (field) => (e) =>
//     setForm((prev) => ({ ...prev, [field]: e.target.value }));

//   const handleSectionChange = (idx, field) => (e) => {
//     const value = field === "score" ? Number(e.target.value) : e.target.value;
//     setForm((prev) => ({
//       ...prev,
//       details: {
//         ...prev.details,
//         summary: prev.details.summary.map((sec, i) =>
//           i === idx ? { ...sec, [field]: value } : sec
//         ),
//       },
//     }));
//   };

//   const handleSectionArrayChange = (idx, field) => (e) => {
//     const value = e.target.value.split("\n");
//     setForm((prev) => ({
//       ...prev,
//       details: {
//         ...prev.details,
//         summary: prev.details.summary.map((sec, i) =>
//           i === idx ? { ...sec, [field]: value } : sec
//         ),
//       },
//     }));
//   };

//   // New: handle changes for recommendedNextSteps fields
//   const handleNextStepChange = (type) => (e) => {
//     setForm((prev) => ({
//       ...prev,
//       recommendedNextSteps: {
//         ...prev.recommendedNextSteps,
//         [type]: e.target.value.split("\n"),
//       },
//     }));
//   };

//   const handleSave = async () => {
//     if (!form || !session_uuid) return;
//     try {
//       await dispatch(saveEditReport({ session_uuid, reportData: form })).unwrap();
//       navigate("/admin/report", { replace: true });
//     } catch (err) {
//       alert("❌ Save failed: " + err);
//     }
//   };

//   const handleBackToReports = () => {
//     navigate("/admin/report");
//   };

//   return (
//     <Box
//       sx={{
//         maxWidth: 1200,
//         mx: "auto",
//         py: { xs: 2, md: 4 },
//         px: { xs: 1, md: 0 },
//         width: "100%",
//         boxSizing: "border-box",
//       }}
//     >
//       <Box sx={{ mb: 2 }}>
//         <Button
//           variant="contained"
//           startIcon={<ArrowBackIcon />}
//           onClick={handleBackToReports}
//           sx={{ mb: 2, width: { xs: "100%", sm: "auto" }, whiteSpace: "nowrap", background: "#18a16e" }}
//         >
//           Back to Reports
//         </Button>
//       </Box>

//       <Paper elevation={6} sx={{ p: { xs: 2, md: 4 }, mb: 3, borderRadius: 3 }}>
//         <Typography variant="h4" fontWeight="bold" mb={1} color="primary.dark" sx={{ fontSize: { xs: "1.5rem", md: "2.125rem" } }}>
//           Edit HR Compliance Report
//         </Typography>
//         <Divider sx={{ my: 2 }} />
//         <Grid container spacing={3} mt={1}>
//           <Grid item xs={12} md={4}>
//             <TextField fullWidth label="Company" value={form.company} onChange={handleChange("company")} sx={{ mb: { xs: 2, md: 0 } }} />
//           </Grid>
//           <Grid item xs={12} md={4}>
//             <TextField fullWidth label="Contact" value={form.contact} onChange={handleChange("contact")} sx={{ mb: { xs: 2, md: 0 } }} />
//           </Grid>
//           <Grid item xs={12} md={2}>
//             <TextField fullWidth label="Date Submitted" value={form.submitted || ""} onChange={handleChange("submitted")} sx={{ mb: { xs: 2, md: 0 } }} />
//           </Grid>
//           <Grid item xs={6} md={1.5}>
//             <Select fullWidth value={form.status || ""} onChange={handleChange("status")} displayEmpty sx={{ mb: { xs: 2, md: 0 } }}>
//               <MenuItem value="Completed">Completed</MenuItem>
//               <MenuItem value="Enhanced">Enhanced</MenuItem>
//               <MenuItem value="In Review">In Review</MenuItem>
//               <MenuItem value="Pending">Pending</MenuItem>
//               <MenuItem value="In Progress">In Progress</MenuItem>
//             </Select>
//           </Grid>
//           <Grid item xs={6} md={0.5}>
//             <TextField fullWidth label="Score" type="number" value={form.score || 0} onChange={handleChange("score")} sx={{ mb: { xs: 2, md: 0 } }} />
//           </Grid>
//         </Grid>
//       </Paper>

//       <Box>
//         <Typography variant="h5" fontWeight={700} color="primary" sx={{ mb: 2, fontSize: { xs: "1.4rem", md: "1.8rem" } }}>
//           Section Details
//         </Typography>
//         {form?.details?.summary?.map((section, idx) => (
//           <Accordion key={section.name} defaultExpanded sx={{ mb: 2, boxShadow: 3, borderRadius: 2, overflow: "hidden" }}>
//             <AccordionSummary
//               expandIcon={<ExpandMoreIcon />}
//               sx={{
//                 bgcolor: "#f2f6ff",
//                 mb: 3,
//                 "& .MuiAccordionSummary-content": { alignItems: "center" },
//                 flexWrap: "wrap",
//                 gap: 1,
//               }}
//             >
//               <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
//                 <Typography sx={{ fontWeight: 600, fontSize: { xs: "1rem", sm: "1.1rem" } }}>{section.name}</Typography>
//                 <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }} justifyContent={{ xs: "center", sm: "flex-start" }}>
//                   <Chip label={`Score: ${section.score} / ${section.maxScore}`} color="primary" sx={chipStyles} />
//                   <Chip label={`Completion: ${section.completionRate}`} color="success" sx={chipStyles} />
//                   <Chip label={`Graph: ${section.graphType || "None"}`} color="warning" sx={chipStyles} />
//                 </Stack>
//               </Box>
//             </AccordionSummary>
//             <AccordionDetails sx={{ pt: 0 }}>
//               <Grid container spacing={3}>
//                 <Grid item xs={12} md={3}>
//                   <TextField
//                     fullWidth
//                     label={`Section Score (Max: ${section.maxScore})`}
//                     type="number"
//                     value={section.score}
//                     inputProps={{ min: 0, max: section.maxScore }}
//                     onChange={handleSectionChange(idx, "score")}
//                   />
//                   <Select
//                     fullWidth
//                     sx={{ mt: 2 }}
//                     value={section.graphType || ""}
//                     displayEmpty
//                     onChange={handleSectionChange(idx, "graphType")}
//                   >
//                     <MenuItem value="">Select graph type</MenuItem>
//                     {graphTypes.map((gt) => (
//                       <MenuItem key={gt} value={gt}>
//                         {gt}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </Grid>

//                 <Grid item xs={12} md={3}>
//                   <Typography fontWeight="bold" sx={{ mb: 1 }}>
//                     Strengths
//                   </Typography>
//                   <TextField
//                     multiline
//                     minRows={4}
//                     fullWidth
//                     placeholder="Enter strengths, one per line..."
//                     value={section.strengths ? section.strengths.join("\n") : ""}
//                     onChange={handleSectionArrayChange(idx, "strengths")}
//                   />
//                 </Grid>
//                 <Grid item xs={12} md={3}>
//                   <Typography fontWeight="bold" sx={{ mb: 1 }}>
//                     Gaps
//                   </Typography>
//                   <TextField
//                     multiline
//                     minRows={4}
//                     fullWidth
//                     placeholder="Describe gaps/weaknesses, one per line..."
//                     value={section.gaps ? section.gaps.join("\n") : ""}
//                     onChange={handleSectionArrayChange(idx, "gaps")}
//                   />
//                 </Grid>
//                 <Grid item xs={12} md={3}>
//                   <Typography fontWeight="bold" sx={{ mb: 1 }}>
//                     Actionable Recommendations
//                   </Typography>
//                   <TextField
//                     multiline
//                     minRows={4}
//                     fullWidth
//                     placeholder="Provide recommendations, one per line..."
//                     value={section.recommendations ? section.recommendations.join("\n") : ""}
//                     onChange={handleSectionArrayChange(idx, "recommendations")}
//                   />
//                 </Grid>
//               </Grid>
//             </AccordionDetails>
//           </Accordion>
//         ))}
//       </Box>

//       {/* NEW: Recommended Next Steps UI */}
//       <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 3, bgcolor: "#f8fcff" }}>
//         <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
//           Recommended Next Steps
//         </Typography>
//         <Grid container spacing={2}>
//           <Grid item xs={12} md={4}>
//             <Box sx={{borderRadius: 2, p: 2, minHeight: 175 }}>
//               <Typography fontWeight="bold" sx={{ mb: 1, color: "#b80e0e" }}>
//                 Immediate (0-30 days)
//               </Typography>
//               <TextField
//                 multiline
//                 minRows={4}
//                 fullWidth
//                 placeholder="List immediate actions, one per line"
//                 value={form.recommendedNextSteps?.immediate?.join('\n') || ''}
//                 onChange={handleNextStepChange("immediate")}
//               />
//             </Box>
//           </Grid>
//           <Grid item xs={12} md={4}>
//             <Box sx={{borderRadius: 2, p: 2, minHeight: 175 }}>
//               <Typography fontWeight="bold" sx={{ mb: 1, color: "#cc9700" }}>
//                 Short-term (1-3 months)
//               </Typography>
//               <TextField
//                 multiline
//                 minRows={4}
//                 fullWidth
//                 placeholder="List short-term actions, one per line"
//                 value={form.recommendedNextSteps?.shortTerm?.join('\n') || ''}
//                 onChange={handleNextStepChange("shortTerm")}
//               />
//             </Box>
//           </Grid>
//           <Grid item xs={12} md={4}>
//             <Box sx={{ borderRadius: 2, p: 2, minHeight: 175 }}>
//               <Typography fontWeight="bold" sx={{ mb: 1, color: "#229e83" }}>
//                 Long-term (3-6 months)
//               </Typography>
//               <TextField
//                 multiline
//                 minRows={4}
//                 fullWidth
//                 placeholder="List long-term actions, one per line"
//                 value={form.recommendedNextSteps?.longTerm?.join('\n') || ''}
//                 onChange={handleNextStepChange("longTerm")}
//               />
//             </Box>
//           </Grid>
//         </Grid>
//       </Paper>
//       {/* END: Recommended Next Steps UI */}

//       <Paper elevation={0} sx={{ mt: 3, p: 2, bgcolor: "#fafcff", borderRadius: 2 }}>
//         <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="flex-end">
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={handleSave}
//             disabled={saving}
//             sx={{ px: 4, fontWeight: 700, width: { xs: "100%", sm: "auto" }, background: "#4385f5" }}
//           >
//             {saving ? "Saving..." : "Save Changes"}
//           </Button>
//           <Button variant="contained" color="secondary" onClick={() => navigate(-1)} sx={{ px: 4, width: { xs: "100%", sm: "auto" }, background: "#4385f5" }}>
//             Cancel
//           </Button>
//         </Stack>
//         {saveError && (
//           <Typography color="error" sx={{ mt: 2 }}>
//             Save error: {saveError}
//           </Typography>
//         )}
//       </Paper>
//     </Box>
//   );
// }




// new edit page after creactin of cover pages uplodation 

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "../components/common/LoadingSpinner";
import {
  fetchEditReport,
  clearEditReport,
  saveEditReport,
} from "../redux/features/editReportSlice";
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
  Card,
  CardContent,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const graphTypes = ["None", "Gauge Chart", "Star Chart", "Circular Chart"];
const chipStyles = { fontWeight: 600, fontSize: 13, px: 1.2 };

const blankNextSteps = {
  immediate: [],
  shortTerm: [],
  longTerm: [],
};

export default function EditReportPage() {
  const { id: session_uuid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { report, loading, error, saving, saveError } = useSelector(
    (state) => state.editReport
  );

  const [form, setForm] = useState(null);
  const [frontImage, setFrontImage] = useState("");
  const [backImage, setBackImage] = useState("");

  // Lists of existing image URLs/base64 strings, to be fetched dynamically if needed
  const [existingFrontImages, setExistingFrontImages] = useState([]);
  const [existingBackImages, setExistingBackImages] = useState([]);

  useEffect(() => {
    if (session_uuid) {
      dispatch(fetchEditReport(session_uuid));
      // Example: fetch your existing images lists from backend here and set states
      // fetchExistingFrontImages(session_uuid).then(setExistingFrontImages);
      // fetchExistingBackImages(session_uuid).then(setExistingBackImages);
    }
    return () => {
      dispatch(clearEditReport());
    };
  }, [dispatch, session_uuid]);

  useEffect(() => {
    if (report) {
      let updatedReport = JSON.parse(JSON.stringify(report));
      updatedReport.recommendedNextSteps =
        updatedReport.recommendedNextSteps || blankNextSteps;

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

      setForm(updatedReport);
      setFrontImage(updatedReport.frontPageImage || "");
      setBackImage(updatedReport.backPageImage || "");

      // If existing images come as part of report, set here
      if (updatedReport.existingFrontImages) setExistingFrontImages(updatedReport.existingFrontImages);
      if (updatedReport.existingBackImages) setExistingBackImages(updatedReport.existingBackImages);
    }
  }, [report]);

  if (loading) return <LoadingSpinner message="Loading report for editing..." />;
  if (error) return <Box sx={{ p: 4, color: "red" }}>{error}</Box>;
  if (!form && !loading && !error) return <Box sx={{ p: 4 }}>Report not found.</Box>;

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

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

  const handleNextStepChange = (type) => (e) => {
    setForm((prev) => ({
      ...prev,
      recommendedNextSteps: {
        ...prev.recommendedNextSteps,
        [type]: e.target.value.split("\n"),
      },
    }));
  };

  const handleImageChange = (setter) => (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setter(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!form || !session_uuid) return;
    const updatedForm = {
      ...form,
      frontPageImage: frontImage || null,
      backPageImage: backImage || null,
    };
    try {
      await dispatch(saveEditReport({ session_uuid, reportData: updatedForm })).unwrap();
      navigate("/admin/report", { replace: true });
    } catch (err) {
      alert("❌ Save failed: " + err);
    }
  };

  const handleBackToReports = () => {
    navigate("/admin/report");
  };

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
          sx={{ mb: 2, width: { xs: "100%", sm: "auto" }, whiteSpace: "nowrap", background: "#18a16e" }}
        >
          Back to Reports
        </Button>
      </Box>

      {/* Basic report info inputs */}
      <Paper elevation={6} sx={{ p: { xs: 2, md: 4 }, mb: 3, borderRadius: 3 }}>
        <Typography variant="h4" fontWeight="bold" mb={1} color="primary.dark" sx={{ fontSize: { xs: "1.5rem", md: "2.125rem" } }}>
          Edit HR Compliance Report
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={3} mt={1}>
          <Grid item xs={12} md={4}>
            <TextField fullWidth label="Company" value={form.company} onChange={handleChange("company")} sx={{ mb: { xs: 2, md: 0 } }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField fullWidth label="Contact" value={form.contact} onChange={handleChange("contact")} sx={{ mb: { xs: 2, md: 0 } }} />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField fullWidth label="Date Submitted" value={form.submitted || ""} onChange={handleChange("submitted")} sx={{ mb: { xs: 2, md: 0 } }} />
          </Grid>
          <Grid item xs={6} md={1.5}>
            <Select fullWidth value={form.status || ""} onChange={handleChange("status")} displayEmpty sx={{ mb: { xs: 2, md: 0 } }}>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Enhanced">Enhanced</MenuItem>
              <MenuItem value="In Review">In Review</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={6} md={0.5}>
            <TextField fullWidth label="Score" type="number" value={form.score || 0} onChange={handleChange("score")} sx={{ mb: { xs: 2, md: 0 } }} />
          </Grid>
        </Grid>
      </Paper>

      {/* Cover Page Images Section */}
      <Card elevation={6} sx={{ mb: 3, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
            Cover Page Images
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, alignItems: "center" }}>
            <Box sx={{ flex: "1 1 200px", minWidth: 150 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="subtitle1" fontWeight="600">Front Page Image (A4 size)</Typography>
                <Select
                  size="small"
                  value={frontImage || ""}
                  onChange={e => setFrontImage(e.target.value || "")}
                  sx={{ minWidth: 150 }}
                  displayEmpty
                >
                  <MenuItem value="">Select existing or upload new</MenuItem>
                  {existingFrontImages.map((img, i) => (
                    <MenuItem key={i} value={img}>
                      {img.length > 40 ? img.substring(0, 37) + '...' : img}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
              {frontImage && <Box component="img" src={frontImage} alt="Front Page" sx={{ width: "100%", height: 140, borderRadius: 1, objectFit: "contain", mb: 1, border: "1px solid #ccc" }} />}
              <input type="file" accept="image/*" onChange={handleImageChange(setFrontImage)} style={{ width: "100%" }} />
            </Box>
            <Box sx={{ flex: "1 1 200px", minWidth: 150 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="subtitle1" fontWeight="600">Back Page Image (A4 size)</Typography>
                <Select
                  size="small"
                  value={backImage || ""}
                  onChange={e => setBackImage(e.target.value || "")}
                  sx={{ minWidth: 150 }}
                  displayEmpty
                >
                  <MenuItem value="">Select existing or upload new</MenuItem>
                  {existingBackImages.map((img, i) => (
                    <MenuItem key={i} value={img}>
                      {img.length > 40 ? img.substring(0, 37) + '...' : img}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
              {backImage && <Box component="img" src={backImage} alt="Back Page" sx={{ width: "100%", height: 140, borderRadius: 1, objectFit: "contain", mb: 1, border: "1px solid #ccc" }} />}
              <input type="file" accept="image/*" onChange={handleImageChange(setBackImage)} style={{ width: "100%" }} />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Section Details */}
      <Box>
        <Typography variant="h5" fontWeight={700} color="primary" sx={{ mb: 2, fontSize: { xs: "1.4rem", md: "1.8rem" } }}>
          Section Details
        </Typography>
        {form?.details?.summary?.map((section, idx) => (
          <Accordion key={section.name} defaultExpanded sx={{ mb: 2, boxShadow: 3, borderRadius: 2, overflow: "hidden" }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: "#f2f6ff", mb: 3, "& .MuiAccordionSummary-content": { alignItems: "center" }, flexWrap: "wrap", gap: 1 }}>
              <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                <Typography sx={{ fontWeight: 600, fontSize: { xs: "1rem", sm: "1.1rem" } }}>{section.name}</Typography>
                <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }} justifyContent={{ xs: "center", sm: "flex-start" }}>
                  <Chip label={`Score: ${section.score} / ${section.maxScore}`} color="primary" sx={chipStyles} />
                  <Chip label={`Completion: ${section.completionRate}`} color="success" sx={chipStyles} />
                  <Chip label={`Graph: ${section.graphType || "None"}`} color="warning" sx={chipStyles} />
                </Stack>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <TextField fullWidth label={`Section Score (Max: ${section.maxScore})`} type="number" value={section.score} inputProps={{ min: 0, max: section.maxScore }} onChange={handleSectionChange(idx, "score")} />
                  <Select fullWidth sx={{ mt: 2 }} value={section.graphType || ""} displayEmpty onChange={handleSectionChange(idx, "graphType")}>
                    <MenuItem value="">Select graph type</MenuItem>
                    {graphTypes.map((gt) => (
                      <MenuItem key={gt} value={gt}>{gt}</MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography fontWeight="bold" sx={{ mb: 1 }}>Strengths</Typography>
                  <TextField multiline minRows={4} fullWidth placeholder="Enter strengths, one per line..." value={section.strengths ? section.strengths.join("\n") : ""} onChange={handleSectionArrayChange(idx, "strengths")} />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography fontWeight="bold" sx={{ mb: 1 }}>Gaps</Typography>
                  <TextField multiline minRows={4} fullWidth placeholder="Describe gaps/weaknesses, one per line..." value={section.gaps ? section.gaps.join("\n") : ""} onChange={handleSectionArrayChange(idx, "gaps")} />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography fontWeight="bold" sx={{ mb: 1 }}>Actionable Recommendations</Typography>
                  <TextField multiline minRows={4} fullWidth placeholder="Provide recommendations, one per line..." value={section.recommendations ? section.recommendations.join("\n") : ""} onChange={handleSectionArrayChange(idx, "recommendations")} />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {/* Recommended Next Steps */}
      <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 3, bgcolor: "#f8fcff" }}>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>Recommended Next Steps</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Box sx={{ borderRadius: 2, p: 2, minHeight: 175 }}>
              <Typography fontWeight="bold" sx={{ mb: 1, color: "#b80e0e" }}>Immediate (0-30 days)</Typography>
              <TextField multiline minRows={4} fullWidth placeholder="List immediate actions, one per line" value={form.recommendedNextSteps?.immediate?.join("\n") || ""} onChange={handleNextStepChange("immediate")} />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ borderRadius: 2, p: 2, minHeight: 175 }}>
              <Typography fontWeight="bold" sx={{ mb: 1, color: "#cc9700" }}>Short-term (1-3 months)</Typography>
              <TextField multiline minRows={4} fullWidth placeholder="List short-term actions, one per line" value={form.recommendedNextSteps?.shortTerm?.join("\n") || ""} onChange={handleNextStepChange("shortTerm")} />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ borderRadius: 2, p: 2, minHeight: 175 }}>
              <Typography fontWeight="bold" sx={{ mb: 1, color: "#229e83" }}>Long-term (3-6 months)</Typography>
              <TextField multiline minRows={4} fullWidth placeholder="List long-term actions, one per line" value={form.recommendedNextSteps?.longTerm?.join("\n") || ""} onChange={handleNextStepChange("longTerm")} />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Save and Cancel Buttons */}
      <Paper elevation={0} sx={{ mt: 3, p: 2, bgcolor: "#fafcff", borderRadius: 2 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="flex-end">
          <Button variant="contained" color="primary" onClick={handleSave} disabled={saving} sx={{ px: 4, fontWeight: 700, width: { xs: "100%", sm: "auto" }, background: "#4385f5" }}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
          <Button variant="contained" color="secondary" onClick={() => navigate(-1)} sx={{ px: 4, width: { xs: "100%", sm: "auto" }, background: "#4385f5" }}>
            Cancel
          </Button>
        </Stack>
        {saveError && (
          <Typography color="error" sx={{ mt: 2 }}>
            Save error: {saveError}
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
