// src/components/Diplomat.js
import React from 'react';

const Diplomat = ({ party }) => {
  // Define colors for the parties
  const partyColors = {
    'D': '#0000FF',  // Blue for Democrats
    'R': '#FF0000',  // Red for Republicans
    'O': '#FFFF00',  // Yellow for Others
  };

  // Get the color based on the party, default to 'O' if undefined
  const circleColor = partyColors[party] || partyColors['O'];

  return (
    <div style={{
      width: '75%',
      height: '75%',
      borderRadius: '50%',  // Makes the circle
      backgroundColor: circleColor,
      margin: '1%',  // Add spacing between circles
    }} />
  );
};

export default Diplomat;
