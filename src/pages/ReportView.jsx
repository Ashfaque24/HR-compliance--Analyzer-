import React, { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminReport, clearReport } from "../redux/features/adminReportSlice";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Summary_Repo from "../components/Summary_Repo";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Divider,
  Stack,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function ReportView() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reportRef = useRef();

  const { report, loading, error } = useSelector((state) => state.adminReport);

  useEffect(() => {
    if (id) dispatch(fetchAdminReport(id));
    return () => dispatch(clearReport());
  }, [id, dispatch]);

  if (loading)
    return <LoadingSpinner message="Loading report..." />;
  if (error)
    return (
      <Box sx={{ p: 5 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  if (!report)
    return (
      <Box sx={{ p: 5 }}>
        <Typography color="error">Report not found</Typography>
      </Box>
    );

  const handleDownloadPdf = () => {
    const input = reportRef.current;
    if (!input) return;

    const margin = 56; // ~20mm
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const contentWidth = pdfWidth - margin * 2;

    html2canvas(input, {
      scale: 3,
      useCORS: true,
      scrollX: 0,
      scrollY: -window.scrollY,
      backgroundColor: "#ffffff",
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png", 1.0);
      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const maxContentHeight = pdfHeight * 2 - margin * 2;
      let scaledHeight = imgHeight;

      if (imgHeight > maxContentHeight) {
        const scaleFactor = maxContentHeight / imgHeight;
        scaledHeight = imgHeight * scaleFactor;
      }

      if (scaledHeight <= pdfHeight - margin * 2) {
        // Fits in one page
        const y = (pdfHeight - scaledHeight) / 2;
        pdf.addImage(imgData, "PNG", margin, y, imgWidth, scaledHeight, "", "FAST");
      } else {
        // Split into two pages
        const firstPageHeight = pdfHeight - margin * 2;
        const canvasPageHeight = (canvas.height * firstPageHeight) / scaledHeight;

        // First page canvas
        const firstCanvas = document.createElement("canvas");
        firstCanvas.width = canvas.width;
        firstCanvas.height = canvasPageHeight;
        const ctx1 = firstCanvas.getContext("2d");
        ctx1.drawImage(
          canvas,
          0,
          0,
          canvas.width,
          canvasPageHeight,
          0,
          0,
          canvas.width,
          canvasPageHeight
        );
        const firstImg = firstCanvas.toDataURL("image/png", 1.0);
        pdf.addImage(firstImg, "PNG", margin, margin, imgWidth, firstPageHeight, "", "FAST");
        pdf.addPage();

        // Second page canvas
        const secondCanvas = document.createElement("canvas");
        secondCanvas.width = canvas.width;
        secondCanvas.height = canvas.height - canvasPageHeight;
        const ctx2 = secondCanvas.getContext("2d");
        ctx2.drawImage(
          canvas,
          0,
          canvasPageHeight,
          canvas.width,
          canvas.height - canvasPageHeight,
          0,
          0,
          canvas.width,
          canvas.height - canvasPageHeight
        );
        const secondImg = secondCanvas.toDataURL("image/png", 1.0);
        const secondPageHeight = scaledHeight - firstPageHeight;
        pdf.addImage(secondImg, "PNG", margin, margin, imgWidth, secondPageHeight, "", "FAST");
      }

      pdf.save(`report_${report.id}.pdf`);
    });
  };

  const submittedDate = report.submitted || "N/A";
  const contactInfo = report.contact || "N/A";

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4 },
        maxWidth: 1200,
        mx: "auto",
        width: "100%",
      }}
    >
      {/* Top Buttons */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          justifyContent: { xs: "center", sm: "flex-start" },
        }}
      >
        <Button
          variant="contained"
          onClick={() => navigate(-1)}
          startIcon={<ArrowBackIcon />}
          sx={{
            flexGrow: { xs: 1, sm: "unset" },
            minWidth: { xs: "100%", sm: "auto" },
            background: "#18a16e",
          }}
        >
          Back to Reports
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDownloadPdf}
          sx={{
            flexGrow: { xs: 1, sm: "unset" },
            minWidth: { xs: "100%", sm: "auto" },
            background: "#18a16e",
          }}
        >
          Download PDF
        </Button>
      </Box>

      {/* Report Section */}
      <Box ref={reportRef} sx={{ width: "100%" }}>
        <Card
          elevation={4}
          sx={{
            mb: 4,
            p: { xs: 2, sm: 3 },
            borderRadius: 3,
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <CardContent>
            <Typography
              variant="h4"
              fontWeight="bold"
              gutterBottom
              sx={{ fontSize: { xs: "1.5rem", sm: "2.125rem" } }}
            >
              {report.company}
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={3}
              alignItems={{ xs: "flex-start", sm: "center" }}
              sx={{ mb: 1 }}
            >
              <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                <b>ID:</b> {report.id}
              </Typography>
              <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                <b>Status:</b> {report.status}
              </Typography>
              <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                <b>Submitted:</b> {submittedDate}
              </Typography>
            </Stack>
            <Typography sx={{ mb: 1, fontSize: { xs: "0.9rem", sm: "1rem" } }}>
              <b>Contact:</b> {contactInfo}
            </Typography>
          </CardContent>
        </Card>

        {/* Summary Report */}
        <Summary_Repo data={report.details} showFull={true} />
      </Box>
    </Box>
  );
}
