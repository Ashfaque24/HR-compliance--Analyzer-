
import React, { useState, useRef } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Stack,
  Box
} from "@mui/material";
import { File, UploadCloud } from "lucide-react";
import * as XLSX from "xlsx";

export default function BulkUpload({ onFileSelected, exampleFileUrl }) {
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef();

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Updated to parse Excel file to JSON
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const jsonData = XLSX.utils.sheet_to_json(ws, { defval: "" }); // Provide default value for empty cells
        onFileSelected && onFileSelected(jsonData); // Pass JSON data to parent
        setOpen(false);
      };
      reader.readAsBinaryString(file);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<File />}
        onClick={() => setOpen(true)}
      >
        Bulk Upload
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Bulk Upload Survey Data</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Upload your survey sections/questions in Excel format.<br />
              Please refer to the example file before uploading.
            </Typography>
          </Box>
          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              variant="contained"
              startIcon={<UploadCloud />}
              onClick={handleUploadClick}
            >
              Upload Excel File
            </Button>
            <input
              type="file"
              accept=".xls,.xlsx"
              hidden
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <Button
              variant="outlined"
              component="a"
              href={exampleFileUrl}
              target="_blank"
              rel="noopener"
              sx={{ ml: 2 }}
            >
              Download Example
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="inherit">Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}


