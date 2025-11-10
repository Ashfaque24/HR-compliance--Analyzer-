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
import QuestionsAndOptionsAdmin from "./Questions&OptionsAdmin"; // Import your separated component

export default function AdminDashboard() {
  const { loading, error } = useSelector((store) => store.questions);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));

  const [editingSection, setEditingSection] = useState(false);

  // ======= Section and view state =======
  const [activeView, setActiveView] = useState("overview"); // 'overview' or 'section-detail'
  const [selectedSection, setSelectedSection] = useState(null);

  // ======= Section modals state =======
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [showEditSectionModal, setShowEditSectionModal] = useState(false);
  const [sectionTitle, setSectionTitle] = useState("");
  const [editSectionId, setEditSectionId] = useState(null);
  const [editSectionName, setEditSectionName] = useState("");

  // ======= Redux data =======
  const sections = useSelector((state) => state.sections.items);
  const totalSections = sections.length;

  // ======= Fetch on mount =======
  useEffect(() => {
    dispatch(fetchSectionsWithQuestionCount());
  }, [dispatch]);

  // ======= Section CRUD handlers =======
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

  const handleDeleteSection = async (sectionId) => {
    await dispatch(deleteSection(sectionId));
    dispatch(fetchSectionsWithQuestionCount());
    if (selectedSection && selectedSection.id === sectionId) {
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
      {/* ======= Header ======= */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          mb: 4,
          gap: { xs: 2, sm: 0 },
          alignItems: "center",
        }}
      >
        <Typography variant="h4" fontWeight="bold" noWrap>
          Survey Management Dashboard
        </Typography>
        <Typography color="text.secondary" mt={1} noWrap>
          Manage and view all survey sections, questions, and options.
        </Typography>
      </Box>

      {/* ======= Breadcrumb Navigation ======= */}
      {selectedSection ? (
        <Stack
          direction="row"
          alignItems="center"
          flexWrap="wrap"
          spacing={1}
          mb={2}
        >
          <Button
            variant="text"
            startIcon={<ArrowLeft />}
            onClick={() => {
              setSelectedSection(null);
              setActiveView("overview");
            }}
            size={isSmDown ? "small" : "medium"}
          >
            Back to Overview
          </Button>
          <ChevronRight color="#aaa" size={20} />
          <Typography
            fontWeight="medium"
            noWrap
            sx={{ maxWidth: { xs: "150px", sm: "300px" } }}
          >
            {selectedSection.section_name}
          </Typography>
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
            onClick={() => setActiveView("overview")}
            fullWidth={isSmDown}
            size={isSmDown ? "small" : "medium"}
          >
            Overview
          </Button>
          <Box width={isSmDown ? "100%" : "auto"}>
            <BulkUpload
              onFileSelected={(jsonData) => {
                console.log("Excel as JSON:", jsonData);
              }}
              exampleFileUrl="/assets/Compliance_Questions (1).xlsx"
            />
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<BarChart2 />}
            onClick={() => navigate("/admin/report")}
            fullWidth={isSmDown}
            size={isSmDown ? "small" : "medium"}
          >
            Report
          </Button>
        </Stack>
      )}

      {/* ======= Overview Section: List all sections ======= */}
      {activeView === "overview" && !selectedSection && (
        <Stack spacing={4}>
          <Stack direction="row" spacing={3} justifyContent="center">
            <Paper sx={{ flex: 1, textAlign: "center", p: { xs: 2, md: 3 } }}>
              <Database color="#1976d2" size={48} />
              <Typography variant="h6" fontWeight="bold">
                {totalSections}
              </Typography>
              <Typography color="text.secondary">Total Sections</Typography>
            </Paper>
          </Stack>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap={2}
          >
            <Typography variant="h6" fontWeight="bold">
              Survey Sections
            </Typography>
            <Button
              variant="contained"
              startIcon={<Plus />}
              onClick={() => setShowAddSectionModal(true)}
              size={isSmDown ? "small" : "medium"}
            >
              Add New Section
            </Button>
          </Box>
          <Stack spacing={2}>
            {sections.map((section) => (
              <Paper key={section.id} sx={{ p: 3 }}>
                <Box
                  display="flex"
                  flexDirection={{ xs: "column", sm: "row" }}
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  justifyContent="space-between"
                  gap={1}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    flexWrap="nowrap"
                    spacing={1}
                  >
                    <ChevronRight size={20} color="#aaa" />
                    <Typography
                      variant="h6"
                      fontWeight="medium"
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: isSmDown ? 200 : 400,
                      }}
                    >
                      {section.section_name}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    flexWrap="wrap"
                    sx={{ mt: { xs: 1, sm: 0 } }}
                  >
                    <Typography color="text.secondary" variant="body2" noWrap>
                      {section.questionCount || 0} questions
                    </Typography>
                    <IconButton
                      color="primary"
                      size={isSmDown ? "small" : "medium"}
                      onClick={() => {
                        setEditSectionId(section.id);
                        setEditSectionName(section.section_name);
                        setShowEditSectionModal(true);
                      }}
                    >
                      <Edit3 size={18} />
                    </IconButton>
                    <IconButton
                      color="error"
                      size={isSmDown ? "small" : "medium"}
                      onClick={() => handleDeleteSection(section.id)}
                    >
                      <Trash2 size={18} />
                    </IconButton>
                    <IconButton
                      color="primary"
                      size={isSmDown ? "small" : "medium"}
                      onClick={() => {
                        setSelectedSection(section);
                        setActiveView("section-detail");
                      }}
                    >
                      <Eye size={18} />
                    </IconButton>
                  </Stack>
                </Box>
              </Paper>
            ))}
          </Stack>
        </Stack>
      )}

      {/* ======= Section Detail: Use separated Questions&OptionsAdmin ======= */}
      {activeView === "section-detail" && selectedSection && (
        <QuestionsAndOptionsAdmin
          selectedSection={selectedSection}
          setSelectedSection={setSelectedSection}
          setActiveView={setActiveView}
          isSmDown={isSmDown}
        />
      )}

      {/* ======= Add Section Modal ======= */}
      <Dialog
        open={showAddSectionModal}
        onClose={() => setShowAddSectionModal(false)}
        fullWidth
        maxWidth="xs"
        fullScreen={isSmDown}
      >
        <DialogTitle>Add New Section</DialogTitle>
        <DialogContent>
          <TextField
            label="Section Title"
            value={sectionTitle}
            onChange={(e) => setSectionTitle(e.target.value)}
            fullWidth
            margin="normal"
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddSectionModal(false)}>Cancel</Button>
          <Button
            onClick={handleAddSection}
            variant="contained"
            startIcon={<Save />}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* ======= Edit Section Modal ======= */}
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
            value={editSectionName}
            onChange={(e) => setEditSectionName(e.target.value)}
            fullWidth
            margin="normal"
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleEditSection}
            variant="contained"
            startIcon={editingSection ? <LoadingSpinner size={20} /> : <Save />}
            disabled={editingSection}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
