
// import React, { useEffect, useState } from "react";
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Box,
//   Button,
//   IconButton,
//   Menu,
//   MenuItem,
// } from "@mui/material";
// import SecurityIcon from "@mui/icons-material/Security";
// import MenuIcon from "@mui/icons-material/Menu";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { logout } from "../../redux/features/authSlice";

// import { LogOut } from "lucide-react";

// const Navbar = ({ hideMenu = false }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [currentPath, setCurrentPath] = useState(location.pathname);
//   const [anchorEl, setAnchorEl] = useState(null);

//   useEffect(() => {
//     setCurrentPath(location.pathname);
//   }, [location]);

//   const onSummary = currentPath === "/assessment/summary";
//   const isAdminPage = currentPath.startsWith("/admin") && currentPath !== "/admin/login";

//   const handleMenuOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };
//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const handleLogout = () => {
//     dispatch(logout());
//     navigate("/admin/login");
//   };

//   return (
//     <AppBar
//       position="static"
//       sx={{
//         backgroundColor: "#1565c0",
//         color: "white",
//         boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
//         borderRadius: 0,
//       }}
//     >
//       <Toolbar sx={{ justifyContent: "space-between", flexWrap: "wrap" }}>
//         {/* Logo and Title */}
//         <Box display="flex" alignItems="center" gap={1} sx={{ flexGrow: 1, minWidth: 0 }}>
//           <SecurityIcon sx={{ color: "white", fontSize: { xs: 28, sm: 32 } }} />
//           <Box sx={{ overflow: "hidden" }}>
//             <Typography
//               variant="h6"
//               fontWeight="bold"
//               color="inherit"
//               noWrap
//               sx={{ fontSize: { xs: 16, sm: 20 } }}
//             >
//               HR Compliance Analyzer
//             </Typography>
//             <Typography
//               variant="body2"
//               sx={{ color: "rgba(255,255,255,0.8)", fontSize: { xs: 10, sm: 14 } }}
//               noWrap
//             >
//               AI-Powered Compliance Assessment
//             </Typography>
//           </Box>
//         </Box>

//         {/* Right Menu for Desktop */}
//         {!hideMenu && (
//           <Box
//             sx={{
//               display: { xs: "none", md: "flex" },
//               gap: 2,
//               alignItems: "center",
//               flexShrink: 0,
//               ml: 2,
//             }}
//           >
//             <Button
//               variant="outlined"
//               sx={{
//                 color: "white",
//                 borderColor: "rgba(255,255,255,0.5)",
//                 "&:hover": {
//                   borderColor: "white",
//                   backgroundColor: "rgba(255,255,255,0.1)",
//                 },
//                 fontSize: { xs: 12, md: 14 },
//                 px: 2,
//               }}
//               onClick={() => navigate("/")}
//             >
//               Home
//             </Button>

//             <Button
//               variant="outlined"
//               sx={{
//                 color: "white",
//                 borderColor: "rgba(255,255,255,0.5)",
//                 "&:hover": {
//                   borderColor: "white",
//                   backgroundColor: "rgba(255,255,255,0.1)",
//                 },
//                 fontSize: { xs: 12, md: 14 },
//                 px: 2,
//               }}
//               onClick={() => navigate("/admin/dashboard")}
//             >
//               Admin
//             </Button>

//             {onSummary && (
//               <Button
//                 variant="contained"
//                 sx={{
//                   backgroundColor: "white",
//                   color: "#1565c0",
//                   fontWeight: 500,
//                   fontSize: { xs: 12, md: 14 },
//                   px: 3,
//                   "&:hover": { backgroundColor: "#f0f0f0" },
//                 }}
//               >
//                 Instant Report 📄
//               </Button>
//             )}

//             {/* Logout Button visible only on Admin pages */}
//             {isAdminPage && (
//               <Button
//                 variant="contained"
//                 startIcon={<LogOut />}
//                 color="error"
//                 onClick={handleLogout}
//                 sx={{
//                   fontSize: { xs: 12, md: 14 },
//                   px: 2,
//                 }}
//               >
//                 Logout
//               </Button>
//             )}
//           </Box>
//         )}

//         {/* Mobile Menu */}
//         {!hideMenu && (
//           <Box sx={{ display: { xs: "flex", md: "none" } }}>
//             <IconButton
//               size="large"
//               aria-label="menu"
//               aria-controls="mobile-menu"
//               aria-haspopup="true"
//               onClick={handleMenuOpen}
//               color="inherit"
//             >
//               <MenuIcon />
//             </IconButton>
//             <Menu
//               id="mobile-menu"
//               anchorEl={anchorEl}
//               open={Boolean(anchorEl)}
//               onClose={handleMenuClose}
//               anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//               transformOrigin={{ vertical: "top", horizontal: "right" }}
//             >
//               <MenuItem
//                 onClick={() => {
//                   navigate("/");
//                   handleMenuClose();
//                 }}
//               >
//                 Home
//               </MenuItem>
//               <MenuItem
//                 onClick={() => {
//                   navigate("/admin/dashboard");
//                   handleMenuClose();
//                 }}
//               >
//                 Admin
//               </MenuItem>
//               {onSummary && <MenuItem onClick={handleMenuClose}>Instant Report 📄</MenuItem>}

//               {isAdminPage && (
//                 <MenuItem
//                   onClick={() => {
//                     handleLogout();
//                     handleMenuClose();
//                   }}
//                 >
//                   Logout
//                 </MenuItem>
//               )}
//             </Menu>
//           </Box>
//         )}
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Navbar;









import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/features/authSlice";
import { LogOut } from "lucide-react";

const Navbar = ({ hideMenu = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [currentPath, setCurrentPath] = useState(location.pathname);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location]);

  const onSummary = currentPath === "/assessment/summary";
  const isAdminPage =
    currentPath.startsWith("/admin") && currentPath !== "/admin/login";

  // Show Admin button only on landing ("/") or any "/admin" route except "/admin/login"
  const showAdminBtn = currentPath === "/" || currentPath.startsWith("/admin");

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/admin/login");
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#1565c0",
        color: "white",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        borderRadius: 0,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", flexWrap: "wrap" }}>
        {/* Logo and Title */}
        <Box display="flex" alignItems="center" gap={1} sx={{ flexGrow: 1, minWidth: 0 }}>
          <SecurityIcon sx={{ color: "white", fontSize: { xs: 28, sm: 32 } }} />
          <Box sx={{ overflow: "hidden" }}>
            <Typography
              variant="h6"
              fontWeight="bold"
              color="inherit"
              noWrap
              sx={{ fontSize: { xs: 16, sm: 20 } }}
            >
              HR Compliance Analyzer
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "rgba(255,255,255,0.8)", fontSize: { xs: 10, sm: 14 } }}
              noWrap
            >
              AI-Powered Compliance Assessment
            </Typography>
          </Box>
        </Box>

        {/* Right Menu for Desktop */}
        {!hideMenu && (
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 2,
              alignItems: "center",
              flexShrink: 0,
              ml: 2,
            }}
          >
            <Button
              variant="outlined"
              sx={{
                color: "white",
                borderColor: "rgba(255,255,255,0.5)",
                "&:hover": {
                  borderColor: "white",
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
                fontSize: { xs: 12, md: 14 },
                px: 2,
              }}
              onClick={() => navigate("/")}
            >
              Home
            </Button>

            {showAdminBtn && (
              <Button
                variant="outlined"
                sx={{
                  color: "white",
                  borderColor: "rgba(255,255,255,0.5)",
                  "&:hover": {
                    borderColor: "white",
                    backgroundColor: "rgba(255,255,255,0.1)",
                  },
                  fontSize: { xs: 12, md: 14 },
                  px: 2,
                }}
                onClick={() => navigate("/admin/dashboard")}
              >
                Admin
              </Button>
            )}

            {onSummary && (
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "white",
                  color: "#1565c0",
                  fontWeight: 500,
                  fontSize: { xs: 12, md: 14 },
                  px: 3,
                  "&:hover": { backgroundColor: "#f0f0f0" },
                }}
              >
                Instant Report 📄
              </Button>
            )}

            {/* Logout Button visible only on Admin pages */}
            {isAdminPage && (
              <Button
                variant="contained"
                startIcon={<LogOut />}
                color="error"
                onClick={handleLogout}
                sx={{
                  fontSize: { xs: 12, md: 14 },
                  px: 2,
                }}
              >
                Logout
              </Button>
            )}
          </Box>
        )}

        {/* Mobile Menu */}
        {!hideMenu && (
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="mobile-menu"
              aria-haspopup="true"
              onClick={handleMenuOpen}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="mobile-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem
                onClick={() => {
                  navigate("/");
                  handleMenuClose();
                }}
              >
                Home
              </MenuItem>
              {showAdminBtn && (
                <MenuItem
                  onClick={() => {
                    navigate("/admin/dashboard");
                    handleMenuClose();
                  }}
                >
                  Admin
                </MenuItem>
              )}
              {onSummary && <MenuItem onClick={handleMenuClose}>Instant Report 📄</MenuItem>}

              {isAdminPage && (
                <MenuItem
                  onClick={() => {
                    handleLogout();
                    handleMenuClose();
                  }}
                >
                  Logout
                </MenuItem>
              )}
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;


