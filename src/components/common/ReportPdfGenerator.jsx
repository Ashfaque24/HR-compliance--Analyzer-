import React, { useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Box } from "@mui/material";
import { getImageUrl } from "../../utils/imageHelper";

export default function ReportPdfGenerator({ 
  report, 
  details, 
  contentRef, 
  onGeneratePdf,
  onPdfDone // NEW: Callback to notify when PDF generation is complete
}) {
  const frontRef = useRef();
  const backRef = useRef();

  const A4_WIDTH_PX = 1123;
  const A4_HEIGHT_PX = 1587;
  const CANVAS_SCALE = 3;

  const handleDownloadPdf = async () => {
    try {
      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const MARGIN_MM = 12;
      const usableWidth = pageWidth - MARGIN_MM * 2;
      const usableHeight = pageHeight - MARGIN_MM * 2;

      // ---------- FRONT COVER ----------
      if (details.frontPageImage && frontRef.current) {
        const canvas = await html2canvas(frontRef.current, {
          scale: CANVAS_SCALE,
          useCORS: true,
        });

        pdf.addImage(
          canvas.toDataURL("image/png"),
          "PNG",
          MARGIN_MM,
          MARGIN_MM,
          usableWidth,
          usableHeight
        );
      }

      // ---------- REPORT CONTENT ----------
      if (contentRef.current) {
        pdf.addPage();

        // Force fixed A4 width
        const originalWidth = contentRef.current.style.width;
        contentRef.current.style.width = `${A4_WIDTH_PX}px`;

        const canvas = await html2canvas(contentRef.current, {
          scale: CANVAS_SCALE,
          useCORS: true,
          backgroundColor: "#ffffff",
          width: A4_WIDTH_PX,
          windowWidth: A4_WIDTH_PX,
        });

        contentRef.current.style.width = originalWidth;

        const imgData = canvas.toDataURL("image/png");

        const fullHeight = (canvas.height * usableWidth) / canvas.width;

        // PAGE 1
        pdf.addImage(
          imgData,
          "PNG",
          MARGIN_MM,
          MARGIN_MM,
          usableWidth,
          fullHeight
        );

        // PAGE 2 (Only if content height exceeds page)
        if (fullHeight > usableHeight) {
          pdf.addPage();
          pdf.addImage(
            imgData,
            "PNG",
            MARGIN_MM,
            MARGIN_MM - usableHeight,
            usableWidth,
            fullHeight
          );
        }
      }

      // ---------- BACK COVER ----------
      if (details.backPageImage && backRef.current) {
        pdf.addPage();

        const canvas = await html2canvas(backRef.current, {
          scale: CANVAS_SCALE,
          useCORS: true,
        });

        pdf.addImage(
          canvas.toDataURL("image/png"),
          "PNG",
          MARGIN_MM,
          MARGIN_MM,
          usableWidth,
          usableHeight
        );
      }

      // SAVE
      pdf.save(`report_${report.id}.pdf`);

      // NEW: Call the completion callback
      if (onPdfDone) {
        onPdfDone();
      }
    } catch (err) {
      console.error("PDF Error:", err);
      alert("PDF generation failed. Try again.");
      
      // NEW: Still close loading spinner even if error occurs
      if (onPdfDone) {
        onPdfDone();
      }
    }
  };

  useEffect(() => {
    if (onGeneratePdf) onGeneratePdf(handleDownloadPdf);
  }, []);

  return (
    <>
      {/* Hidden Front Cover */}
      <Box
        ref={frontRef}
        sx={{
          position: "fixed",
          top: -9999,
          left: -9999,
          width: `${A4_WIDTH_PX}px`,
          height: `${A4_HEIGHT_PX}px`,
        }}
      >
        {details.frontPageImage && (
          <img
            src={getImageUrl(details.frontPageImage)}
            alt="Front Cover"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            crossOrigin="anonymous"
          />
        )}
      </Box>

      {/* Hidden Back Cover */}
      <Box
        ref={backRef}
        sx={{
          position: "fixed",
          top: -9999,
          left: -9999,
          width: `${A4_WIDTH_PX}px`,
          height: `${A4_HEIGHT_PX}px`,
        }}
      >
        {details.backPageImage && (
          <img
            src={getImageUrl(details.backPageImage)}
            alt="Back Cover"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            crossOrigin="anonymous"
          />
        )}
      </Box>
    </>
  );
}
