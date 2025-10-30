
import React, { useState, useEffect } from "react";
import {
  Box, Button, Paper, TextField, Typography, IconButton, InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import ShieldIcon from "@mui/icons-material/Security";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/features/authSlice";

export default function AdminLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { isAuthenticated, loading, error, token } = useSelector(state => state.auth);

  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated && token) {
      localStorage.setItem('token', token); 
      navigate("/admin/dashboard");
    }
  }, [isAuthenticated, token, navigate]);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginUser(credentials));
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#f5f7fa" }}>
      <Paper elevation={5} sx={{ px: 4, py: 5, borderRadius: 3, maxWidth: 360, width: "100%", textAlign: "center" }}>
        <Box sx={{ mb: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ShieldIcon sx={{ fontSize: 40, bgcolor: "#232b3b", color: "#fff", borderRadius: "50%", p: 1, mb: 1 }} />
        </Box>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 1, letterSpacing: 1 }}>
          Admin Login
        </Typography>
        <Typography variant="body2" color="error" sx={{ minHeight: "1.5em", mb: 2 }}>
          {error && error}
        </Typography>
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <TextField
            label="Email Address"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            variant="outlined"
            type="email"
            sx={{ mb: 2 }}
            fullWidth
            InputLabelProps={{ shrink: true }}
            disabled={loading}
          />
          <TextField
            label="Password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
            variant="outlined"
            type={showPassword ? "text" : "password"}
            sx={{ mb: 2 }}
            fullWidth
            InputLabelProps={{ shrink: true }}
            disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(prev => !prev)} edge="end" disabled={loading}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button type="submit" variant="contained" size="large" fullWidth disabled={loading} sx={{ bgcolor: "#3d4559", color: "#fff", fontWeight: "bold", my: 1, py: 1, borderRadius: 2, fontSize: "1.09rem" }}>
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </form>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 3, display: "block" }}>
          Authorized personnel only. All access is logged and monitored.
        </Typography>
      </Paper>
    </Box>
  );
}
