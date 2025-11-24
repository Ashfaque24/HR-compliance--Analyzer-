// ReportPdfGenerator.jsx
import React, { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { getImageUrl } from "../../utils/imageHelper";
import generatePDF from "react-to-pdf";

// A4 dimensions at 96 DPI
const A4_WIDTH = "794px";
const A4_HEIGHT = "1123px";

const pageBreak = {
  pageBreakAfter: "always",
  breakAfter: "page",
};

export default function ReportPdfGenerator({
  report,
  details,
  contentRef,
  onGeneratePdf,
  onPdfDone,
}) {
  const wrapperRef = useRef();

  const handleDownloadPdf = async () => {
    try {
      if (!wrapperRef.current) return;

      const pdfOptions = {
        filename: `report_${report.id}.pdf`,
        page: { margin: 0 },
        canvas: { scale: 2 },
      };

      await generatePDF(wrapperRef, pdfOptions);

      if (onPdfDone) onPdfDone();
    } catch (err) {
      console.error("PDF generation error:", err);
      alert("PDF generation failed.");
      if (onPdfDone) onPdfDone();
    }
  };

  useEffect(() => {
    if (onGeneratePdf) onGeneratePdf(handleDownloadPdf);
  }, []);

  return (
    <>
      {/* Hidden wrapper for PDF */}
      <Box
        ref={wrapperRef}
        sx={{
          position: "fixed",
          top: "-9999px",
          left: "-9999px",
          width: A4_WIDTH,
          background: "#fff",
          overflow: "visible", // IMPORTANT
        }}
      >
        {/* ---------- FRONT COVER ---------- */}
        {details.frontPageImage && (
          <Box sx={{ width: A4_WIDTH, height: A4_HEIGHT, ...pageBreak }}>
            <img
              src={getImageUrl(details.frontPageImage)}
              style={{
                width: A4_WIDTH,
                height: A4_HEIGHT,
                objectFit: "cover",
                display: "block",
              }}
            />
          </Box>
        )}

        {/* ---------- REPORT CONTENT ---------- */}
        <Box
          sx={{
            width: A4_WIDTH,
            padding: "20px",
            boxSizing: "border-box",
            overflow: "visible",
            ...pageBreak,
          }}
        >
          {contentRef.current && (
            <div
              dangerouslySetInnerHTML={{
                __html: contentRef.current.innerHTML,
              }}
            />
          )}
        </Box>

        {/* ---------- FORCE CLEAN NEW PAGE BEFORE BACK COVER ---------- */}
        <div style={{ height: "0px", pageBreakBefore: "always" }} />

        {/* ---------- BACK COVER (FULL SINGLE PAGE) ---------- */}
        {details.backPageImage && (
          <Box
            sx={{
              width: A4_WIDTH,
              height: A4_HEIGHT,
              overflow: "hidden", // prevent internal slicing
              position: "relative",
            }}
          >
            <img
              src={getImageUrl(details.backPageImage)}
              style={{
                width: A4_WIDTH,
                height: A4_HEIGHT,
                objectFit: "cover",
                display: "block",
              }}
            />
          </Box>
        )}
      </Box>
    </>
  );
}


