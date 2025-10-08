

// import React from "react";
// import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
// import SecurityIcon from "@mui/icons-material/Security";
// import { useNavigate, useLocation } from "react-router-dom";

// const Navbar = ({ hideMenu = false }) => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Only show the Instant Report button on summary page
//   const onSummary =
//     location.pathname === "/assessment/summary";

//   return (
//     <AppBar position="static" color="default" elevation={1}>
//       <Toolbar sx={{ justifyContent: "space-between" }}>
//         {/* Logo */}
//         <Box display="flex" alignItems="center" gap={1}>
//           <SecurityIcon color="primary" />
//           <Box>
//             <Typography variant="h6" fontWeight="bold" color="text.primary">
//               HR Compliance Analyzer
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               AI-Powered Compliance Assessment
//             </Typography>
//           </Box>
//         </Box>

//         {/* Right menu (hidden if hideMenu) */}
//         {!hideMenu && (
//           <Box display="flex" gap={3}>
//             <Button color="inherit" onClick={() => navigate("/admin/login")}>
//               Admin
//             </Button>
//             {onSummary && (
//               <Button color="inherit">
//                 Instant Report 📄
//               </Button>
//             )}
//           </Box>
//         )}
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Navbar;



import React from "react";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = ({ hideMenu = false }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Only show the Instant Report button on summary page
  const onSummary = location.pathname === "/assessment/summary";

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Logo and Title */}
        <Box display="flex" alignItems="center" gap={1}>
          <SecurityIcon color="primary" />
          <Box>
            <Typography variant="h6" fontWeight="bold" color="text.primary">
              HR Compliance Analyzer
            </Typography>
            <Typography variant="body2" color="text.secondary">
              AI-Powered Compliance Assessment
            </Typography>
          </Box>
        </Box>

        {/* Right menu */}
        {!hideMenu && (
          <Box display="flex" gap={3}>
            <Button color="inherit" onClick={() => navigate("/admin/login")}>
              Admin
            </Button>
            {onSummary && (
              <Button color="inherit">
                Instant Report 📄
              </Button>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
