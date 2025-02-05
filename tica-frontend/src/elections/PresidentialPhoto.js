import React from "react";
import { Box } from "@mui/material";

const PresidentialPhoto = ({ src, alt, size = 100, borderColor = "#000", borderWidth = 2 }) => {
  return (
    <Box
      component="img"
      src={src}
      alt={alt}
      sx={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: `${borderWidth}px solid ${borderColor}`,
        objectFit: "cover",
      }}
    />
  );
};

export default PresidentialPhoto;
