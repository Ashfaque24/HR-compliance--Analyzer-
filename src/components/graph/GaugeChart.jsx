// GaugeChart.jsx
import * as React from 'react';
import { Gauge } from '@mui/x-charts/Gauge';

export function GaugeChart({ score, maxScore }) {
  const value = maxScore > 0 ? (score / maxScore) * 100 : 0;

  return (
    <Gauge
      width={120}
      height={80}
      value={value}
      startAngle={-90}   // Start at -90° (left side)
      endAngle={90}      // End at +90° (right side)
    />
  );
}
