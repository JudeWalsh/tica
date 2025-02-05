import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import TimelineSlider from "../elections/TimelineSlider";
import ElectoralCollege from "../elections/ElectoralCollege";
import ElectoralCollegeHeader from "../elections/ElectoralCollegeHeader";
import SenateSection from "../elections/SenateSection";
import HouseSection from "../elections/HouseSection";
import PresidentSection from "../elections/PresidentSection";


const Elections = () => {
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(1960);
  const [electionData, setElectionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch years from the backend
  useEffect(() => {
    const fetchYears = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/election_years");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setYears(data.years);
        setSelectedYear(data.years[0]);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchYears();
  }, []);

  // Fetch election data when the selected year changes
  useEffect(() => {
    if (!selectedYear) return;

    const fetchElectionData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/elections/${selectedYear}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setElectionData(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchElectionData();
  }, [selectedYear]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>Error: {error}</Typography>;
  }

  return (
    <Box>
      {/* Timeline Slider */}
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", marginBottom: "1%" }}>
        <TimelineSlider
          years={years}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
        />
      </Box>

      {/* Horizontal Layout for Senate, Electoral College, and House Charts */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",  // Centers children horizontally
          alignItems: "center",  // Centers children vertically
          width: "100%",
          height: "900px",
        }}
      >
        {electionData ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <Box
              sx={{
                flex: 1,
                height: "100%",
                display: "flex",
                justifyContent: "center",  // Center the SenateSection
                alignItems: "center",  // Ensure it is vertically centered too
              }}
            >
              <SenateSection selectedYear={selectedYear} />
            </Box>
            <Box
              sx={{
                flex: 1,
                height: "100%",
                display: "flex",
                justifyContent: "center",  // Center the SenateSection
                alignItems: "center",  // Ensure it is vertically centered too
              }}
            >
              <PresidentSection selectedYear={selectedYear} />
            </Box>
            <Box
              sx={{
                flex: 1,
                height: "100%",
                display: "flex",
                justifyContent: "center",  // Center the SenateSection
                alignItems: "center",  // Ensure it is vertically centered too
              }}
            >
              <HouseSection selectedYear={selectedYear} />
            </Box>
          </Box>
        ) : (
          <Typography variant="body1">Loading election data...</Typography>
        )}
      </Box>
    </Box>
  );
};

export default Elections;
