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
//   const isAdminPage =
//     currentPath.startsWith("/admin") && currentPath !== "/admin/login";

//   // Show Admin button only on landing ("/") or any "/admin" route except "/admin/login"
//   const showAdminBtn = currentPath === "/" || currentPath.startsWith("/admin");

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
// // #1565c0
//   return (
//     <AppBar
//       position="static"
//       sx={{
//         backgroundColor: "#18a16e",
//         color: "white",
//         boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
//         borderRadius: 0,
//       }}
//     >
//       <Toolbar sx={{ justifyContent: "space-between", flexWrap: "wrap" }}>
//         {/* Logo and Title */}
//         <Box
//   display="flex"
//   alignItems="center"
//   gap={1.5}
//   sx={{ flexGrow: 1, minWidth: 0 }}
// >
//   {/* Logo in white box */}
//   <Box
//     sx={{
//       bgcolor: "white",
//       borderRadius: 2,  
//                   // 2 = 16px; use "50%" if you want a circle
//                    // inner padding around the logo
//                    p:0,
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//     }}
//   >
//     <Box
//       component="img"
//       src="/assets/Short Logo2.png"
//       alt="logo"
//       sx={{
//         width: { xs: 40, sm: 60 },  // bigger logo
//         height: { xs: 40, sm: 60 },
//         objectFit: "contain",
//         display: "block",
//       }}
//     />
//   </Box>

//   <Box sx={{ overflow: "hidden" }}>
//     <Typography
//       variant="h6"
//       fontWeight="bold"
//       color="inherit"
//       noWrap
//       sx={{ fontSize: { xs: 16, sm: 20 } }}
//     >
//       HR Compliance Health Checker
//     </Typography>
//     <Typography
//       variant="body2"
//       sx={{
//         color: "rgba(255,255,255,0.8)",
//         fontSize: { xs: 10, sm: 14 },
//       }}
//       noWrap
//     >
//       AI-Powered Compliance Assessment
//     </Typography>
//   </Box>
// </Box>


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
//               variant="contained"
//               sx={{
//                 backgroundColor: "#FFFFFF", // white background
//                 color: "#000000", // blue text for contrast
//                 borderColor: "#FFFFFF", // white border
//                 "&:hover": {
//                   backgroundColor: "#f0f0f0", // light gray on hover
//                   borderColor: "#f0f0f0",
//                 },
//                 fontSize: { xs: 12, md: 14 },
//                 px: 2,
//                 textTransform: "none",
//               }}
//               onClick={() => navigate("/")}
//             >
//               Home
//             </Button>

//             {showAdminBtn && (
//               <Button
//                 variant="contained"
//                 sx={{
//                   backgroundColor: "#FFFFFF", // white background
//                   color: "#000000", // black text
//                   borderColor: "#FFFFFF",
//                   "&:hover": {
//                     backgroundColor: "#f0f0f0", // light gray hover effect
//                     borderColor: "#f0f0f0",
//                   },
//                   fontSize: { xs: 12, md: 14 },
//                   px: 2,
//                   textTransform: "none",
//                 }}
//                 onClick={() => navigate("/admin/dashboard")}
//               >
//                 Admin
//               </Button>
//             )}

//             {/* Logout Button visible only on Admin pages */}
//             {isAdminPage && (
//               <Button
//                 variant="contained"
//                 startIcon={<LogOut />}
//                 onClick={handleLogout}
//                 sx={{
//                   backgroundColor: "#FFFFFF", // white background
//                   color: "#000000", // black text
//                   borderColor: "#FFFFFF",
//                   "&:hover": {
//                     backgroundColor: "#f0f0f0", // light gray hover effect
//                     borderColor: "#f0f0f0",
//                   },
//                   fontSize: { xs: 12, md: 14 },
//                   px: 2,
//                   textTransform: "none",
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
//               {showAdminBtn && (
//                 <MenuItem
//                   onClick={() => {
//                     navigate("/admin/dashboard");
//                     handleMenuClose();
//                   }}
//                 >
//                   Admin
//                 </MenuItem>
//               )}

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
        backgroundColor: "#18a16e",
        color: "white",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        borderRadius: 0,
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          flexWrap: "nowrap",
          minWidth: 0,
          px: { xs: 1, sm: 2 }, // less horizontal padding so text gets more space
        }}
      >
        {/* Logo and Title */}
        <Box
          display="flex"
          alignItems="center"
          gap={{ xs: 1, sm: 1.5 }} // smaller gap on mobile
          sx={{
            flexGrow: 1,
            flexShrink: 1,
            minWidth: 0,
            overflow: "hidden",
          }}
        >
          {/* Logo in white box */}
          <Box
            sx={{
              bgcolor: "white",
              borderRadius: 2,
              p: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              component="img"
              src="/assets/Short Logo2.png"
              alt="logo"
              sx={{
                width: { xs: 32, sm: 48 }, // slightly smaller on mobile
                height: { xs: 32, sm: 48 },
                objectFit: "contain",
                display: "block",
              }}
            />
          </Box>

          <Box sx={{ overflow: "hidden" }}>
            <Typography
              variant="h6"
              fontWeight="bold"
              color="inherit"
              noWrap
              sx={{ fontSize: { xs: 15, sm: 20 } }}
            >
              HR Compliance Health Checker
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255,255,255,0.8)",
                fontSize: { xs: 10, sm: 14 },
              }}
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
              variant="contained"
              sx={{
                backgroundColor: "#FFFFFF",
                color: "#000000",
                borderColor: "#FFFFFF",
                "&:hover": {
                  backgroundColor: "#f0f0f0",
                  borderColor: "#f0f0f0",
                },
                fontSize: { xs: 12, md: 14 },
                px: 2,
                textTransform: "none",
              }}
              onClick={() => navigate("/")}
            >
              Home
            </Button>

            {showAdminBtn && (
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#FFFFFF",
                  color: "#000000",
                  borderColor: "#FFFFFF",
                  "&:hover": {
                    backgroundColor: "#f0f0f0",
                    borderColor: "#f0f0f0",
                  },
                  fontSize: { xs: 12, md: 14 },
                  px: 2,
                  textTransform: "none",
                }}
                onClick={() => navigate("/admin/dashboard")}
              >
                Admin
              </Button>
            )}

            {isAdminPage && (
              <Button
                variant="contained"
                startIcon={<LogOut />}
                onClick={handleLogout}
                sx={{
                  backgroundColor: "#FFFFFF",
                  color: "#000000",
                  borderColor: "#FFFFFF",
                  "&:hover": {
                    backgroundColor: "#f0f0f0",
                    borderColor: "#f0f0f0",
                  },
                  fontSize: { xs: 12, md: 14 },
                  px: 2,
                  textTransform: "none",
                }}
              >
                Logout
              </Button>
            )}
          </Box>
        )}

        {/* Mobile Menu */}
        {!hideMenu && (
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              flexShrink: 0,
            }}
          >
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
//   const isAdminPage =
//     currentPath.startsWith("/admin") && currentPath !== "/admin/login";

//   const showAdminBtn = currentPath === "/" || currentPath.startsWith("/admin");

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
//         backgroundColor: "#ffffff",          // white navbar
//         color: "#000000",                    // default text color black
//         boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
//         borderRadius: 0,
//       }}
//     >
//       <Toolbar
//         sx={{
//           justifyContent: "space-between",
//           flexWrap: "nowrap",
//           minWidth: 0,
//           px: { xs: 1, sm: 2 },
//         }}
//       >
//         {/* Logo and Title */}
//         <Box
//           display="flex"
//           alignItems="center"
//           gap={{ xs: 1, sm: 1.5 }}
//           sx={{
//             flexGrow: 1,
//             flexShrink: 1,
//             minWidth: 0,
//             overflow: "hidden",
//           }}
//         >
//           {/* Logo in white box (keep as is, adds subtle card look) */}
//           <Box
//             sx={{
//               bgcolor: "#ffffff",
//               borderRadius: 2,
//               p: 0,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <Box
//               component="img"
//               src="/assets/Short Logo2.png"
//               alt="logo"
//               sx={{
//                 width: { xs: 32, sm: 48 },
//                 height: { xs: 32, sm: 48 },
//                 objectFit: "contain",
//                 display: "block",
//               }}
//             />
//           </Box>

//           <Box sx={{ overflow: "hidden" }}>
//             <Typography
//               variant="h6"
//               fontWeight="bold"
//               color="text.primary"          // black text
//               noWrap
//               sx={{ fontSize: { xs: 15, sm: 20 } }}
//             >
//               HR Compliance Health Checker
//             </Typography>
//             <Typography
//               variant="body2"
//               sx={{
//                 color: "text.secondary",    // grey text
//                 fontSize: { xs: 10, sm: 14 },
//               }}
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
//                 backgroundColor: "#ffffff",
//                 color: "#000000",
//                 borderColor: "#e0e0e0",
//                 "&:hover": {
//                   backgroundColor: "#f5f5f5",
//                   borderColor: "#cfcfcf",
//                 },
//                 fontSize: { xs: 12, md: 14 },
//                 px: 2,
//                 textTransform: "none",
//               }}
//               onClick={() => navigate("/")}
//             >
//               Home
//             </Button>

//             {showAdminBtn && (
//               <Button
//                 variant="outlined"
//                 sx={{
//                   backgroundColor: "#ffffff",
//                   color: "#000000",
//                   borderColor: "#e0e0e0",
//                   "&:hover": {
//                     backgroundColor: "#f5f5f5",
//                     borderColor: "#cfcfcf",
//                   },
//                   fontSize: { xs: 12, md: 14 },
//                   px: 2,
//                   textTransform: "none",
//                 }}
//                 onClick={() => navigate("/admin/dashboard")}
//               >
//                 Admin
//               </Button>
//             )}

//             {isAdminPage && (
//               <Button
//                 variant="outlined"
//                 startIcon={<LogOut size={16} />}
//                 onClick={handleLogout}
//                 sx={{
//                   backgroundColor: "#ffffff",
//                   color: "#000000",
//                   borderColor: "#e0e0e0",
//                   "&:hover": {
//                     backgroundColor: "#f5f5f5",
//                     borderColor: "#cfcfcf",
//                   },
//                   fontSize: { xs: 12, md: 14 },
//                   px: 2,
//                   textTransform: "none",
//                 }}
//               >
//                 Logout
//               </Button>
//             )}
//           </Box>
//         )}

//         {/* Mobile Menu */}
//         {!hideMenu && (
//           <Box
//             sx={{
//               display: { xs: "flex", md: "none" },
//               flexShrink: 0,
//             }}
//           >
//             <IconButton
//               size="large"
//               aria-label="menu"
//               aria-controls="mobile-menu"
//               aria-haspopup="true"
//               onClick={handleMenuOpen}
//               sx={{ color: "#000000" }}      // hamburger icon black
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

//               {showAdminBtn && (
//                 <MenuItem
//                   onClick={() => {
//                     navigate("/admin/dashboard");
//                     handleMenuClose();
//                   }}
//                 >
//                   Admin
//                 </MenuItem>
//               )}

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
