// import React, { useState, useRef } from "react";
// import {
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Typography,
//   Stack,
//   Box,
//   CircularProgress,
// } from "@mui/material";
// import { File, UploadCloud } from "lucide-react";
// import * as XLSX from "xlsx";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   bulkUploadQuestions,
//   resetBulkUpload,
// } from "../../redux/features/bulkUploadSlice";

// export default function BulkUpload() {
//   const [open, setOpen] = useState(false);
//   const fileInputRef = useRef();
//   const dispatch = useDispatch();

//   const { loading, success, error } = useSelector(
//     (state) => state.bulkUpload || {}
//   );

//   // Path to example Excel file (inside public/assets)
//   const exampleFileUrl = "/assets/Compliance_Questions.xlsx";

//   // Trigger hidden file input
//   const handleUploadClick = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.click();
//     }
//   };

//   /**
//    * Group Excel rows by Section, then by Question
//    * Creates structure: sections array, each with questions array
//    */
//   const groupRows = (rows) => {
//     const sectionMap = {};

//     rows.forEach((row) => {
//       const section = row.Section?.trim();
//       const question = row.Question?.trim();
//       const option = row.Option?.trim();
//       const score = Number(row.Score) || 0;

//       if (!section || !question || !option) return;

//       // Create section if it doesn't exist
//       if (!sectionMap[section]) {
//         sectionMap[section] = {
//           section,
//           questions: [],
//         };
//       }

//       // Find or create question in this section
//       let questionObj = sectionMap[section].questions.find(
//         (q) => q.question === question
//       );

//       if (!questionObj) {
//         questionObj = {
//           question,
//           options: [],
//         };
//         sectionMap[section].questions.push(questionObj);
//       }

//       // Add option with score (avoid duplicates)
//       if (!questionObj.options.some((o) => o.name === option)) {
//         questionObj.options.push({ name: option, score });
//       }
//     });

//     return Object.values(sectionMap);
//   };

//   // Handle Excel file upload
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (evt) => {
//         const bstr = evt.target.result;
//         const wb = XLSX.read(bstr, { type: "binary" });
//         const wsname = wb.SheetNames[0];
//         const ws = wb.Sheets[wsname];
//         const jsonData = XLSX.utils.sheet_to_json(ws, { defval: "" });

        

//         const uploadPayload = groupRows(jsonData);


//         if (!uploadPayload.length) {
//           alert("⚠️ No valid data found in the uploaded file!");
//           return;
//         }

//         // Dispatch async thunk
//         dispatch(bulkUploadQuestions(uploadPayload))
//           .unwrap()
//           .then(() => {
//             alert("✅ Bulk upload successful!");
//             setOpen(false);
//           })
//           .catch((err) => {
//             console.error("❌ Upload failed:", err);
//             alert(
//               "Upload failed. Please check your Excel format or console for details."
//             );
//           });
//       };
//       reader.readAsBinaryString(file);
//     }
//   };

//   const handleClose = () => {
//     setOpen(false);
//     dispatch(resetBulkUpload());
//   };

//   return (
//     <>
//       {/* Open Upload Dialog */}
//       <Button
//         variant="contained"
//         color="primary"
//         startIcon={<File />}
//         onClick={() => setOpen(true)}
//         sx={{ background: "#18a16e" }}
//       >
//         Bulk Upload
//       </Button>

//       {/* Dialog for Bulk Upload */}
//       <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
//         <DialogTitle>Bulk Upload Survey Data</DialogTitle>

//         <DialogContent>
//           <Box sx={{ mb: 2 }}>
//             <Typography variant="body2" color="text.secondary">
//               :- The file must contain four columns: Section, Question, Option,
//               Score following the same structure as the example sheet.
//               <br />
//               :- If a Section already exists, do not upload it as a new row.
//               Instead, add the new questions under the same Section so that
//               duplicate Sections are not created.
//               <br />
//               :- Please format your data exactly like the example provided.
//             </Typography>
//           </Box>

//           <Stack direction="row" spacing={2} alignItems="center">
//             {/* Upload Button */}
//             <Button
//               variant="contained"
//               startIcon={<UploadCloud />}
//               onClick={handleUploadClick}
//               disabled={loading}
//               sx={{ background: "#18a16e" }}
//             >
//               {loading ? (
//                 <CircularProgress size={22} color="inherit" />
//               ) : (
//                 "Upload Excel File"
//               )}
//             </Button>

//             {/* Hidden File Input */}
//             <input
//               type="file"
//               accept=".xls,.xlsx"
//               hidden
//               ref={fileInputRef}
//               onChange={handleFileChange}
//             />

//             {/* Example File Download */}
//             <Button
//               variant="contained"
//               component="a"
//               href={exampleFileUrl}
//               download="Example_Compliance_Questions.xlsx"
//               sx={{ ml: 2, backgroundColor: "#18a16e" }}
//             >
//               Download Example
//             </Button>
//           </Stack>

//           {/* Status Messages */}
//           {success && (
//             <Typography mt={2} color="success.main">
//               ✅ Uploaded successfully!
//             </Typography>
//           )}
//           {error && (
//             <Typography mt={2} color="error.main">
//               ❌ Upload failed: {error}
//             </Typography>
//           )}
//         </DialogContent>

//         <DialogActions>
//           <Button onClick={handleClose} color="inherit" disabled={loading}>
//             Cancel
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// }









// BulkUpload.js
import React, { useState, useRef } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Stack,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { File, UploadCloud } from "lucide-react";
import * as XLSX from "xlsx";
import { useDispatch, useSelector } from "react-redux";
import {
  bulkUploadQuestions,
  resetBulkUpload,
} from "../../redux/features/bulkUploadSlice";

// ✅ Accept an optional onSuccess prop from parent
export default function BulkUpload({ onSuccess }) {
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef();
  const dispatch = useDispatch();

  const { loading, success, error } = useSelector(
    (state) => state.bulkUpload || {}
  );

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Path to example Excel file (inside public/assets)
  const exampleFileUrl = "/assets/Compliance_Questions.xlsx";

  // Trigger hidden file input
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  /**
   * Group Excel rows by Section, then by Question
   * Creates structure: sections array, each with questions array
   */
  const groupRows = (rows) => {
    const sectionMap = {};

    rows.forEach((row) => {
      const section = row.Section?.trim();
      const question = row.Question?.trim();
      const option = row.Option?.trim();
      const score = Number(row.Score) || 0;

      if (!section || !question || !option) return;

      // Create section if it doesn't exist
      if (!sectionMap[section]) {
        sectionMap[section] = {
          section,
          questions: [],
        };
      }

      // Find or create question in this section
      let questionObj = sectionMap[section].questions.find(
        (q) => q.question === question
      );

      if (!questionObj) {
        questionObj = {
          question,
          options: [],
        };
        sectionMap[section].questions.push(questionObj);
      }

      // Add option with score (avoid duplicates)
      if (!questionObj.options.some((o) => o.name === option)) {
        questionObj.options.push({ name: option, score });
      }
    });

    return Object.values(sectionMap);
  };

  // Handle Excel file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const jsonData = XLSX.utils.sheet_to_json(ws, { defval: "" });

        const uploadPayload = groupRows(jsonData);

        if (!uploadPayload.length) {
          setSnackbar({
            open: true,
            message: "No valid data found in the uploaded file!",
            severity: "warning",
          });
          return;
        }

        // Dispatch async thunk
        dispatch(bulkUploadQuestions(uploadPayload))
          .unwrap()
          .then(() => {
            setSnackbar({
              open: true,
              message: "Bulk upload successful!",
              severity: "success",
            });
            setOpen(false);

            // ✅ Notify parent to refresh sections
            if (typeof onSuccess === "function") {
              onSuccess();
            }
          })
          .catch((err) => {
            console.error("❌ Upload failed:", err);
            setSnackbar({
              open: true,
              message: "Upload failed. Please check your Excel format ",
              severity: "error",
            });
          });
      };
      reader.readAsBinaryString(file);
    }
  };

  const handleClose = () => {
    setOpen(false);
    dispatch(resetBulkUpload());
  };

  return (
    <>
      {/* Open Upload Dialog */}
      <Button
        variant="contained"
        color="primary"
        startIcon={<File />}
        onClick={() => setOpen(true)}
        sx={{ background: "#18a16e" }}
      >
        Bulk Upload
      </Button>

      {/* Dialog for Bulk Upload */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Bulk Upload Survey Data</DialogTitle>

        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              :- The file must contain four columns: Section, Question, Option,
              Score following the same structure as the example sheet.
              <br />
              :- If a Section already exists, do not upload it as a new row.
              Instead, add the new questions under the same Section so that
              duplicate Sections are not created.
              <br />
              :- Please format your data exactly like the example provided.
            </Typography>
          </Box>

          <Stack direction="row" spacing={2} alignItems="center">
            {/* Upload Button */}
            <Button
              variant="contained"
              startIcon={<UploadCloud />}
              onClick={handleUploadClick}
              disabled={loading}
              sx={{ background: "#18a16e" }}
            >
              {loading ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                "Upload Excel File"
              )}
            </Button>

            {/* Hidden File Input */}
            <input
              type="file"
              accept=".xls,.xlsx"
              hidden
              ref={fileInputRef}
              onChange={handleFileChange}
            />

            {/* Example File Download */}
            <Button
              variant="contained"
              component="a"
              href={exampleFileUrl}
              download="Example_Compliance_Questions.xlsx"
              sx={{ ml: 2, backgroundColor: "#18a16e" }}
            >
              Download Example
            </Button>
          </Stack>

          {/* Status Messages */}
          {error && (
            <Typography mt={2} color="error.main">
              ❌ Upload failed: {error}
            </Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="inherit" disabled={loading}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
