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
          px: { xs: 1, sm: 2 },
          height:80
        }}
      >
        {/* Logo and Title */}
        <Box
          display="flex"
          flexDirection="row" // Keep logo and title on the left
          gap={{ xs: 1, sm: 1.5 }}
          sx={{
            flexGrow: 1,
            flexShrink: 1,
            minWidth: 0,
            overflow: "hidden",
          }}
        >
          {/* Logo and Title Column */}
          <Box
            display="flex"
            flexDirection="column"
            sx={{
              flexShrink: 0,
            }}
          >
            {/* Logo */}
            <Box>
              <Box
                component="img"
                src="/assets/42-white-border.png"
                alt="logo"
                sx={{
                  width: { xs: 80, sm: 110 },
                  height: { xs: 50, sm: 70 },
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </Box>

            {/* Title under logo */}
            <Box sx={{ overflow: "hidden" }}>
              <Typography
                variant="h6"
                fontWeight="bold"
                color="inherit"
                noWrap
                sx={{ fontSize: { xs: 14, sm: 16 } }}
              >
                HR Compliance Health Checker
              </Typography>
            </Box>
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


