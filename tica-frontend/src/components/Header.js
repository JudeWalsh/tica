// src/components/Header.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#333' }}>
      <Toolbar sx={{ display: 'flex' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          TICA Web App
        </Typography>
        <div>
          <Button
            component={Link}
            to="/home"
            sx={{ color: 'white', marginLeft: 2 }}
          >
            Home
          </Button>
          <Button
            component={Link}
            to="/elections"
            sx={{ color: 'white', marginLeft: 2 }}
          >
            US Elections
          </Button>
          <Button>
            Super Power Index
          </Button>
          <Button>
            Bitcoin
          </Button>
          <Button>
            Diet Tracker
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
