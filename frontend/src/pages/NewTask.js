import React, { useState } from 'react';
import { Box, TextField, Button, Typography, IconButton, FormControlLabel, Switch } from '@mui/material';
import { AddCircle } from '@mui/icons-material';
import axios from 'axios';

function NewTask() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState(''); // New description state
  const [time, setTime] = useState('');
  const [impact, setImpact] = useState('');
  const [complexity, setComplexity] = useState('');
  const [requireOthers, setRequireOthers] = useState(false);
  const [attributes, setAttributes] = useState([]);

  const handleAttributeChange = (index, field, value) => {
    const newAttributes = [...attributes];
    newAttributes[index][field] = value;
    setAttributes(newAttributes);
  };

  const addAttributeField = () => {
    setAttributes([...attributes, { key: '', value: '' }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare attributes object, including fixed fields
    const attributesObject = {
      time: parseFloat(time),
      impact: parseFloat(impact),
      complexity: parseFloat(complexity),
      requireOthers: requireOthers ? 1 : 0, // Keep as boolean
      description: description, // Include description as string
    };

    // Add dynamic attributes
    attributes.forEach(attr => {
      if (attr.key && attr.value !== '') {
        // Check if the value is a number or string
        // const value = isNaN(attr.value) ? attr.value : parseFloat(attr.value);
        attributesObject[attr.key] = attr.value;
      }
    });
    console.log(attributesObject);
    // Send data to backend
    axios.post('http://localhost:8000/tasks/', { title, attributes: attributesObject })
      .then(response => {
        // Reset form fields
        setTitle('');
        setDescription('');
        setTime('');
        setImpact('');
        setComplexity('');
        setRequireOthers(false);
        setAttributes([]);
        alert('Task created successfully!');
      })
      .catch(error => console.error(error));
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <h1>Create New Task</h1>
      <TextField
        label="Task Title"
        variant="outlined"
        fullWidth
        required
        value={title}
        onChange={e => setTitle(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Description"
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        required
        value={description}
        onChange={e => setDescription(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Time"
        variant="outlined"
        fullWidth
        required
        type="number"
        value={time}
        onChange={e => setTime(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Impact"
        variant="outlined"
        fullWidth
        required
        type="number"
        value={impact}
        onChange={e => setImpact(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Complexity"
        variant="outlined"
        fullWidth
        required
        type="number"
        value={complexity}
        onChange={e => setComplexity(e.target.value)}
        sx={{ mb: 2 }}
      />
      <FormControlLabel
        control={
          <Switch
            checked={requireOthers}
            onChange={e => setRequireOthers(e.target.checked)}
            color="primary"
          />
        }
        label="Requires Others"
        sx={{ mb: 2 }}
      />
      <Typography variant="h6">Additional Attributes</Typography>
      {attributes.map((attr, index) => (
        <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            label="Key"
            variant="outlined"
            required
            value={attr.key}
            onChange={e => handleAttributeChange(index, 'key', e.target.value)}
          />
          <TextField
            label="Value"
            variant="outlined"
            required
            value={attr.value}
            onChange={e => handleAttributeChange(index, 'value', e.target.value)}
          />
        </Box>
      ))}
      <IconButton onClick={addAttributeField} color="primary">
        <AddCircle />
      </IconButton>
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        Create Task
      </Button>
    </Box>
  );
}

export default NewTask;
