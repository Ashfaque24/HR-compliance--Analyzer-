// Summary_Repo.jsx
import React from "react";
import {
  Box,
  Typography,
  Card,
  Grid,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import InfoIcon from "@mui/icons-material/Info";
import { blue, green, red } from "@mui/material/colors";
import { ExecutiveSummary } from "./ExecutiveSummary";
import { GaugeChart } from "./graph/GaugeChart";
import { StarRating } from "./graph/StarRating";
import { CircularProgressWithLabel } from "./graph/CircularProgressWithLabel";

const reportFont = "Helvetica, Arial, sans-serif";
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

// Dummy summary data for blurred state
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

function SectionCard({ section, idx, sectionsCount }) {
  if (!section) return null;

  const sectionMax = section.maxScore || section.mxmScore;

  return (
    <Box sx={{ mb: { xs: 3, sm: 4 }, fontFamily: reportFont }}>
      {/* ---------- Header Card ---------- */}
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
            <Typography sx={{ color: "grey", fontSize: { xs: 14, sm: 16 } }}>
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

      {/* ---------- Body Card ---------- */}
      <Card
        variant="outlined"
        sx={{
          borderRadius: "0 0 16px 16px",
          pt: 2,
          pb: 2,
          fontFamily: reportFont,
        }}
      >
        <Box sx={{ px: { xs: 2, sm: 4 } }}>
          {/* ------------------------------------
              UPDATED GRID (Perfect Alignment)
          ------------------------------------- */}
          <Grid container spacing={3} justifyContent="space-between">
            {["strengths", "gaps", "recommendations"].map((key, index) => (
              <Grid
                key={index}
                item
                xs={12}
                md={4}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems:
                    index === 0
                      ? "flex-start"
                      : index === 1
                        ? "center"
                        : "flex-end",
                  textAlign:
                    index === 0 ? "left" : index === 1 ? "center" : "right",
                }}
              >
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
                  sx={{ fontSize: { xs: 16, sm: 18 } }}
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
                    sx={{ color: "#999" }}
                  >
                    No {key} identified
                  </Typography>
                ) : (
                  <List dense sx={{ width: "100%", maxWidth: 330 }}>
                    {section[key].map((item, i) => (
                      <ListItem key={i} disableGutters>
                        <ListItemText
                          primary={item}
                          sx={{
                            fontWeight: 500,
                            fontSize: { xs: 14, sm: 16 },
                            color: "#333",
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
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

  let mergedSummary = data.summary || [];

  if (data.sectionRatings && data.summary) {
    mergedSummary = data.summary.map((sum) => {
      const sec = data.sectionRatings.find((s) => s.sectionName === sum.name);

      return {
        ...sum,
        graphType: sec?.graphType !== undefined ? sec.graphType : "Gauge Chart",
      };
    });
  }

  const sectionsCount = mergedSummary.length;
  const dummySummary = dummySummaryHalf;

  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        py: { xs: 2, sm: 4 },
        position: "relative",
      }}
    >
      <ExecutiveSummary data={data} />

      <Box sx={{ position: "relative" }}>
        <Box sx={isBlurred ? { ...blurStyles } : {}}>
          {(isBlurred ? dummySummary : mergedSummary).map((section, idx) => (
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
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              <InfoIcon sx={{ fontSize: 30 }} />
              <Typography sx={{
                fontSize:"1rem",
                fontWeight:"700"
              }}>
                For detailed report contact admin
              </Typography>
            </Box>

            <Button
              variant="contained"
              sx={{
                backgroundColor: "#18a16e",
                px: 4,
                py: 1,
                fontWeight: 700,
              }}
              onClick={() => alert("Request Full Report")}
            >
              Request Full Report
            </Button>

            <Typography variant="body2" sx={{ mt: 2 }}>
              <ContactMailIcon sx={{ verticalAlign: "middle" }} /> Email:
              <a
                href={`mailto:${import.meta.env.VITE_EMAIL}`}
                style={{ marginLeft: 5 }}
              >
                {import.meta.env.VITE_EMAIL}
              </a>
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
