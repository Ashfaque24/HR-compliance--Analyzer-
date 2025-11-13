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
} from "@mui/material";
import { File, UploadCloud } from "lucide-react";
import * as XLSX from "xlsx";
import { useDispatch, useSelector } from "react-redux";
import {
  bulkUploadQuestions,
  resetBulkUpload,
} from "../../redux/features/bulkUploadSlice";

export default function BulkUpload() {
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef();
  const dispatch = useDispatch();

  const { loading, success, error } = useSelector(
    (state) => state.bulkUpload || {}
  );

  // ✅ Path to example Excel file (inside public/assets)
  const exampleFileUrl = "/assets/Compliance_Questions.xlsx";

  // Trigger hidden file input
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  /**
   * ✅ Group Excel rows by Section & Question
   * Also maps Options + Scores into [{ name, score }]
   */
  const groupRows = (rows) => {
    const grouped = {};
  
    rows.forEach((row) => {
      const section = row.Section?.trim();
      const question = row.Question?.trim();
      if (!section || !question) return;
  
      const key = `${section}|${question}`;
  
      if (!grouped[key]) {
        grouped[key] = {
          section,
          question,
          options: [],
        };
      }
  
      const opts = row.Options ? row.Options.split(",").map((o) => o.trim()) : [];
      const singleScore = Number(row.Score) || 0; // single score value
  
      opts.forEach((name) => {
        if (!grouped[key].options.some((o) => o.name === name)) {
          grouped[key].options.push({ name, score: singleScore });
        }
      });
    });
  
    return Object.values(grouped);
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
          alert("⚠️ No valid data found in the uploaded file!");
          return;
        }

        console.log("📦 Upload payload:", uploadPayload);

        // Dispatch async thunk
        dispatch(bulkUploadQuestions(uploadPayload))
          .unwrap()
          .then(() => {
            alert("✅ Bulk upload successful!");
            setOpen(false);
          })
          .catch((err) => {
            console.error("❌ Upload failed:", err);
            alert(
              "Upload failed. Please check your Excel format or console for details."
            );
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
        sx={{background: "#18a16e" }}
      >
        Bulk Upload
      </Button>

      {/* Dialog for Bulk Upload */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Bulk Upload Survey Data</DialogTitle>

        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Upload your survey data in Excel format.
              <br />
              Each row should have <b>Section</b>, <b>Question</b>, and{" "}
              <b>Options</b> (comma-separated).
              <br />
              Optionally, you can add a <b>Scores</b> column to assign points per
              option.
              <br />
              Refer to the example file below.
            </Typography>
          </Box>

          <Stack direction="row" spacing={2} alignItems="center">
            {/* Upload Button */}
            <Button
              variant="contained"
              startIcon={<UploadCloud />}
              onClick={handleUploadClick}
              disabled={loading}
              sx={{background:"#18a16e"}}
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
              download="Example_Compliance_Questions.xlsx" // ✅ forces download
              sx={{ ml: 2, backgroundColor:"#18a16e" }}
            >
              Download Example
            </Button>
          </Stack>

          {/* Status Messages */}
          {success && (
            <Typography mt={2} color="success.main">
              ✅ Uploaded successfully!
            </Typography>
          )}
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
    </>
  );
}
