import React from 'react';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { Box, Typography } from '@mui/material';

const CongressionalGauge = ({ senate, blueDiplomats }) => {
  // Handle missing or invalid data gracefully
  if (blueDiplomats == null || blueDiplomats < 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 150 }}>
        <Typography variant="h6" color="error">
          Invalid Data
        </Typography>
      </Box>
    );
  }

  // Calculate the percentage of blue diplomats
  const totalSeats = senate ? 100 : 435; // 100 for Senate, 435 for House
  const bluePercent = (blueDiplomats / totalSeats) * 100; // Percentage of blue diplomats

  return (
    <Box sx={{ display: "flex", justifyContent: "center",width: '100%', height: '100%', position: 'relative' }}>
      <Gauge
        value={bluePercent}
        startAngle={270}
        endAngle={90}
        innerRadius={"30%"}
        outerRadius={"90%"}
        sx={{
            width: '80%',
            height: '75%',
            [`& .${gaugeClasses.valueText}`]: {
                fontSize: 0,
                transform: 'translate(0px, 0px)',
            },
            [`& .${gaugeClasses.valueArc}`]: {
                fill: '#0000FF',
            },
            [`& .${gaugeClasses.referenceArc}`]: {
                fill: '#FF0000',
            },
        }}
      />
    </Box>
  );
};

export default CongressionalGauge;
