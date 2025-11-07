
import React, { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminReport, clearReport } from "../redux/features/adminReportSlice";
import Summary_Repo from "../components/Summary_Repo";
import { Box, Button, Typography, Card, CardContent, Divider, Stack } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function ReportView() {
  const { id } = useParams(); // session_uuid param
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reportRef = useRef();

  const { report, loading, error } = useSelector((state) => state.adminReport);

  useEffect(() => {
    if (id) dispatch(fetchAdminReport(id));
    return () => dispatch(clearReport());
  }, [id, dispatch]);

  if (loading) return <Box sx={{ p: 5 }}><Typography>Loading...</Typography></Box>;
  if (error) return <Box sx={{ p: 5 }}><Typography color="error">{error}</Typography></Box>;
  if (!report) return <Box sx={{ p: 5 }}><Typography color="error">Report not found</Typography></Box>;

  const handleDownloadPdf = () => {
    const input = reportRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
      const finalHeight = imgHeight > pdfHeight ? pdfHeight : imgHeight;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, finalHeight);
      pdf.save(`report_${report.id}.pdf`);
    });
  };

  // Normalize submitted date display with fallback
  const submittedDate = report.submitted || "N/A";

  // Normalize contact display
  const contactInfo = report.contact || "N/A";

  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, maxWidth: 1200, mx: "auto", width: "100%" }}>
      <Box sx={{ mb: 3, display: "flex", flexWrap: "wrap", gap: 2, justifyContent: { xs: "center", sm: "flex-start" } }}>
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

      <Box ref={reportRef} sx={{ width: "100%" }}>
        <Card elevation={4} sx={{ mb: 4, p: { xs: 2, sm: 3 }, borderRadius: 3, width: "100%", boxSizing: "border-box" }}>
          <CardContent>
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: "1.5rem", sm: "2.125rem" } }}>
              {report.company}
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems={{ xs: "flex-start", sm: "center" }} sx={{ mb: 1 }}>
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

        {/* Summary report details */}
        <Summary_Repo data={report.details} showFull={true} />
      </Box>
    </Box>
  );
}
