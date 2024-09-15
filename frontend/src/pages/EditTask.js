import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, IconButton } from '@mui/material';
import { AddCircle, RemoveCircle } from '@mui/icons-material';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [attributes, setAttributes] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:8000/tasks/${id}`)
      .then(response => {
        setTitle(response.data.title);
        const attrs = Object.entries(response.data.attributes).map(([key, value]) => ({ key, value }));
        setAttributes(attrs);
      })
      .catch(error => console.error(error));
  }, [id]);

  const handleAttributeChange = (index, field, value) => {
    const newAttributes = [...attributes];
    newAttributes[index][field] = value;
    setAttributes(newAttributes);
  };

  const addAttributeField = () => {
    setAttributes([...attributes, { key: '', value: '' }]);
  };

  const removeAttributeField = (index) => {
    const newAttributes = [...attributes];
    newAttributes.splice(index, 1);
    setAttributes(newAttributes);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const attributesObject = {};
    attributes.forEach(attr => {
      if (attr.key && attr.value !== '') {
        attributesObject[attr.key] = attr.value;
      }
    });
    axios.put(`http://localhost:8000/tasks/${id}`, { title, attributes: attributesObject })
      .then(response => {
        alert('Task updated successfully!');
        navigate('/');
      })
      .catch(error => console.error(error));
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <h1>Edit Task</h1>
      <TextField
        label="Task Title"
        variant="outlined"
        fullWidth
        required
        value={title}
        onChange={e => setTitle(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Typography variant="h6">Attributes</Typography>
      {attributes.map((attr, index) => (
        <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
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
          <IconButton onClick={() => removeAttributeField(index)} color="secondary">
            <RemoveCircle />
          </IconButton>
        </Box>
      ))}
      <IconButton onClick={addAttributeField} color="primary">
        <AddCircle />
      </IconButton>
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        Update Task
      </Button>
    </Box>
  );
}

export default EditTask;
