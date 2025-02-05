import React from "react";
import { Box } from "@mui/material";
import PresidentialGauge from "./PresidentialGauge";
import ElectoralBar from "./ElectoralBar";

const PresidentAnalytics = ({ analytics }) => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column", // Stacks children vertically
        gap: 2, // Adds spacing between the children
      }}
    >
      <Box>
        <ElectoralBar
          blueVotes={analytics.blue_votes}
          redVotes={analytics.red_votes}
          yellowVotes={analytics.yellow_votes}
          average={analytics.average_r_electoral_votes}
          averageR={analytics.average_r_winner_votes}
          averageD={analytics.average_r_loser_votes}
        />
      </Box>
      <Box>
        <PresidentialGauge bluePercent={analytics.democrat_percent} />
      </Box>
    </Box>
  );
};

export default PresidentAnalytics;
