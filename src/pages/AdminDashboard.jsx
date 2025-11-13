
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import LoadingSpinner from "../components/common/LoadingSpinner";
import {
  Plus,
  Edit3,
  Trash2,
  Eye,
  ChevronRight,
  Database,
  Save,
  ArrowLeft,
  BarChart2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchSectionsWithQuestionCount,
  addSection,
  editSection,
  deleteSection,
} from "../redux/features/sectionsSlice";
import BulkUpload from "../components/common/BulkUpload";
import QuestionsAndOptionsAdmin from "./Questions&OptionsAdmin";

export default function AdminDashboard() {
  const { loading, error } = useSelector((store) => store.questions);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));
  const isXsDown = useMediaQuery(theme.breakpoints.down("xs"));

  const [editingSection, setEditingSection] = useState(false);
  const [activeView, setActiveView] = useState("overview");
  const [selectedSection, setSelectedSection] = useState(null);

  // Section Modal States
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [showEditSectionModal, setShowEditSectionModal] = useState(false);
  const [sectionTitle, setSectionTitle] = useState("");
  const [editSectionId, setEditSectionId] = useState(null);
  const [editSectionName, setEditSectionName] = useState("");

  const sections = useSelector((state) => state.sections.items);
  const totalSections = sections.length;

  useEffect(() => {
    dispatch(fetchSectionsWithQuestionCount());
  }, [dispatch]);

  const handleAddSection = async () => {
    if (sectionTitle.trim()) {
      dispatch(addSection(sectionTitle.trim())).then((res) => {
        if (res.payload.status !== "error") {
          setSectionTitle("");
          setShowAddSectionModal(false);
          dispatch(fetchSectionsWithQuestionCount());
        }
      });
    }
  };

  const handleEditSection = async () => {
    if (editSectionName.trim() && editSectionId) {
      setEditingSection(true);
      try {
        await dispatch(
          editSection({
            id: editSectionId,
            section_name: editSectionName,
            is_active: 1,
          })
        );
        setShowEditSectionModal(false);
        setEditSectionId(null);
        setEditSectionName("");
        dispatch(fetchSectionsWithQuestionCount());
      } finally {
        setEditingSection(false);
      }
    }
  };

  const handleDeleteSection = async (id) => {
    await dispatch(deleteSection(id));
    dispatch(fetchSectionsWithQuestionCount());
    if (selectedSection?.id === id) {
      setSelectedSection(null);
      setActiveView("overview");
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "#f5f7fa",
        minHeight: "100vh",
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 2,
          mb: 4,
        }}
      >
        <Typography variant="h5" fontWeight="bold" sx={{ textAlign: "left" }}>
          Survey Management Dashboard
        </Typography>
      </Box>

      {/* BREADCRUMB */}
      {selectedSection ? (
        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
          <Button
            variant="outlined"
            startIcon={<ArrowLeft />}
            onClick={() => {
              setSelectedSection(null);
              setActiveView("overview");
            }}
            size={isSmDown ? "small" : "medium"}
            fullWidth={isSmDown}
          >
            Back
          </Button>

          {!isSmDown && <ChevronRight size={20} color="#777" />}
          {!isSmDown && (
            <Typography
              sx={{
                fontWeight: 600,
                maxWidth: 250,
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {selectedSection.section_name}
            </Typography>
          )}
        </Stack>
      ) : (
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          mb={3}
          alignItems={{ xs: "stretch", sm: "center" }}
        >
          <Button
            variant="contained"
            startIcon={<Database />}
            fullWidth={isSmDown}
            sx={{ background: "#18a16e" }}
            onClick={() => setActiveView("overview")}
          >
            Overview
          </Button>

          <BulkUpload
            onFileSelected={(json) => console.log("Excel JSON:", json)}
            exampleFileUrl="/assets/Compliance_Questions (1).xlsx"
          />

          <Button
            variant="contained"
            startIcon={<BarChart2 />}
            fullWidth={isSmDown}
            sx={{ background: "#18a16e" }}
            onClick={() => navigate("/admin/report")}
          >
            Report
          </Button>
        </Stack>
      )}

      {/* OVERVIEW LIST */}
      {activeView === "overview" && !selectedSection && (
        <Stack spacing={4}>
          {/* Stats */}
          <Stack direction="row" justifyContent="center">
            <Paper sx={{ p: 3, textAlign: "center", width: "100%" }}>
              <Database size={40} color="#1976d2" />
              <Typography variant="h6" fontWeight="bold">
                {totalSections}
              </Typography>
              <Typography color="text.secondary">Total Sections</Typography>
            </Paper>
          </Stack>

          {/* Add Section */}
          <Box
            display="flex"
            justifyContent="space-between"
            flexWrap="wrap"
            gap={1}
          >
            <Typography variant="h6" fontWeight="bold">
              Survey Sections
            </Typography>

            <Button
              variant="contained"
              startIcon={<Plus />}
              size={isSmDown ? "small" : "medium"}
              sx={{ background: "#18a16e" }}
              onClick={() => setShowAddSectionModal(true)}
            >
              Add Section
            </Button>
          </Box>

          {/* Section List */}
          <Stack spacing={2}>
            {sections.map((sec) => (
              <Paper key={sec.id} sx={{ p: 2.5 }}>
                <Box
                  display="flex"
                  flexDirection={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  gap={2}
                >
                  {/* Name */}
                  <Stack direction="row" spacing={1} alignItems="center">
                    <ChevronRight size={18} color="#aaa" />
                    <Typography
                      sx={{
                        fontSize: 16,
                        fontWeight: 600,
                        maxWidth: { xs: 200, sm: 350 },
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {sec.section_name}
                    </Typography>
                  </Stack>

                  {/* Actions */}
                  <Stack direction="row" spacing={1}>
                    <Typography variant="body2" color="text.secondary">
                      {sec.questionCount} questions
                    </Typography>

                    <IconButton
                      size="small"
                      onClick={() => {
                        setEditSectionId(sec.id);
                        setEditSectionName(sec.section_name);
                        setShowEditSectionModal(true);
                      }}
                    >
                      <Edit3 size={18} color="#4385f5"/>
                    </IconButton>

                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteSection(sec.id)}
                    >
                      <Trash2 size={18} />
                    </IconButton>

                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelectedSection(sec);
                        setActiveView("section-detail");
                      }}
                    >
                      <Eye size={18} color="#4385f5" />
                    </IconButton>
                  </Stack>
                </Box>
              </Paper>
            ))}
          </Stack>
        </Stack>
      )}

      {/* SECTION DETAIL */}
      {activeView === "section-detail" && selectedSection && (
        <QuestionsAndOptionsAdmin
          selectedSection={selectedSection}
          setSelectedSection={setSelectedSection}
          setActiveView={setActiveView}
          isSmDown={isSmDown}
        />
      )}

      {/* ADD SECTION MODAL */}
      <Dialog
        open={showAddSectionModal}
        onClose={() => setShowAddSectionModal(false)}
        fullWidth
        maxWidth="xs"
        fullScreen={isSmDown}
      >
        <DialogTitle>Add Section</DialogTitle>
        <DialogContent>
          <TextField
            label="Section Title"
            fullWidth
            value={sectionTitle}
            onChange={(e) => setSectionTitle(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddSectionModal(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            sx={{ background: "#18a16e" }}
            onClick={handleAddSection}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* EDIT SECTION MODAL */}
      <Dialog
        open={showEditSectionModal}
        onClose={() => setShowEditSectionModal(false)}
        fullWidth
        maxWidth="xs"
        fullScreen={isSmDown}
      >
        <DialogTitle>Edit Section</DialogTitle>
        <DialogContent>
          <TextField
            label="Section Title"
            fullWidth
            value={editSectionName}
            onChange={(e) => setEditSectionName(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            sx={{ background: "#18a16e" }}
            disabled={editingSection}
            startIcon={
              editingSection ? <LoadingSpinner size={20} /> : <Save />
            }
            onClick={handleEditSection}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

