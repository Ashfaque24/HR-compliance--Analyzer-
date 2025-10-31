
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Badge,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import NotificationsIcon from "@mui/icons-material/Notifications";

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

import {
  fetchQuestionsBySection,
  fetchAllQuestions,
  addQuestion,
  editQuestion,
  deleteQuestion,
} from "../redux/features/questionsSlice";

import {
  fetchAnswersByQuestion,
  addAnswer,
  editAnswer,
  deleteAnswer,
} from "../redux/features/answersSlice";

import BulkUpload from "../components/common/BulkUpload";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down("sm")); // screens below 600px

  // State for active view and current selected section
  const [activeView, setActiveView] = useState("overview");
  const [selectedSection, setSelectedSection] = useState(null);

  // Section modal state and fields (for adding/editing)
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [showEditSectionModal, setShowEditSectionModal] = useState(false);
  const [sectionTitle, setSectionTitle] = useState("");
  const [editSectionId, setEditSectionId] = useState(null);
  const [editSectionName, setEditSectionName] = useState("");

  // Question add/edit state
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [showEditQuestionModal, setShowEditQuestionModal] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [editQuestionId, setEditQuestionId] = useState(null);
  const [editQuestionText, setEditQuestionText] = useState("");
  // Options for adding and editing questions (including score)
  const [options, setOptions] = useState([
    { id: null, option_text: "", score: "4" },
    { id: null, option_text: "", score: "3" },
    { id: null, option_text: "", score: "2" },
    { id: null, option_text: "", score: "1" },
  ]);
  const [editOptions, setEditOptions] = useState([
    { id: null, option_text: "", score: "4" },
  ]);

  // Modal state for single answer option editing (without score in this modal)
  const [showEditAnswerModal, setShowEditAnswerModal] = useState(false);
  const [editAnswerId, setEditAnswerId] = useState(null);
  const [editOptionText, setEditOptionText] = useState("");

  // Redux data selectors
  const sections = useSelector((state) => state.sections.items);
  const questions = useSelector((state) => state.questions.items);
  const answers = useSelector((state) => state.answers.items);

  // Initial data load
  useEffect(() => {
    dispatch(fetchSectionsWithQuestionCount());
    dispatch(fetchAllQuestions());
  }, [dispatch]);

  // Load questions when a section is selected
  useEffect(() => {
    if (selectedSection) {
      dispatch(fetchQuestionsBySection(selectedSection.id));
    }
  }, [selectedSection, dispatch]);

  // Load answers whenever questions change
  useEffect(() => {
    if (questions.length) {
      questions.forEach((q) => dispatch(fetchAnswersByQuestion(q.id)));
    }
  }, [questions, dispatch]);

  const totalSections = sections.length;

  // --- SECTION HANDLERS ---
  const handleAddSection = async () => {
    if (sectionTitle.trim()) {
      await dispatch(addSection(sectionTitle.trim()));
      setSectionTitle("");
      setShowAddSectionModal(false);
      dispatch(fetchSectionsWithQuestionCount());
    }
  };

  const handleEditSection = async () => {
    if (editSectionName.trim() && editSectionId) {
      await dispatch(
        editSection({ id: editSectionId, section_name: editSectionName, is_active: 1 })
      );
      setShowEditSectionModal(false);
      setEditSectionId(null);
      setEditSectionName("");
      dispatch(fetchSectionsWithQuestionCount());
    }
  };

  const handleDeleteSection = async (sectionId) => {
    if (window.confirm("Are you sure you want to delete this section?")) {
      await dispatch(deleteSection(sectionId));
      dispatch(fetchSectionsWithQuestionCount());
      if (selectedSection && selectedSection.id === sectionId) {
        setSelectedSection(null);
        setActiveView("overview");
      }
    }
  };

  // --- QUESTION HANDLERS ---
  const handleAddQuestion = async () => {
    if (questionText.trim() && options.every((opt) => opt.option_text.trim()) && selectedSection) {
      const questionResult = await dispatch(
        addQuestion({ question: questionText.trim(), section_id: selectedSection.id })
      ).unwrap();

      for (const opt of options) {
        await dispatch(
          addAnswer({
            question_id: questionResult.id,
            option_text: opt.option_text.trim(),
            score: opt.score !== "" ? Number(opt.score) : 0,
          })
        );
      }
      setQuestionText("");
      // Reset options for next add with default scores
      setOptions([
        { id: null, option_text: "", score: "4" },
        { id: null, option_text: "", score: "3" },
        { id: null, option_text: "", score: "2" },
        { id: null, option_text: "", score: "1" },
      ]);
      setShowAddQuestionModal(false);
      await dispatch(fetchQuestionsBySection(selectedSection.id));
    }
  };

  const handleEditQuestionClick = async (question) => {
    setEditQuestionId(question.id);
    setEditQuestionText(question.question);
    await dispatch(fetchAnswersByQuestion(question.id));
    const optionsWithIds = answers
      .filter((ans) => ans.question_id === question.id)
      .map((ans) => ({
        id: ans.id,
        option_text: ans.option_text,
        score: ans.score !== undefined && ans.score !== null ? String(ans.score) : "",
      }));
    setEditOptions(
      optionsWithIds.length
        ? optionsWithIds
        : [
            { id: null, option_text: "", score: "4" },
            { id: null, option_text: "", score: "3" },
            { id: null, option_text: "", score: "2" },
            { id: null, option_text: "", score: "1" },
          ]
    );
    setShowEditQuestionModal(true);
  };

  const handleEditQuestion = async () => {
    if (editQuestionText.trim() && editQuestionId && selectedSection) {
      await dispatch(
        editQuestion({ id: editQuestionId, question: editQuestionText, section_id: selectedSection.id })
      );
      for (const opt of editOptions) {
        if (opt.id) {
          await dispatch(
            editAnswer({
              id: opt.id,
              option_text: opt.option_text,
              score: opt.score !== undefined ? Number(opt.score) : 0,
            })
          );
        } else if (opt.option_text.trim()) {
          await dispatch(
            addAnswer({
              question_id: editQuestionId,
              option_text: opt.option_text,
              score: opt.score !== undefined ? Number(opt.score) : 0,
            })
          );
        }
      }
      setShowEditQuestionModal(false);
      setEditQuestionId(null);
      setEditQuestionText("");
      setEditOptions([{ id: null, option_text: "", score: "" }]);
      dispatch(fetchQuestionsBySection(selectedSection.id));
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (selectedSection && window.confirm("Are you sure you want to delete this question?")) {
      await dispatch(deleteQuestion(questionId));
      dispatch(fetchQuestionsBySection(selectedSection.id));
      dispatch(fetchSectionsWithQuestionCount());
    }
  };

  // --- ANSWER HANDLERS ---
  const handleEditAnswer = async () => {
    if (editOptionText.trim() && editAnswerId) {
      await dispatch(editAnswer({ id: editAnswerId, option_text: editOptionText }));
      setShowEditAnswerModal(false);
      setEditAnswerId(null);
      setEditOptionText("");
      if (questions.length && selectedSection) {
        questions.forEach((q) => dispatch(fetchAnswersByQuestion(q.id)));
      }
    }
  };

  const handleDeleteAnswer = async (answerId, questionId) => {
    if (window.confirm("Are you sure you want to delete this option?")) {
      await dispatch(deleteAnswer(answerId));
      dispatch(fetchAnswersByQuestion(questionId));
    }
  };

  return (
    <Box sx={{ bgcolor: "#f5f7fa", minHeight: "100vh", p: { xs: 2, sm: 3, md: 4 } }}>
      {/* Header */}
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
        <Box sx={{ width: "100%", mb: { xs: 1, sm: 0 } }}>
          <Typography variant="h4" fontWeight="bold" noWrap>
            Survey Management Dashboard
          </Typography>
          <Typography color="text.secondary" mt={1} noWrap>
            Manage and view all survey sections, questions, and options in one place
          </Typography>
        </Box>

        {/* Notifications icon for report from user */}
        <Tooltip title="Notifications">
          <IconButton
            color="primary"
            aria-label="notifications"
            onClick={() => console.log("Open notification panel")}
            size={isSmDown ? "small" : "medium"}
          >
            <Badge badgeContent={3} color="error" overlap="circular">
              <NotificationsIcon fontSize={isSmDown ? "small" : "medium"} />
            </Badge>
          </IconButton>
        </Tooltip>
      </Box>

      {/* Breadcrumb */}
      {selectedSection ? (
        <Stack direction="row" alignItems="center" flexWrap="wrap" spacing={1} mb={2}>
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
          <Typography fontWeight="medium" noWrap sx={{ maxWidth: { xs: "150px", sm: "300px" } }}>
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

          {/* BulkUpload component */}
          <Box width={isSmDown ? "100%" : "auto"}>
            <BulkUpload
              onFileSelected={(jsonData) => {
                console.log("Excel as JSON:", jsonData); // This is now js array of objects
              }}
              exampleFileUrl="/assets/Compliance_Questions (1).xlsx"
            />
          </Box>

          {/* New Report Button */}
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

      {/* Overview */}
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
                  <Stack direction="row" alignItems="center" flexWrap="nowrap" spacing={1}>
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

      {/* Section Detail */}
      {activeView === "section-detail" && selectedSection && (
        <Stack spacing={3}>
          <Box
            display="flex"
            flexDirection={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            gap={1}
          >
            <Box>
              <Typography variant="h5" fontWeight="bold" noWrap sx={{ maxWidth: 280 }}>
                {selectedSection.section_name}
              </Typography>
              <Typography color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
                {questions.length} questions in this section
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Plus />}
              color="success"
              onClick={() => setShowAddQuestionModal(true)}
              size={isSmDown ? "small" : "medium"}
            >
              Add New Question
            </Button>
          </Box>
          {questions.map((question, index) => (
            <Paper key={question.id} sx={{ p: 2 }}>
              <Box
                display="flex"
                flexDirection={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                gap={1}
                mb={1}
              >
                <Typography fontWeight="bold" mr={2} flexShrink={0}>
                  Q{index + 1}.
                </Typography>
                <Typography flex={1} sx={{ wordBreak: "break-word" }}>
                  {question.question}
                </Typography>
                <Box>
                  <IconButton
                    color="primary"
                    size={isSmDown ? "small" : "medium"}
                    onClick={() => handleEditQuestionClick(question)}
                  >
                    <Edit3 size={18} />
                  </IconButton>
                  <IconButton
                    color="error"
                    size={isSmDown ? "small" : "medium"}
                    onClick={() => handleDeleteQuestion(question.id)}
                    sx={{ ml: 1 }}
                  >
                    <Trash2 size={18} />
                  </IconButton>
                </Box>
              </Box>
              <Box ml={{ xs: 0, sm: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  Options:
                </Typography>
                <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                  {answers
                    .filter((ans) => ans.question_id === question.id)
                    .map((option, optIndex) => (
                      <Chip
                        key={optIndex}
                        label={`${option.option_text} (Score: ${option.score || 0})`}
                        size="small"
                        sx={{ bgcolor: "purple.100", color: "purple.800", mr: 1, mb: 1 }}
                        onClick={() => {
                          setEditAnswerId(option.id);
                          setEditOptionText(option.option_text);
                          setShowEditAnswerModal(true);
                        }}
                        onDelete={() => handleDeleteAnswer(option.id, question.id)}
                      />
                    ))}
                </Stack>
              </Box>
            </Paper>
          ))}
        </Stack>
      )}

      {/* Modals Section */}
      {/* Add Section Modal */}
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
          <Button onClick={handleAddSection} variant="contained" startIcon={<Save />}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Section Modal */}
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
          <Button onClick={() => setShowEditSectionModal(false)}>Cancel</Button>
          <Button onClick={handleEditSection} variant="contained" startIcon={<Save />}>
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Question Modal */}
      <Dialog
        open={showAddQuestionModal}
        onClose={() => setShowAddQuestionModal(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={isSmDown}
      >
        <DialogTitle>Add New Question</DialogTitle>
        <DialogContent>
          <TextField
            label="Question Text"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            fullWidth
            multiline
            margin="normal"
            autoFocus
          />
          <Typography variant="body2" mt={2}>
            Answer Options:
          </Typography>
          <Grid container spacing={2} mt={1}>
            {options.map((option, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Box display="flex" alignItems="center" gap={1}>
                  <TextField
                    value={option.option_text || ""}
                    onChange={(e) => {
                      const newOpts = [...options];
                      newOpts[index] = { ...option, option_text: e.target.value };
                      setOptions(newOpts);
                    }}
                    label={`Option ${index + 1}`}
                    margin="dense"
                    fullWidth
                    sx={{ flexGrow: 1 }}
                  />
                  <TextField
                    type="number"
                    value={option.score}
                    onChange={(e) => {
                      const newOpts = [...options];
                      newOpts[index] = { ...option, score: e.target.value };
                      setOptions(newOpts);
                    }}
                    label="Score"
                    margin="dense"
                    sx={{ width: 100 }}
                    inputProps={{ min: 0 }}
                  />
                  {options.length > 2 && (
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => setOptions(options.filter((_, i) => i !== index))}
                    >
                      <Trash2 size={16} />
                    </IconButton>
                  )}
                </Box>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button
                onClick={() => setOptions([...options, { id: null, option_text: "", score: "" }])}
                startIcon={<Plus />}
                sx={{ alignSelf: "flex-start", mt: 1 }}
                size={isSmDown ? "small" : "medium"}
              >
                Add Option
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddQuestionModal(false)}>Cancel</Button>
          <Button onClick={handleAddQuestion} variant="contained" startIcon={<Save />}>
            Save Question
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Question Modal */}
      <Dialog
        open={showEditQuestionModal}
        onClose={() => setShowEditQuestionModal(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={isSmDown}
      >
        <DialogTitle>Edit Question and Options</DialogTitle>
        <DialogContent>
          <TextField
            label="Question"
            value={editQuestionText}
            onChange={(e) => setEditQuestionText(e.target.value)}
            fullWidth
            margin="normal"
            autoFocus
          />
          <Typography mt={2} variant="body2">
            Options:
          </Typography>
          <Grid container spacing={2} mt={1}>
            {editOptions.map((option, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Box display="flex" alignItems="center" gap={1}>
                  <TextField
                    value={option.option_text}
                    onChange={(e) => {
                      const newOptions = [...editOptions];
                      newOptions[index] = { ...option, option_text: e.target.value };
                      setEditOptions(newOptions);
                    }}
                    label={`Option ${index + 1}`}
                    margin="dense"
                    fullWidth
                    sx={{ flexGrow: 1 }}
                  />
                  <TextField
                    type="number"
                    value={option.score}
                    onChange={(e) => {
                      const newOptions = [...editOptions];
                      newOptions[index] = { ...option, score: e.target.value };
                      setEditOptions(newOptions);
                    }}
                    label="Score"
                    margin="dense"
                    sx={{ width: 100 }}
                    inputProps={{ min: 0 }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => {
                      const newOpts = [...editOptions];
                      newOpts.splice(index, 1);
                      setEditOptions(newOpts.length ? newOpts : [{ id: null, option_text: "", score: "" }]);
                    }}
                    color="error"
                  >
                    <Trash2 size={16} />
                  </IconButton>
                </Box>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button
                onClick={() => setEditOptions([...editOptions, { id: null, option_text: "", score: "" }])}
                startIcon={<Plus />}
                sx={{ alignSelf: "flex-start", mt: 1 }}
                size={isSmDown ? "small" : "medium"}
              >
                Add Option
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEditQuestionModal(false)}>Cancel</Button>
          <Button onClick={handleEditQuestion} variant="contained" startIcon={<Save />}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Answer Modal */}
      <Dialog
        open={showEditAnswerModal}
        onClose={() => setShowEditAnswerModal(false)}
        fullWidth
        maxWidth="xs"
        fullScreen={isSmDown}
      >
        <DialogTitle>Edit Option</DialogTitle>
        <DialogContent>
          <TextField
            label="Edit Option Text"
            value={editOptionText}
            onChange={(e) => setEditOptionText(e.target.value)}
            fullWidth
            margin="normal"
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEditAnswerModal(false)}>Cancel</Button>
          <Button onClick={handleEditAnswer} variant="contained" startIcon={<Save />}>
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

