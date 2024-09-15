import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { Box, FormControl, InputLabel, Select, MenuItem, Card, CardContent, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

function Visualize() {
  const [tasks, setTasks] = useState([]);
  const [dimensions, setDimensions] = useState({ x: 'time', y: 'impact', z: 'impact' });
  const [availableDimensions, setAvailableDimensions] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  const theme = useTheme();

  useEffect(() => {
    axios.get('http://localhost:8000/tasks/')
      .then((response) => {
        setTasks(response.data);
        // const allAttributes = response.data.flatMap(task => Object.keys(task.attributes));
        const allAttributes = response.data.flatMap(task =>
            Object.entries(task.attributes)
              .filter(([key, value]) => typeof value === 'number' && !isNaN(value))
              .map(([key, value]) => key)
          );
        const uniqueAttributes = [...new Set(allAttributes)];
        setAvailableDimensions(uniqueAttributes);
        if (uniqueAttributes.length >= 3 && (!dimensions.x || !dimensions.y || !dimensions.z)) {
          setDimensions({ x: uniqueAttributes[0], y: uniqueAttributes[1], z: uniqueAttributes[2] });
        }
      })
      .catch(error => console.error(error));
  }, []);

  const data = tasks.map(task => ({
    x: task.attributes[dimensions.x],
    y: task.attributes[dimensions.y],
    z: task.attributes[dimensions.z],
    name: task.title,
    id: task.id,
    attributes: task.attributes,
  }));

  const handleDimensionChange = (e) => {
    setDimensions({
      ...dimensions,
      [e.target.name]: e.target.value,
    });
  };

  const handlePointClick = (dataPoint) => {
    setSelectedTask(dataPoint);
  };

  const CustomDot = (props) => {
    const { cx, cy, payload } = props;

    // Calculate min and max Z values from data
    const zValues = data.map(d => d.z);
    const minZ = Math.min(...zValues);
    const maxZ = Math.max(...zValues);

    // Set minRadius and maxRadius based on minZ and maxZ
    const minDisplayRadius = 5; // Minimum display radius in pixels
    const maxDisplayRadius = 10; // Maximum display radius in pixels

    // Normalize z value to radius
    let radius = minDisplayRadius;
    if (maxZ !== minZ) {
      radius = ((payload.z - minZ) / (maxZ - minZ)) * (maxDisplayRadius - minDisplayRadius) + minDisplayRadius;
    }

    return (
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill={theme.palette.primary.main}
        stroke="#fff"
        strokeWidth={1}
        onClick={() => handlePointClick(payload)}
        style={{ cursor: 'pointer' }}
      />
    );
  };

  return (
    <Box>
      <h1>Visualize Tasks</h1>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <FormControl fullWidth>
          <InputLabel>X Dimension</InputLabel>
          <Select
            name="x"
            value={dimensions.x}
            onChange={handleDimensionChange}
            label="X Dimension"
          >
            {availableDimensions.map(attr => (
              <MenuItem key={attr} value={attr}>{attr}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Y Dimension</InputLabel>
          <Select
            name="y"
            value={dimensions.y}
            onChange={handleDimensionChange}
            label="Y Dimension"
          >
            {availableDimensions.map(attr => (
              <MenuItem key={attr} value={attr}>{attr}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Z Dimension</InputLabel>
          <Select
            name="z"
            value={dimensions.z}
            onChange={handleDimensionChange}
            label="Z Dimension"
          >
            {availableDimensions.map(attr => (
              <MenuItem key={attr} value={attr}>{attr}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ width: '80%', height: 500 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid />
            <XAxis dataKey="x" name={dimensions.x} type="number" />
            <YAxis dataKey="y" name={dimensions.y} type="number" />
            <ZAxis dataKey="z" name={dimensions.z} type="number" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter
              name="Tasks"
              data={data}
              shape={<CustomDot />}
              isAnimationActive={false}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </Box>
      {selectedTask && (
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h5">
              <Link to={`/task/${selectedTask.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                {selectedTask.name}
              </Link>
            </Typography>
            <Typography variant="subtitle1">Attributes:</Typography>
            {Object.entries(selectedTask.attributes).map(([key, value]) => (
              <Typography key={key}>{`${key}: ${value}`}</Typography>
            ))}
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

export default Visualize;
