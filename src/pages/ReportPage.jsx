import React, { useEffect, useState, useCallback } from "react";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Safely get totalPages for component use
  const totalPages = pagination?.totalPages || 1;

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      // Only update if search actually changed
      if (searchQuery !== debouncedSearch) {
        setDebouncedSearch(searchQuery);
        setCurrentPage(1); // Reset to page 1 when search changes
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, debouncedSearch]);

  // Fetch data when page or debouncedSearch changes
  useEffect(() => {
    dispatch(
      fetchAllSubmissions({
        page: currentPage,
        pageSize: 20,
        search: debouncedSearch,
      })
    );
  }, [dispatch, currentPage, debouncedSearch]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading && submissions.length === 0) {
    return <LoadingSpinner message="Loading reports..." />;
  }

  if (error && submissions.length === 0) {
    return (
      <Box sx={{ p: 5, textAlign: "center" }}>
        <Typography color="error">{error}</Typography>
        <Button
          variant="contained"
          onClick={() =>
            dispatch(fetchAllSubmissions({ page: 1, pageSize: 20, search: "" }))
          }
          sx={{ mt: 2, background: "#18a16e" }}
        >
          Retry
        </Button>
      </Box>
    );
  }

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

      {/* Loading Overlay */}
      {loading && (
        <Box sx={{ textAlign: "center", py: 2 }}>
          <Typography color="primary">Loading...</Typography>
        </Box>
      )}

      {/* ======= TABLE ======= */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          overflowX: "auto",
          boxShadow: "0px 2px 8px rgba(0,0,0,0.05)",
          opacity: loading ? 0.6 : 1,
          transition: "opacity 0.3s",
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
                      direction={{ xs: "row", sm: "row" }}
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

      {/* ===  PREVIOUS / NEXT BUTTONS === */}
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
          disabled={currentPage <= 1 || loading}
          onClick={handlePreviousPage}
          sx={{
            background: "#18a16e",
            "&:disabled": {
              background: "#ccc",
            },
          }}
        >
          Previous
        </Button>

        <Typography>
          Page {currentPage} of {totalPages}
        </Typography>

        <Button
          variant="contained"
          disabled={currentPage >= totalPages || loading}
          onClick={handleNextPage}
          sx={{
            background: "#18a16e",
            "&:disabled": {
              background: "#ccc",
            },
          }}
        >
          Next
        </Button>
      </Box>

      {/* ======= PAGINATION ======= */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          showFirstButton
          showLastButton
          disabled={loading}
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
