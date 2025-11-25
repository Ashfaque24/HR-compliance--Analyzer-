import React, { useRef, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Summary_Repo from "../../components/Summary_Repo";
import { Button, Box, Typography } from "@mui/material";
import LoadingSpinner from "../../components/common/LoadingSpinner"; 
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import themeConfig from "../../components/themeConfig.json";

export default function AssessmentSummary() {
  const location = useLocation();
  const report = location.state?.reportSummary;
  const userInfo = location.state?.userInfo;

  const reportRef = useRef();

  const [isDownloading, setIsDownloading] = useState(false); // Loading state for PDF download

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

  // Determine theme based on industry or use default
  const industry = report.industry || "Default";
  const themeToUse = themeConfig[industry] || themeConfig.Default;

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;

    setIsDownloading(true);

    try {
      // Save current viewport content to restore later
      const metaViewport = document.querySelector("meta[name=viewport]");
      const originalContent = metaViewport?.getAttribute("content") || "";

      // Force viewport width to desktop size for consistent rendering
      if (metaViewport) {
        metaViewport.setAttribute("content", "width=1200");
      }

      const input = reportRef.current;
      const canvas = await html2canvas(input, {
        scale: 2,
        windowWidth: 1200, // simulate desktop width for canvas
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("portrait", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("assessment-report.pdf");

      // Restore original viewport setting after PDF generation
      if (metaViewport) {
        metaViewport.setAttribute("content", originalContent);
      }
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      setIsDownloading(false);
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
      {/* Download button with loading spinner */}
      <Box sx={{ position: "absolute", top: 16, right: 16, zIndex: 10 }}>
        <Button
          variant="contained"
          size="small"
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          sx={{ background: "#18a16e", minWidth: 160 }}
          aria-label="Download report as PDF"
        >
          {isDownloading ? <LoadingSpinner size={24} /> : "Download Report"}
        </Button>
      </Box>

      {/* Report summary displayed inside a reference div for capture */}
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
