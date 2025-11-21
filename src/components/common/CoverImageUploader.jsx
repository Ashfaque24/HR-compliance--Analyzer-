// src/components/common/CoverImageUploader.js (Corrected)
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchExistingCoverImages,
  saveCoverImages,
  resetSaveStatus,
} from "../../redux/features/coverPageSlice";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  CircularProgress,
  Alert,
  Grid,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { CloudUpload, Close, CheckCircle } from "@mui/icons-material";
import { getImageUrl } from "../../utils/imageHelper";

export default function CoverImageUploader({
  session_uuid,
  frontImage,
  backImage,
  setFrontImage,
  setBackImage,
}) {
  const dispatch = useDispatch();

  const {
    existingFrontImages,
    existingBackImages,
    loading,
    error,
    saveLoading,
    saveError,
    saveSuccess,
  
    newFrontFilename, 
    newBackFilename,  
  } = useSelector((state) => state.coverPage);

  const [frontFile, setFrontFile] = useState(null);
  const [backFile, setBackFile] = useState(null);
  const [openFrontDialog, setOpenFrontDialog] = useState(false);
  const [openBackDialog, setOpenBackDialog] = useState(false);

  // States to hold preview URLs for front/back images
  const [frontImageUrl, setFrontImageUrl] = useState("");
  const [backImageUrl, setBackImageUrl] = useState("");

  useEffect(() => {
    if (session_uuid) {
      dispatch(fetchExistingCoverImages(session_uuid));
      // Reset save status on mount to prevent stale success message
      dispatch(resetSaveStatus()); 
    }
  }, [dispatch, session_uuid]);

  // 🔥 FIX 1: Update Parent State and Reset Local File State upon successful upload
  useEffect(() => {
    if (saveSuccess) {
      // 1. Reset local file objects
      setFrontFile(null);
      setBackFile(null);
      
    
      if (newFrontFilename) {
        setFrontImage(newFrontFilename);
      }
      if (newBackFilename) {
        setBackImage(newBackFilename);
      }
      
     
      dispatch(fetchExistingCoverImages(session_uuid));
      
      
    }
    
    // Cleanup save status after success or error
    if (saveSuccess || saveError) {
        const timer = setTimeout(() => {
            dispatch(resetSaveStatus());
        }, 3000); // Clear status messages after 3 seconds
        return () => clearTimeout(timer);
    }
  }, [saveSuccess, saveError, newFrontFilename, newBackFilename, dispatch, session_uuid, setFrontImage, setBackImage]);
  // Note: frontImage and backImage are NOT dependencies here, as we are setting them.


  // Update front image URL preview whenever related dependencies change
  useEffect(() => {
    if (frontFile) {
      // Priority 1: Newly selected file from local computer
      const url = URL.createObjectURL(frontFile);
      setFrontImageUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (frontImage) { // Priority 2: Filename exists (from parent prop)
      const selected = existingFrontImages.find((img) => img.filename === frontImage);
      // 🔥 FIX 2: Ensure existingFrontImages is checked for the image URL
      setFrontImageUrl(selected ? getImageUrl(selected.url) : "");
    } else {
      setFrontImageUrl("");
    }
  }, [frontFile, frontImage, existingFrontImages]);

  // Update back image URL preview similarly
  useEffect(() => {
    if (backFile) {
      // Priority 1: Newly selected file from local computer
      const url = URL.createObjectURL(backFile);
      setBackImageUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (backImage) { // Priority 2: Filename exists (from parent prop)
      const selected = existingBackImages.find((img) => img.filename === backImage);
      // 🔥 FIX 2: Ensure existingBackImages is checked for the image URL
      setBackImageUrl(selected ? getImageUrl(selected.url) : "");
    } else {
      setBackImageUrl("");
    }
  }, [backFile, backImage, existingBackImages]);

  const handleFileChange = (setter, resetSelector) => (e) => {
    const file = e.target.files[0];
    if (file) {
      setter(file); // setFrontFile(file)
      resetSelector(""); // setFrontImage("") - clear selected existing image
    }
  };

  const uploadCoverImages = () => {
    if (!session_uuid) return;
    if (!frontFile && !backFile) return;

    dispatch(resetSaveStatus());

    const formData = new FormData();
    if (frontFile) formData.append("frontImage", frontFile);
    if (backFile) formData.append("backImage", backFile);

    dispatch(saveCoverImages({ session_uuid, formData }));
    // No need to manually update state here, as it's done in the saveSuccess useEffect
  };

  const handleSelectExisting = (filename, type) => {
    if (type === "front") {
      setFrontImage(filename); // Update parent state with selected filename
      setFrontFile(null); // Clear local file (upload) state
      setOpenFrontDialog(false);
    } else {
      setBackImage(filename); // Update parent state with selected filename
      setBackFile(null); // Clear local file (upload) state
      setOpenBackDialog(false);
    }
  };

  const ImageSelectionDialog = ({ open, onClose, images, selectedImage, type }) => (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Select {type === "front" ? "Front" : "Back"} Page Image
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
        ) : images.length === 0 ? (
          <Typography color="text.secondary" textAlign="center" py={4}>
            No existing images found. Upload a new image.
          </Typography>
        ) : (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {images.map((imgObj, idx) => {
              const isSelected = selectedImage === imgObj.filename;
              return (
                <Grid item xs={6} sm={4} md={3} key={idx}>
                  <Paper
                    elevation={isSelected ? 8 : 2}
                    sx={{
                      p: 1,
                      cursor: "pointer",
                      position: "relative",
                      border: isSelected ? "3px solid #1976d2" : "3px solid transparent",
                      transition: "all 0.2s",
                      "&:hover": {
                        elevation: 6,
                        transform: "scale(1.02)",
                      },
                    }}
                    onClick={() => handleSelectExisting(imgObj.filename, type)}
                  >
                    <Box
                      component="img"
                      src={getImageUrl(imgObj.url)}
                      alt={imgObj.filename}
                      sx={{
                        width: "100%",
                        height: 150,
                        objectFit: "cover",
                        borderRadius: 1,
                      }}
                    />
                    {isSelected && (
                      <CheckCircle
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          color: "#1976d2",
                          backgroundColor: "white",
                          borderRadius: "50%",
                        }}
                      />
                    )}
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        mt: 1,
                        textAlign: "center",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={imgObj.filename}
                    >
                      {imgObj.filename}
                    </Typography>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );

  const isUploadDisabled = (!frontFile && !backFile) || saveLoading;

  return (
    <Card elevation={6} sx={{ mb: 3, borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
          Cover Page Images
        </Typography>

        {loading && <CircularProgress size={24} sx={{ mb: 2 }} />}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={4}>
          {/* Front Image */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight="600" mb={2}>
              Front Page Image (A4 size)
            </Typography>

            {/* Selected/Preview Image */}
            {(frontFile || frontImageUrl) && (
              <Paper elevation={3} sx={{ p: 2, mb: 2, position: "relative" }}>
                <Box
                  component="img"
                  src={frontImageUrl}
                  alt="Front Page Preview"
                  sx={{
                    width: "100%",
                    maxHeight: 300,
                    objectFit: "contain",
                    borderRadius: 1,
                  }}
                />
                <IconButton
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    backgroundColor: "rgba(255,255,255,0.9)",
                    "&:hover": { backgroundColor: "rgba(255,255,255,1)" },
                  }}
                  onClick={() => {
                    setFrontFile(null); // Clear local file state
                    setFrontImage(""); // Clear parent's selected filename state
                  }}
                >
                  <Close />
                </IconButton>
                <Typography variant="caption" sx={{ display: "block", mt: 1, textAlign: "center" }}>
                  {frontFile ? frontFile.name : frontImage}
                </Typography>
              </Paper>
            )}

            {/* Action Buttons */}
            <Stack spacing={1}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => setOpenFrontDialog(true)}
                disabled={loading}
              >
                Select from Existing ({existingFrontImages.length})
              </Button>
              <Button
                variant="contained"
                component="label"
                fullWidth
                startIcon={<CloudUpload />}
              >
                Upload New Image
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleFileChange(setFrontFile, setFrontImage)}
                />
              </Button>
            </Stack>
          </Grid>

          {/* Back Image */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight="600" mb={2}>
              Back Page Image (A4 size)
            </Typography>

            {/* Selected/Preview Image */}
            {(backFile || backImageUrl) && (
              <Paper elevation={3} sx={{ p: 2, mb: 2, position: "relative" }}>
                <Box
                  component="img"
                  src={backImageUrl}
                  alt="Back Page Preview"
                  sx={{
                    width: "100%",
                    maxHeight: 300,
                    objectFit: "contain",
                    borderRadius: 1,
                  }}
                />
                <IconButton
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    backgroundColor: "rgba(255,255,255,0.9)",
                    "&:hover": { backgroundColor: "rgba(255,255,255,1)" },
                  }}
                  onClick={() => {
                    setBackFile(null);
                    setBackImage("");
                  }}
                >
                  <Close />
                </IconButton>
                <Typography variant="caption" sx={{ display: "block", mt: 1, textAlign: "center" }}>
                  {backFile ? backFile.name : backImage}
                </Typography>
              </Paper>
            )}

            {/* Action Buttons */}
            <Stack spacing={1}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => setOpenBackDialog(true)}
                disabled={loading}
              >
                Select from Existing ({existingBackImages.length})
              </Button>
              <Button
                variant="contained"
                component="label"
                fullWidth
                startIcon={<CloudUpload />}
              >
                Upload New Image
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleFileChange(setBackFile, setBackImage)}
                />
              </Button>
            </Stack>
          </Grid>
        </Grid>

        {/* Status Messages */}
        {saveLoading && (
          <Alert severity="info" sx={{ mt: 3 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <CircularProgress size={20} />
              <Typography>Uploading images...</Typography>
            </Stack>
          </Alert>
        )}

        {saveError && !saveLoading && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {saveError}
          </Alert>
        )}

        {saveSuccess && (
          <Alert severity="success" sx={{ mt: 3 }}>
            Cover images uploaded and selected successfully!
          </Alert>
        )}

        {/* Upload Button */}
        <Stack justifyContent="flex-end" direction="row" sx={{ mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={uploadCoverImages}
            disabled={isUploadDisabled}
            size="large"
            sx={{ minWidth: 200 }}
          >
            {saveLoading ? "Uploading..." : "Upload Cover Images"}
          </Button>
        </Stack>

        {/* Image Selection Dialogs */}
        <ImageSelectionDialog
          open={openFrontDialog}
          onClose={() => setOpenFrontDialog(false)}
          images={existingFrontImages}
          selectedImage={frontImage}
          type="front"
        />

        <ImageSelectionDialog
          open={openBackDialog}
          onClose={() => setOpenBackDialog(false)}
          images={existingBackImages}
          selectedImage={backImage}
          type="back"
        />
      </CardContent>
    </Card>
  );
}

