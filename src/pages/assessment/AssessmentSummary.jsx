

// AssessmentSummary.jsx
import React, { useRef } from "react";
import { useLocation } from "react-router-dom";
import Summary_Repo from "../../components/Summary_Repo";
import { Button, Box, Typography } from "@mui/material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function AssessmentSummary() {
  const location = useLocation();
  const report = location.state?.reportSummary;
  const userInfo = location.state?.userInfo;
  const reportRef = useRef();

  if (!report) {
    return (
      <Typography align="center" sx={{ mt: 4 }}>
        No report data found. Please complete the assessment first.
      </Typography>
    );
  }

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    const input = reportRef.current;
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF('portrait', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgProps = { width: canvas.width, height: canvas.height };
    const pdfWidth = pageWidth;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('assessment-report.pdf');
  };

  return (
    <Box sx={{ position: 'relative', maxWidth: 900, mx: "auto", mt: 4, px: 2, backgroundColor: '#fff', borderRadius: 2, boxShadow: 1 }}>
      <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
        <Button variant="contained" size="small" onClick={handleDownloadPDF}>
          Download Report
        </Button>
      </Box>

      <Box ref={reportRef} sx={{ pt: 4 }}>
        <Summary_Repo data={report.details} showFull={false} />
      </Box>
    </Box>
  );
}

