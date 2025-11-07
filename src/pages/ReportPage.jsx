
import React, { useEffect, useState } from "react";
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Stack, TextField, MenuItem, Select, InputAdornment,
  useTheme, useMediaQuery,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllSubmissions } from "../redux/features/reportInfoSlice";

export default function ReportPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));

  const { submissions, loading, error } = useSelector((state) => state.reportInfo);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  useEffect(() => {
    dispatch(fetchAllSubmissions());
  }, [dispatch]);

  const reportsArray = Array.isArray(submissions) ? submissions : [];

  const filteredReports = reportsArray.filter((r) => {
    const companyMatch = r.company.toLowerCase().includes(searchQuery.toLowerCase());
    const nameMatch = r.full_name.toLowerCase().includes(searchQuery.toLowerCase());
    const emailMatch = (r.email || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSearch = companyMatch || nameMatch || emailMatch;
    const matchesStatus = statusFilter === "All Status" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <Box sx={{ p: 5, textAlign: "center" }}>
        <Typography>Loading reports...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 5, textAlign: "center" }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  // Helper: format date or fallback
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <Box p={{ xs: 2, sm: 4 }}>
      <Stack direction="row" alignItems="center" spacing={1} mb={2} flexWrap="wrap">
        <Icon icon="line-md:document-report" width={32} height={32} />
        <Typography variant={isSmDown ? "h5" : "h4"} fontWeight="bold" noWrap>
          Reports
        </Typography>
      </Stack>

      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/admin/dashboard/")}
        sx={{ mb: 3, width: isSmDown ? "100%" : "auto" }}
        size={isSmDown ? "small" : "medium"}
      >
        Back to Dashboard
      </Button>

      <Typography mb={4} sx={{ fontSize: isSmDown ? "0.9rem" : "1rem" }}>
        Review, enhance, and manage HR compliance assessment reports.
      </Typography>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        mb={3}
        alignItems="center"
        flexWrap="wrap"
      >
        <TextField
          placeholder="Search by company, full name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          variant="outlined"
          size="small"
          sx={{ flexGrow: 1, minWidth: 200, maxWidth: isSmDown ? "100%" : 400 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Icon icon="material-symbols:search" color="#888" />
              </InputAdornment>
            ),
          }}
        />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          size="small"
          sx={{ width: isSmDown ? "100%" : 180, maxWidth: 180 }}
        >
          <MenuItem value="All Status">All Status</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
          <MenuItem value="Enhanced">Enhanced</MenuItem>
          <MenuItem value="In Review">In Review</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="In Progress">In Progress</MenuItem>
        </Select>
      </Stack>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          overflowX: "auto",
          "&::-webkit-scrollbar": { height: 6 },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#ccc",
            borderRadius: 3,
          },
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ minWidth: 150 }}><strong>Company</strong></TableCell>
              <TableCell sx={{ minWidth: 150 }}><strong>Full Name</strong></TableCell>
              <TableCell sx={{ minWidth: 150 }}><strong>Email</strong></TableCell>
              <TableCell sx={{ minWidth: 150 }}><strong>Contact</strong></TableCell>
              <TableCell sx={{ minWidth: 70 }}><strong>Score</strong></TableCell>
              <TableCell sx={{ minWidth: 100 }}><strong>Status</strong></TableCell>
              <TableCell sx={{ minWidth: 120 }}><strong>Date Submitted</strong></TableCell>
              <TableCell sx={{ minWidth: 120 }}><strong>Date Started</strong></TableCell>
              <TableCell sx={{ minWidth: 180 }}><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReports.length ? (
              filteredReports.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.company}</TableCell>
                  <TableCell>{row.full_name}</TableCell>
                  <TableCell>{row.email !== "-" ? row.email : "-"}</TableCell>
                  <TableCell>{row.contact !== "-" ? row.contact : "-"}</TableCell>
                  <TableCell>{row.score}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>{formatDate(row.submitted_at)}</TableCell>
                  <TableCell>{formatDate(row.started_at)}</TableCell>
                  <TableCell>
                    <Stack
                      direction="row"
                      spacing={1}
                      flexWrap={isSmDown ? "wrap" : "nowrap"}
                      justifyContent={isSmDown ? "center" : "flex-start"}
                    >
                      <Button
                        size={isSmDown ? "small" : "medium"}
                        variant="outlined"
                        color="primary"
                        startIcon={<Icon icon="tabler:edit" width={20} height={20} />}
                        onClick={() => navigate(`/admin/report/edit/${row.session_uuid}`)}
                        sx={{ minWidth: 80 }}
                      >
                        Edit
                      </Button>
                      <Button
                        size={isSmDown ? "small" : "medium"}
                        variant="contained"
                        color="secondary"
                        startIcon={<Icon icon="mdi:eye-outline" width={20} height={20} />}
                        onClick={() => navigate(`/admin/report/${row.session_uuid}`)}
                        sx={{ minWidth: 110 }}
                      >
                        View Report
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                  No reports found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
