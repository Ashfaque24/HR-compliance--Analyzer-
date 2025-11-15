// import React from "react";
// import { Box, Typography } from "@mui/material";

// export function ProgressScoreBlock({ score, maxScore }) {
//   const percent = Math.round((score / maxScore) * 100);
//   return (
//     <Box sx={{
//       maxWidth: 370, mx: "auto", my: 2,
//       border: "2px solid #191b3a",
//       bgcolor: "#fafbfe", borderRadius: 2, p: 2
//     }}>
//       <Typography align="center" sx={{ fontWeight: 700, color: "#191b3a" }}>Executive Summary</Typography>
//       <Typography align="center" sx={{ color: "#6d1093", mt: 1, fontWeight: 500 }}>Funding Goal: Compliance</Typography>
//       <Box sx={{ position:"relative", mt: 2, mb: 1 }}>
//         <Box sx={{
//           width: "100%",
//           height: 22,
//           bgcolor: "#e0e0e0",
//           borderRadius: 12,
//           overflow: "hidden"
//         }}>
//           <Box sx={{
//             width: `${percent}%`,
//             bgcolor: "#6d1093",
//             height: "100%",
//             fontWeight: 700,
//             color: "#fff",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center"
//           }}>{percent}%</Box>
//         </Box>
//       </Box>
//     </Box>
//   );
// }





import React from "react";
import { Box, Typography } from "@mui/material";

export function ProgressScoreBlock({ score, maxScore }) {
  const percent = Math.round((score / maxScore) * 100);
  return (
    <Box
      sx={{
        maxWidth: 420, 
        mx: "auto", 
        my: 2,
        bgcolor: "#fafbfe",
        borderRadius: 2,
        p: 2.5,
        border: "2px dashed #bbbbbb",
        boxSizing: "border-box",
        position: "relative"
      }}
    >
      <Typography
        align="center"
        sx={{
          fontWeight: 700,
          fontSize: 20,
          mb: 2,
          fontFamily: 'monospace',
          color: "#232323",
          letterSpacing: 1,
        }}
      >
        COMPLIANCE RECEIPT
      </Typography>
      {/* Progress Bar */}
      <Box sx={{ display:"flex", justifyContent:"center", mb: 2 }}>
        <Box sx={{
          width: "80%",
          height: 24,
          bgcolor: "#e0e0e0",
          borderRadius: 10,
          overflow: "hidden",
          display: "flex",
          alignItems: "center"
        }}>
          <Box sx={{
            width: `${percent}%`,
            bgcolor: "#821f66",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            color: "#fff",
            fontSize: 18,
            transition: "width .4s"
          }}>
            {percent}%
          </Box>
        </Box>
      </Box>
      {/* TOTAL row */}
      <Box sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mt: 2, 
        p: 0.5
      }}>
        <Typography sx={{ fontFamily:'monospace', fontWeight: 700, fontSize: 21, letterSpacing: 1 }}>
          TOTAL :
        </Typography>
        <Typography sx={{ fontWeight: 700, fontFamily:'monospace', color: "#d32f2f", fontSize: 22 }}>
          {score}/{maxScore}
        </Typography>
      </Box>
    </Box>
  );
}
