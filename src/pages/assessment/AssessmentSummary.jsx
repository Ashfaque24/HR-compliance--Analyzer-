

import React, { useRef } from "react";
import Summary_Repo from "../../components/Summary_Repo";
import reportsData from "../../data/reports.json"; 
import { Button, Box } from "@mui/material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function AssessmentSummary() {
  let storedReports = JSON.parse(localStorage.getItem("reportsData"));
  if (!storedReports) {
    localStorage.setItem("reportsData", JSON.stringify(reportsData));
    storedReports = reportsData;
  }

  const currentReport = storedReports[0];
  const reportRef = useRef();

  const handleDownloadPDF = async () => {
    const input = reportRef.current;
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF('portrait', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Calculate image dimensions to fit A4 width
    const imgProps = {
      width: canvas.width,
      height: canvas.height,
    };
    const pdfWidth = pageWidth;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('assessment-report.pdf');
  };

  return (
    <Box sx={{ position: 'relative', maxWidth: 900, mx: "auto", mt: 4, px: 2, backgroundColor: '#fff', borderRadius: 2, boxShadow: 1 }}>
      {/* Download button positioned top-right */}
      <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
        <Button
          variant="contained"
          size="small"
          onClick={handleDownloadPDF}
        >
          Download Report
        </Button>
      </Box>

      {/* Report content */}
      <Box ref={reportRef} sx={{ pt: 4 }}>
        <Summary_Repo data={currentReport.details} showFull={false} />
      </Box>
    </Box>
  );
}
