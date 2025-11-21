import React, { useRef, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Box } from "@mui/material";
import { getImageUrl } from "../../utils/imageHelper";

export default function ReportPdfGenerator({ report, details, contentRef, onGeneratePdf }) {
  const frontImageRef = useRef();
  const backImageRef = useRef();

  const handleDownloadPdf = async () => {
    const frontExists = !!details.frontPageImage && !!frontImageRef.current;
    const backExists = !!details.backPageImage && !!backImageRef.current;

    if (!frontExists && !backExists) {
      const proceed = window.confirm(
        "No cover pages found. Do you want to download the report without cover pages?"
      );
      if (!proceed) return;
    }

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    const margin = 56;
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const contentWidth = pdfWidth - margin * 2;
    const contentHeight = pdfHeight - margin * 2;

    const captureElement = async (element) => {
      if (!element) return null;
      return await html2canvas(element, {
        scale: 3,
        useCORS: true,
        scrollX: 0,
        scrollY: -window.scrollY,
        backgroundColor: "#ffffff",
      });
    };

    try {
      // Add front cover image as first page
      if (frontExists) {
        const frontCanvas = await captureElement(frontImageRef.current);
        pdf.addImage(
          frontCanvas.toDataURL("image/png"),
          "PNG",
          margin,
          margin,
          contentWidth,
          contentHeight
        );
      }

      // Add report content pages - USE contentRef from parent
      if (contentRef.current) {
        if (frontExists) pdf.addPage();

        const reportCanvas = await captureElement(contentRef.current);
        let totalHeight = reportCanvas.height;
        const pageHeightPx = (contentHeight * reportCanvas.width) / contentWidth;
        let renderedHeight = 0;

        while (renderedHeight < totalHeight) {
          const canvasPage = document.createElement("canvas");
          canvasPage.width = reportCanvas.width;
          canvasPage.height = Math.min(pageHeightPx, totalHeight - renderedHeight);
          const ctx = canvasPage.getContext("2d");

          ctx.drawImage(
            reportCanvas,
            0,
            renderedHeight,
            reportCanvas.width,
            canvasPage.height,
            0,
            0,
            reportCanvas.width,
            canvasPage.height
          );

          const imgData = canvasPage.toDataURL("image/png");
          if (renderedHeight > 0) pdf.addPage();
          const scaleFactor = contentWidth / canvasPage.width;
          pdf.addImage(imgData, "PNG", margin, margin, contentWidth, canvasPage.height * scaleFactor);

          renderedHeight += canvasPage.height;
        }
      }

      // Add back cover image as last page
      if (backExists) {
        pdf.addPage();
        const backCanvas = await captureElement(backImageRef.current);
        pdf.addImage(
          backCanvas.toDataURL("image/png"),
          "PNG",
          margin,
          margin,
          contentWidth,
          contentHeight
        );
      }

      pdf.save(`report_${report.id}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF");
    }
  };

  // Expose the handleDownloadPdf function to parent
  useEffect(() => {
    if (onGeneratePdf) {
      onGeneratePdf(handleDownloadPdf);
    }
  }, [onGeneratePdf, report, details]);

  return (
    <>
      {/* Hidden full-size front cover image */}
      <Box
        ref={frontImageRef}
        sx={{
          position: "fixed",
          top: -9999,
          left: -9999,
          width: "794px",
          height: "1123px",
          overflow: "hidden",
          zIndex: -1,
        }}
      >
        {details.frontPageImage && (
          <img
            src={getImageUrl(details.frontPageImage)}
            alt="Front Cover Full Resolution"
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
            crossOrigin="anonymous"
          />
        )}
      </Box>

      {/* Hidden full-size back cover image */}
      <Box
        ref={backImageRef}
        sx={{
          position: "fixed",
          top: -9999,
          left: -9999,
          width: "794px",
          height: "1123px",
          overflow: "hidden",
          zIndex: -1,
        }}
      >
        {details.backPageImage && (
          <img
            src={getImageUrl(details.backPageImage)}
            alt="Back Cover Full Resolution"
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
            crossOrigin="anonymous"
          />
        )}
      </Box>
    </>
  );
}
