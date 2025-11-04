import React, { useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import reportsData from "../data/reports.json";
import Summary_Repo from "../components/Summary_Repo";
import { Box, Button, Typography, Card, CardContent, Divider, Stack } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function ReportView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const reportRef = useRef();

  // Robust localStorage fetch
  let storedReports;
  try {
    storedReports = JSON.parse(localStorage.getItem("reportsData"));
    if (!Array.isArray(storedReports)) throw new Error();
  } catch {
    localStorage.setItem("reportsData", JSON.stringify(reportsData));
    storedReports = reportsData;
  }

  const report = storedReports.find((r) => String(r.id) === String(id));

  if (!report)
    return (
      <Box sx={{ p: 5 }}>
        <Typography color="error" variant="h6">Report not found</Typography>
      </Box>
    );

  const handleDownloadPdf = () => {
    const input = reportRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4"
      });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Calculate image height to maintain ratio
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // If bigger than a4, fit inside
      const finalHeight = imgHeight > pdfHeight ? pdfHeight : imgHeight;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, finalHeight);
      pdf.save(`report_${report.id}.pdf`);
    });
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4 },
        maxWidth: 1200,
        mx: "auto",
        width: "100%",
      }}
    >
      <Box
        sx={{
          mb: 3,
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          justifyContent: { xs: "center", sm: "flex-start" }
        }}
      >
        <Button
          variant="outlined"
          onClick={() => navigate(-1)}
          startIcon={<ArrowBackIcon />}
          sx={{ flexGrow: { xs: 1, sm: "unset" }, minWidth: { xs: "100%", sm: "auto" } }}
        >
          Back to Reports
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDownloadPdf}
          sx={{ flexGrow: { xs: 1, sm: "unset" }, minWidth: { xs: "100%", sm: "auto" } }}
        >
          Download PDF
        </Button>
      </Box>

      <Box
        ref={reportRef}
        sx={{
          width: "100%",
        }}
      >
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
                <b>Submitted:</b> {report.submitted}
              </Typography>
            </Stack>
            <Typography sx={{ mb: 1, fontSize: { xs: "0.9rem", sm: "1rem" } }}>
              <b>Contact:</b> {report.contact}
            </Typography>
          </CardContent>
        </Card>

        <Summary_Repo data={report.details} showFull={true} />
      </Box>
    </Box>
  );
}
