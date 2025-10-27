// complete report .. can se given to summary 


import React from "react";
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Divider,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { CheckCircleOutline, ErrorOutline, TrackChanges } from "@mui/icons-material";
import { blue, green, red, orange, grey } from "@mui/material/colors";
import summaryData from "../../data/summaryData.json";

// Professional report font family
const reportFont = '"Calibri", "Arial", "Helvetica Neue", "Helvetica", "Roboto", "sans-serif"';

// Consistent blue for headings
const headerBgColor = blue[50];
const headerTextColor = blue[700];
const borderColor = blue[200];

// Section card
function SectionCard({ section, idx }) {
  if (!section) return null;

  return (
    <Box sx={{ mb: 4, fontFamily: reportFont }}>
      {/* Colored Header Box */}
      <Box
        sx={{
          bgcolor: headerBgColor,
          px: 4,
          py: 2,
          borderRadius: "16px 16px 0 0",
          borderBottom: `2px solid ${borderColor}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: 2,
          fontFamily: reportFont,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            fontWeight="600"
            sx={{ color: headerTextColor, mb: 0, fontFamily: reportFont, letterSpacing: 0.2 }}
          >
            {section.name}
          </Typography>
          <Typography
            sx={{ color: headerTextColor, opacity: 0.7, fontFamily: reportFont, fontSize: 15 }}
            variant="subtitle2"
          >
            Category {idx + 1} of 5
          </Typography>
        </Box>
        <Box sx={{ textAlign: "right" }}>
          <Typography
            variant="h5"
            fontWeight="700"
            sx={{ color: "#111", fontFamily: reportFont, mb: 0 }}
          >
            {section.score}/{section.maxScore}
          </Typography>
          <Typography variant="body2" sx={{ color: grey[700], fontFamily: reportFont }}>
            {section.completionRate} Complete
          </Typography>
        </Box>
      </Box>

      {/* Main Card Area */}
      <Card
        variant="outlined"
        sx={{
          borderRadius: "0 0 16px 16px",
          bgcolor: "background.paper",
          pt: 2,
          pb: 2,
          fontFamily: reportFont,
        }}
      >
        <CardContent>
          <Grid container spacing={15}>
            {/* Strengths */}
            <Grid item xs={12} md={4}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <CheckCircleOutline sx={{ color: green[600], mr: 1 }} />
                <Typography fontWeight="bold" color={green[700]} sx={{ fontFamily: reportFont }}>
                  Strengths
                </Typography>
              </Box>
              {section.strengths.length === 0 ? (
                <Typography variant="body2" fontStyle="italic" sx={{ color: grey[500], fontFamily: reportFont }}>
                  No strengths identified in this category
                </Typography>
              ) : (
                <List dense>
                  {section.strengths.map((str, i) => (
                    <ListItem key={i} disablePadding>
                      <ListItemText primary={str} sx={{ fontFamily: reportFont }} />
                    </ListItem>
                  ))}
                </List>
              )}
            </Grid>

            {/* Gaps */}
            <Grid item xs={12} md={4}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <ErrorOutline sx={{ color: red[600], mr: 1 }} />
                <Typography fontWeight="bold" color={red[700]} sx={{ fontFamily: reportFont }}>
                  Gaps
                </Typography>
              </Box>
              {section.gaps.length === 0 ? (
                <Typography variant="body2" fontStyle="italic" sx={{ color: grey[500], fontFamily: reportFont }}>
                  No gaps identified in this category
                </Typography>
              ) : (
                <List dense>
                  {section.gaps.map((gap, i) => (
                    <ListItem key={i} disablePadding>
                      <ListItemText primary={gap} sx={{ fontFamily: reportFont }} />
                    </ListItem>
                  ))}
                </List>
              )}
            </Grid>

            {/* Action Recommendations */}
            <Grid item xs={12} md={4}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <TrackChanges sx={{ color: blue[600], mr: 1 }} />
                <Typography fontWeight="bold" color={blue[700]} sx={{ fontFamily: reportFont }}>
                  Action Recommendations
                </Typography>
              </Box>
              {section.recommendations.length === 0 ? (
                <Typography variant="body2" fontStyle="italic" sx={{ color: grey[500], fontFamily: reportFont }}>
                  No recommendations identified in this category
                </Typography>
              ) : (
                <List dense>
                  {section.recommendations.map((rec, i) => (
                    <ListItem key={i} disablePadding>
                      <ListItemText primary={rec} sx={{ fontFamily: reportFont }} />
                    </ListItem>
                  ))}
                </List>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}

export default function Summary_Repo() {
  const data = summaryData;

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", py: 4, fontFamily: reportFont }}>

      {/* Executive Summary Display */}
      <Paper sx={{ mb: 3, p: 3, fontFamily: reportFont }}>
        <Typography variant="h5" align="center" fontWeight="bold" sx={{ fontFamily: reportFont }}>
          Executive Summary
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, my: 2 }}>
          <Typography variant="h6" color="primary" sx={{ fontFamily: reportFont }}>
            {data.overAllScore} Score
          </Typography>
          <Typography variant="h6" sx={{ fontFamily: reportFont }}>
            / {data.maxmScore} Max
          </Typography>
        </Box>
        <Box sx={{ textAlign: "center", mb: 1 }}>
          <Chip
            label={data.summaryStatus}
            color={
              data.summaryType === "danger"
                ? "error"
                : data.summaryType === "success"
                ? "success"
                : "warning"
            }
            sx={{ fontSize: "1rem", px: 4, mb: 1, fontFamily: reportFont }}
          />
        </Box>

        {/* Section Ratings Summary */}
        <Grid container spacing={2} justifyContent="center" sx={{ mb: 2 }}>
          {data.sectionRatings.map((sr, idx) => (
            <Grid item key={idx} xs={12} sm={6} md={2.4}>
              <Card
                variant="outlined"
                sx={{
                  minWidth: 150,
                  textAlign: "center",
                  p: 1.5,
                  borderRadius: 3,
                  bgcolor: blue[50],
                  boxShadow: 2,
                  fontFamily: reportFont,
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{ color: "#222", fontFamily: reportFont, letterSpacing: 0.5 }}
                >
                  {sr.score}/{sr.mxmScore}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography
                  variant="body2"
                  fontWeight="500"
                  sx={{ color: "#222", fontSize: 13, fontFamily: reportFont, letterSpacing: 0.2 }}
                >
                  {sr.sectionName}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Key Insights */}
        <Box sx={{
          bgcolor: "rgba(119, 162, 88, 0.15)",
          borderRadius: 2, mt: 2, p: 2,
          fontFamily: reportFont
        }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ fontFamily: reportFont }}>
            Key Insights
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            {data.keyInsights.map((ki, idx) => (
              <Chip
                key={idx}
                label={ki.name}
                sx={{
                  bgcolor: ki.status ? { success: green[200], danger: red[200], warning: orange[200] }[ki.status] : undefined,
                  fontWeight: "bold",
                  fontFamily: reportFont
                }}
              />
            ))}
          </Box>
        </Box>
      </Paper>

      {/* Section Cards */}
      {data.summary.map((section, idx) => (
        <SectionCard key={section.name || idx} section={section} idx={idx} />
      ))}

      {/* Recommended Next Steps */}
      <Card sx={{ mt: 4, p: 3, fontFamily: reportFont }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontFamily: reportFont }}>
            Recommended Next Steps
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ bgcolor: red[100], p: 2, fontFamily: reportFont }}>Immediate (30 days)</Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ bgcolor: orange[100], p: 2, fontFamily: reportFont }}>Short term (3 months)</Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ bgcolor: green[100], p: 2, fontFamily: reportFont }}>Long term (6-12 months)</Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
