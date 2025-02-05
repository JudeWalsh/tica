import React, { useState, useEffect } from "react";
import { Slider, Typography, Box } from "@mui/material";

const TimelineSlider = ({ years, selectedYear, setSelectedYear }) => {
  // Map years to slider marks
  const marks = years.map((year, index) => ({ value: index, label: `${year}` }));

  // Handle slider value change
  const handleSliderChange = (event, newValue) => {
    setSelectedYear(years[newValue]); // Set the selected year
  };

  return (
    <Box sx={{ width: "80%", padding: 2, textAlign: "center" }}>
      <Typography gutterBottom>US Elections Timeline</Typography>
      <Slider
        value={years.indexOf(selectedYear)} // Match slider value to the selected year
        onChange={handleSliderChange}
        step={null} // No intermediate steps
        marks={marks}
        min={0}
        max={marks.length - 1}
        valueLabelDisplay="auto"
        valueLabelFormat={(value) => marks[value]?.label}
      />
    </Box>
  );
};

export default TimelineSlider;
