import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import BulletBarChart from "./BulletBarChart";
import RankTable from "./RankTable";

const SenateAnalytics = ({analytics, republicans, democrats}) => {

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
      }}
    >
        <Typography>
            {analytics.control} Controlled Senate
        </Typography>
        <Typography>
            On average the senate has {analytics.average_r_senators} Republicans and {analytics.average_d_senators} Democrats
        </Typography>
        <Box>
            <BulletBarChart republicans={republicans} democrats={democrats} avgD={analytics.average_d_senators} avgR={analytics.average_r_senators}/>
        </Box>
        <Typography>
            Senate is {analytics.control} controlled {analytics.control_percent}% of the time
        </Typography>
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-evenly", // Optional, adjusts spacing between tables
                gap: 1, // Space between the tables
                marginTop: 2, // Space above the tables
                }}
        >
            <RankTable title={"Overall"} partyRankings={analytics.partyRankings}/>
            <RankTable title={"By Party Control"} partyRankings={analytics.partyRankings_control}/>
        </Box>
    </Box>
  );
};

export default SenateAnalytics;
