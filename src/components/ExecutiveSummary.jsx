import React from "react";
import { Box, Typography, Paper, Divider, Chip } from "@mui/material";
import { blue, red, grey } from "@mui/material/colors";

const reportFont = "Helvetica, Arial, sans-serif";

const iconMap = {
  "Registration & Licensing": "🏢",
  "Employee Welfare & Benefits": "👥",
  "Policy & Documentation": "📄",
  "Statutory Payments & Returns": "💲",
  "Workplace Governance": "⚖️",
};

function getRiskLevel(score, max) {
  const pct = (score / max) * 100;
  if (pct < 40)
    return {
      text: "High Risk – Immediate Attention Required",
      color: red[600],
      bgColor: red[50],
      borderColor: red[300],
      icon: "✕",
    };
  if (pct < 70)
    return {
      text: "Medium Risk – Action Needed",
      color: red[600],
      bgColor: red[50],
      borderColor: red[300],
      icon: "!",
    };
  return {
    text: "Low Risk – Good Standing",
    color: red[600],
    bgColor: red[50],
    borderColor: red[300],
    icon: "✓",
  };
}

export function ExecutiveSummary({ data }) {
  const { sectionRatings = [], overAllScore, maxmScore, keyInsights = [] } =
    data;

  const risk = getRiskLevel(overAllScore, maxmScore);

  return (
    <Paper
      elevation={4}
      sx={{
        fontFamily: reportFont,
        borderRadius: 4,
        px: { xs: 2, sm: 4, md: 6 },
        py: { xs: 2, sm: 4 },
        mb: 4,
      }}
    >
      {/* TITLE */}
      <Typography
        align="center"
        fontWeight={700}
        sx={{
          fontSize: { xs: 26, sm: 34 },
          mb: 2,
        }}
      >
        Executive Summary
      </Typography>

      {/* SCORE BLOCK */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "baseline",
          gap: 2,
          mb: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: 48, sm: 66 },
            fontWeight: 800,
            color: blue[600],
          }}
        >
          {overAllScore}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: 34, sm: 48 },
            fontWeight: 500,
            color: grey[400],
          }}
        >
          / {maxmScore}
        </Typography>
      </Box>

      {/* SCORE LABELS */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 4,
          mb: 3,
        }}
      >
        <Typography sx={{ fontSize: 15, color: grey[600] }}>
          Overall Score
        </Typography>
        <Typography sx={{ fontSize: 15, color: grey[600] }}>Maximum</Typography>
      </Box>

      {/* RISK INDICATOR */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: 4,
            py: 1.5,
            borderRadius: 50,
            bgcolor: risk.bgColor,
            border: `2px solid ${risk.borderColor}`,
            maxWidth: "92%",
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              border: `2px solid ${risk.color}`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: 700,
            }}
          >
            {risk.icon}
          </Box>

          <Typography
            sx={{
              fontWeight: 600,
              color: risk.color,
              fontSize: { xs: 14, sm: 16 },
            }}
          >
            {risk.text}
          </Typography>
        </Box>
      </Box>

      {/* SECTION RATINGS GRID */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(5, 1fr)",
          },
          rowGap: 4,
          columnGap: 3,
          mt: 3,
        }}
      >
        {sectionRatings.map((sec, idx) => {
          const max = sec.maxScore ?? sec.mxmScore ?? "?";
          const percentage = max !== "?" ? (sec.score / max) * 100 : 0;

          return (
            <Box
              key={idx}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: 2,
                  bgcolor: blue[50],
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 28,
                }}
              >
                {iconMap[sec.sectionName] || "📊"}
              </Box>

              <Typography sx={{ fontWeight: 700, fontSize: 26 }}>
                {sec.score}/{max}
              </Typography>

              <Typography
                sx={{
                  fontSize: 14,
                  color: grey[700],
                  textAlign: "center",
                  lineHeight: 1.3,
                  minHeight: 40,
                }}
              >
                {sec.sectionName}
              </Typography>

              <Box
                sx={{
                  width: "100%",
                  height: 8,
                  bgcolor: grey[200],
                  borderRadius: 1,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    width: `${percentage}%`,
                    height: "100%",
                    bgcolor: red[400],
                  }}
                />
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* KEY INSIGHTS */}
      {keyInsights.length > 0 && (
        <Box
          sx={{
            mt: { xs: 3, sm: 4 },
            p: { xs: 1.5, sm: 2 },
            bgcolor: "rgba(119,162,88,0.08)",
            borderRadius: 2,
          }}
        >
          <Typography fontWeight={700} sx={{ mb: 1.5 }}>
            Key Insights
          </Typography>
          <Divider />

          <Box
            sx={{
              mt: 2,
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              justifyContent:"center",
            }}
          >
            {keyInsights.map((ki, idx) => (
              <Chip
                key={idx}
                label={ki.name}
                size="small"
                sx={{
                  bgcolor:
                    ki.status === "success"
                      ? "rgba(76,175,80,0.25)"
                      : ki.status === "danger"
                      ? "rgba(244,67,54,0.25)"
                      : ki.status === "warning"
                      ? "rgba(255,193,7,0.22)"
                      : "rgba(200,200,200,0.2)",
                  fontWeight: 600,
                }}
              />
            ))}
          </Box>
        </Box>
      )}
    </Paper>
  );
}
