// // ReportPdfGenerator.jsx
// import React, { useEffect, useRef } from "react";
// import { Box } from "@mui/material";
// import { getImageUrl } from "../../utils/imageHelper";
// import generatePDF from "react-to-pdf";

// // A4 dimensions at 96 DPI
// const A4_WIDTH = "794px";
// const A4_HEIGHT = "1123px";

// const pageBreak = {
//   pageBreakAfter: "always",
//   breakAfter: "page",
// };

// export default function ReportPdfGenerator({
//   report,
//   details,
//   contentRef,
//   onGeneratePdf,
//   onPdfDone,
// }) {
//   const wrapperRef = useRef();

//   const handleDownloadPdf = async () => {
//     try {
//       if (!wrapperRef.current) return;

//       const pdfOptions = {
//         filename: `report_${report.id}.pdf`,
//         page: { margin: 0 },
//         canvas: { scale: 2 },
//       };

//       await generatePDF(wrapperRef, pdfOptions);

//       if (onPdfDone) onPdfDone();
//     } catch (err) {
//       console.error("PDF generation error:", err);
//       alert("PDF generation failed.");
//       if (onPdfDone) onPdfDone();
//     }
//   };

//   useEffect(() => {
//     if (onGeneratePdf) onGeneratePdf(handleDownloadPdf);
//   }, []);

//   return (
//     <>
//       {/* Hidden wrapper for PDF */}
//       <Box
//         ref={wrapperRef}
//         sx={{
//           position: "fixed",
//           top: "-9999px",
//           left: "-9999px",
//           width: A4_WIDTH,
//           background: "#fff",
//           overflow: "visible", // IMPORTANT
//         }}
//       >
//         {/* ---------- FRONT COVER ---------- */}
//         {details.frontPageImage && (
//           <Box sx={{ width: A4_WIDTH, height: A4_HEIGHT, ...pageBreak }}>
//             <img
//               src={getImageUrl(details.frontPageImage)}
//               style={{
//                 width: A4_WIDTH,
//                 height: A4_HEIGHT,
//                 objectFit: "cover",
//                 display: "block",
//               }}
//             />
//           </Box>
//         )}

//         {/* ---------- REPORT CONTENT ---------- */}
//         <Box
//           sx={{
//             width: A4_WIDTH,
//             padding: "20px",
//             boxSizing: "border-box",
//             overflow: "visible",
//             ...pageBreak,
//           }}
//         >
//           {contentRef.current && (
//             <div
//               dangerouslySetInnerHTML={{
//                 __html: contentRef.current.innerHTML,
//               }}
//             />
//           )}
//         </Box>

//         {/* ---------- FORCE CLEAN NEW PAGE BEFORE BACK COVER ---------- */}
//         <div style={{ height: "0px", pageBreakBefore: "always" }} />

//         {/* ---------- BACK COVER (FULL SINGLE PAGE) ---------- */}
//         {details.backPageImage && (
//           <Box
//             sx={{
//               width: A4_WIDTH,
//               height: A4_HEIGHT,
//               overflow: "hidden", // prevent internal slicing
//               position: "relative",
//             }}
//           >
//             <img
//               src={getImageUrl(details.backPageImage)}
//               style={{
//                 width: A4_WIDTH,
//                 height: A4_HEIGHT,
//                 objectFit: "cover",
//                 display: "block",
//               }}
//             />
//           </Box>
//         )}
//       </Box>
//     </>
//   );
// }







// ReportPdfGenerator.jsx
import React, { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { getImageUrl } from "../../utils/imageHelper";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// A4 dimensions (points) for jsPDF when using 'pt'
const PDF_FORMAT = { unit: "pt", format: "a4" };
const A4_PT = { width: 595.28, height: 841.89 }; // points (approx)
// EXTREME DENSITY SCALE FACTOR: This sets content to 60% of its normal size.
// Do not go much lower than 0.60, as text may become unreadable.
const CONTENT_SCALE_FACTOR = 0.60; 

export default function ReportPdfGenerator({
  report,
  details,
  contentRef,
  onGeneratePdf,
  onPdfDone,
}) {
  const wrapperRef = useRef();
  const frontRef = useRef();
  const bodyRef = useRef();
  const backRef = useRef();

  // helper: render a DOM node to canvas (higher scale for quality)
  const renderNodeToCanvas = async (node, scale = 2) => {
    return await html2canvas(node, {
      useCORS: true,
      scale,
      logging: false,
      allowTaint: true,
      backgroundColor: "#ffffff",
      windowWidth: node.scrollWidth,
      windowHeight: node.scrollHeight,
    });
  };

  // helper: add full-page image (canvas) to PDF
  const addFullPageFromCanvas = (pdf, canvas) => {
    // convert canvas to image and place it stretched to full A4
    const imgData = canvas.toDataURL("image/png");
    pdf.addImage(imgData, "PNG", 0, 0, A4_PT.width, A4_PT.height);
  };

  // helper: split tall canvas into multiple A4 pages and add to pdf
  const addMultiPageFromCanvas = (pdf, canvas) => {
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // scale so that canvas width fits PDF page width
    const scaleFactor = A4_PT.width / canvasWidth;
    // portion in source-canvas px that fits one pdf page
    const pageCanvasHeightPx = Math.floor(A4_PT.height / scaleFactor); 

    let y = 0;
    let pageIndex = 0;
    while (y < canvasHeight) {
      const sliceHeight = Math.min(pageCanvasHeightPx, canvasHeight - y);

      // create a temp canvas to hold the slice
      const tmpCanvas = document.createElement("canvas");
      tmpCanvas.width = canvasWidth;
      tmpCanvas.height = sliceHeight;
      const ctx = tmpCanvas.getContext("2d");

      // draw slice from original canvas
      ctx.drawImage(canvas, 0, y, canvasWidth, sliceHeight, 0, 0, canvasWidth, sliceHeight);

      const imgData = tmpCanvas.toDataURL("image/png");

      // Add slice as a pdf page sized to A4
      if (pageIndex > 0) pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, 0, A4_PT.width, sliceHeight * scaleFactor);

      y += sliceHeight;
      pageIndex++;
    }
  };

  const generatePdf = async () => {
    try {
      if (!wrapperRef.current) throw new Error("PDF wrapper not ready");

      const pdf = new jsPDF("portrait", PDF_FORMAT.unit, "a4");

      // 1) FRONT COVER (if any)
      if (details.frontPageImage && frontRef.current) {
        const frontCanvas = await renderNodeToCanvas(frontRef.current, 2);
        addFullPageFromCanvas(pdf, frontCanvas);
      }

      // 2) REPORT BODY (slice into pages)
      if (bodyRef.current) {
        // Render the body area
        const bodyCanvas = await renderNodeToCanvas(bodyRef.current, 2);

        // If a front cover was added, move to the next page for the body content.
        if (details.frontPageImage) {
          pdf.addPage();
        }

        addMultiPageFromCanvas(pdf, bodyCanvas);
      }

      // 3) BACK COVER (if any) - ensure it's on its own page
      if (details.backPageImage && backRef.current) {
        // Make sure we're on a fresh page
        pdf.addPage();
        const backCanvas = await renderNodeToCanvas(backRef.current, 2);
        addFullPageFromCanvas(pdf, backCanvas);
      }

      // Save file
      const filename = `report_${report?.id || "export"}.pdf`;
      pdf.save(filename);

      if (onPdfDone) onPdfDone();
    } catch (err) {
      console.error("PDF generation error:", err);
      alert("PDF generation failed. See console for details.");
      if (onPdfDone) onPdfDone();
    }
  };

  useEffect(() => {
    if (onGeneratePdf) onGeneratePdf(generatePdf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onGeneratePdf, details, report, contentRef]);

  // Render an offscreen but fully-rendered DOM that html2canvas can snapshot.
  return (
    <Box
      ref={wrapperRef}
      sx={{
        // keep rendered but offscreen so layout isn't disturbed
        position: "fixed",
        top: -99999,
        left: -99999,
        width: `${Math.round(A4_PT.width)}pt`, // keep physical size for rendering
        background: "#fff",
        zIndex: -1,
      }}
    >
      {/* FRONT COVER PAGE */}
      {details.frontPageImage && (
        <Box
          ref={frontRef}
          sx={{
            width: `${Math.round(A4_PT.width)}px`,
            height: `${Math.round(A4_PT.height)}px`,
            overflow: "hidden",
            pageBreakAfter: "always",
            WebkitPrintColorAdjust: "exact",
            display: "block",
          }}
        >
          <img
            alt="front cover"
            src={getImageUrl(details.frontPageImage)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </Box>
      )}

      {/* REPORT BODY - ADJUSTED FOR EXTREME DENSITY (0.60) */}
      <Box
        ref={bodyRef}
        sx={{
          // Set width to be proportionally larger to render content at a high density
          // (e.g., 595.28 / 0.60 ≈ 992.13px)
          width: `${Math.round(A4_PT.width / CONTENT_SCALE_FACTOR)}px`,
          
          // Shrink the rendered content down to fit A4 width, maximizing density
          transform: `scale(${CONTENT_SCALE_FACTOR})`,
          transformOrigin: 'top left',

          boxSizing: "border-box",
          padding: "20px",
          overflow: "visible",
          pageBreakAfter: "always",
          WebkitPrintColorAdjust: "exact",
          background: "#ffffff",
        }}
        // clone contentRef.innerHTML into the offscreen body for snapshot
        dangerouslySetInnerHTML={{
          __html: contentRef.current ? contentRef.current.innerHTML : "<div/>",
        }}
      />

      {/* BACK COVER PAGE */}
      {details.backPageImage && (
        <Box
          ref={backRef}
          sx={{
            width: `${Math.round(A4_PT.width)}px`,
            height: `${Math.round(A4_PT.height)}px`,
            overflow: "hidden",
            pageBreakAfter: "always",
            WebkitPrintColorAdjust: "exact",
            display: "block",
          }}
        >
          <img
            alt="back cover"
            src={getImageUrl(details.backPageImage)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </Box>
      )}
    </Box>
  );
}