// import React, { useState } from "react";
// import {
//   Box,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Button,
//   Stack,
//   TextField,
//   MenuItem,
//   Select,
//   InputAdornment
// } from "@mui/material";
// import { Icon } from "@iconify/react";
// import reportsData from "../data/reports.json"; // import from JSON file

// export default function ReportPage() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All Status");

//   const filteredReports = reportsData.filter((r) => {
//     const matchesSearch =
//       r.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       r.id.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesStatus =
//       statusFilter === "All Status" || r.status === statusFilter;
//     return matchesSearch && matchesStatus;
//   });

//   return (
//     <Box p={4}>
//       {/* Header Section */}
//       <Stack direction="row" alignItems="center" spacing={1} mb={2}>
//         <Icon icon="line-md:document-report" width="32" height="32" />
//         <Typography variant="h4" fontWeight="bold">
//           Reports
//         </Typography>
//       </Stack>
//       <Typography mb={4}>
//         Review, enhance, and manage HR compliance assessment reports.
//       </Typography>

//       {/* Search + Filter + Export */}
//       <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={3} alignItems="center">
//         <TextField
//           placeholder="Search by name, company, or report ID..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           variant="outlined"
//           size="small"
//           sx={{ flexGrow: 1, minWidth: 300 }}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <Icon icon="material-symbols:search" color="#888" />
//               </InputAdornment>
//             ),
//           }}
//         />
//         <Select
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value)}
//           size="small"
//           sx={{ width: 180 }}
//         >
//           <MenuItem value="All Status">All Status</MenuItem>
//           <MenuItem value="Completed">Completed</MenuItem>
//           <MenuItem value="Enhanced">Enhanced</MenuItem>
//           <MenuItem value="In Review">In Review</MenuItem>
//           <MenuItem value="Pending">Pending</MenuItem>
//         </Select>
//         <Button
//           variant="contained"
//           color="primary"
//           startIcon={<Icon icon="mdi:export" />}
//           onClick={() => console.log("Export clicked")}
//           sx={{ textTransform: "none", borderRadius: "8px", px: 2.5 }}
//         >
//           Export
//         </Button>
//       </Stack>

//       {/* Table Section */}
//       <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: "hidden" }}>
//         <Table>
//           <TableHead>
//             <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
//               <TableCell><strong>Report ID</strong></TableCell>
//               <TableCell><strong>User/Company</strong></TableCell>
//               <TableCell><strong>Date Submitted</strong></TableCell>
//               <TableCell><strong>Contact</strong></TableCell>
//               <TableCell><strong>Score</strong></TableCell>
//               <TableCell><strong>Status</strong></TableCell>
//               <TableCell><strong>Actions</strong></TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {filteredReports.map((row) => (
//               <TableRow key={row.id} hover>
//                 <TableCell>{row.id}</TableCell>
//                 <TableCell>{row.company}</TableCell>
//                 <TableCell>{row.submitted}</TableCell>
//                 <TableCell>{row.contact}</TableCell>
//                 <TableCell>{row.score}</TableCell>
//                 <TableCell>{row.status}</TableCell>
//                 <TableCell>
//                   <Stack direction="row" spacing={1}>
//                     <Button
//                       size="small"
//                       variant="outlined"
//                       color="primary"
//                       startIcon={<Icon icon="tabler:edit" width="20" height="20" />}
//                     >
//                       Edit
//                     </Button>
//                     <Button
//                       size="small"
//                       variant="contained"
//                       color="secondary"
//                       startIcon={<Icon icon="mdi:eye-outline" width="20" height="20" />}
//                     >
//                       View
//                     </Button>
//                   </Stack>
//                 </TableCell>
//               </TableRow>
//             ))}
//             {filteredReports.length === 0 && (
//               <TableRow>
//                 <TableCell colSpan={7} align="center">
//                   No reports found.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );
// }




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
  InputAdornment
} from "@mui/material";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import reportsData from "../data/reports.json";

export default function ReportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const navigate = useNavigate();

  const filteredReports = reportsData.filter((r) => {
    const matchesSearch =
      r.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "All Status" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Box p={4}>
      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        <Icon icon="line-md:document-report" width="32" height="32" />
        <Typography variant="h4" fontWeight="bold">
          Reports
        </Typography>
      </Stack>
      <Typography mb={4}>
        Review, enhance, and manage HR compliance assessment reports.
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={3} alignItems="center">
        <TextField
          placeholder="Search by name, company, or report ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          variant="outlined"
          size="small"
          sx={{ flexGrow: 1, minWidth: 300 }}
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
          sx={{ width: 180 }}
        >
          <MenuItem value="All Status">All Status</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
          <MenuItem value="Enhanced">Enhanced</MenuItem>
          <MenuItem value="In Review">In Review</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
        </Select>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Icon icon="mdi:export" />}
          onClick={() => console.log("Export clicked")}
          sx={{ textTransform: "none", borderRadius: "8px", px: 2.5 }}
        >
          Export
        </Button>
      </Stack>

      <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell><strong>Report ID</strong></TableCell>
              <TableCell><strong>User/Company</strong></TableCell>
              <TableCell><strong>Date Submitted</strong></TableCell>
              <TableCell><strong>Contact</strong></TableCell>
              <TableCell><strong>Score</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
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
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      startIcon={<Icon icon="tabler:edit" width="20" height="20" />}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="secondary"
                      startIcon={<Icon icon="mdi:eye-outline" width="20" height="20" />}
                      onClick={() => navigate(`/admin/report/${row.id}`)}

                    >
                      View
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            {filteredReports.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
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
