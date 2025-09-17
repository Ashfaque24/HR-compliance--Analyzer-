import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Admin login:", credentials);
    // In real app, call API -> if success, dispatch Redux login action
    navigate("/admin/dashboard");
  };

  return (
    <Box className="flex justify-center items-center min-h-screen bg-gray-50">
      <Paper elevation={3} className="p-6 rounded-2xl w-[350px]">
        <Typography variant="h5" align="center" gutterBottom>
          Admin Login
        </Typography>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <TextField
            label="Username"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
          <Button type="submit" variant="contained" fullWidth>
            Login
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
