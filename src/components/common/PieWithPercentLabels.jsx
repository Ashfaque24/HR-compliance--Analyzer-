// PieWithPercentLabels.js
import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export function PieWithPercentLabels({ data }) {
  return (
    <Pie
      data={data}
      options={{
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          datalabels: {
            color: "#222",
            font: { weight: "bold", size: 13 },
            formatter: function (value, context) {
                const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                const percent = total > 0 ? Math.round((value / total) * 100) : 0;
                return percent === 0 ? "" : `${percent}%`;
              },
              
          },
          tooltip: {
            enabled: true,
            callbacks: {
              label: function (context) {
                const label = context.label || "";
                const score = context.parsed;
                const total = context.dataset.data.reduce((sum, v) => sum + v, 0);
                const percent = total > 0 ? ((score / total) * 100).toFixed(1) : 0;
                return `${label}: ${score} (${percent}%)`;
              },
            },
          },
        },
      }}
      style={{ width: "100%", height: "100%" }}
      plugins={[ChartDataLabels]}
    />
  );
}
