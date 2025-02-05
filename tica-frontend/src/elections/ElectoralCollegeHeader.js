import React from "react";
import {Stack, Typography} from "@mui/material";
import ElectoralBar from "./ElectoralBar";

const ElectoralCollegeHeader = ({ redVotes, yellowVotes, blueVotes, presidentialYear, candidate, opponent }) => {
  return (
    <Stack
      direction="column"
      alignItems="center"
      spacing={2}
      sx={{ width: "90%", padding: 2 }}
    >
      <Typography>
        In {presidentialYear}, {candidate} defeated {opponent}
      </Typography>
      {/* Electoral Bar */}
      <ElectoralBar redVotes={redVotes} yellowVotes={yellowVotes} blueVotes={blueVotes} />
    </Stack>
  );
};

export default ElectoralCollegeHeader;
