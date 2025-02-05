import React from 'react';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { Box } from '@mui/material';

const PresidentialGauge = ({ bluePercent }) => {
  const redPercent = 100 - bluePercent;
  const text = bluePercent > 50
    ? `Democrats have controlled\nthe presidency\n${bluePercent.toFixed(2)}%\nof the time since 1960`
    : `Republicans have controlled\nthe presidency\n${redPercent.toFixed(2)}%\nof the time since 1960`;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: 250, position: 'relative' }}>
      <Gauge
        value={bluePercent}
        startAngle={-90}
        endAngle={90}
        innerRadius={'55%'}
        outerRadius={'90%'}
        sx={{
          width: '100%',
          height: 200,
          [`& .${gaugeClasses.valueText}`]: {
            fontSize: 16,
            whiteSpace: 'pre-line',
            textAlign: 'center',
            dominantBaseline: 'middle',
            textAnchor: 'middle',
            transform: 'translateY(-30px)',
          },
          [`& .${gaugeClasses.valueArc}`]: {
            fill: '#0000FF',
          },
          [`& .${gaugeClasses.referenceArc}`]: {
            fill: '#FF0000',
          },
        }}
        text={() => text}
      />
    </Box>
  );
};

export default PresidentialGauge;
