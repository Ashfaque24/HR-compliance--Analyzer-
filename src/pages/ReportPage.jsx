import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Stack,
  TextField,
  MenuItem,
  Select,
  InputAdornment,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllSubmissions } from "../redux/features/reportInfoSlice";
import LoadingSpinner from "../components/common/LoadingSpinner";

export default function ReportPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));
  const isMdDown = useMediaQuery(theme.breakpoints.down("md"));

  const { submissions, loading, error } = useSelector(
    (state) => state.reportInfo
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  useEffect(() => {
    dispatch(fetchAllSubmissions());
  }, [dispatch]);

  const reportsArray = Array.isArray(submissions) ? submissions : [];

  const filteredReports = reportsArray.filter((r) => {
    const query = searchQuery.toLowerCase();
    const companyMatch = r.company.toLowerCase().includes(query);
    const nameMatch = r.full_name.toLowerCase().includes(query);
    const emailMatch = (r.email || "").toLowerCase().includes(query);

    const matchesSearch = companyMatch || nameMatch || emailMatch;
    const matchesStatus =
      statusFilter === "All Status" || r.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) return <LoadingSpinner message="Loading reports..." />;

  if (error)
    return (
      <Box sx={{ p: 5, textAlign: "center" }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <Box p={{ xs: 2, sm: 3, md: 4 }}>
      {/* ======= PAGE HEADER ======= */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        mb={2}
        flexWrap="wrap"
      >
        <Icon icon="line-md:document-report" width={32} height={32} />
        <Typography variant={isSmDown ? "h5" : "h4"} fontWeight="bold" noWrap>
          Reports
        </Typography>
      </Stack>

      <Button
        variant="contained"
        onClick={() => navigate("/admin/dashboard/")}
        sx={{
          mb: 3,
          width: isSmDown ? "100%" : "auto",
          background: "#18a16e",
        }}
        size={isSmDown ? "small" : "medium"}
      >
        Back to Dashboard
      </Button>

      <Typography
        mb={4}
        sx={{ fontSize: isSmDown ? "0.9rem" : "1rem", opacity: 0.8 }}
      >
        Review, enhance, and manage HR compliance assessment reports.
      </Typography>

      {/* ======= FILTERS ======= */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        mb={3}
        alignItems={{ xs: "stretch", sm: "center" }}
        flexWrap="wrap"
      >
        {/* Search */}
        <TextField
          placeholder="Search by company, full name, or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          variant="outlined"
          size="small"
          fullWidth={isSmDown}
          sx={{
            flexGrow: 1,
            maxWidth: isSmDown ? "100%" : 420,
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Icon icon="material-symbols:search" color="#888" />
              </InputAdornment>
            ),
          }}
        />

        {/* Status Filter */}
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          size="small"
          fullWidth={isSmDown}
          sx={{ width: isSmDown ? "100%" : 200 }}
        >
          <MenuItem value="All Status">All Status</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
          <MenuItem value="Enhanced">Enhanced</MenuItem>
          <MenuItem value="In Review">In Review</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="In Progress">In Progress</MenuItem>
        </Select>
      </Stack>

      {/* ======= TABLE ======= */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          overflowX: "auto",
          boxShadow: "0px 2px 8px rgba(0,0,0,0.05)",
          "&::-webkit-scrollbar": { height: 6 },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#ccc",
            borderRadius: 3,
          },
        }}
      >
        <Table sx={{ minWidth: 900 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              {[
                "Company",
                "Full Name",
                "Email",
                "Contact",
                "Score",
                "Status",
                "Date Submitted",
                "Date Started",
                "Actions",
              ].map((head) => (
                <TableCell key={head} sx={{ fontWeight: "bold" }}>
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredReports.length ? (
              filteredReports.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.company}</TableCell>
                  <TableCell>{row.full_name}</TableCell>
                  <TableCell>{row.email || "-"}</TableCell>
                  <TableCell>{row.contact || "-"}</TableCell>
                  <TableCell>{row.score}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>{formatDate(row.submitted_at)}</TableCell>
                  <TableCell>{formatDate(row.started_at)}</TableCell>

                  {/* ======= ACTION BUTTONS ======= */}
                  <TableCell>
                    <Stack
                      direction={isSmDown ? "column" : "row"}
                      spacing={1}
                      alignItems="center"
                      justifyContent={isSmDown ? "center" : "flex-start"}
                      sx={{ width: "100%" }}
                    >
                      {/* Edit */}
                      <Button
                        size={isSmDown ? "small" : "medium"}
                        variant="contained"
                        startIcon={
                          <Icon icon="tabler:edit" width={20} height={20} />
                        }
                        onClick={() =>
                          navigate(`/admin/report/edit/${row.session_uuid}`)
                        }
                        sx={{
                          minWidth: 90,
                          width: isSmDown ? "100%" : "auto",
                          background: "#18a16e",
                          textTransform: "none",
                        }}
                      >
                        Edit
                      </Button>

                      {/* View */}
                      <Button
                        size={isSmDown ? "small" : "medium"}
                        variant="contained"
                        startIcon={
                          <Icon icon="mdi:eye-outline" width={20} height={20} />
                        }
                        onClick={() =>
                          navigate(`/admin/report/${row.session_uuid}`)
                        }
                        sx={{
                          minWidth: 90,
                          width: isSmDown ? "100%" : "auto",
                          background: "#18a16e",
                          textTransform: "none",
                        }}
                      >
                        View
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
