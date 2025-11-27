// import React, { useEffect, useRef } from "react";
// import { Box } from "@mui/material";
// import { getImageUrl } from "../../utils/imageHelper";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

// // A4 dimensions (points)
// const PDF_FORMAT = { unit: "pt", format: "a4" };
// const A4_PT = { width: 595.28, height: 841.89 };

// const CANVAS_SCALE = 2;
// const SECTION_SPACING_PT = 8;

// export default function ReportPdfGenerator({
//   report,
//   details,
//   companyDetailsRef,
//   executiveSummaryRef,
//   sectionRefs,
//   nextStepsRef,
//   onGeneratePdf,
//   onPdfDone,
// }) {
//   const wrapperRef = useRef();
//   const frontRef = useRef();
//   const backRef = useRef();

//   // render DOM node -> canvas
//   const renderNodeToCanvas = async (node) => {
//     return await html2canvas(node, {
//       useCORS: true,
//       scale: CANVAS_SCALE,
//       logging: false,
//       allowTaint: true,
//       backgroundColor: "#ffffff",
//       windowWidth: 1200,       // ★ FORCE DESKTOP WIDTH
//       windowHeight: node.scrollHeight,
//     });
//   };

//   const addCanvasAtY = (pdf, canvas, yPos) => {
//     const imgData = canvas.toDataURL("image/png");
//     const scaleFactor = A4_PT.width / canvas.width;
//     const heightInPdf = canvas.height * scaleFactor;
//     pdf.addImage(imgData, "PNG", 0, yPos, A4_PT.width, heightInPdf);
//     return heightInPdf;
//   };

//   const addMultiPageCanvas = (pdf, canvas) => {
//     const canvasWidth = canvas.width;
//     const canvasHeight = canvas.height;
//     const scaleFactor = A4_PT.width / canvasWidth;
//     const pageCanvasHeightPx = Math.floor(A4_PT.height / scaleFactor);

//     let yPx = 0;
//     let firstPage = true;

//     while (yPx < canvasHeight) {
//       const sliceHeightPx = Math.min(pageCanvasHeightPx, canvasHeight - yPx);

//       const tmpCanvas = document.createElement("canvas");
//       tmpCanvas.width = canvasWidth;
//       tmpCanvas.height = sliceHeightPx;
//       const ctx = tmpCanvas.getContext("2d");
//       ctx.drawImage(canvas, 0, yPx, canvasWidth, sliceHeightPx, 0, 0, canvasWidth, sliceHeightPx);

//       const imgData = tmpCanvas.toDataURL("image/png");

//       if (!firstPage) pdf.addPage();
//       pdf.addImage(imgData, "PNG", 0, 0, A4_PT.width, sliceHeightPx * scaleFactor);

//       yPx += sliceHeightPx;
//       firstPage = false;
//     }

//     const remainderPx = canvasHeight % pageCanvasHeightPx || pageCanvasHeightPx;
//     return remainderPx * scaleFactor;
//   };

//   const generatePdf = async () => {
//     try {
//       const pdf = new jsPDF("portrait", PDF_FORMAT.unit, "a4");
//       let currentPageUsedHeight = 0;

//       // FRONT COVER
//       if (details.frontPageImage && frontRef.current) {
//         const frontCanvas = await renderNodeToCanvas(frontRef.current);
//         pdf.addImage(frontCanvas.toDataURL("image/png"), "PNG", 0, 0, A4_PT.width, A4_PT.height);
//         pdf.addPage();
//         currentPageUsedHeight = 0;
//       }

//       // COMPANY DETAILS
//       if (companyDetailsRef?.current) {
//         const canvas = await renderNodeToCanvas(companyDetailsRef.current);
//         const blockHeight = canvas.height * (A4_PT.width / canvas.width);

//         if (blockHeight <= (A4_PT.height - currentPageUsedHeight)) {
//           addCanvasAtY(pdf, canvas, currentPageUsedHeight);
//           currentPageUsedHeight += blockHeight + SECTION_SPACING_PT;
//         } else {
//           pdf.addPage();
//           currentPageUsedHeight = 0;
//           addCanvasAtY(pdf, canvas, 0);
//           currentPageUsedHeight += blockHeight + SECTION_SPACING_PT;
//         }
//       }

//       // EXEC SUMMARY
//       if (executiveSummaryRef?.current) {
//         const canvas = await renderNodeToCanvas(executiveSummaryRef.current);
//         const blockHeight = canvas.height * (A4_PT.width / canvas.width);

//         if (blockHeight <= (A4_PT.height - currentPageUsedHeight)) {
//           addCanvasAtY(pdf, canvas, currentPageUsedHeight);
//           currentPageUsedHeight += blockHeight + SECTION_SPACING_PT;
//         } else {
//           pdf.addPage();
//           currentPageUsedHeight = 0;
//           addCanvasAtY(pdf, canvas, 0);
//           currentPageUsedHeight += blockHeight + SECTION_SPACING_PT;
//         }
//       }

//       // SECTION CARDS
//       const refsArray = (sectionRefs && sectionRefs.current) || [];

//       for (let i = 0; i < refsArray.length; i++) {
//         const node = refsArray[i];
//         if (!node) continue;

//         const canvas = await renderNodeToCanvas(node);
//         const blockHeight = canvas.height * (A4_PT.width / canvas.width);

//         if (blockHeight <= (A4_PT.height - currentPageUsedHeight)) {
//           addCanvasAtY(pdf, canvas, currentPageUsedHeight);
//           currentPageUsedHeight += blockHeight + SECTION_SPACING_PT;
//         } else {
//           pdf.addPage();
//           currentPageUsedHeight = 0;

//           if (blockHeight > A4_PT.height) {
//             const lastHeight = addMultiPageCanvas(pdf, canvas);
//             currentPageUsedHeight = lastHeight + SECTION_SPACING_PT;
//           } else {
//             addCanvasAtY(pdf, canvas, 0);
//             currentPageUsedHeight = blockHeight + SECTION_SPACING_PT;
//           }
//         }
//       }

//       // NEXT STEPS
//       if (nextStepsRef?.current) {
//         pdf.addPage();
//         currentPageUsedHeight = 0;

//         const canvas = await renderNodeToCanvas(nextStepsRef.current);
//         const blockHeight = canvas.height * (A4_PT.width / canvas.width);

//         if (blockHeight <= A4_PT.height) {
//           addCanvasAtY(pdf, canvas, 0);
//         } else {
//           addMultiPageCanvas(pdf, canvas);
//         }
//       }

//       // BACK COVER
//       if (details.backPageImage && backRef.current) {
//         pdf.addPage();
//         const backCanvas = await renderNodeToCanvas(backRef.current);
//         pdf.addImage(backCanvas.toDataURL("image/png"), "PNG", 0, 0, A4_PT.width, A4_PT.height);
//       }

//       pdf.save(`report_${report?.id || "export"}.pdf`);
//       onPdfDone?.();

//     } catch (err) {
//       console.error("PDF generation error:", err);
//       alert("PDF generation failed. Check console.");
//       onPdfDone?.();
//     }
//   };

//   useEffect(() => {
//     if (onGeneratePdf) onGeneratePdf(generatePdf);
//   }, [onGeneratePdf, companyDetailsRef, executiveSummaryRef, sectionRefs, nextStepsRef]);

//   return (
//     <Box
//       ref={wrapperRef}
//       className="pdf-desktop"     // ★ ADD THIS CLASS
//       sx={{
//         position: "fixed",
//         top: -99999,
//         left: -99999,
//         width: `${A4_PT.width}px`,
//         background: "#fff",
//         zIndex: -1,
//       }}
//     >
//       {/* FRONT COVER */}
//       {details.frontPageImage && (
//         <Box
//           ref={frontRef}
//           sx={{
//             width: `${A4_PT.width}px`,
//             height: `${A4_PT.height}px`,
//           }}
//         >
//           <img
//             src={getImageUrl(details.frontPageImage)}
//             style={{ width: "100%", height: "100%", objectFit: "cover" }}
//           />
//         </Box>
//       )}

//       {/* BACK COVER */}
//       {details.backPageImage && (
//         <Box
//           ref={backRef}
//           sx={{
//             width: `${A4_PT.width}px`,
//             height: `${A4_PT.height}px`,
//           }}
//         >
//           <img
//             src={getImageUrl(details.backPageImage)}
//             style={{ width: "100%", height: "100%", objectFit: "cover" }}
//           />
//         </Box>
//       )}
//     </Box>
//   );
// }







// // after size reducing 

// import React, { useEffect, useRef } from "react";
// import { Box } from "@mui/material";
// import { getImageUrl } from "../../utils/imageHelper";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

// // A4 dimensions (points)
// const PDF_FORMAT = { unit: "pt", format: "a4" };
// const A4_PT = { width: 595.28, height: 841.89 };

// // Improved scale for better text quality
// const CANVAS_SCALE = 1.5;
// const SECTION_SPACING_PT = 8;

// export default function ReportPdfGenerator({
//   report,
//   details,
//   companyDetailsRef,
//   executiveSummaryRef,
//   sectionRefs,
//   nextStepsRef,
//   onGeneratePdf,
//   onPdfDone,
// }) {
//   const wrapperRef = useRef();
//   const frontRef = useRef();
//   const backRef = useRef();

//   // render DOM node -> canvas with better text rendering
//   const renderNodeToCanvas = async (node) => {
//     return await html2canvas(node, {
//       useCORS: true,
//       scale: CANVAS_SCALE,
//       logging: false,
//       allowTaint: true,
//       backgroundColor: "#ffffff",
//       windowWidth: 1200,
//       windowHeight: node.scrollHeight,
//       imageTimeout: 0,
//       removeContainer: true,
//     });
//   };

//   // Compress canvas with better quality balance for text
//   const compressCanvas = (canvas, quality = 0.85) => {
//     return canvas.toDataURL("image/jpeg", quality);
//   };

//   const addCanvasAtY = (pdf, canvas, yPos, quality = 0.85) => {
//     const imgData = compressCanvas(canvas, quality);
//     const scaleFactor = A4_PT.width / canvas.width;
//     const heightInPdf = canvas.height * scaleFactor;
//     pdf.addImage(imgData, "JPEG", 0, yPos, A4_PT.width, heightInPdf);
//     return heightInPdf;
//   };

//   const addMultiPageCanvas = (pdf, canvas, quality = 0.85) => {
//     const canvasWidth = canvas.width;
//     const canvasHeight = canvas.height;
//     const scaleFactor = A4_PT.width / canvasWidth;
//     const pageCanvasHeightPx = Math.floor(A4_PT.height / scaleFactor);

//     let yPx = 0;
//     let firstPage = true;

//     while (yPx < canvasHeight) {
//       const sliceHeightPx = Math.min(pageCanvasHeightPx, canvasHeight - yPx);

//       const tmpCanvas = document.createElement("canvas");
//       tmpCanvas.width = canvasWidth;
//       tmpCanvas.height = sliceHeightPx;
//       const ctx = tmpCanvas.getContext("2d");
//       ctx.drawImage(
//         canvas,
//         0,
//         yPx,
//         canvasWidth,
//         sliceHeightPx,
//         0,
//         0,
//         canvasWidth,
//         sliceHeightPx
//       );

//       const imgData = compressCanvas(tmpCanvas, quality);

//       if (!firstPage) pdf.addPage();
//       pdf.addImage(imgData, "JPEG", 0, 0, A4_PT.width, sliceHeightPx * scaleFactor);

//       yPx += sliceHeightPx;
//       firstPage = false;
//     }

//     const remainderPx = canvasHeight % pageCanvasHeightPx || pageCanvasHeightPx;
//     return remainderPx * scaleFactor;
//   };

//   const generatePdf = async () => {
//     try {
//       const pdf = new jsPDF("portrait", PDF_FORMAT.unit, "a4");
//       let currentPageUsedHeight = 0;

//       // FRONT COVER (compress image with slightly lower quality to save space)
//       if (details.frontPageImage && frontRef.current) {
//         const frontCanvas = await renderNodeToCanvas(frontRef.current);
//         const compressedFront = compressCanvas(frontCanvas, 0.8);
//         pdf.addImage(compressedFront, "JPEG", 0, 0, A4_PT.width, A4_PT.height);
//         pdf.addPage();
//         currentPageUsedHeight = 0;
//       }

//       // COMPANY DETAILS
//       if (companyDetailsRef?.current) {
//         const canvas = await renderNodeToCanvas(companyDetailsRef.current);
//         const blockHeight = canvas.height * (A4_PT.width / canvas.width);

//         if (blockHeight <= A4_PT.height - currentPageUsedHeight) {
//           addCanvasAtY(pdf, canvas, currentPageUsedHeight, 0.85);
//           currentPageUsedHeight += blockHeight + SECTION_SPACING_PT;
//         } else {
//           pdf.addPage();
//           currentPageUsedHeight = 0;
//           addCanvasAtY(pdf, canvas, 0, 0.85);
//           currentPageUsedHeight += blockHeight + SECTION_SPACING_PT;
//         }
//       }

//       // EXEC SUMMARY
//       if (executiveSummaryRef?.current) {
//         const canvas = await renderNodeToCanvas(executiveSummaryRef.current);
//         const blockHeight = canvas.height * (A4_PT.width / canvas.width);

//         if (blockHeight <= A4_PT.height - currentPageUsedHeight) {
//           addCanvasAtY(pdf, canvas, currentPageUsedHeight, 0.85);
//           currentPageUsedHeight += blockHeight + SECTION_SPACING_PT;
//         } else {
//           pdf.addPage();
//           currentPageUsedHeight = 0;
//           addCanvasAtY(pdf, canvas, 0, 0.85);
//           currentPageUsedHeight += blockHeight + SECTION_SPACING_PT;
//         }
//       }

//       // SECTION CARDS
//       const refsArray = (sectionRefs && sectionRefs.current) || [];

//       for (let i = 0; i < refsArray.length; i++) {
//         const node = refsArray[i];
//         if (!node) continue;

//         const canvas = await renderNodeToCanvas(node);
//         const blockHeight = canvas.height * (A4_PT.width / canvas.width);

//         if (blockHeight <= A4_PT.height - currentPageUsedHeight) {
//           addCanvasAtY(pdf, canvas, currentPageUsedHeight, 0.85);
//           currentPageUsedHeight += blockHeight + SECTION_SPACING_PT;
//         } else {
//           pdf.addPage();
//           currentPageUsedHeight = 0;

//           if (blockHeight > A4_PT.height) {
//             const lastHeight = addMultiPageCanvas(pdf, canvas, 0.85);
//             currentPageUsedHeight = lastHeight + SECTION_SPACING_PT;
//           } else {
//             addCanvasAtY(pdf, canvas, 0, 0.85);
//             currentPageUsedHeight = blockHeight + SECTION_SPACING_PT;
//           }
//         }
//       }

//       // NEXT STEPS
//       if (nextStepsRef?.current) {
//         pdf.addPage();
//         currentPageUsedHeight = 0;

//         const canvas = await renderNodeToCanvas(nextStepsRef.current);
//         const blockHeight = canvas.height * (A4_PT.width / canvas.width);

//         if (blockHeight <= A4_PT.height) {
//           addCanvasAtY(pdf, canvas, 0, 0.85);
//         } else {
//           addMultiPageCanvas(pdf, canvas, 0.85);
//         }
//       }

//       // BACK COVER (compress image with slightly lower quality to save space)
//       if (details.backPageImage && backRef.current) {
//         pdf.addPage();
//         const backCanvas = await renderNodeToCanvas(backRef.current);
//         const compressedBack = compressCanvas(backCanvas, 0.8);
//         pdf.addImage(compressedBack, "JPEG", 0, 0, A4_PT.width, A4_PT.height);
//       }

//       pdf.save(`report_${report?.id || "export"}.pdf`);
//       onPdfDone?.();
//     } catch (err) {
//       console.error("PDF generation error:", err);
//       alert("PDF generation failed. Check console.");
//       onPdfDone?.();
//     }
//   };

//   useEffect(() => {
//     if (onGeneratePdf) onGeneratePdf(generatePdf);
//   }, [onGeneratePdf, companyDetailsRef, executiveSummaryRef, sectionRefs, nextStepsRef]);

//   return (
//     <Box
//       ref={wrapperRef}
//       className="pdf-desktop"
//       sx={{
//         position: "fixed",
//         top: -99999,
//         left: -99999,
//         width: `${A4_PT.width}px`,
//         background: "#fff",
//         zIndex: -1,
//       }}
//     >
//       {/* FRONT COVER */}
//       {details.frontPageImage && (
//         <Box
//           ref={frontRef}
//           sx={{
//             width: `${A4_PT.width}px`,
//             height: `${A4_PT.height}px`,
//           }}
//         >
//           <img
//             src={getImageUrl(details.frontPageImage)}
//             style={{ width: "100%", height: "100%", objectFit: "cover" }}
//           />
//         </Box>
//       )}

//       {/* BACK COVER */}
//       {details.backPageImage && (
//         <Box
//           ref={backRef}
//           sx={{
//             width: `${A4_PT.width}px`,
//             height: `${A4_PT.height}px`,
//           }}
//         >
//           <img
//             src={getImageUrl(details.backPageImage)}
//             style={{ width: "100%", height: "100%", objectFit: "cover" }}
//           />
//         </Box>
//       )}
//     </Box>
//   );
// }












// after size reducing 

import React, { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { getImageUrl } from "../../utils/imageHelper";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// A4 dimensions (points)
const PDF_FORMAT = { unit: "pt", format: "a4" };
const A4_PT = { width: 595.28, height: 841.89 };

// Improved scale for better text quality
const CANVAS_SCALE = 1.5;
const SECTION_SPACING_PT = 8;

export default function ReportPdfGenerator({
  report,
  details,
  companyDetailsRef,
  executiveSummaryRef,
  sectionRefs,
  nextStepsRef,
  onGeneratePdf,
  onPdfDone,
}) {
  const wrapperRef = useRef();
  const frontRef = useRef();
  const backRef = useRef();

  // render DOM node -> canvas with better text rendering
  const renderNodeToCanvas = async (node) => {
    return await html2canvas(node, {
      useCORS: true,
      scale: CANVAS_SCALE,
      logging: false,
      allowTaint: true,
      backgroundColor: "#ffffff",
      windowWidth: 1200,
      windowHeight: node.scrollHeight,
      imageTimeout: 0,
      removeContainer: true,
    });
  };

  // Compress canvas with better quality balance for text
  const compressCanvas = (canvas, quality = 0.85) => {
    return canvas.toDataURL("image/jpeg", quality);
  };

  const addCanvasAtY = (pdf, canvas, yPos, quality = 0.85) => {
    const imgData = compressCanvas(canvas, quality);
    const scaleFactor = A4_PT.width / canvas.width;
    const heightInPdf = canvas.height * scaleFactor;
    pdf.addImage(imgData, "JPEG", 0, yPos, A4_PT.width, heightInPdf);
    return heightInPdf;
  };

  const addMultiPageCanvas = (pdf, canvas, quality = 0.85) => {
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const scaleFactor = A4_PT.width / canvasWidth;
    const pageCanvasHeightPx = Math.floor(A4_PT.height / scaleFactor);

    let yPx = 0;
    let firstPage = true;

    while (yPx < canvasHeight) {
      const sliceHeightPx = Math.min(pageCanvasHeightPx, canvasHeight - yPx);

      const tmpCanvas = document.createElement("canvas");
      tmpCanvas.width = canvasWidth;
      tmpCanvas.height = sliceHeightPx;
      const ctx = tmpCanvas.getContext("2d");
      ctx.drawImage(
        canvas,
        0,
        yPx,
        canvasWidth,
        sliceHeightPx,
        0,
        0,
        canvasWidth,
        sliceHeightPx
      );

      const imgData = compressCanvas(tmpCanvas, quality);

      if (!firstPage) pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, 0, A4_PT.width, sliceHeightPx * scaleFactor);

      yPx += sliceHeightPx;
      firstPage = false;
    }

    const remainderPx = canvasHeight % pageCanvasHeightPx || pageCanvasHeightPx;
    return remainderPx * scaleFactor;
  };

  const generatePdf = async () => {
    try {
      const pdf = new jsPDF("portrait", PDF_FORMAT.unit, "a4");
      let currentPageUsedHeight = 0;

      // FRONT COVER
      if (details.frontPageImage && frontRef.current) {
        const frontCanvas = await renderNodeToCanvas(frontRef.current);
        const compressedFront = compressCanvas(frontCanvas, 0.8);
        pdf.addImage(compressedFront, "JPEG", 0, 0, A4_PT.width, A4_PT.height);
        pdf.addPage();
        currentPageUsedHeight = 0;
      }

      // COMPANY DETAILS
      if (companyDetailsRef?.current) {
        const canvas = await renderNodeToCanvas(companyDetailsRef.current);
        const blockHeight = canvas.height * (A4_PT.width / canvas.width);

        if (blockHeight <= A4_PT.height - currentPageUsedHeight) {
          addCanvasAtY(pdf, canvas, currentPageUsedHeight, 0.85);
          currentPageUsedHeight += blockHeight + SECTION_SPACING_PT;
        } else {
          pdf.addPage();
          currentPageUsedHeight = 0;
          addCanvasAtY(pdf, canvas, 0, 0.85);
          currentPageUsedHeight += blockHeight + SECTION_SPACING_PT;
        }
      }

      // EXEC SUMMARY
      if (executiveSummaryRef?.current) {
        const canvas = await renderNodeToCanvas(executiveSummaryRef.current);
        const blockHeight = canvas.height * (A4_PT.width / canvas.width);

        if (blockHeight <= A4_PT.height - currentPageUsedHeight) {
          addCanvasAtY(pdf, canvas, currentPageUsedHeight, 0.85);
          currentPageUsedHeight += blockHeight + SECTION_SPACING_PT;
        } else {
          pdf.addPage();
          currentPageUsedHeight = 0;
          addCanvasAtY(pdf, canvas, 0, 0.85);
          currentPageUsedHeight += blockHeight + SECTION_SPACING_PT;
        }
      }

      // SECTION CARDS
      const refsArray = (sectionRefs && sectionRefs.current) || [];

      for (let i = 0; i < refsArray.length; i++) {
        const node = refsArray[i];
        if (!node) continue;

        const canvas = await renderNodeToCanvas(node);
        const blockHeight = canvas.height * (A4_PT.width / canvas.width);

        if (blockHeight <= A4_PT.height - currentPageUsedHeight) {
          addCanvasAtY(pdf, canvas, currentPageUsedHeight, 0.85);
          currentPageUsedHeight += blockHeight + SECTION_SPACING_PT;
        } else {
          pdf.addPage();
          currentPageUsedHeight = 0;

          if (blockHeight > A4_PT.height) {
            const lastHeight = addMultiPageCanvas(pdf, canvas, 0.85);
            currentPageUsedHeight = lastHeight + SECTION_SPACING_PT;
          } else {
            addCanvasAtY(pdf, canvas, 0, 0.85);
            currentPageUsedHeight = blockHeight + SECTION_SPACING_PT;
          }
        }
      }

      // NEXT STEPS
      if (nextStepsRef?.current) {
        pdf.addPage();
        currentPageUsedHeight = 0;

        const canvas = await renderNodeToCanvas(nextStepsRef.current);
        const blockHeight = canvas.height * (A4_PT.width / canvas.width);

        if (blockHeight <= A4_PT.height) {
          addCanvasAtY(pdf, canvas, 0, 0.85);
        } else {
          addMultiPageCanvas(pdf, canvas, 0.85);
        }
      }

      // BACK COVER
      if (details.backPageImage && backRef.current) {
        pdf.addPage();
        const backCanvas = await renderNodeToCanvas(backRef.current);
        const compressedBack = compressCanvas(backCanvas, 0.8);
        pdf.addImage(compressedBack, "JPEG", 0, 0, A4_PT.width, A4_PT.height);
      }

      // FINAL STEP: SHOW PDF BEFORE DOWNLOAD
      const pdfUrl = pdf.output("bloburl");
      window.open(pdfUrl, "_blank");

      onPdfDone?.();
    } catch (err) {
      console.error("PDF generation error:", err);
      alert("PDF generation failed. Check console.");
      onPdfDone?.();
    }
  };

  useEffect(() => {
    if (onGeneratePdf) onGeneratePdf(generatePdf);
  }, [onGeneratePdf, companyDetailsRef, executiveSummaryRef, sectionRefs, nextStepsRef]);

  return (
    <Box
      ref={wrapperRef}
      className="pdf-desktop"
      sx={{
        position: "fixed",
        top: -99999,
        left: -99999,
        width: `${A4_PT.width}px`,
        background: "#fff",
        zIndex: -1,
      }}
    >
      {/* FRONT COVER */}
      {details.frontPageImage && (
        <Box
          ref={frontRef}
          sx={{
            width: `${A4_PT.width}px`,
            height: `${A4_PT.height}px`,
          }}
        >
          <img
            src={getImageUrl(details.frontPageImage)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Box>
      )}

      {/* BACK COVER */}
      {details.backPageImage && (
        <Box
          ref={backRef}
          sx={{
            width: `${A4_PT.width}px`,
            height: `${A4_PT.height}px`,
          }}
        >
          <img
            src={getImageUrl(details.backPageImage)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Box>
      )}
    </Box>
  );
}
