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
  InputAdornment,
  useTheme,
  useMediaQuery,
  Pagination,
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

  const { submissions, loading, error, pagination } = useSelector(
    (state) => state.reportInfo
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const delay = setTimeout(() => {
      dispatch(
        fetchAllSubmissions({
          page,
          pageSize: 20,
          search: searchQuery,
        })
      );
    }, 500);

    return () => clearTimeout(delay);
  }, [dispatch, page, searchQuery]);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

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

  const reportsArray = Array.isArray(submissions) ? submissions : [];

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
        justifyContent="space-between"
        flexWrap="wrap"
      >
        <TextField
          placeholder="Search by company, full name, or email..."
          value={searchQuery}
          onChange={handleSearchChange}
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
      </Stack>

      {/* ======= TABLE ======= */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          overflowX: "auto",
          boxShadow: "0px 2px 8px rgba(0,0,0,0.05)",
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
                "Date Submitted",
                "Date Started",
                "Requested",
                "Actions",
              ].map((head) => (
                <TableCell key={head} sx={{ fontWeight: "bold" }}>
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {reportsArray.length ? (
              reportsArray.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.company}</TableCell>
                  <TableCell>{row.full_name}</TableCell>
                  <TableCell>{row.email || "-"}</TableCell>
                  <TableCell>{row.contact || "-"}</TableCell>
                  <TableCell>{row.score}</TableCell>
                  <TableCell>{formatDate(row.submitted_at)}</TableCell>
                  <TableCell>{formatDate(row.started_at)}</TableCell>
                  <TableCell>{row.isEnquired ? "Yes" : "No"}</TableCell>

                  <TableCell>
                    <Stack
                      direction={isSmDown ? "column" : "row"}
                      spacing={1}
                      alignItems="center"
                      justifyContent={isSmDown ? "center" : "flex-start"}
                    >
                      <Button
                        size={isSmDown ? "small" : "medium"}
                        variant="contained"
                        startIcon={<Icon icon="tabler:edit" width={20} />}
                        onClick={() =>
                          navigate(`/admin/report/edit/${row.session_uuid}`)
                        }
                        sx={{
                          minWidth: 90,
                          background: "#18a16e",
                          textTransform: "none",
                        }}
                      >
                        Edit
                      </Button>

                      <Button
                        size={isSmDown ? "small" : "medium"}
                        variant="contained"
                        startIcon={<Icon icon="mdi:eye-outline" width={20} />}
                        onClick={() =>
                          navigate(`/admin/report/${row.session_uuid}`)
                        }
                        sx={{
                          minWidth: 90,
                          background: "#18a16e",
                          textTransform: "none",
                        }}
                      >
                        View
                      </Button>

                      {/* NEW Assessment button */}
                      <Button
                        size={isSmDown ? "small" : "medium"}
                        variant="contained"
                        startIcon={
                          <Icon icon="mdi:clipboard-text-outline" width={20} />
                        }
                        onClick={() =>
                          navigate(
                            `/admin/report/assessment/${row.session_uuid}`
                          )
                        }
                        sx={{
                          minWidth: 110,
                          background: "#18a16e",
                          textTransform: "none",
                        }}
                      >
                        Assessment
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                  {searchQuery
                    ? "No reports found matching your search."
                    : "No reports found."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ===  PREVIOUS / NEXT ALWAYS VISIBLE === */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          mt: 3,
        }}
      >
        <Button
          variant="contained"
          disabled={page <= 1}
          onClick={() => setPage((prev) => prev - 1)}
          sx={{ background: "#18a16e" }}
        >
          Previous
        </Button>

        <Typography>
          Page {page} of {pagination.totalPages || 1}
        </Typography>

        <Button
          variant="contained"
          disabled={page >= (pagination.totalPages || 1)}
          onClick={() => setPage((prev) => prev + 1)}
          sx={{ background: "#18a16e" }}
        >
          Next
        </Button>
      </Box>

      {/* ======= PAGINATION ======= */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Pagination
          count={pagination.totalPages || 1}
          page={page}
          onChange={handlePageChange}
          color="primary"
          showFirstButton
          showLastButton
          sx={{
            "& .MuiPaginationItem-root.Mui-selected": {
              backgroundColor: "#18a16e",
              color: "white",
            },
          }}
        />
      </Box>
    </Box>
  );
}
