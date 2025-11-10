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
} from "@mui/material";
import { Plus, Edit3, Trash2, Save } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchQuestionsBySection,
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
import LoadingSpinner from "../components/common/LoadingSpinner";

export default function QuestionsAndOptionsAdmin({
  selectedSection,
  setSelectedSection,
  setActiveView,
  isSmDown,
}) {
  const dispatch = useDispatch();
  const questions = useSelector((state) => state.questions.items);
  const answers = useSelector((state) => state.answers.items);

  const [editingQuestion, setEditingQuestion] = useState(false);
  const [editingAnswer, setEditingAnswer] = useState(false);

  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [showEditQuestionModal, setShowEditQuestionModal] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [editQuestionId, setEditQuestionId] = useState(null);
  const [editQuestionText, setEditQuestionText] = useState("");
  const [addingQuestion, setAddingQuestion] = useState(false);

  const [options, setOptions] = useState([
    { id: null, option_text: "", score: "4" },
    { id: null, option_text: "", score: "3" },
    { id: null, option_text: "", score: "2" },
    { id: null, option_text: "", score: "1" },
  ]);
  const [editOptions, setEditOptions] = useState([
    { id: null, option_text: "", score: "4" },
  ]);

  const [showEditAnswerModal, setShowEditAnswerModal] = useState(false);
  const [editAnswerId, setEditAnswerId] = useState(null);
  const [editOptionText, setEditOptionText] = useState("");

  useEffect(() => {
    if (selectedSection) {
      dispatch(fetchQuestionsBySection(selectedSection.id));
    }
  }, [selectedSection, dispatch]);

  useEffect(() => {
    if (questions.length) {
      questions.forEach((q) => dispatch(fetchAnswersByQuestion(q.id)));
    }
  }, [questions, dispatch]);

  // Add question
  const handleAddQuestion = async () => {
    if (
      questionText.trim() &&
      options.every((opt) => opt.option_text.trim()) &&
      selectedSection
    ) {
      setAddingQuestion(true);
      try {
        await dispatch(
          addQuestion({
            question: questionText.trim(),
            section_id: selectedSection.id,
            options,
          })
        ).unwrap();
        setQuestionText("");
        setOptions([
          { id: null, option_text: "", score: "4" },
          { id: null, option_text: "", score: "3" },
          { id: null, option_text: "", score: "2" },
          { id: null, option_text: "", score: "1" },
        ]);
        setShowAddQuestionModal(false);
        await dispatch(fetchQuestionsBySection(selectedSection.id));
      } finally {
        setAddingQuestion(false);
      }
    }
  };

  // Open edit question modal and preload options
  const handleEditQuestionClick = async (question) => {
    setEditQuestionId(question.id);
    setEditQuestionText(question.text || question.question);

    await dispatch(fetchAnswersByQuestion(question.id));
    const optionsWithIds =
      answers
        .filter((ans) => ans.question_id === question.id)
        .map((ans) => ({
          id: ans.id,
          option_text: ans.option_text,
          score:
            ans.score !== undefined && ans.score !== null
              ? String(ans.score)
              : "",
        })) || [];

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

  // Save edited question and its options

  const handleEditQuestion = async () => {
    if (editQuestionText.trim() && editQuestionId && selectedSection) {
      setEditingQuestion(true);
      try {
        await dispatch(
          editQuestion({
            id: editQuestionId,
            text: editQuestionText,
            section_id: selectedSection.id,
          })
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
      } finally {
        setEditingQuestion(false);
      }
    }
  };

  // Delete question
  const handleDeleteQuestion = async (questionId) => {
    if (selectedSection) {
      await dispatch(deleteQuestion(questionId));
      dispatch(fetchQuestionsBySection(selectedSection.id));
    }
  };

  // Save edited answer option text
  const handleEditAnswer = async () => {
    if (editOptionText.trim() && editAnswerId) {
      setEditingAnswer(true);
      try {
        await dispatch(
          editAnswer({ id: editAnswerId, option_text: editOptionText })
        );
        setShowEditAnswerModal(false);
        setEditAnswerId(null);
        setEditOptionText("");
        if (questions.length && selectedSection) {
          questions.forEach((q) => dispatch(fetchAnswersByQuestion(q.id)));
        }
      } finally {
        setEditingAnswer(false);
      }
    }
  };

  // Delete an answer option
  const handleDeleteAnswer = async (answerId, questionId) => {
    await dispatch(deleteAnswer(answerId));
    dispatch(fetchAnswersByQuestion(questionId));
  };

  // NEW: Delete option in edit modal - works for both existing and newly added options
  const handleDeleteEditOption = async (option, index) => {
    if (option.id) {
      await dispatch(deleteAnswer(option.id));
    }
    setEditOptions((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <Stack spacing={3}>
        {/* Section header and add question button */}
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          gap={1}
        >
          <Box>
            <Typography
              variant="h5"
              fontWeight="bold"
              noWrap
              sx={{ maxWidth: 280 }}
            >
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

        {/* List all questions with their options */}
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
                {question.text || question.question}
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
                  .map((option) => (
                    <Chip
                      key={option.id}
                      label={`${option.option_text} (Score: ${option.score || 0})`}
                      size="small"
                      sx={{
                        bgcolor: "purple.100",
                        color: "purple.800",
                        mr: 1,
                        mb: 1,
                      }}
                      onClick={() => {
                        setEditAnswerId(option.id);
                        setEditOptionText(option.option_text);
                        setShowEditAnswerModal(true);
                      }}
                      onDelete={() =>
                        handleDeleteAnswer(option.id, question.id)
                      }
                    />
                  ))}
              </Stack>
            </Box>
          </Paper>
        ))}
      </Stack>

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
                      newOpts[index] = {
                        ...option,
                        option_text: e.target.value,
                      };
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
                      onClick={() =>
                        setOptions(options.filter((_, i) => i !== index))
                      }
                    >
                      <Trash2 size={16} />
                    </IconButton>
                  )}
                </Box>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button
                onClick={() =>
                  setOptions([
                    ...options,
                    { id: null, option_text: "", score: "" },
                  ])
                }
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
          <Button
            onClick={handleAddQuestion}
            variant="contained"
            startIcon={addingQuestion ? <LoadingSpinner size={20} /> : <Save />}
            disabled={addingQuestion}
          >
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
                      newOptions[index] = {
                        ...option,
                        option_text: e.target.value,
                      };
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
                    color="error"
                    onClick={() => handleDeleteEditOption(option, index)}
                  >
                    <Trash2 size={16} />
                  </IconButton>
                </Box>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button
                onClick={() =>
                  setEditOptions([
                    ...editOptions,
                    { id: null, option_text: "", score: "" },
                  ])
                }
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
          <Button onClick={() => setShowEditQuestionModal(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleEditQuestion}
            variant="contained"
            startIcon={
              editingQuestion ? <LoadingSpinner size={20} /> : <Save />
            }
            disabled={editingQuestion}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Answer Option Modal */}
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
          <Button
            onClick={handleEditAnswer}
            variant="contained"
            startIcon={editingAnswer ? <LoadingSpinner size={20} /> : <Save />}
            disabled={editingAnswer}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
