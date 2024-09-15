import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Card, CardContent } from '@mui/material';
import axios from 'axios';

function TaskDetails() {
  const { id } = useParams();
  const [task, setTask] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8000/tasks/${id}`)
      .then(response => setTask(response.data))
      .catch(error => console.error(error));
  }, [id]);

  if (!task) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <h1>Task Details</h1>
      <Card>
        <CardContent>
          <Typography variant="h5">{task.title}</Typography>
          <Typography variant="subtitle1">Attributes:</Typography>
          {Object.entries(task.attributes).map(([key, value]) => (
            <Typography key={key}>{`${key}: ${value}`}</Typography>
          ))}
        </CardContent>
      </Card>
    </Box>
  );
}

export default TaskDetails;
