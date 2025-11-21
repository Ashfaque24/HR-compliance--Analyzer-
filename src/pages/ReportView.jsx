// import React, { useEffect, useRef, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchAdminReport, clearReport } from "../redux/features/adminReportSlice";
// import LoadingSpinner from "../components/common/LoadingSpinner";
// import Summary_Repo from "../components/Summary_Repo";
// import {
//   Box,
//   Button,
//   Typography,
//   Card,
//   CardContent,
//   Divider,
//   Stack,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
// } from "@mui/material";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import themeConfig from "../components/themeConfig.json";

// import { getImageUrl } from "../utils/imageHelper";

// export default function ReportView() {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const reportRef = useRef();
//   // We will now point these refs to the HIDDEN, full-size elements.
//   const frontImageRef = useRef();
//   const backImageRef = useRef();

//   const dropdownOptions = Object.keys(themeConfig);
//   const [selectedDomain, setSelectedDomain] = useState("Default");

//   const { report, loading, error } = useSelector((state) => state.adminReport);

//   useEffect(() => {
//     if (id) dispatch(fetchAdminReport(id));
//     return () => dispatch(clearReport());
//   }, [id, dispatch]);

//   if (loading)
//     return <LoadingSpinner message="Loading report..." />;
//   if (error)
//     return (
//       <Box sx={{ p: 5 }}>
//         <Typography color="error">{error}</Typography>
//       </Box>
//     );
//   if (!report)
//     return (
//       <Box sx={{ p: 5 }}>
//         <Typography color="error">Report not found</Typography>
//       </Box>
//     );

//   const details = report.details || {};

//   const currentThemeConfig = themeConfig[selectedDomain] || themeConfig["Default"];

//   const handleDownloadPdf = async () => {
//     // Use presence of relative URLs for existence checks
//     const frontExists = !!details.frontPageImage && !!frontImageRef.current;
//     const backExists = !!details.backPageImage && !!backImageRef.current;

//     if (!frontExists && !backExists) {
//       const proceed = window.confirm(
//         "No cover pages found. Do you want to download the report without cover pages?"
//       );
//       if (!proceed) return;
//     }

//     const pdf = new jsPDF({
//       orientation: "portrait",
//       unit: "pt",
//       format: "a4",
//     });

//     const margin = 56; // 20mm margin (approx)
//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pdfHeight = pdf.internal.pageSize.getHeight();
//     const contentWidth = pdfWidth - margin * 2;
//     const contentHeight = pdfHeight - margin * 2;

//     const captureElement = async (element) => {
//       if (!element) return null;
//       // Scale is set high (3) for better resolution capture
//       return await html2canvas(element, {
//         scale: 3, 
//         useCORS: true,
//         scrollX: 0,
//         scrollY: -window.scrollY,
//         backgroundColor: "#ffffff",
//       });
//     };

//     try {
//       // Front cover
//       if (frontExists) {
//         const frontCanvas = await captureElement(frontImageRef.current);
//         pdf.addImage(
//           frontCanvas.toDataURL("image/png"),
//           "PNG",
//           margin,
//           margin,
//           contentWidth,
//           contentHeight
//         );
//       }

//       // Report content
//       if (reportRef.current) {
//         if (frontExists) pdf.addPage();

//         const reportCanvas = await captureElement(reportRef.current);
//         let totalHeight = reportCanvas.height;
//         const pageHeightPx = (contentHeight * reportCanvas.width) / contentWidth;
//         let renderedHeight = 0;

//         while (renderedHeight < totalHeight) {
//           const canvasPage = document.createElement("canvas");
//           canvasPage.width = reportCanvas.width;
//           canvasPage.height = Math.min(pageHeightPx, totalHeight - renderedHeight);
//           const ctx = canvasPage.getContext("2d");
//           ctx.drawImage(
//             reportCanvas,
//             0,
//             renderedHeight,
//             reportCanvas.width,
//             canvasPage.height,
//             0,
//             0,
//             reportCanvas.width,
//             canvasPage.height
//           );

//           const imgData = canvasPage.toDataURL("image/png");
//           if (renderedHeight > 0) pdf.addPage();
//           const scaleFactor = contentWidth / canvasPage.width;
//           pdf.addImage(
//             imgData,
//             "PNG",
//             margin,
//             margin,
//             contentWidth,
//             canvasPage.height * scaleFactor
//           );

//           renderedHeight += canvasPage.height;
//         }
//       }

//       // Back cover
//       if (backExists) {
//         pdf.addPage();
//         const backCanvas = await captureElement(backImageRef.current);
//         pdf.addImage(
//           backCanvas.toDataURL("image/png"),
//           "PNG",
//           margin,
//           margin,
//           contentWidth,
//           contentHeight
//         );
//       }

//       pdf.save(`report_${report.id}.pdf`);
//     } catch (error) {
//       console.error("Error generating PDF:", error);
//       alert("Failed to generate PDF");
//     }
//   };

//   const submittedDate = report.submitted || "N/A";
//   const contactInfo = report.contact || "N/A";

//   return (
//     <Box sx={{ p: { xs: 2, sm: 4 }, maxWidth: 1200, mx: "auto", width: "100%" }}>
//       {/* Top Buttons and Dropdown */}
//       <Box
//         sx={{
//           mb: 3,
//           display: "flex",
//           flexDirection: { xs: "column", sm: "row" },
//           flexWrap: "wrap",
//           gap: 2,
//           justifyContent: { xs: "center", sm: "space-between" },
//           alignItems: "center",
//         }}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: { xs: "column", sm: "row" },
//             gap: 2,
//             width: { xs: "100%", sm: "auto" },
//           }}
//         >
//           <Button
//             variant="contained"
//             onClick={() => navigate(-1)}
//             startIcon={<ArrowBackIcon />}
//             sx={{ width: { xs: "100%", sm: "auto" }, background: "#18a16e" }}
//           >
//             Back to Reports
//           </Button>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={handleDownloadPdf}
//             sx={{ width: { xs: "100%", sm: "auto" }, background: "#18a16e" }}
//           >
//             Download PDF
//           </Button>
//         </Box>
//         <FormControl sx={{ minWidth: { xs: "100%", sm: 200 }, width: { xs: "100%", sm: 200 } }}>
//           <InputLabel id="domain-select-label">Themes</InputLabel>
//           <Select
//             labelId="domain-select-label"
//             value={selectedDomain}
//             label="Themes"
//             onChange={(e) => setSelectedDomain(e.target.value)}
//             size="small"
//           >
//             {dropdownOptions.map((option) => (
//               <MenuItem key={option} value={option}>
//                 {option}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//       </Box>

//       {/* --- VISIBLE THUMBNAIL (Front Cover) --- */}
//       <Box sx={{ mb: 2, width: "100%", textAlign: "center" }}>
//         {details.frontPageImage && (
//           <>
//             <img
//               src={getImageUrl(details.frontPageImage)}
//               alt="Front Cover Thumbnail"
//               style={{ 
//                 maxWidth: 150, // Display as small thumbnail
//                 maxHeight: 200, // Display as small thumbnail
//                 objectFit: "contain",
//                 cursor: 'pointer',
//                 boxShadow: '0 4px 8px rgba(0,0,0,0.1)' 
//               }}
//             />
//             <Typography variant="caption" display="block" sx={{ mt: 1 }}>
//               Front Cover (Thumbnail)
//             </Typography>
//           </>
//         )}
//       </Box>

//       {/* --- HIDDEN FULL-SIZE ELEMENT FOR PDF CAPTURE (Front Cover) --- */}
//       <Box 
//         ref={frontImageRef} 
//         sx={{
//           position: 'fixed',
//           top: -9999,      // Hide off-screen
//           left: -9999,
//           width: '794px',   // A4 width approximation (96 DPI)
//           height: '1123px', // A4 height approximation (96 DPI)
//           overflow: 'hidden',
//           zIndex: -1, // Ensure it doesn't interfere with interaction
//         }}
//       >
//         {details.frontPageImage && (
//           <img
//             src={getImageUrl(details.frontPageImage)}
//             alt="Front Cover Full Resolution"
//             // The image fills the hidden A4-sized box
//             style={{ 
//               width: '100%', 
//               height: '100%', 
//               objectFit: 'contain'
//             }}
//             crossOrigin="anonymous" // Important for html2canvas with external images
//           />
//         )}
//       </Box>
//       {/* --- END HIDDEN FRONT COVER --- */}


//       {/* Main Report Content */}
//       <Box ref={reportRef} sx={{ width: "100%" }}>
//         <Card
//           elevation={4}
//           sx={{
//             mb: 4,
//             p: { xs: 2, sm: 3 },
//             borderRadius: 3,
//             width: "100%",
//             boxSizing: "border-box",
//           }}
//         >
//           <CardContent>
//             <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: "1.5rem", sm: "2.125rem" } }}>
//               {report.company}
//             </Typography>
//             <Divider sx={{ my: 1 }} />
//             <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems={{ xs: "flex-start", sm: "center" }} sx={{ mb: 1 }}>
//               <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
//                 <b>ID:</b> {report.id}
//               </Typography>
//               <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
//                 <b>Status:</b> {report.status}
//               </Typography>
//               <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
//                 <b>Submitted:</b> {submittedDate}
//               </Typography>
//             </Stack>
//             <Typography sx={{ mb: 1, fontSize: { xs: "0.9rem", sm: "1rem" } }}>
//               <b>Contact:</b> {contactInfo}
//             </Typography>
//           </CardContent>
//         </Card>
//         <Summary_Repo data={details} showFull themeConfig={currentThemeConfig} />
//       </Box>

//       {/* --- VISIBLE THUMBNAIL (Back Cover) --- */}
//       <Box sx={{ mt: 2, width: "100%", textAlign: "center" }}>
//         {details.backPageImage && (
//           <>
//             <img
//               src={getImageUrl(details.backPageImage)}
//               alt="Back Cover Thumbnail"
//               style={{ 
//                 maxWidth: 150, // Display as small thumbnail
//                 maxHeight: 200, // Display as small thumbnail
//                 objectFit: "contain",
//                 cursor: 'pointer',
//                 boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
//               }}
//             />
//             <Typography variant="caption" display="block" sx={{ mt: 1 }}>
//               Back Cover (Thumbnail)
//             </Typography>
//           </>
//         )}
//       </Box>

//       {/* --- HIDDEN FULL-SIZE ELEMENT FOR PDF CAPTURE (Back Cover) --- */}
//       <Box 
//         ref={backImageRef} 
//         sx={{
//           position: 'fixed',
//           top: -9999,      // Hide off-screen
//           left: -9999,
//           width: '794px',   // A4 width approximation (96 DPI)
//           height: '1123px', // A4 height approximation (96 DPI)
//           overflow: 'hidden',
//           zIndex: -1, 
//         }}
//       >
//         {details.backPageImage && (
//           <img
//             src={getImageUrl(details.backPageImage)}
//             alt="Back Cover Full Resolution"
//             // The image fills the hidden A4-sized box
//             style={{ 
//               width: '100%', 
//               height: '100%', 
//               objectFit: 'contain'
//             }}
//             crossOrigin="anonymous" // Important for html2canvas with external images
//           />
//         )}
//       </Box>
//       {/* --- END HIDDEN BACK COVER --- */}
//     </Box>
//   );
// }












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

  // Store the PDF generate function received from child
  const [generatePdfFunc, setGeneratePdfFunc] = useState(null);

  useEffect(() => {
    if (id) dispatch(fetchAdminReport(id));
    return () => dispatch(clearReport());
  }, [id, dispatch]);

  if (loading)
    return <LoadingSpinner message="Loading report..." />;
  if (error)
    return (
      <Box sx={{ p: 5 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
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

  // When download button clicked, trigger the generatePdfFunc if available
  const onDownloadClick = () => {
    if (generatePdfFunc) generatePdfFunc();
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
            sx={{ width: { xs: "100%", sm: "auto" }, background: "#18a16e" }}
          >
            Download PDF
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
          <Chip label="Front Cover Added" color="success" variant="outlined" size="small" icon={<CheckCircleIcon sx={{ fontSize: 16 }} />} />
        )}
        {backCoverPresent && (
          <Chip label="Back Cover Added" color="success" variant="outlined" size="small" icon={<CheckCircleIcon sx={{ fontSize: 16 }} />} />
        )}
        {!frontCoverPresent && !backCoverPresent && (
          <Chip label="No Cover Pages Added" color="warning" variant="outlined" size="small" />
        )}
      </Stack>

      {/* Main Report Content */}
      <Box ref={contentRef} sx={{ width: "100%" }}>
        <Card
          elevation={4}
          sx={{
            mb: 4,
            p: { xs: 2, sm: 3 },
            borderRadius: 3,
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <CardContent>
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: "1.5rem", sm: "2.125rem" } }}>
              {report.company}
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems={{ xs: "flex-start", sm: "center" }} sx={{ mb: 1 }}>
              <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                <b>ID:</b> {report.id}
              </Typography>
              <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                <b>Status:</b> {report.status}
              </Typography>
              <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                <b>Submitted:</b> {submittedDate}
              </Typography>
            </Stack>
            <Typography sx={{ mb: 1, fontSize: { xs: "0.9rem", sm: "1rem" } }}>
              <b>Contact:</b> {contactInfo}
            </Typography>
          </CardContent>
        </Card>

        <Summary_Repo data={details} showFull themeConfig={currentThemeConfig} />
      </Box>

      {/* PDF Generator Section */}
      <ReportPdfGenerator
        report={report}
        details={details}
        contentRef={contentRef}
        onGeneratePdf={(handler) => setGeneratePdfFunc(() => handler)}
      />
    </Box>
  );
}
