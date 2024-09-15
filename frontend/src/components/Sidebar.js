import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  Box,
} from '@mui/material';
import { Home, List as ListIcon, Add, BarChart } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const drawerWidth = 300; // Adjust the width as needed

function Sidebar() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Task Planner
        </Typography>
      </Toolbar>
      <Divider />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          <ListItem button component={Link} to="/">
            <ListItemIcon>
              <Home />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button component={Link} to="/tasks">
            <ListItemIcon>
              <ListIcon />
            </ListItemIcon>
            <ListItemText primary="Tasks" />
          </ListItem>
          <ListItem button component={Link} to="/new-task">
            <ListItemIcon>
              <Add />
            </ListItemIcon>
            <ListItemText primary="New Task" />
          </ListItem>
          <ListItem button component={Link} to="/visualize">
            <ListItemIcon>
              <BarChart />
            </ListItemIcon>
            <ListItemText primary="Visualize" />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}

export default Sidebar;
