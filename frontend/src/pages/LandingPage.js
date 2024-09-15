import React from 'react';
import { Box, Typography } from '@mui/material';
import PlannerLogo from '../assets/planner_logo.png'; // Adjust the path to your logo image

function LandingPage() {
  return (
    <Box sx={{ textAlign: 'center', mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        Welcome to Your Tasks Graph Planner
      </Typography>
      <img
        src={PlannerLogo}
        alt="Planner Logo"
        style={{ maxWidth: '600px', marginTop: '20px' }}
      />
    </Box>
  );
}

export default LandingPage;
