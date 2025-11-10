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
import {
  blue,
  green,
  orange,
  red,
  purple,
  pink,
  indigo,
  teal,
  amber,
  grey,
} from "@mui/material/colors";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import InfoIcon from "@mui/icons-material/Info";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { GaugeChart } from "./graph/GaugeChart";
import { StarRating } from "./graph/StarRating";
import { CircularProgressWithLabel } from "./graph/CircularProgressWithLabel";
import { PieWithPercentLabels } from "./common/PieWithPercentLabels";

ChartJS.register(ArcElement, Tooltip, Legend);

const reportFont = "sans-serif";
const headerBgColor = blue[50];
const headerTextColor = blue[700];
const borderColor = blue[200];
const blurStyles = {
  filter: "blur(5px)",
  pointerEvents: "none",
  userSelect: "none",
  borderRadius: 2,
  overflow: "hidden",
};
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

// Dummy data for blur mode
const dummySummaryHalf = [
  {
    name: "Registration & Licensing",
    score: 8,
    maxScore: 10,
    completionRate: "80%",
    strengths: ["All licenses up to date", "Proper documentation maintained"],
    gaps: ["Delay in renewal tracking"],
    recommendations: [
      "Automate license renewal alerts",
      "Maintain centralized license register",
    ],
    graphType: "Gauge Chart",
  },
  {
    name: "Employee Welfare & Benefits",
    score: 12,
    maxScore: 20,
    completionRate: "60%",
    strengths: ["Good medical coverage", "Employee assistance programs active"],
    gaps: ["Limited wellness initiatives", "Outdated leave policy"],
    recommendations: [
      "Introduce wellness programs",
      "Update HR policies annually",
    ],
    graphType: "Star Chart",
  },
];
//-----------------pi chat - including section score in its right ------------------------------------------------

function SectionPieChartWithLegend({
  sectionRatings,
  overAllScore,
  maxmScore,
}) {
  const colorPalette = [
    blue[500],
    green[400],
    orange[500],
    red[400],
    purple[500],
    pink[400],
    indigo[400],
    teal[400],
    amber[400],
    grey[500],
  ];
  const dynamicColors = sectionRatings.map(
    (_, i) => colorPalette[i % colorPalette.length]
  );
  const total = sectionRatings.reduce((sum, sec) => sum + sec.score, 0);

  // Fallback: Try section.mxmScore if section.maxScore is not defined
  const getMaxScore = (section) =>
    typeof section.maxScore !== "undefined"
      ? section.maxScore
      : typeof section.mxmScore !== "undefined"
        ? section.mxmScore
        : "?";

  const data = {
    labels: sectionRatings.map((sec) => sec.sectionName),
    datasets: [
      {
        data: sectionRatings.map((sec) => sec.score),
        backgroundColor: dynamicColors,
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

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
      {/* Pie Chart */}
      <Box
        sx={{
          width: { xs: "90vw", sm: 220 },
          maxWidth: 280,
          height: { xs: "90vw", sm: 220 },
          maxHeight: 280,
          position: "relative",
        }}
      >
        {/* imported this for labeling persantage on pie chart */}
        <PieWithPercentLabels data={data} />
      </Box>

      {/* Overall Score Box */}
      {overAllScore !== undefined && (
        <Card
          sx={{
            px: { xs: 3, sm: 5 },
            py: { xs: 2, sm: 4 },
            textAlign: "center",
            bgcolor: blue[50],
            borderRadius: 3,
            boxShadow: 3,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minWidth: { xs: "80vw", sm: 200 },
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: 18, sm: 22 },
              color: blue[800],
              mb: 0.5,
            }}
          >
            Overall Score
          </Typography>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: { xs: 26, sm: 34 },
              color: "#111",
            }}
          >
            {overAllScore}
            <span
              style={{
                fontWeight: 800,
                fontSize: { xs: 26, sm: 34 },
                color: "black",
              }}
            >{` / ${maxmScore}`}</span>
          </Typography>
        </Card>
      )}

      {/* Legend */}
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
                minWidth: 60,
                textAlign: "right",
              }}
            >
              {/* Show both score and maxScore, and fallback if missing */}
              {sec.score}/{getMaxScore(sec)}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

//---------------------------------------------------------------------------------------------------------------

function SectionCard({ section, idx, sectionsCount }) {
  if (!section) return null;
  // Use the correct key for section: maxScore or mxmScore
  const sectionMax = section.maxScore || section.mxmScore;
  return (
    <Box sx={{ mb: { xs: 3, sm: 4 }, fontFamily: reportFont }}>
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
          flexDirection: { xs: "column", sm: "row" },
          textAlign: { xs: "center", sm: "left" },
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
            justifyContent: { xs: "center", sm: "flex-end" },
            gap: { xs: 2, sm: 3 },
            flexWrap: "wrap",
            flexDirection: { xs: "column-reverse", sm: "row" },
            width: "100%",
          }}
        >
          <Box sx={{ textAlign: { xs: "center", sm: "right" }, minWidth: 85 }}>
            <Typography
              variant="h5"
              fontWeight="700"
              sx={{ color: "#111", mb: 0, fontSize: { xs: 20, sm: 26 } }}
            >
              {section.score}/{sectionMax}
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
              <GaugeChart score={section.score} maxScore={sectionMax} />
            )}
            {section.graphType === "Star Chart" && (
              <StarRating score={section.score} maxScore={sectionMax} />
            )}
            {section.graphType === "Circular Chart" && (
              <CircularProgressWithLabel
                score={section.score}
                maxScore={sectionMax}
              />
            )}
          </Box>
        </Box>
      </Box>
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
            {["strengths", "gaps", "recommendations"].map((key, idx) => (
              <Grid key={idx} item xs={12} md={4} sx={{ px: { xs: 1, sm: 3 } }}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    fontWeight="700"
                    color={
                      key === "strengths"
                        ? green[700]
                        : key === "gaps"
                          ? red[700]
                          : blue[700]
                    }
                    mb={2}
                    sx={{ fontSize: { xs: 16, sm: 18 }, letterSpacing: 0.3 }}
                  >
                    {key === "strengths"
                      ? "Strengths"
                      : key === "gaps"
                        ? "Gaps"
                        : "Action Recommendations"}
                  </Typography>
                  {section[key].length === 0 ? (
                    <Typography
                      variant="body2"
                      fontStyle="italic"
                      sx={{ color: "#999", textAlign: "center" }}
                    >
                      No {key} identified in this category
                    </Typography>
                  ) : (
                    <List dense sx={{ textAlign: "center" }}>
                      {section[key].map((item, i) => (
                        <ListItem
                          key={i}
                          sx={{ justifyContent: "center", px: 0 }}
                        >
                          <ListItemText
                            primary={item}
                            sx={{
                              fontFamily: reportFont,
                              fontWeight: 500,
                              fontSize: { xs: 14, sm: 16 },
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
            ))}
          </Grid>
        </Box>
      </Card>
    </Box>
  );
}

export default function Summary_Repo({ data, showFull }) {
  if (!data) return <div>No data</div>;
  const isBlurred = !showFull;
  const sectionsCount = data.summary ? data.summary.length : 0;
  const dummySummary = dummySummaryHalf;

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
      }}
    >
      {/* Executive Summary */}
      <Paper sx={{ mb: 3, p: { xs: 2, sm: 3 }, fontFamily: reportFont }}>
        <Typography
          variant="h5"
          align="center"
          fontWeight="700"
          mb={{ xs: 1, sm: 2 }}
          fontSize={{ xs: 22, sm: 30 }}
        >
          Executive Summary
        </Typography>
        <SectionPieChartWithLegend
          sectionRatings={data.sectionRatings}
          overAllScore={data.overAllScore}
          maxmScore={data.maxmScore}
        />
        {/* Summary Status */}
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
              textAlign: "center",
            }}
          />
        </Box>
        {/* Key Insights */}
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
            fontWeight="700"
            fontSize={{ xs: 15, sm: 17 }}
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
              justifyContent: { xs: "center" },
            }}
          >
            {(data.keyInsights || []).map((ki, idx) => (
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
                  fontWeight: 700,
                  fontFamily: reportFont,
                  color: "#111",
                  fontSize: { xs: 12, sm: 14 },
                }}
              />
            ))}
          </Box>
        </Box>
      </Paper>
      {/* Section Details */}
      <Box sx={{ position: "relative" }}>
        <Box sx={isBlurred ? { ...blurStyles } : {}}>
          {(isBlurred ? dummySummary : data.summary)?.map((section, idx) => (
            <SectionCard
              key={section.name || idx}
              section={section}
              idx={idx}
              sectionsCount={isBlurred ? dummySummary.length : sectionsCount}
            />
          ))}
        </Box>
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
