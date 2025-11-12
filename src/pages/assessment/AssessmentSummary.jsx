

// // AssessmentSummary.jsx

// Import React and needed hooks
import React, { useRef } from "react";
import { useLocation } from "react-router-dom"; // For accessing navigation state
import Summary_Repo from "../../components/Summary_Repo"; // Custom component to show report details
import { Button, Box, Typography } from "@mui/material";
import jsPDF from "jspdf";         // Library to generate PDF documents
import html2canvas from "html2canvas"; // Used to capture HTML content as a canvas image

export default function AssessmentSummary() {
  // React Router hook: retrieves data passed from AssessmentFlow via navigation
  const location = useLocation();
  const report = location.state?.reportSummary; // assessment result summary
  const userInfo = location.state?.userInfo;    // user data (if needed for customization)
  
  // useRef used to reference the content DOM node we want to convert into PDF
  const reportRef = useRef();

  // Safeguard: if no report exists (for example, user accessed the summary directly)
  if (!report) {
    return (
      <Typography align="center" sx={{ mt: 4 }}>
        No report data found. Please complete the assessment first.
      </Typography>
    );
  }

  // Function to handle PDF download using html2canvas + jsPDF
  const handleDownloadPDF = async () => {
    // Ensure ref is available
    if (!reportRef.current) return;

    const input = reportRef.current;

    // Convert the referenced HTML into a canvas image with fixed scaling for clarity
    const canvas = await html2canvas(input, { scale: 2 });

    // Generate an image from the canvas
    const imgData = canvas.toDataURL("image/png");

    // Create an instance of jsPDF in portrait A4 size
    const pdf = new jsPDF('portrait', 'mm', 'a4');

    // Retrieve page dimensions to scale the captured image correctly
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgProps = { width: canvas.width, height: canvas.height };

    // Maintain image aspect ratio while scaling to PDF page width
    const pdfWidth = pageWidth;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    // Add image to first page starting at (0, 0)
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

    // Trigger browser download of PDF
    pdf.save('assessment-report.pdf');
  };

  // Main render section for UI
  return (
    <Box
      sx={{
        position: 'relative',
        maxWidth: 900,
        mx: "auto",
        mt: 4,
        px: 2,
        backgroundColor: '#fff',
        borderRadius: 2,
        boxShadow: 1
      }}
    >
      {/* Floating Download button positioned on the top-right of the report */}
      <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
        <Button variant="contained" size="small" onClick={handleDownloadPDF}>
          Download Report
        </Button>
      </Box>

      {/* Actual report content that will be captured as PDF */}
      <Box ref={reportRef} sx={{ pt: 4 }}>
        {/* Summary_Repo component is responsible for rendering report details */}
        <Summary_Repo data={report.details} showFull={false} />
      </Box>
    </Box>
  );
}
