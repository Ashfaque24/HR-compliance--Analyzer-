




// import React, { useState, useEffect } from "react";
// import {
//   Box, Typography, Button, Paper, Stack, Table, TableHead, TableBody,
//   TableRow, TableCell, IconButton, Dialog, DialogTitle, DialogContent,
//   DialogActions, TextField, Chip,
// } from "@mui/material";
// import {
//   Plus, Edit3, Trash2, Eye, ChevronRight, Database, HelpCircle, List,
//   LogOut, Save, ArrowLeft,
// } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import { logoutUser } from "../redux/features/authSlice";
// import { useNavigate } from "react-router-dom";
// import {
//   fetchSections, addSection,
// } from "../redux/features/sectionsSlice";
// import {
//   fetchQuestionsBySection, addQuestion,
// } from "../redux/features/questionsSlice";
// import {
//   fetchAnswersByQuestion, addAnswer,
// } from "../redux/features/answersSlice";


// export default function AdminDashboard() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [activeView, setActiveView] = useState("overview");
//   const [selectedSection, setSelectedSection] = useState(null);
//   const [showAddSectionModal, setShowAddSectionModal] = useState(false);
//   const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
//   const [sectionTitle, setSectionTitle] = useState("");
//   const [questionText, setQuestionText] = useState("");
//   const [options, setOptions] = useState(["", ""]);

//   // Redux selectors
//   const sections = useSelector(state => state.sections.items);
//   const questions = useSelector(state => state.questions.items);
//   const answers = useSelector(state => state.answers.items);

//   // Fetch sections on mount
//   useEffect(() => {
//     dispatch(fetchSections());
//   }, [dispatch]);

//   // Fetch questions when section is selected
//   useEffect(() => {
//     if (selectedSection) {
//       dispatch(fetchQuestionsBySection(selectedSection.id));
//     }
//   }, [selectedSection, dispatch]);

//   // Fetch answers as questions load
//   useEffect(() => {
//     if (questions.length) {
//       questions.forEach(q => dispatch(fetchAnswersByQuestion(q.id)));
//     }
//   }, [questions, dispatch]);

//   const totalSections = sections.length;
//   const totalQuestions = questions.length;
//   const totalOptions = answers.length;

//   const handleAddSection = async () => {
//     if (sectionTitle.trim()) {
//       await dispatch(addSection(sectionTitle.trim()));
//       setSectionTitle("");
//       setShowAddSectionModal(false);
//       dispatch(fetchSections());
//     }
//   };

//   const handleAddQuestion = async () => {
//     if (
//       questionText.trim() &&
//       options.every(opt => opt.trim()) &&
//       selectedSection
//     ) {
//       const questionResult = await dispatch(
//         addQuestion({ question: questionText.trim(), section_id: selectedSection.id })
//       ).unwrap();

//       for (const opt of options.map(x => x.trim())) {
//         await dispatch(
//           addAnswer({ question_id: questionResult.id, option_text: opt })
//         );
//       }
//       setQuestionText("");
//       setOptions(["", ""]);
//       setShowAddQuestionModal(false);
//       dispatch(fetchQuestionsBySection(selectedSection.id)); // Refresh questions after add
//     }
//   };

//   const handleDeleteSection = (sectionId) => {
//     if (window.confirm("Are you sure you want to delete this section?")) {
//       // Add delete handler logic here
//       dispatch(fetchSections());
//       if (selectedSection && selectedSection.id === sectionId) {
//         setSelectedSection(null);
//         setActiveView("overview");
//       }
//     }
//   };

//   const handleDeleteQuestion = (questionId) => {
//     if (selectedSection && window.confirm("Are you sure you want to delete this question?")) {
//       // Add delete handler logic here
//       dispatch(fetchQuestionsBySection(selectedSection.id));
//     }
//   };

//   const handleLogout = async () => {
//     await dispatch(logoutUser());
//     navigate("/admin/login");
//   };

//   return (
//     <Box sx={{ bgcolor: "#f5f7fa", minHeight: "100vh", p: 4 }}>
//       {/* Header */}
//       <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
//         <Box>
//           <Typography variant="h4" fontWeight="bold">Survey Management Dashboard</Typography>
//           <Typography color="text.secondary" mt={1}>Manage and view all survey sections, questions, and options in one place</Typography>
//         </Box>
//         <Button variant="outlined" startIcon={<LogOut />} color="error" onClick={handleLogout}>Logout</Button>
//       </Box>

//       {/* Navigation */}
//       {selectedSection ? (
//         <Stack direction="row" alignItems="center" mb={2}>
//           <Button variant="text" startIcon={<ArrowLeft />} onClick={() => {setSelectedSection(null); setActiveView("overview");}}>Back to Overview</Button>
//           <ChevronRight color="#aaa" size={20} style={{ margin: "0 8px" }} />
//           <Typography fontWeight="medium">{selectedSection.section_name}</Typography>
//         </Stack>
//       ) : (
//         <Stack direction="row" spacing={2} mb={3}>
//           <Button variant={activeView === "overview" ? "contained" : "outlined"} startIcon={<Database />} onClick={() => setActiveView("overview")}>Overview</Button>
//           <Button variant={activeView === "table" ? "contained" : "outlined"} startIcon={<List />} onClick={() => setActiveView("table")}>Detailed Table View</Button>
//         </Stack>
//       )}

//       {/* Overview Content */}
//       {activeView === "overview" && !selectedSection && (
//         <Stack spacing={4}>
//           {/* Stats */}
//           <Stack direction="row" spacing={3}>
//             <Paper sx={{ flex: 1, textAlign: "center", p: 3 }}>
//               <Database color="#1976d2" size={48} />
//               <Typography variant="h6" fontWeight="bold">{totalSections}</Typography>
//               <Typography color="text.secondary">Total Sections</Typography>
//             </Paper>
//             <Paper sx={{ flex: 1, textAlign: "center", p: 3 }}>
//               <HelpCircle color="#388e3c" size={48} />
//               <Typography variant="h6" fontWeight="bold">{totalQuestions}</Typography>
//               <Typography color="text.secondary">Total Questions</Typography>
//             </Paper>
//             <Paper sx={{ flex: 1, textAlign: "center", p: 3 }}>
//               <List color="#7b1fa2" size={48} />
//               <Typography variant="h6" fontWeight="bold">{totalOptions}</Typography>
//               <Typography color="text.secondary">Total Options</Typography>
//             </Paper>
//           </Stack>

//           {/* Add Section Button */}
//           <Box display="flex" justifyContent="space-between" alignItems="center">
//             <Typography variant="h6" fontWeight="bold">Survey Sections</Typography>
//             <Button variant="contained" startIcon={<Plus />} onClick={() => setShowAddSectionModal(true)}>Add New Section</Button>
//           </Box>

//           {/* Sections List with correct count */}
//           <Stack spacing={2}>
//             {sections.map((section) => (
//               <Paper key={section.id} sx={{ p: 3 }}>
//                 <Box display="flex" alignItems="center" justifyContent="space-between">
//                   <Stack direction="row" alignItems="center">
//                     <ChevronRight size={20} color="#aaa" />
//                     <Typography variant="h6" fontWeight="medium" ml={1}>{section.section_name}</Typography>
//                   </Stack>
//                   <Stack direction="row" alignItems="center" spacing={1}>
//                     <Typography color="text.secondary" variant="body2">
//                       {questions.filter(q => q.section_id === section.id).length} questions
//                     </Typography>
//                     <IconButton color="primary" onClick={() => {setSelectedSection(section); setActiveView("section-detail");}}>
//                       <Eye size={18} />
//                     </IconButton>
//                     <IconButton color="error" onClick={() => handleDeleteSection(section.id)}>
//                       <Trash2 size={18} />
//                     </IconButton>
//                   </Stack>
//                 </Box>
//               </Paper>
//             ))}
//           </Stack>
//         </Stack>
//       )}

//       {/* Section Detail View */}
//       {activeView === "section-detail" && selectedSection && (
//         <Stack spacing={3}>
//           <Box display="flex" justifyContent="space-between" alignItems="center">
//             <Box>
//               <Typography variant="h5" fontWeight="bold">{selectedSection.section_name}</Typography>
//               <Typography color="text.secondary">{questions.length} questions in this section</Typography>
//             </Box>
//             <Button variant="contained" startIcon={<Plus />} color="success" onClick={() => setShowAddQuestionModal(true)}>Add New Question</Button>
//           </Box>

//           {questions.map((question, index) => (
//             <Paper key={question.id} sx={{ p: 2 }}>
//               <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
//                 <Typography fontWeight="bold" mr={2}>Q{index + 1}.</Typography>
//                 <Typography flex={1}>{question.question}</Typography>
//                 <IconButton color="error" onClick={() => handleDeleteQuestion(question.id)} sx={{ ml: 2 }}>
//                   <Trash2 size={18} />
//                 </IconButton>
//               </Box>
//               <Box ml={4}>
//                 <Typography variant="body2" color="text.secondary">Options:</Typography>
//                 <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
//                   {answers.filter(ans => ans.question_id === question.id).map((option, optIndex) => (
//                     <Chip key={optIndex} label={option.option_text} size="small" sx={{ bgcolor: "purple.100", color: "purple.800" }} />
//                   ))}
//                 </Stack>
//               </Box>
//             </Paper>
//           ))}
//         </Stack>
//       )}

//       {/* Table View */}
//       {activeView === "table" && !selectedSection && (
//         <Paper sx={{ width: "100%", overflowX: "auto" }}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Section</TableCell>
//                 <TableCell>Question ID</TableCell>
//                 <TableCell>Question Text</TableCell>
//                 <TableCell>Options</TableCell>
//                 <TableCell>Option Count</TableCell>
//                 <TableCell>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {sections.map((section) =>
//                 questions.filter(q => q.section_id === section.id).map((question) => (
//                   <TableRow key={`${section.section_name}-${question.id}`}>
//                     <TableCell>{section.section_name}</TableCell>
//                     <TableCell>{question.id}</TableCell>
//                     <TableCell>{question.question}</TableCell>
//                     <TableCell>
//                       <Stack direction="row" spacing={1}>
//                         {answers.filter(ans => ans.question_id === question.id).map((option, i) => (
//                           <Chip key={i} label={option.option_text} size="small" sx={{ bgcolor: "purple.100", color: "purple.800" }} />
//                         ))}
//                       </Stack>
//                     </TableCell>
//                     <TableCell>{answers.filter(ans => ans.question_id === question.id).length}</TableCell>
//                     <TableCell>
//                       <IconButton color="primary">
//                         <Edit3 size={16} />
//                       </IconButton>
//                       <IconButton color="error" onClick={() => handleDeleteQuestion(question.id)}>
//                         <Trash2 size={16} />
//                       </IconButton>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </Paper>
//       )}

//       {/* Add Section Modal */}
//       <Dialog open={showAddSectionModal} onClose={() => setShowAddSectionModal(false)}>
//         <DialogTitle>Add New Section</DialogTitle>
//         <DialogContent>
//           <TextField label="Section Title" value={sectionTitle} onChange={(e) => setSectionTitle(e.target.value)} fullWidth margin="normal" />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setShowAddSectionModal(false)}>Cancel</Button>
//           <Button onClick={handleAddSection} variant="contained" startIcon={<Save />}>Save</Button>
//         </DialogActions>
//       </Dialog>

//       {/* Add Question Modal */}
//       <Dialog open={showAddQuestionModal} onClose={() => setShowAddQuestionModal(false)}>
//         <DialogTitle>Add New Question</DialogTitle>
//         <DialogContent>
//           <TextField label="Question Text" value={questionText} onChange={(e) => setQuestionText(e.target.value)} fullWidth multiline margin="normal" />
//           <Typography variant="body2" mt={2}>Answer Options:</Typography>
//           <Stack spacing={1} mt={1}>
//             {options.map((option, index) => (
//               <Box key={index} display="flex" alignItems="center">
//                 <TextField value={option} onChange={(e) => {
//                   const newOpts = [...options];
//                   newOpts[index] = e.target.value;
//                   setOptions(newOpts);
//                 }} label={`Option ${index + 1}`} fullWidth margin="dense" />
//                 {options.length > 2 && (
//                   <IconButton color="error" onClick={() => setOptions(options.filter((_, i) => i !== index))}>
//                     <Trash2 size={16} />
//                   </IconButton>
//                 )}
//               </Box>
//             ))}
//             <Button onClick={() => setOptions([...options, ""])} startIcon={<Plus />} sx={{ alignSelf: "flex-start", mt: 1 }}>Add Option</Button>
//           </Stack>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setShowAddQuestionModal(false)}>Cancel</Button>
//           <Button onClick={handleAddQuestion} variant="contained" startIcon={<Save />}>Save Question</Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// }



import React, { useState, useEffect } from "react";
import {
  Box, Typography, Button, Paper, Stack, Table, TableHead, TableBody,
  TableRow, TableCell, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Chip,
} from "@mui/material";
import {
  Plus, Edit3, Trash2, Eye, ChevronRight, Database, HelpCircle, List,
  LogOut, Save, ArrowLeft,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/features/authSlice";
import { useNavigate } from "react-router-dom";
import {
  fetchSectionsWithQuestionCount, addSection,
} from "../redux/features/sectionsSlice";
import {
  fetchQuestionsBySection, fetchAllQuestions, addQuestion,
} from "../redux/features/questionsSlice";
import {
  fetchAnswersByQuestion, addAnswer,
} from "../redux/features/answersSlice";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeView, setActiveView] = useState("overview");
  const [selectedSection, setSelectedSection] = useState(null);
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [sectionTitle, setSectionTitle] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", ""]);

  const sections = useSelector(state => state.sections.items);
  const questions = useSelector(state => state.questions.items);
  const answers = useSelector(state => state.answers.items);

  useEffect(() => {
    dispatch(fetchSectionsWithQuestionCount());
    dispatch(fetchAllQuestions());
  }, [dispatch]);
  
  useEffect(() => {
    if (selectedSection) {
      dispatch(fetchQuestionsBySection(selectedSection.id));
    }
  }, [selectedSection, dispatch]);
  
  useEffect(() => {
    if (questions.length) {
      questions.forEach(q => dispatch(fetchAnswersByQuestion(q.id)));
    }
  }, [questions, dispatch]);
  
  // To log latest questions data when it updates
  useEffect(() => {
    console.log("Latest questions:", questions);
  }, [questions]);
  

  const totalSections = sections.length;
  const totalQuestions = questions.length;
  const totalOptions = answers.length;

  const handleAddSection = async () => {
    if (sectionTitle.trim()) {
      await dispatch(addSection(sectionTitle.trim()));
      setSectionTitle("");
      setShowAddSectionModal(false);
      dispatch(fetchSectionsWithQuestionCount());
    }
  };

  const handleAddQuestion = async () => {
    if (
      questionText.trim() &&
      options.every(opt => opt.trim()) &&
      selectedSection
    ) {
      const questionResult = await dispatch(
        addQuestion({ question: questionText.trim(), section_id: selectedSection.id })
      ).unwrap();

      for (const opt of options.map(x => x.trim())) {
        await dispatch(
          addAnswer({ question_id: questionResult.id, option_text: opt })
        );
      }
      setQuestionText("");
      setOptions(["", ""]);
      setShowAddQuestionModal(false);
      dispatch(fetchQuestionsBySection(selectedSection.id));
      dispatch(fetchSectionsWithQuestionCount());
      dispatch(fetchAllQuestions());
    }
  };

  const handleDeleteSection = (sectionId) => {
    if (window.confirm("Are you sure you want to delete this section?")) {
      // Implement delete backend call here
      dispatch(fetchSectionsWithQuestionCount());
      if (selectedSection && selectedSection.id === sectionId) {
        setSelectedSection(null);
        setActiveView("overview");
      }
    }
  };

  const handleDeleteQuestion = (questionId) => {
    if (selectedSection && window.confirm("Are you sure you want to delete this question?")) {
      // Implement delete backend call here
      dispatch(fetchQuestionsBySection(selectedSection.id));
      dispatch(fetchSectionsWithQuestionCount());
    }
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/admin/login");
  };

  return (
    <Box sx={{ bgcolor: "#f5f7fa", minHeight: "100vh", p: 4 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Survey Management Dashboard
          </Typography>
          <Typography color="text.secondary" mt={1}>
            Manage and view all survey sections, questions, and options in one place
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<LogOut />}
          color="error"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>

      {/* Navigation */}
      {selectedSection ? (
        <Stack direction="row" alignItems="center" mb={2}>
          <Button
            variant="text"
            startIcon={<ArrowLeft />}
            onClick={() => {
              setSelectedSection(null);
              setActiveView("overview");
            }}
          >
            Back to Overview
          </Button>
          <ChevronRight color="#aaa" size={20} style={{ margin: "0 8px" }} />
          <Typography fontWeight="medium">{selectedSection.section_name}</Typography>
        </Stack>
      ) : (
        <Stack direction="row" spacing={2} mb={3}>
          <Button
            variant={activeView === "overview" ? "contained" : "outlined"}
            startIcon={<Database />}
            onClick={() => setActiveView("overview")}
          >
            Overview
          </Button>
          <Button
            variant={activeView === "table" ? "contained" : "outlined"}
            startIcon={<List />}
            onClick={() => setActiveView("table")}
          >
            Detailed Table View
          </Button>
        </Stack>
      )}

      {/* Overview Content */}
      {activeView === "overview" && !selectedSection && (
        <Stack spacing={4}>
          {/* Stats */}
          <Stack direction="row" spacing={3}>
            <Paper sx={{ flex: 1, textAlign: "center", p: 3 }}>
              <Database color="#1976d2" size={48} />
              <Typography variant="h6" fontWeight="bold">{totalSections}</Typography>
              <Typography color="text.secondary">Total Sections</Typography>
            </Paper>
            <Paper sx={{ flex: 1, textAlign: "center", p: 3 }}>
              <HelpCircle color="#388e3c" size={48} />
              <Typography variant="h6" fontWeight="bold">{totalQuestions}</Typography>
              <Typography color="text.secondary">Total Questions</Typography>
            </Paper>
            <Paper sx={{ flex: 1, textAlign: "center", p: 3 }}>
              <List color="#7b1fa2" size={48} />
              <Typography variant="h6" fontWeight="bold">{totalOptions}</Typography>
              <Typography color="text.secondary">Total Options</Typography>
            </Paper>
          </Stack>

          {/* Add Section Button */}
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight="bold">Survey Sections</Typography>
            <Button
              variant="contained"
              startIcon={<Plus />}
              onClick={() => setShowAddSectionModal(true)}
            >
              Add New Section
            </Button>
          </Box>

          {/* Sections List */}
          <Stack spacing={2}>
            {sections.map((section) => (
              <Paper key={section.id} sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Stack direction="row" alignItems="center">
                    <ChevronRight size={20} color="#aaa" />
                    <Typography variant="h6" fontWeight="medium" ml={1}>
                      {section.section_name}
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography color="text.secondary" variant="body2">
                      {section.questionCount || 0} questions
                    </Typography>
                    <IconButton
                      color="primary"
                      onClick={() => {
                        setSelectedSection(section);
                        setActiveView("section-detail");
                      }}
                    >
                      <Eye size={18} />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDeleteSection(section.id)}>
                      <Trash2 size={18} />
                    </IconButton>
                  </Stack>
                </Box>
              </Paper>
            ))}
          </Stack>
        </Stack>
      )}

      {/* Section Detail View */}
      {activeView === "section-detail" && selectedSection && (
        <Stack spacing={3}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h5" fontWeight="bold">{selectedSection.section_name}</Typography>
              <Typography color="text.secondary">{questions.length} questions in this section</Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Plus />}
              color="success"
              onClick={() => setShowAddQuestionModal(true)}
            >
              Add New Question
            </Button>
          </Box>

          {questions.map((question, index) => (
            <Paper key={question.id} sx={{ p: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                <Typography fontWeight="bold" mr={2}>Q{index + 1}.</Typography>
                <Typography flex={1}>{question.question}</Typography>
                <IconButton color="error" onClick={() => handleDeleteQuestion(question.id)} sx={{ ml: 2 }}>
                  <Trash2 size={18} />
                </IconButton>
              </Box>
              <Box ml={4}>
                <Typography variant="body2" color="text.secondary">Options:</Typography>
                <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                  {answers
                    .filter(ans => ans.question_id === question.id)
                    .map((option, optIndex) => (
                      <Chip
                        key={optIndex}
                        label={option.option_text}
                        size="small"
                        sx={{ bgcolor: "purple.100", color: "purple.800" }}
                      />
                    ))}
                </Stack>
              </Box>
            </Paper>
          ))}
        </Stack>
      )}

      {/* Table View */}
      {activeView === "table" && !selectedSection && (
        <Paper sx={{ width: "100%", overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Section</TableCell>
                <TableCell>Question ID</TableCell>
                <TableCell>Question Text</TableCell>
                <TableCell>Options</TableCell>
                <TableCell>Option Count</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sections.map((section) =>
                questions
                  .filter(q => q.section_id === section.id)
                  .map((question) => (
                    <TableRow key={`${section.section_name}-${question.id}`}>
                      <TableCell>{section.section_name}</TableCell>
                      <TableCell>{question.id}</TableCell>
                      <TableCell>{question.question}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          {answers
                            .filter(ans => ans.question_id === question.id)
                            .map((option, i) => (
                              <Chip
                                key={i}
                                label={option.option_text}
                                size="small"
                                sx={{ bgcolor: "purple.100", color: "purple.800" }}
                              />
                            ))}
                        </Stack>
                      </TableCell>
                      <TableCell>{answers.filter(ans => ans.question_id === question.id).length}</TableCell>
                      <TableCell>
                        <IconButton color="primary">
                          <Edit3 size={16} />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDeleteQuestion(question.id)}>
                          <Trash2 size={16} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* Add Section Modal */}
      <Dialog open={showAddSectionModal} onClose={() => setShowAddSectionModal(false)}>
        <DialogTitle>Add New Section</DialogTitle>
        <DialogContent>
          <TextField
            label="Section Title"
            value={sectionTitle}
            onChange={e => setSectionTitle(e.target.value)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddSectionModal(false)}>Cancel</Button>
          <Button onClick={handleAddSection} variant="contained" startIcon={<Save />}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Add Question Modal */}
      <Dialog open={showAddQuestionModal} onClose={() => setShowAddQuestionModal(false)}>
        <DialogTitle>Add New Question</DialogTitle>
        <DialogContent>
          <TextField
            label="Question Text"
            value={questionText}
            onChange={e => setQuestionText(e.target.value)}
            fullWidth
            multiline
            margin="normal"
          />
          <Typography variant="body2" mt={2}>Answer Options:</Typography>
          <Stack spacing={1} mt={1}>
            {options.map((option, index) => (
              <Box key={index} display="flex" alignItems="center">
                <TextField
                  value={option}
                  onChange={e => {
                    const newOpts = [...options];
                    newOpts[index] = e.target.value;
                    setOptions(newOpts);
                  }}
                  label={`Option ${index + 1}`}
                  fullWidth
                  margin="dense"
                />
                {options.length > 2 && (
                  <IconButton color="error" onClick={() => setOptions(options.filter((_, i) => i !== index))}>
                    <Trash2 size={16} />
                  </IconButton>
                )}
              </Box>
            ))}
            <Button onClick={() => setOptions([...options, ""])} startIcon={<Plus />} sx={{ alignSelf: "flex-start", mt: 1 }}>
              Add Option
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddQuestionModal(false)}>Cancel</Button>
          <Button onClick={handleAddQuestion} variant="contained" startIcon={<Save />}>
            Save Question
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
