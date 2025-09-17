import React from "react";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Logo */}
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

        {/* Right Menu */}
        <Box display="flex" gap={3}>
          <Button color="inherit" onClick={()=>navigate('/admin/login')}>Admin</Button>
          <Button color="inherit" >Secure ✅</Button>
          <Button color="inherit">Instant Report 📄</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
