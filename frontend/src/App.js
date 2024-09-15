import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import Tasks from './pages/Tasks';
import NewTask from './pages/NewTask';
import Visualize from './pages/Visualize';
import EditTask from './pages/EditTask';
import TaskDetails from './pages/TaskDetails';

const drawerWidth = 300; // Should match the width in Sidebar.js

function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
          }}
        >
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/new-task" element={<NewTask />} />
            <Route path="/visualize" element={<Visualize />} />
            <Route path="/edit-task/:id" element={<EditTask />} />
            <Route path="/task/:id" element={<TaskDetails />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
