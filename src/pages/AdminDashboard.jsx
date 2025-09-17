import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Admin logged out");
    navigate("/admin/login");
  };

  return (
    <Box className="flex flex-col justify-center items-center min-h-screen bg-gray-200">
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography variant="body1" gutterBottom>
        Welcome, Admin! Here you can manage surveys.
      </Typography>
      <Button variant="contained" color="error" onClick={handleLogout}>
        Logout
      </Button>
    </Box>
  );
}
