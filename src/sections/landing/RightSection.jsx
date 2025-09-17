import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
} from "@mui/material";

const RightSection = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted ✅", form);
  };

  return (
    <Paper  elevation={3} sx={{ p: 4, width: '100%',border:'1px solid black' }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Start Your Assessment
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Enter your details to begin the compliance evaluation
      </Typography>

      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Full Name *"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Email Address *"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Phone Number *"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Company Name *"
            name="company"
            value={form.company}
            onChange={handleChange}
            fullWidth
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
          >
            Start Compliance Assessment
          </Button>
        </Stack>
      </form>
    </Paper>
  );
};

export default RightSection;
