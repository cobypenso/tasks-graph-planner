import React, { useEffect, useState } from 'react';
import {
  TextField, Box, List, ListItem, ListItemText, IconButton,
  FormControl, InputLabel, Select, MenuItem, Collapse, Typography, Card, CardContent,
} from '@mui/material';
import { Edit, Delete, ExpandMore, ExpandLess } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [filterAttribute, setFilterAttribute] = useState('time');
  const [filterOperator, setFilterOperator] = useState('equal');
  const [filterValue, setFilterValue] = useState('');
  const [filteredTasks, setFilteredTasks] = useState([]);
  const navigate = useNavigate();
  const [expandedTaskIds, setExpandedTaskIds] = useState([]);
  const StyledLink = styled(Link)(({ theme }) => ({
    textDecoration: 'none',
    color: 'inherit',
    '&:hover': {
      textDecoration: 'underline',
      color: theme.palette.primary.main,
    },
  }));
  const loadTasks = () => {
    axios.get('http://localhost:8000/tasks/')
      .then(response => setTasks(response.data))
      .catch(error => console.error(error));
  };

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    let filtered = tasks.filter(task =>
      task.title.toLowerCase().includes(filterText.toLowerCase())
    );

    if (filterValue !== '') {
      filtered = filtered.filter(task => {
        const attrValue = task.attributes[filterAttribute];
        if (attrValue === undefined) {
          return false;
        }
        const value = parseFloat(filterValue);
        if (filterOperator === 'equal') {
          return attrValue === value;
        } else if (filterOperator === 'greater') {
          return attrValue > value;
        } else if (filterOperator === 'less') {
          return attrValue < value;
        }
        return true;
      });
    }

    setFilteredTasks(filtered);
  }, [tasks, filterText, filterAttribute, filterOperator, filterValue]);

  const handleEdit = (taskId) => {
    navigate(`/edit-task/${taskId}`);
  };

  const handleDelete = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      axios.delete(`http://localhost:8000/tasks/${taskId}`)
        .then(() => {
          loadTasks();
        })
        .catch(error => console.error(error));
    }
  };

  const toggleExpand = (taskId) => {
    setExpandedTaskIds(prevState =>
      prevState.includes(taskId)
        ? prevState.filter(id => id !== taskId)
        : [...prevState, taskId]
    );
  };

  return (
    <Box>
      <h1>Tasks</h1>
      <TextField
        label="Filter tasks"
        variant="outlined"
        fullWidth
        value={filterText}
        onChange={e => setFilterText(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <FormControl fullWidth>
          <InputLabel>Attribute</InputLabel>
          <Select
            value={filterAttribute}
            onChange={e => setFilterAttribute(e.target.value)}
            label="Attribute"
          >
            <MenuItem value="time">Time</MenuItem>
            <MenuItem value="impact">Impact</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Operator</InputLabel>
          <Select
            value={filterOperator}
            onChange={e => setFilterOperator(e.target.value)}
            label="Operator"
          >
            <MenuItem value="equal">Equal</MenuItem>
            <MenuItem value="greater">Greater Than</MenuItem>
            <MenuItem value="less">Less Than</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Value"
          variant="outlined"
          type="number"
          fullWidth
          value={filterValue}
          onChange={e => setFilterValue(e.target.value)}
        />
      </Box>
      <List>
        {filteredTasks.map(task => {
          const isExpanded = expandedTaskIds.includes(task.id);
          return (
            <Box key={task.id}>
              <ListItem
                secondaryAction={
                  <Box>
                    <IconButton edge="end" onClick={() => handleEdit(task.id)}>
                      <Edit />
                    </IconButton>
                    <IconButton edge="end" onClick={() => handleDelete(task.id)}>
                      <Delete />
                    </IconButton>
                    <IconButton edge="end" onClick={() => toggleExpand(task.id)}>
                      {isExpanded ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  </Box>
                }
              >
                <ListItemText
                  primary={
                    <StyledLink to={`/task/${task.id}`}>
                      {task.title}
                    </StyledLink>
                  }
                />
              </ListItem>
              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <Box sx={{ ml: 4, mb: 2 }}>
                <Card>
                    <CardContent>
                    <Typography variant="h6">{task.title}</Typography>
                    <Typography variant="subtitle1">Attributes:</Typography>
                    {Object.entries(task.attributes).map(([key, value]) => (
                        <Typography key={key}>{`${key}: ${value}`}</Typography>
                    ))}
                    </CardContent>
                </Card>
                </Box>
              </Collapse>
            </Box>
          );
        })}
      </List>
    </Box>
  );
}

export default Tasks;