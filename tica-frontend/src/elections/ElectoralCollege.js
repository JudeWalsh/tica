import React, { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { debounce } from "lodash";

const ElectoralCollege = ({ redStates = [], blueStates = [], yellowStates = [], setState }) => {
  const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

  const stateNameToPostal = {
  "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR", "California": "CA",
  "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE", "Florida": "FL", "Georgia": "GA",
  "Hawaii": "HI", "Idaho": "ID", "Illinois": "IL", "Indiana": "IN", "Iowa": "IA",
  "Kansas": "KS", "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Maryland": "MD",
  "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS", "Missouri": "MO",
  "Montana": "MT", "Nebraska": "NE", "Nevada": "NV", "New Hampshire": "NH", "New Jersey": "NJ",
  "New Mexico": "NM", "New York": "NY", "North Carolina": "NC", "North Dakota": "ND", "Ohio": "OH",
  "Oklahoma": "OK", "Oregon": "OR", "Pennsylvania": "PA", "Rhode Island": "RI", "South Carolina": "SC",
  "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX", "Utah": "UT", "Vermont": "VT",
  "Virginia": "VA", "Washington": "WA", "West Virginia": "WV", "Wisconsin": "WI", "Wyoming": "WY"
};


  const partyColors = {
    R: "#FF0000", // Red for Republican
    D: "#0000FF", // Blue for Democrat
    O: "#FFFF00", // Yellow for Other
  };

  const [debouncedData, setDebouncedData] = useState({
    redStates: [],
    blueStates: [],
    yellowStates: [],
  });

  // Debounce input changes
  useEffect(() => {
    const handler = debounce(
      () =>
        setDebouncedData({
          redStates,
          blueStates,
          yellowStates,
        }),
      300
    );

    handler();

    return () => {
      handler.cancel();
    };
  }, [redStates, blueStates, yellowStates]);

  // Prepare the voting data
  const votingData = {};

  debouncedData.redStates.forEach((state) => {
    votingData[state] = "R";
  });

  debouncedData.blueStates.forEach((state) => {
    votingData[state] = "D";
  });

  debouncedData.yellowStates.forEach((state) => {
    votingData[state] = "O";
  });

  return (
    <ComposableMap
      projection="geoAlbersUsa"
      style={{ width: "100%", height: "auto" }}
    >
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map((geo) => {
            const stateName = geo.properties.name;
            const stateVote = votingData[stateName];
            const fillColor = partyColors[stateVote] || "#E0E0E0";

            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                onClick={() => {
                  const stateName = geo.properties.name;
                  const postalCode = stateNameToPostal[stateName] || stateName; // Fallback to full name if missing
                  setState(postalCode);
                }}
                style={{
                  default: {
                    fill: fillColor,
                    outline: "none",
                    stroke: "#ffffff",
                    strokeWidth: 0.5,
                    cursor: "pointer", // Show pointer cursor to indicate clickability
                  },
                  hover: { fill: "#CCCCCC", outline: "none" }, // Highlight on hover
                  pressed: { fill: fillColor, outline: "none" },
                }}
              />
            );
          })
        }
      </Geographies>
    </ComposableMap>
  );
};

export default ElectoralCollege;
