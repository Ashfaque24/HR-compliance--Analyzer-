

// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Typography,
//   Paper,
//   Card,
//   Divider,
//   Chip,
//   Grid,
//   Button,
//   CircularProgress,
// } from "@mui/material";
// import { blue, green, orange, red } from "@mui/material/colors";
// import CountUp from "react-countup";
// import ContactMailIcon from '@mui/icons-material/ContactMail';
// import InfoIcon from '@mui/icons-material/Info';
// import summaryData from "../../data/summaryData.json";


// const reportFont = '"Calibri", "Arial", "Helvetica Neue", "Helvetica", "Roboto", "sans-serif"';

// const headerBgColor = blue[50];
// const headerTextColor = blue[700];
// const borderColor = blue[200];

// const blurStyles = {
//   filter: "blur(5.5px)",
//   pointerEvents: "none",
//   userSelect: "none",
//   borderRadius: 2,
//   overflow: "hidden",
// };

// const catchyOverlayStyles = {
//   position: "absolute",
//   top: 0,
//   left: 0,
//   width: "100%",
//   height: "100%",
//   bgcolor: "rgba(255, 255, 255, 0.9)",
//   boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "center",
//   justifyContent: "center",
//   gap: 2,
//   zIndex: 10,
//   padding: 2,
//   borderRadius: 2,
//   fontFamily: reportFont,
//   color: "#1976d2",
//   textShadow: "0 1px 2px rgba(0,0,0,0.1)",
//   fontWeight: "700",
//   fontSize: { xs: '1.2rem', sm: '1.5rem' },
// };

// function SectionCard({ section, idx }) {
//   if (!section) return null;

//   return (
//     <Box sx={{ mb: { xs: 3, sm: 4 }, fontFamily: reportFont }}>
//       <Box
//         sx={{
//           bgcolor: headerBgColor,
//           px: { xs: 2, sm: 4 },
//           py: { xs: 1, sm: 2 },
//           borderRadius: "16px 16px 0 0",
//           borderBottom: `2px solid ${borderColor}`,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           boxShadow: 2,
//         }}
//       >
//         <Box>
//           <Typography
//             variant="h6"
//             fontWeight="600"
//             sx={{ color: headerTextColor, mb: 0, letterSpacing: 0.2, fontSize: { xs: 16, sm: 18 } }}
//           >
//             {section.name}
//           </Typography>
//           <Typography sx={{ color: headerTextColor, opacity: 0.7, fontSize: { xs: 12, sm: 15 } }} variant="subtitle2">
//             Category {idx + 1} of 5
//           </Typography>
//         </Box>
//         <Box sx={{ textAlign: "right" }}>
//           <Typography
//             variant="h5"
//             fontWeight="700"
//             sx={{ color: "#111", mb: 0, fontSize: { xs: 18, sm: 24 } }}
//           >
//             {section.score}/{section.maxScore}
//           </Typography>
//           <Typography sx={{ color: "grey", fontFamily: reportFont, fontSize: { xs: 12, sm: 14 } }}>
//             {section.completionRate} Complete
//           </Typography>
//         </Box>
//       </Box>
//     </Box>
//   );
// }

// export default function Summary_Repo() {
//   const data = summaryData;
//   const [progress, setProgress] = useState(1); // Initialize > 0 for stable render
//   const [showProgress, setShowProgress] = useState(false); // For fade-in timing
//   const [isBlurred, setIsBlurred] = useState(true);

//   useEffect(() => {
//     // Fade-in delay for smooth render stability
//     const delay = setTimeout(() => setShowProgress(true), 100);
//     return () => clearTimeout(delay);
//   }, []);

//   useEffect(() => {
//     if (!showProgress) return;

//     let start = progress;
//     const end = (data.overAllScore / data.maxmScore) * 100;
//     const duration = 2500;
//     const stepTime = 15;
//     const increment = (end - start) / (duration / stepTime);
//     const timer = setInterval(() => {
//       start += increment;
//       if (start >= end) {
//         start = end;
//         clearInterval(timer);
//       }
//       setProgress(start);
//     }, stepTime);

//     return () => clearInterval(timer);
//   }, [data.overAllScore, data.maxmScore, showProgress]); 

//   return (
//     <Box sx={{ maxWidth: 1200, mx: "auto", py: { xs: 2, sm: 4 }, px: { xs: 1, sm: 0 }, fontFamily: reportFont, position: "relative" }}>
//       {/* Executive Summary */}
//       <Paper sx={{ mb: 3, p: { xs: 2, sm: 3 }, fontFamily: reportFont }}>
//         <Typography variant="h5" align="center" fontWeight="bold" mb={{ xs: 1, sm: 2 }} fontSize={{ xs: 20, sm: 28 }}>
//           Executive Summary
//         </Typography>
//         {/* Circular Score */}
//         <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", my: { xs: 2, sm: 3 } }}>
//           <Box
//             sx={{
//               position: "relative",
//               display: "grid",
//               placeItems: "center",
//               width: { xs: 130, sm: 170 },
//               height: { xs: 130, sm: 170 },
//               mx: "auto",
//             }}
//           >
//             {showProgress && (
//               <>
//                 <CircularProgress
//                   variant="determinate"
//                   value={100}
//                   size="100%"
//                   thickness={5}
//                   sx={{ color: blue[100], position: "absolute" }}
//                 />
//                 <CircularProgress
//                   variant="determinate"
//                   value={progress}
//                   size="100%"
//                   thickness={5}
//                   sx={{
//                     color:
//                       data.overAllScore >= 80
//                         ? green[500]
//                         : data.overAllScore >= 60
//                         ? orange[500]
//                         : red[500],
//                   }}
//                 />
//                 <Box sx={{ position: "absolute", textAlign: "center" }}>
//                   <Typography sx={{ fontWeight: "bold", fontSize: { xs: 18, sm: 24 }, color: "#111" }}>
//                     <CountUp start={0} end={data.overAllScore} duration={2.5} /> / {data.maxmScore}
//                   </Typography>
//                   <Typography sx={{ fontSize: { xs: 12, sm: 14 }, color: "grey" }}>
//                     Overall Score
//                   </Typography>
//                 </Box>
//               </>
//             )}
//           </Box>
//         </Box>
//         {/* Status Chip */}
//         <Box sx={{ display: "flex", justifyContent: "center", mb: { xs: 1, sm: 2 } }}>
//           <Chip
//             label={data.summaryStatus}
//             color={
//               data.summaryType === "danger"
//                 ? "error"
//                 : data.summaryType === "success"
//                 ? "success"
//                 : "warning"
//             }
//             sx={{ px: 4, fontSize: { xs: 14, sm: 16 }, fontFamily: reportFont }}
//           />
//         </Box>
//         {/* Section Ratings Summary */}
//         <Grid container spacing={2} justifyContent="center" mb={{ xs: 1, sm: 2 }}>
//           {data.sectionRatings.map((sr, idx) => (
//             <Grid item key={idx} xs={12} sm={6} md={2.4}>
//               <Card sx={{ p: { xs: 1, sm: 1.5 }, borderRadius: 3, bgcolor: blue[50], boxShadow: 2, textAlign: "center", fontFamily: reportFont }}>
//                 <Typography sx={{ fontWeight: "bold", fontSize: { xs: 14, sm: 16 }, color: "#222" }}>
//                   {sr.score}/{sr.mxmScore}
//                 </Typography>
//                 <Divider sx={{ my: 1 }} />
//                 <Typography sx={{ fontSize: { xs: 11, sm: 13 }, color: "#222" }}>
//                   {sr.sectionName}
//                 </Typography>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//         {/* Key Insights */}
//         <Box sx={{ bgColor: "rgba(119, 162, 88, 0.15)", p: { xs: 1, sm: 2 }, borderRadius: 2, mt: { xs: 1, sm: 2 } }}>
//           <Typography variant="subtitle1" fontWeight="bold" fontSize={{ xs: 16, sm: 18 }}>
//             Key Insights
//           </Typography>
//           <Divider sx={{ my: 1 }} />
//           <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
//             {data.keyInsights.map((ki, idx) => (
//               <Chip
//                 key={idx}
//                 label={ki.name}
//                 sx={{
//                   bgcolor: ki.status ? { success: green[200], danger: red[200], warning: orange[200] }[ki.status] : undefined,
//                   fontWeight: "bold",
//                   fontFamily: reportFont,
//                   fontSize: { xs: 12, sm: 14 },
//                 }}
//               />
//             ))}
//           </Box>
//         </Box>
//       </Paper>
//       {/* Blurred Sections with catchy overlay */}
//       <Box sx={{ position: "relative" }}>
//         <Box sx={isBlurred ? { ...blurStyles, borderRadius: 2, overflow: "hidden" } : {}}>
//           {data.summary.map((section, idx) => (
//             <SectionCard key={section.name || idx} section={section} idx={idx} />
//           ))}
//         </Box>
//         {isBlurred && (
//           <Box sx={catchyOverlayStyles}>
//             <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2, flexWrap: "wrap", justifyContent: "center" }}>
//               <InfoIcon sx={{ fontSize: { xs: 24, sm: 30 } }} />
//               <Typography variant="h5" sx={{ fontWeight: "bold", fontFamily: reportFont, fontSize: { xs: 16, sm: 20 } }}>
//                 For detailed report contact admin
//               </Typography>
//             </Box>
//             <Button
//               variant="contained"
//               color="primary"
//               size="large"
//               sx={{
//                 fontFamily: reportFont,
//                 px: { xs: 3, sm: 5 },
//                 py: { xs: 1, sm: 1.5 },
//                 fontWeight: "bold",
//                 fontSize: { xs: 14, sm: 16 },
//                 transition: "transform 0.3s ease",
//                 "&:hover": {
//                   transform: "scale(1.05)",
//                 },
//               }}
//               onClick={() => alert("Request Full Report")}
//             >
//               Request Full Report
//             </Button>
//             <Typography
//               variant="body2"
//               color="text.secondary"
//               sx={{ mt: 2, display: "flex", alignItems: "center", gap: 0.5, fontSize: { xs: 12, sm: 15 } }}
//             >
//               <ContactMailIcon sx={{ height: { xs: 14, sm: 17 }, width: { xs: 28, sm: 33 }, mb: "-2px", color: "#1976d2" }} />
//               For enquiries, email us at:&nbsp;
//               <a href="mailto:ashfaque@gmail.com" style={{ textDecoration: "none", color: "#1976d2", fontWeight: 500, fontSize: 'inherit' }}>
//                 ashfaque@gmail.com
//               </a>
//             </Typography>
//           </Box>
//         )}
//       </Box>
//     </Box>
//   );
// }







import React from "react";
import Summary_Repo from "../../components/Summary_Repo";
import reportsData from "../../data/reports.json"; // The path is correct (2 dots up from /pages/assessment)

const currentReport = reportsData[0]; // Pick for user

export default function AssessmentSummary() {
  return <Summary_Repo data={currentReport.details} showFull={false} />;
}


