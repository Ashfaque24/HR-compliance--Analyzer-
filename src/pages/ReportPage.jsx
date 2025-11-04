import React, { useState } from "react";
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
import reportsData from "../data/reports.json";

export default function ReportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const navigate = useNavigate();

  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down("sm")); 

  const filteredReports = reportsData.filter((r) => {
    const matchesSearch =
      r.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All Status" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
          placeholder="Search by name, company, or report ID..."
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
        </Select>
        {/* <Button
          variant="contained"
          color="primary"
          startIcon={<Icon icon="mdi:export" />}
          onClick={() => console.log("Export clicked")}
          sx={{
            textTransform: "none",
            borderRadius: "8px",
            px: 2.5,
            width: isSmDown ? "100%" : "auto",
          }}
          size={isSmDown ? "small" : "medium"}
        >
          Export
        </Button> */}
      </Stack>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          overflowX: "auto",
          // Small devices scroll horizontally if table wider than screen
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
              <TableCell sx={{ minWidth: 100 }}>
                <strong>Report ID</strong>
              </TableCell>
              <TableCell sx={{ minWidth: 150 }}>
                <strong>User/Company</strong>
              </TableCell>
              <TableCell sx={{ minWidth: 120 }}>
                <strong>Date Submitted</strong>
              </TableCell>
              <TableCell sx={{ minWidth: 150 }}>
                <strong>Contact</strong>
              </TableCell>
              <TableCell sx={{ minWidth: 70 }}>
                <strong>Score</strong>
              </TableCell>
              <TableCell sx={{ minWidth: 100 }}>
                <strong>Status</strong>
              </TableCell>
              <TableCell sx={{ minWidth: 180 }}>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReports.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.company}</TableCell>
                <TableCell>{row.submitted}</TableCell>
                <TableCell>{row.contact}</TableCell>
                <TableCell>{row.score}</TableCell>
                <TableCell>{row.status}</TableCell>
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
                      onClick={() => navigate(`/admin/report/edit/${row.id}`)}
                      sx={{ minWidth: 80 }}
                    >
                      Edit
                    </Button>
                    <Button
                      size={isSmDown ? "small" : "medium"}
                      variant="contained"
                      color="secondary"
                      startIcon={<Icon icon="mdi:eye-outline" width={20} height={20} />}
                      onClick={() => navigate(`/admin/report/${row.id}`)}
                      sx={{ minWidth: 110 }}
                    >
                      View Report
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            {filteredReports.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
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

