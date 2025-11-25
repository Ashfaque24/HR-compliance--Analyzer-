import React, { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Summary_Repo from "../../components/Summary_Repo";
import { Button, Box, Typography } from "@mui/material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import themeConfig from "../../components/themeConfig.json";

export default function AssessmentSummary() {
  const location = useLocation();
  const report = location.state?.reportSummary;
  const userInfo = location.state?.userInfo;

  const reportRef = useRef();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (!report) {
    return (
      <Typography align="center" sx={{ mt: 4 }}>
        No report data found. Please complete the assessment first.
      </Typography>
    );
  }

  // Determine which theme to apply - fallback to 'Default'
  const industry = report.industry || "Default";
  const themeToUse = themeConfig[industry] || themeConfig.Default;

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;

    // Save current viewport setting to restore it later
    const metaViewport = document.querySelector('meta[name=viewport]');
    const originalContent = metaViewport?.getAttribute('content') || "";

    // Temporarily fix viewport to desktop width for html2canvas rendering
    if (metaViewport) {
      metaViewport.setAttribute("content", "width=1200");
    }

    const input = reportRef.current;
    const canvas = await html2canvas(input, {
      scale: 2,
      windowWidth: 1200, // simulate desktop width
      useCORS: true,
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("portrait", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("assessment-report.pdf");

    // Restore original viewport for normal mobile behavior
    if (metaViewport) {
      metaViewport.setAttribute("content", originalContent);
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        maxWidth: 900,
        mx: "auto",
        mt: 4,
        px: 2,
        backgroundColor: "#fff",
        borderRadius: 2,
        boxShadow: 1,
      }}
    >
      <Box sx={{ position: "absolute", top: 16, right: 16, zIndex: 10 }}>
        <Button
          variant="contained"
          size="small"
          onClick={handleDownloadPDF}
          sx={{ background: "#18a16e" }}
        >
          Download Report
        </Button>
      </Box>

      <Box ref={reportRef} sx={{ pt: 4 }}>
        <Summary_Repo
          data={report.details}
          showFull={false}
          themeConfig={themeToUse}
        />
      </Box>
    </Box>
  );
}
