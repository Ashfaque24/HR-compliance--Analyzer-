// StarRating.jsx
import React from 'react';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import Box from '@mui/material/Box';

const labels = {
  0.5: 'Useless',
  1: 'Poor',
  1.5: 'Ok',
  2: 'Fair',
  2.5: 'Average',
  3: 'Good',
  3.5: 'Very Good',
  4: 'Excellent',
  4.5: 'Superb',
  5: 'Perfect',
};

export function StarRating({ score, maxScore }) {
  const value = maxScore > 0 ? (score / maxScore) * 5 : 0;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Rating
        name="read-only"
        value={value}
        precision={0.5}
        readOnly
        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
        size="small"
      />
      <Box sx={{ fontSize: 12, color: '#555' }}>
        {labels[value.toFixed(1)] || ''}
      </Box>
    </Box>
  );
}
