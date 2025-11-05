

// import React, { useState } from "react";
// import { Box, Typography, TextField, Button, Paper, Stack } from "@mui/material";
// import PeopleIcon from "@mui/icons-material/People";
// import ShieldIcon from "@mui/icons-material/Shield";
// import DescriptionIcon from "@mui/icons-material/Description";
// import { useNavigate } from "react-router-dom";
// import requestWrapper from "../api/axiosInstance";

// export default function Landing() {
//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     phone: "",
//     company: "",
//   });

//   const navigate = useNavigate();

//   function handleChange(e) {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   }

//   function handleSubmit(e) {
//     e.preventDefault();
//     // Navigate to /assessment passing user details and dynamically loaded sections

//     navigate("/assessment", { state: formData });
//   }

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexDirection: { xs: "column", md: "row" },
//         minHeight: "100vh",
//         fontFamily: "Arial, sans-serif",
//         width: "100vw",
//       }}
//     >
//       <Box
//         sx={{
//           flex: 1,
//           bgcolor: "primary.dark",
//           color: "white",
//           p: { xs: 4, md: 8 },
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "center",
//           gap: 3,
//           background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
//           textAlign: { xs: "center", md: "left" },
//         }}
//       >
//         <Typography variant="h4" fontWeight="bold">
//           Get Your HR Compliance Score in Minutes
//         </Typography>
//         <Typography
//           sx={{
//             maxWidth: { xs: "100%", md: 400 },
//             margin: { xs: "auto", md: "unset" },
//           }}
//         >
//           Our AI-powered analysis evaluates your organization across 5 critical
//           compliance areas and provides actionable recommendations.
//         </Typography>
//         <Stack
//           spacing={2}
//           sx={{
//             maxWidth: { xs: "100%", md: 400 },
//             margin: { xs: "auto", md: "unset" },
//           }}
//           direction="column"
//           alignItems={{ xs: "center", md: "flex-start" }}
//         >
//           <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//             <Paper
//               elevation={3}
//               sx={{ p: 1, borderRadius: "50%", bgcolor: "primary.main", color: "white" }}
//             >
//               <PeopleIcon />
//             </Paper>
//             <Box>
//               <Typography fontWeight="bold">Registration & Licensing</Typography>
//               <Typography variant="caption" color="grey.300">
//                 MCA, ESIC, EPFO, and regulatory compliance
//               </Typography>
//             </Box>
//           </Box>

//           <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//             <Paper
//               elevation={3}
//               sx={{ p: 1, borderRadius: "50%", bgcolor: "primary.main", color: "white" }}
//             >
//               <ShieldIcon />
//             </Paper>
//             <Box>
//               <Typography fontWeight="bold">Employee Welfare & Benefits</Typography>
//               <Typography variant="caption" color="grey.300">
//                 Statutory benefits and welfare compliance
//               </Typography>
//             </Box>
//           </Box>

//           <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//             <Paper
//               elevation={3}
//               sx={{ p: 1, borderRadius: "50%", bgcolor: "primary.main", color: "white" }}
//             >
//               <DescriptionIcon />
//             </Paper>
//             <Box>
//               <Typography fontWeight="bold">Documentation & Governance</Typography>
//               <Typography variant="caption" color="grey.300">
//                 Policies, POSH compliance, and workplace governance
//               </Typography>
//             </Box>
//           </Box>
//         </Stack>
//       </Box>

//       <Box
//         sx={{
//           flex: 1,
//           p: { xs: 4, md: 8 },
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           bgcolor: "background.paper",
//         }}
//       >
//         <Box
//           component="form"
//           onSubmit={handleSubmit}
//           sx={{
//             width: "100%",
//             maxWidth: 480,
//             bgcolor: "background.paper",
//             boxShadow: 3,
//             borderRadius: 2,
//             p: 4,
//             display: "flex",
//             flexDirection: "column",
//             gap: 2,
//           }}
//         >
//           <Typography variant="h5" fontWeight="bold">
//             Start Your Assessment
//           </Typography>
//           <Typography>Enter your details to begin the compliance evaluation</Typography>
//           <TextField
//             label="Full Name *"
//             name="fullName"
//             variant="outlined"
//             value={formData.fullName}
//             onChange={handleChange}
//             required
//             fullWidth
//           />
//           <TextField
//             label="Email Address *"
//             name="email"
//             type="email"
//             variant="outlined"
//             value={formData.email}
//             onChange={handleChange}
//             required
//             fullWidth
//           />
//           <TextField
//             label="Phone Number *"
//             name="phone"
//             type="tel"
//             variant="outlined"
//             value={formData.phone}
//             onChange={handleChange}
//             required
//             fullWidth
//           />
//           <TextField
//             label="Company Name *"
//             name="company"
//             variant="outlined"
//             value={formData.company}
//             onChange={handleChange}
//             required
//             fullWidth
//           />
//           <Button type="submit" variant="contained" size="large" sx={{ mt: 2 }}>
//             Start Compliance Assessment
//           </Button>
//           <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
//             Your information is secure and will only be used for generating your compliance report.
//           </Typography>
//         </Box>
//       </Box>
//     </Box>
//   );
// }






// import React, { useState } from "react";
// import { Box, Typography, TextField, Button, Paper, Stack } from "@mui/material";
// import PeopleIcon from "@mui/icons-material/People";
// import ShieldIcon from "@mui/icons-material/Shield";
// import DescriptionIcon from "@mui/icons-material/Description";
// import { useNavigate } from "react-router-dom";
// import requestWrapper from "../api/axiosInstance";

// export default function Landing() {
//   // State to store user input from the form fields
//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     phone: "",
//     company: "",
//   });

//   // Hook for programmatic navigation between routes
//   const navigate = useNavigate();

//   // Update form state when user changes input fields
//   function handleChange(e) {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   }

//   // Function to send form data to backend API using axios instance
//   const handleApiSubmit = async () => {

//     try {
//       // Replace 'your-backend-endpoint' with your actual API URL
//       const response = await requestWrapper({
//         method: "POST",
//         url: "user/response/start", 
//         data: {
//           fullName: formData.fullName,
//           email: formData.email,
//           phone: formData.phone,
//           company: formData.company,
//         },
//       });
//       console.log("Form submitted successfully:", response);
//       return response; // Return response if needed for further processing
//     } catch (error) {
//       // Log error for debugging and rethrow to handle in submit handler
//       console.error("Failed to submit form:", error);
//       throw error;
//     }
//   };

//   // Form submit handler triggered on form submit event
//   async function handleSubmit(e) {
//     e.preventDefault(); // Prevent default form submission behavior
//     try {
//       // First submit data to backend API
//       await handleApiSubmit();

//       // On success, navigate to assessment page passing user data
//       navigate("/assessment", { state: formData });
//     } catch {
//       // Show an alert if submission fails
//       alert("Failed to submit form. Please try again.");
//     }
//   }

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexDirection: { xs: "column", md: "row" },
//         minHeight: "100vh",
//         fontFamily: "Arial, sans-serif",
//         width: "100vw",
//       }}
//     >
//       {/* Left side informational panel with feature highlights */}
//       <Box
//         sx={{
//           flex: 1,
//           bgcolor: "primary.dark",
//           color: "white",
//           p: { xs: 4, md: 8 },
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "center",
//           gap: 3,
//           background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
//           textAlign: { xs: "center", md: "left" },
//         }}
//       >
//         <Typography variant="h4" fontWeight="bold">
//           Get Your HR Compliance Score in Minutes
//         </Typography>
//         <Typography
//           sx={{ maxWidth: { xs: "100%", md: 400 }, margin: { xs: "auto", md: "unset" } }}
//         >
//           Our AI-powered analysis evaluates your organization across 5 critical
//           compliance areas and provides actionable recommendations.
//         </Typography>
//         <Stack
//           spacing={2}
//           sx={{ maxWidth: { xs: "100%", md: 400 }, margin: { xs: "auto", md: "unset" } }}
//           direction="column"
//           alignItems={{ xs: "center", md: "flex-start" }}
//         >
//           {/* Feature 1: Registration & Licensing */}
//           <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//             <Paper elevation={3} sx={{ p: 1, borderRadius: "50%", bgcolor: "primary.main", color: "white" }}>
//               <PeopleIcon />
//             </Paper>
//             <Box>
//               <Typography fontWeight="bold">Registration & Licensing</Typography>
//               <Typography variant="caption" color="grey.300">
//                 MCA, ESIC, EPFO, and regulatory compliance
//               </Typography>
//             </Box>
//           </Box>

//           {/* Feature 2: Employee Welfare & Benefits */}
//           <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//             <Paper elevation={3} sx={{ p: 1, borderRadius: "50%", bgcolor: "primary.main", color: "white" }}>
//               <ShieldIcon />
//             </Paper>
//             <Box>
//               <Typography fontWeight="bold">Employee Welfare & Benefits</Typography>
//               <Typography variant="caption" color="grey.300">
//                 Statutory benefits and welfare compliance
//               </Typography>
//             </Box>
//           </Box>

//           {/* Feature 3: Documentation & Governance */}
//           <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//             <Paper elevation={3} sx={{ p: 1, borderRadius: "50%", bgcolor: "primary.main", color: "white" }}>
//               <DescriptionIcon />
//             </Paper>
//             <Box>
//               <Typography fontWeight="bold">Documentation & Governance</Typography>
//               <Typography variant="caption" color="grey.300">
//                 Policies, POSH compliance, and workplace governance
//               </Typography>
//             </Box>
//           </Box>
//         </Stack>
//       </Box>

//       {/* Right side form panel to collect user details */}
//       <Box
//         sx={{
//           flex: 1,
//           p: { xs: 4, md: 8 },
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           bgcolor: "background.paper",
//         }}
//       >
//         <Box
//           component="form"
//           onSubmit={handleSubmit} // Handle form submit event
//           sx={{
//             width: "100%",
//             maxWidth: 480,
//             bgcolor: "background.paper",
//             boxShadow: 3,
//             borderRadius: 2,
//             p: 4,
//             display: "flex",
//             flexDirection: "column",
//             gap: 2,
//           }}
//         >
//           <Typography variant="h5" fontWeight="bold">
//             Start Your Assessment
//           </Typography>
//           <Typography>Enter your details to begin the compliance evaluation</Typography>

//           {/* Full Name input */}
//           <TextField
//             label="Full Name *"
//             name="fullName"
//             variant="outlined"
//             value={formData.fullName}
//             onChange={handleChange}
//             required
//             fullWidth
//           />

//           {/* Email input */}
//           <TextField
//             label="Email Address *"
//             name="email"
//             type="email"
//             variant="outlined"
//             value={formData.email}
//             onChange={handleChange}
//             required
//             fullWidth
//           />

//           {/* Phone input */}
//           <TextField
//             label="Phone Number *"
//             name="phone"
//             type="tel"
//             variant="outlined"
//             value={formData.phone}
//             onChange={handleChange}
//             required
//             fullWidth
//           />

//           {/* Company input */}
//           <TextField
//             label="Company Name *"
//             name="company"
//             variant="outlined"
//             value={formData.company}
//             onChange={handleChange}
//             required
//             fullWidth
//           />

//           {/* Submit button */}
//           <Button type="submit" variant="contained" size="large" sx={{ mt: 2 }} onClick={()=>handleApiSubmit()}>
//             Start Compliance Assessment
//           </Button>

//           {/* Informational text */}
//           <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
//             Your information is secure and will only be used for generating your compliance report.
//           </Typography>
//         </Box>
//       </Box>
//     </Box>
//   );
// }
































import React, { useState } from "react";
import { Box, Typography, TextField, Button, Paper, Stack } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import ShieldIcon from "@mui/icons-material/Shield";
import DescriptionIcon from "@mui/icons-material/Description";
import { useNavigate } from "react-router-dom";
import requestWrapper from "../api/axiosInstance";

export default function Landing() {
  // State to store user input from form fields
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
  });

  const navigate = useNavigate();

  // Update form state when inputs change
  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  // Send formData to backend, store session_uuid in localStorage
  const handleApiSubmit = async () => {
    try {
      const response = await requestWrapper({
        method: "POST",
        url: "user/response/start", // Replace with your actual backend endpoint
        data: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
        },
      });
      console.log("Form submitted successfully:", response);

      // Save session_uuid to localStorage if returned
      if (response.session_uuid) {
        localStorage.setItem("session_uuid", response.session_uuid);
      } else {
        alert("Missing session ID from server response.");
        throw new Error("No session_uuid in response");
      }
      return response;
    } catch (error) {
      console.error("Failed to submit form:", error);
      throw error;
    }
  };

  // Handle form submission event
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await handleApiSubmit(); // Send API request
      navigate("/assessment", { state: formData }); // Proceed on success
    } catch {
      alert("Failed to submit form. Please try again.");
    }
  }

  return (
    <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, minHeight: "100vh", fontFamily: "Arial, sans-serif", width: "100vw" }}>
      {/* Left information panel */}
      <Box sx={{ flex: 1, bgcolor: "primary.dark", color: "white", p: { xs: 4, md: 8 }, display: "flex", flexDirection: "column", justifyContent: "center", gap: 3, background: "linear-gradient(135deg, #1e3a8a, #2563eb)", textAlign: { xs: "center", md: "left" } }}>
        <Typography variant="h4" fontWeight="bold">Get Your HR Compliance Score in Minutes</Typography>
        <Typography sx={{ maxWidth: { xs: "100%", md: 400 }, m: { xs: "auto", md: "unset" } }}>
          Our AI-powered analysis evaluates your organization across 5 critical compliance areas and provides actionable recommendations.
        </Typography>
        <Stack spacing={2} sx={{ maxWidth: { xs: "100%", md: 400 }, m: { xs: "auto", md: "unset" } }} direction="column" alignItems={{ xs: "center", md: "flex-start" }}>
          {/* Features */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Paper elevation={3} sx={{ p: 1, borderRadius: "50%", bgcolor: "primary.main", color: "white" }}>
              <PeopleIcon />
            </Paper>
            <Box>
              <Typography fontWeight="bold">Registration & Licensing</Typography>
              <Typography variant="caption" color="grey.300">MCA, ESIC, EPFO, and regulatory compliance</Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Paper elevation={3} sx={{ p: 1, borderRadius: "50%", bgcolor: "primary.main", color: "white" }}>
              <ShieldIcon />
            </Paper>
            <Box>
              <Typography fontWeight="bold">Employee Welfare & Benefits</Typography>
              <Typography variant="caption" color="grey.300">Statutory benefits and welfare compliance</Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Paper elevation={3} sx={{ p: 1, borderRadius: "50%", bgcolor: "primary.main", color: "white" }}>
              <DescriptionIcon />
            </Paper>
            <Box>
              <Typography fontWeight="bold">Documentation & Governance</Typography>
              <Typography variant="caption" color="grey.300">Policies, POSH compliance, and workplace governance</Typography>
            </Box>
          </Box>
        </Stack>
      </Box>

      {/* Right form panel */}
      <Box sx={{ flex: 1, p: { xs: 4, md: 8 }, display: "flex", justifyContent: "center", alignItems: "center", bgcolor: "background.paper" }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%", maxWidth: 480, bgcolor: "background.paper", boxShadow: 3, borderRadius: 2, p: 4, display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="h5" fontWeight="bold">Start Your Assessment</Typography>
          <Typography>Enter your details to begin the compliance evaluation</Typography>

          <TextField label="Full Name *" name="fullName" variant="outlined" value={formData.fullName} onChange={handleChange} required fullWidth />
          <TextField label="Email Address *" name="email" type="email" variant="outlined" value={formData.email} onChange={handleChange} required fullWidth />
          <TextField label="Phone Number *" name="phone" type="tel" variant="outlined" value={formData.phone} onChange={handleChange} required fullWidth />
          <TextField label="Company Name *" name="company" variant="outlined" value={formData.company} onChange={handleChange} required fullWidth />

          <Button type="submit" variant="contained" size="large" sx={{ mt: 2 }}>Start Compliance Assessment</Button>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            Your information is secure and will only be used for generating your compliance report.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
