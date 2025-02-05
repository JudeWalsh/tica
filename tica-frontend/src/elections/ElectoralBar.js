import React from "react";
import { Box, Tooltip, Typography } from "@mui/material";

const ElectoralBar = ({ redVotes, yellowVotes, blueVotes, average, averageR, averageD }) => {
  // Calculate the total votes to determine the percentage widths
  const totalVotes = redVotes + yellowVotes + blueVotes;

  // Calculate each segment's percentage
  const redPercentage = (redVotes / totalVotes) * 100;
  const bluePercentage = (blueVotes / totalVotes) * 100;

  const averageElection = (average / totalVotes) * 100;
  const averageRedElection = (averageR / totalVotes) * 100;
  const averageBlueElection = (averageD / totalVotes) * 100;

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: 30,
        borderRadius: 5,
        overflow: "hidden",
        border: "1px solid #ccc",
        position: "relative", // For positioning the vertical line
      }}
    >
      {/* Black vertical line in the center */}
      <Tooltip title={"Average Election"} arrow>
          <Box
            sx={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${averageElection}%`,
              width: "3px",
              backgroundColor: "#000",
              border: "1px solid #000", // Black border
              zIndex: 1, // Ensures it appears above the bar
            }}
          />
      </Tooltip>
        <Tooltip title={"Average Republican Victory"} arrow>
          <Box
            sx={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${averageRedElection}%`,
              width: "3px",
              backgroundColor: "#FF0000",
              border: "1px solid #000", // Black border
              zIndex: 1, // Ensures it appears above the bar
            }}
          />
        </Tooltip>
        <Tooltip title={"Average Democratic Victory"} arrow>
          <Box
            sx={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${averageBlueElection}%`,
              width: "3px",
              backgroundColor: "#0000FF",
              border: "1px solid #000", // Black border
              zIndex: 1, // Ensures it appears above the bar
            }}
          />
        </Tooltip>

      {/* Red Section */}
      <Box
        sx={{
          width: `${redPercentage}%`,
          backgroundColor: "#FF0000",
          position: "relative",
          zIndex: 0, // Ensures the text appears below the line
        }}
      >
        <Typography
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "#fff",
            fontWeight: "bold",
            fontSize: 12,
          }}
        >
          {redVotes}
        </Typography>
      </Box>

      {/* Yellow Section */}
      <Box
        sx={{
          width: `${100 - redPercentage - bluePercentage}%`, // Calculate yellow width dynamically
          backgroundColor: "#FFFF00",
        }}
      />

      {/* Blue Section */}
      <Box
        sx={{
          width: `${bluePercentage}%`,
          backgroundColor: "#0000FF",
          position: "relative",
          zIndex: 0, // Ensures the text appears below the line
        }}
      >
        <Typography
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "#fff",
            fontWeight: "bold",
            fontSize: 12,
          }}
        >
          {blueVotes}
        </Typography>
      </Box>
    </Box>
  );
};

export default ElectoralBar;
