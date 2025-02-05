import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Box, Typography } from '@mui/material';

// Register Chart.js elements
ChartJS.register(ArcElement, Tooltip, Legend);

const StateGauge = ({ bluePercent, redPercent, title }) => {
  const yellowPercent = 100 - (bluePercent + redPercent);

  const data = {
    labels: ['Democrat', 'Other', 'Republican'],
    datasets: [
      {
        data: [bluePercent, yellowPercent, redPercent],
        backgroundColor: ['#0000FF', '#FFFF00', '#FF0000'],
        borderWidth: 0, // Optional: Remove border between segments
      },
    ],
  };

  const options = {
    rotation: -90,
    circumference: 180,
    plugins: {
      legend: {
        display: false, // Hides the legend
      },
    },
  };

  return (
    <div style={{ width: '200px', height: '100px', display: 'flex', justifyContent: 'center' }}>
      <Typography>
        {title}
      </Typography>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default StateGauge;
