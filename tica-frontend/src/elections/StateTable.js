import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';

const StateTable = ({ title, partyRankings }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h8" align="center">
        {title}
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Party</TableCell>
              <TableCell align="center">%</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell align="center">Republican</TableCell>
              <TableCell align="center">{partyRankings.republican_percentile}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center">Democrat</TableCell>
              <TableCell align="center">{partyRankings.democratic_percentile}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default RankTable;
