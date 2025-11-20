import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchExistingCoverImages,
  saveCoverImages,
  setFrontImage,
  setBackImage,
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

export default function CoverImageUploader({ session_uuid }) {
  const dispatch = useDispatch();

  const {
    frontImage,
    backImage,
    existingFrontImages,
    existingBackImages,
    loading,
    error,
    saveLoading,
    saveError,
    saveSuccess,
  } = useSelector((state) => state.coverPage);

  const [frontFile, setFrontFile] = useState(null);
  const [backFile, setBackFile] = useState(null);
  const [openFrontDialog, setOpenFrontDialog] = useState(false);
  const [openBackDialog, setOpenBackDialog] = useState(false);

  useEffect(() => {
    if (session_uuid) {
      dispatch(fetchExistingCoverImages(session_uuid));
      dispatch(resetSaveStatus());
    }
  }, [dispatch, session_uuid]);

  const handleFileChange = (setter, resetFile) => (e) => {
    const file = e.target.files[0];
    if (file) {
      setter(file);
      resetFile(null);
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
  };

  const getFrontImageUrl = () => {
    if (frontFile) return URL.createObjectURL(frontFile);
    if (!frontImage) return "";
    const selected = existingFrontImages.find((img) => img.filename === frontImage);
    return selected ? getImageUrl(selected.url) : "";
  };

  const getBackImageUrl = () => {
    if (backFile) return URL.createObjectURL(backFile);
    if (!backImage) return "";
    const selected = existingBackImages.find((img) => img.filename === backImage);
    return selected ? getImageUrl(selected.url) : "";
  };

  const handleSelectExisting = (filename, type) => {
    if (type === "front") {
      dispatch(setFrontImage(filename));
      setFrontFile(null);
      setOpenFrontDialog(false);
    } else {
      dispatch(setBackImage(filename));
      setBackFile(null);
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
        {images.length === 0 ? (
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
            {(frontFile || frontImage) && (
              <Paper elevation={3} sx={{ p: 2, mb: 2, position: "relative" }}>
                <Box
                  component="img"
                  src={getFrontImageUrl()}
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
                    setFrontFile(null);
                    dispatch(setFrontImage(""));
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
                  onChange={handleFileChange(setFrontFile, () => dispatch(setFrontImage("")))}
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
            {(backFile || backImage) && (
              <Paper elevation={3} sx={{ p: 2, mb: 2, position: "relative" }}>
                <Box
                  component="img"
                  src={getBackImageUrl()}
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
                    dispatch(setBackImage(""));
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
                  onChange={handleFileChange(setBackFile, () => dispatch(setBackImage("")))}
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
            Cover images uploaded successfully!
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




