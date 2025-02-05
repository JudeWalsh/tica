import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import StateGauge from "./StateGauge";

const StateAnalytics = ({ stateID, selectedYear }) => {
  const [svgSrc, setSvgSrc] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (stateID) {
      import(`./stateSVG/${stateID.toLowerCase()}.svg`)
        .then((module) => setSvgSrc(module.default))
        .catch(() => setSvgSrc(null)); // Handle missing files gracefully
    }
  }, [stateID]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!stateID || !selectedYear) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://127.0.0.1:8000/state_analytics/${stateID}/${selectedYear}`);
        if (!response.ok) throw new Error('Failed to fetch analytics data');

        const data = await response.json();
        setAnalyticsData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [stateID, selectedYear]);

  return (
      <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            padding: 2,
          }}
      >
        {loading && <CircularProgress />}
        {error && <Typography color="error">{error}</Typography>}
        {analyticsData && (
            <Box sx={{ textAlign: 'center', marginTop: 2 }}>
              <Typography variant="h6">
                {stateID} voted {analyticsData.yearly_df.StateStatus} in {selectedYear}
              </Typography>
              {/* Bottom Gauges arranged in a row */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2, width: '100%', maxWidth: 800 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '50%' }}>
                    <StateGauge bluePercent={analyticsData.Distribution.blue} redPercent={analyticsData.Distribution.red} title={"Historically"} />
                    <Typography>{stateID} has voted Blue {analyticsData.Distribution.blue.toFixed(2)}% of the time</Typography>
                    <Typography>{stateID} has voted Red {analyticsData.Distribution.red.toFixed(2)}% of the time</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '50%' }}>
                    <StateGauge bluePercent={analyticsData.yearly_df.BluePercent} redPercent={analyticsData.yearly_df.RedPercent} title={selectedYear} />
                    <Typography>{analyticsData.yearly_df.BluePercent.toFixed(2)}% of {stateID} voted Blue</Typography>
                    <Typography>{analyticsData.yearly_df.RedPercent.toFixed(2)}% of {stateID} voted Red</Typography>
                </Box>
              </Box>
            </Box>
        )}
      </Box>
  );
};

export default StateAnalytics;
