import React from "react";
import {
  Box,
  Typography,
  Paper,
  Card,
  Divider,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";

import { blue, green, orange, red, grey } from "@mui/material/colors";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import InfoIcon from "@mui/icons-material/Info";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import { GaugeChart } from "./graph/GaugeChart";
import { StarRating } from "./graph/StarRating";
import { CircularProgressWithLabel } from "./graph/CircularProgressWithLabel";

// Register Chart.js components for pie chart functionality
ChartJS.register(ArcElement, Tooltip, Legend);

// Theme and styling constants for consistent UI look
const reportFont = "sans-serif";
const headerBgColor = blue[50];
const headerTextColor = blue[700];
const borderColor = blue[200];

// Styles to apply blur when detailed report is not shown
const blurStyles = {
  filter: "blur(5px)",
  pointerEvents: "none",
  userSelect: "none",
  borderRadius: 2,
  overflow: "hidden",
};

// Overlay styles for access restriction message and contact action
const catchyOverlayStyles = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  bgcolor: "rgba(255, 255, 255, 0.9)",
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 2,
  zIndex: 10,
  padding: 2,
  borderRadius: 2,
  fontFamily: reportFont,
  color: "#1976d2",
  textShadow: "0 1px 2px rgba(0,0,0,0.1)",
  fontWeight: "700",
  fontSize: { xs: "1.2rem", sm: "1.5rem" },
};

// ------- SectionPieChartWithLegend Component -------
// Renders a pie chart with color-coded legend to show relative section scores
function SectionPieChartWithLegend({ sectionRatings }) {
  // Colors for chart and legend
  const colorPalette = [
    blue[500],
    green[300],
    orange[500],
    orange[200],
    "#ffe082",
    grey[400],
  ];

  // Chart.js data config mapping section names and scores
  const data = {
    labels: sectionRatings.map((sec) => sec.sectionName),
    datasets: [
      {
        data: sectionRatings.map((sec) => sec.score),
        backgroundColor: colorPalette,
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  // Calculate total score and percentage for legend display
  const total = sectionRatings.reduce((sum, sec) => sum + sec.score, 0);
  const percent = (val) => (total > 0 ? Math.round((val / total) * 100) : 0);

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        my: 4,
        gap: { xs: 3, sm: 4 },
      }}
    >
      {/* Pie Chart Container */}
      <Box
        sx={{
          width: { xs: "90vw", sm: 220 },
          maxWidth: 280,
          height: { xs: "90vw", sm: 220 },
          maxHeight: 280,
        }}
      >
        <Pie
          data={data}
          options={{
            plugins: { legend: { display: false }, tooltip: { enabled: true } },
            maintainAspectRatio: false,
          }}
          style={{ width: "100%", height: "100%" }}
        />
      </Box>

      {/* Legend Description */}
      <Box sx={{ minWidth: { xs: "100%", sm: 160 }, maxWidth: 300 }}>
        <Typography
          variant="subtitle2"
          fontWeight={700}
          sx={{
            mb: 3,
            color: "#444",
            letterSpacing: 0.5,
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          Sections
        </Typography>
        {sectionRatings.map((sec, idx) => (
          <Box
            key={idx}
            sx={{ display: "flex", alignItems: "center", mb: 1.5 }}
          >
            <Box
              sx={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                bgcolor: colorPalette[idx % colorPalette.length],
                mr: 2,
                border: "2px solid #fff",
                boxShadow: "0 0 2px rgba(0,0,0,0.07)",
              }}
            />
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: 15,
                color: "#222",
                letterSpacing: 0.3,
                flex: 1,
                whiteSpace: "normal",
                wordBreak: "break-word",
              }}
            >
              {sec.sectionName}
            </Typography>
            <Typography
              sx={{
                color: "#444",
                fontWeight: 700,
                minWidth: 40,
                textAlign: "right",
              }}
            >
              {percent(sec.score)}%
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

// ------- SectionCard Component -------
// Displays detailed info for a section: score, completion, strengths, gaps, recommendations, charts
function SectionCard({ section, idx, sectionsCount }) {
  if (!section) return null;

  return (
    <Box sx={{ mb: { xs: 3, sm: 4 }, fontFamily: reportFont }}>
      {/* Section Header with Title, Category Index, Score Info, and Chart-------------------------------------- */}
      <Box
        sx={{
          bgcolor: headerBgColor,
          px: { xs: 2, sm: 4 },
          py: { xs: 1, sm: 2 },
          borderRadius: "16px 16px 0 0",
          borderBottom: `2px solid ${borderColor}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: 2,
          flexWrap: "wrap",
          gap: { xs: 2, sm: 0 },
          flexDirection: { xs: "column", sm: "row" }, // ✅ Stack vertically on phones
          textAlign: { xs: "center", sm: "left" }, // ✅ Center text on phones
        }}
      >
        <Box sx={{ minWidth: 220 }}>
          <Typography
            variant="h6"
            fontWeight="700"
            sx={{
              color: headerTextColor,
              mb: 0,
              letterSpacing: 0.4,
              fontSize: { xs: 18, sm: 20 },
            }}
          >
            {section.name}
          </Typography>
          <Typography
            sx={{
              color: headerTextColor,
              opacity: 0.7,
              fontSize: { xs: 14, sm: 16 },
            }}
            variant="subtitle2"
          >
            Category {idx + 1} of {sectionsCount}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "center", sm: "flex-end" }, // ✅ Center on mobile
            gap: { xs: 2, sm: 3 },
            flexWrap: "wrap",
            flexDirection: { xs: "column-reverse", sm: "row" }, // ✅ Stack vertically (score above chart)
            width: "100%",
          }}
        >
          <Box sx={{ textAlign: { xs: "center", sm: "right" }, minWidth: 85 }}>
            <Typography
              variant="h5"
              fontWeight="700"
              sx={{ color: "#111", mb: 0, fontSize: { xs: 20, sm: 26 } }}
            >
              {section.score}/{section.maxScore}
            </Typography>
            <Typography
              sx={{
                color: "grey",
                fontFamily: reportFont,
                fontSize: { xs: 14, sm: 16 },
              }}
            >
              {section.completionRate} Complete
            </Typography>
          </Box>

          <Box sx={{ minWidth: 80 }}>
            {section.graphType === "Gauge Chart" && (
              <GaugeChart score={section.score} maxScore={section.maxScore} />
            )}
            {section.graphType === "Star Chart" && (
              <StarRating score={section.score} maxScore={section.maxScore} />
            )}
            {section.graphType === "Circular Chart" && (
              <CircularProgressWithLabel
                score={section.score}
                maxScore={section.maxScore}
              />
            )}
          </Box>
        </Box>
      </Box>

      {/* Section Details Card for Strengths, Gaps and Recommendations --------------------------------------------*/}
      <Card
        variant="outlined"
        sx={{
          borderRadius: "0 0 16px 16px",
          bgcolor: "background.paper",
          pt: 2,
          pb: 2,
          fontFamily: reportFont,
          maxWidth: "100%",
          overflowX: "hidden",
        }}
      >
        <Box sx={{ px: { xs: 2, sm: 4 } }}>
          <Grid container spacing={3} alignItems="flex-start">
            {/* Strengths List */}
            <Grid item xs={12} md={4} sx={{ px: { xs: 1, sm: 3 } }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  fontWeight="700"
                  color={green[700]}
                  mb={2}
                  sx={{ fontSize: { xs: 16, sm: 18 }, letterSpacing: 0.3 }}
                >
                  Strengths
                </Typography>
                {section.strengths.length === 0 ? (
                  <Typography
                    variant="body2"
                    fontStyle="italic"
                    sx={{ color: "#999", textAlign: "center" }}
                  >
                    No strengths identified in this category
                  </Typography>
                ) : (
                  <List dense sx={{ textAlign: "center" }}>
                    {section.strengths.map((str, i) => (
                      <ListItem
                        key={i}
                        sx={{ justifyContent: "center", px: 0 }}
                      >
                        <ListItemText
                          primary={str}
                          sx={{
                            fontFamily: reportFont,
                            fontWeight: 500,
                            fontSize: { xs: 14, sm: 16 },
                            letterSpacing: 0.3,
                            color: "#333",
                            textAlign: "center",
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>
            </Grid>

            {/* Gaps List */}
            <Grid item xs={12} md={4} sx={{ px: { xs: 1, sm: 3 } }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  fontWeight="700"
                  color={red[700]}
                  mb={2}
                  sx={{ fontSize: { xs: 16, sm: 18 }, letterSpacing: 0.3 }}
                >
                  Gaps
                </Typography>
                {section.gaps.length === 0 ? (
                  <Typography
                    variant="body2"
                    fontStyle="italic"
                    sx={{ color: "#999", textAlign: "center" }}
                  >
                    No gaps identified in this category
                  </Typography>
                ) : (
                  <List dense sx={{ textAlign: "center" }}>
                    {section.gaps.map((gap, i) => (
                      <ListItem
                        key={i}
                        sx={{ justifyContent: "center", px: 0 }}
                      >
                        <ListItemText
                          primary={gap}
                          sx={{
                            fontFamily: reportFont,
                            fontWeight: 500,
                            fontSize: { xs: 14, sm: 16 },
                            letterSpacing: 0.3,
                            color: "#333",
                            textAlign: "center",
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>
            </Grid>

            {/* Recommendations List */}
            <Grid item xs={12} md={4} sx={{ px: { xs: 1, sm: 3 } }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  fontWeight="700"
                  color={blue[700]}
                  mb={2}
                  sx={{ fontSize: { xs: 16, sm: 18 }, letterSpacing: 0.3 }}
                >
                  Action Recommendations
                </Typography>
                {section.recommendations.length === 0 ? (
                  <Typography
                    variant="body2"
                    fontStyle="italic"
                    sx={{ color: "#999", textAlign: "center" }}
                  >
                    No recommendations identified in this category
                  </Typography>
                ) : (
                  <List dense sx={{ textAlign: "center" }}>
                    {section.recommendations.map((rec, i) => (
                      <ListItem
                        key={i}
                        sx={{ justifyContent: "center", px: 0 }}
                      >
                        <ListItemText
                          primary={rec}
                          sx={{
                            fontFamily: reportFont,
                            fontWeight: 500,
                            fontSize: { xs: 14, sm: 16 },
                            letterSpacing: 0.3,
                            color: "#333",
                            textAlign: "center",
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Card>
    </Box>
  );
}

// ------- Main Summary_Repo Component -------
// Main container that presents the executive summary, pie chart,
// section cards, key insights, and handles blur / overlay when full report access is restricted
export default function Summary_Repo({ data, showFull }) {
  if (!data) return <div>No data</div>;

  // Blur content if full report should not be shown
  const isBlurred = !showFull;
  const sectionsCount = data.summary ? data.summary.length : 0;

  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        py: { xs: 2, sm: 4 },
        px: { xs: 1, sm: 0 },
        fontFamily: reportFont,
        position: "relative",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Executive summary header---------------------------------------------------------work */}
      <Paper sx={{ mb: 3, p: { xs: 2, sm: 3 }, fontFamily: reportFont }}>
        <Typography
          variant="h5"
          align="center"
          fontWeight="700"
          mb={{ xs: 1, sm: 2 }}
          fontSize={{ xs: 22, sm: 30 }}
          letterSpacing={0.5}
        >
          Executive Summary
        </Typography>

        {/* Pie chart showing section score distribution */}
        <SectionPieChartWithLegend sectionRatings={data.sectionRatings} />

        {/* Summary status chip with dynamic color ------------------------------------immediate attention required area */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: { xs: 1, sm: 2 },
          }}
        >
          <Chip
            label={data.summaryStatus}
            color={
              data.summaryType === "danger"
                ? "error"
                : data.summaryType === "success"
                  ? "success"
                  : "warning"
            }
            sx={{
              px: 4,
              fontSize: { xs: 13, sm: 16, md: 18 },
              fontFamily: reportFont,
              fontWeight: "700",
              maxWidth: { xs: "90vw", sm: 400 },
              whiteSpace: "normal",
              wordBreak: "break-word",
              lineHeight: 1.4,
              textAlign: "center",
              minHeight: 38,
            }}
          />
        </Box>

        {/* Score cards for each section *-----------------------*/}
        <Grid
          container
          spacing={2}
          justifyContent="center"
          mb={{ xs: 1, sm: 2 }}
        >
          {data.sectionRatings.map((sr, idx) => (
            <Grid
              item
              key={idx}
              xs={12}
              sm={6}
              md={2.4}
              sx={{ display: "flex" }}
            >
              <Card
                sx={{
                  width: "100%",
                  minWidth: 180,
                  maxWidth: 230,
                  borderRadius: 3,
                  bgcolor: blue[50],
                  boxShadow: 2,
                  textAlign: "center",
                  fontFamily: reportFont,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "auto",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: "700",
                    fontSize: { xs: 16, sm: 18 },
                    color: "#222",
                    letterSpacing: 0.5,
                  }}
                >
                  {sr.score}/{sr.mxmScore}
                </Typography>
                <Divider sx={{ my: 1, width: "80%" }} />
                <Typography
                  sx={{
                    fontSize: { xs: 14, sm: 16 },
                    color: "#7B1113",
                    fontWeight: "700",
                    letterSpacing: 0.5,
                    wordBreak: "break-word",
                  }}
                >
                  {sr.sectionName}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Key Insights Section */}
        <Box
          sx={{
            bgcolor: "rgba(119, 162, 88, 0.15)",
            p: { xs: 0.5, sm: 1.5 },
            borderRadius: 2,
            mt: { xs: 1, sm: 2 },
          }}
        >
          <Typography
            variant="subtitle2"
            fontWeight="700" // ✅ Bolder title
            fontSize={{ xs: 15, sm: 17 }}
            letterSpacing={0.4}
          >
            Key Insights
          </Typography>

          <Divider sx={{ my: 0.5 }} />

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: { xs: 0.5, sm: 1 },
              alignItems: "center",
              justifyContent: { xs: "center", sm: "flex-start" },
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            {data.keyInsights.map((ki, idx) => (
              <Chip
                key={idx}
                label={ki.name}
                size="small"
                sx={{
                  bgcolor: ki.status
                    ? {
                        success: green[200],
                        danger: red[200],
                        warning: orange[200],
                      }[ki.status]
                    : undefined,
                  fontWeight: 700, // ✅ Bold text inside chip
                  fontFamily: reportFont,
                  color: "#111", // ✅ Dark text for better visibility
                  fontSize: { xs: 12, sm: 14 },
                  letterSpacing: 0.2,
                  px: { xs: 1, sm: 1.5 },
                  py: 0.4,
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                  lineHeight: 1.3,
                  textAlign: "center",
                  maxWidth: { xs: "85vw", sm: "none" },
                  minHeight: 26,
                  borderRadius: 1.5,
                  boxShadow: 1, // ✅ Light shadow for better separation
                }}
              />
            ))}
          </Box>
        </Box>
      </Paper>

      {/* ===== Section Details List with optional blur ===== */}
      <Box sx={{ position: "relative" }}>
        {/* Sections grouped below - blurred if no full access */}
        <Box
          sx={
            isBlurred
              ? { ...blurStyles, borderRadius: 2, overflow: "hidden" }
              : {}
          }
        >
          {data.summary?.map((section, idx) => (
            <SectionCard
              key={section.name || idx}
              section={section}
              idx={idx}
              sectionsCount={sectionsCount}
            />
          ))}
        </Box>

        {/* Overlay asking user to request full report if content blurred */}
        {isBlurred && (
          <Box sx={catchyOverlayStyles}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 2,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <InfoIcon sx={{ fontSize: { xs: 24, sm: 30 } }} />
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "700",
                  fontFamily: reportFont,
                  fontSize: { xs: 16, sm: 20 },
                }}
              >
                For detailed report contact admin
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{
                fontFamily: reportFont,
                px: { xs: 3, sm: 5 },
                py: { xs: 1, sm: 1.5 },
                fontWeight: "700",
                fontSize: { xs: 14, sm: 16 },
                transition: "transform 0.3s ease",
                "&:hover": { transform: "scale(1.05)" },
              }}
              onClick={() => alert("Request Full Report")}
            >
              Request Full Report
            </Button>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 2,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                fontSize: { xs: 12, sm: 15 },
              }}
            >
              <ContactMailIcon
                sx={{
                  height: { xs: 14, sm: 17 },
                  width: { xs: 28, sm: 33 },
                  mb: "-2px",
                  color: "#1976d2",
                }}
              />
              For enquiries, email us at:&nbsp;
              <a
                href="mailto:ashfaque@gmail.com"
                style={{
                  textDecoration: "none",
                  color: "#1976d2",
                  fontWeight: 500,
                  fontSize: "inherit",
                }}
              >
                ashfaque@gmail.com
              </a>
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
