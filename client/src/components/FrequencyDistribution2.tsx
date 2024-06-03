import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer, Label } from 'recharts';

const FrequencyDistribution = ({ cacheData, noCacheData }) => {
  const formatData = (data) => {
    return data.labels.map((label, index) => ({
      label: label,
      cacheValue: data.values[index],
      noCacheValue: noCacheData.values[index] || 0,
    }));
  };

  const data = formatData(cacheData);

  // Custom tick formatter function to round the labels
  const tickFormatter = (tick) => {
    return Math.round(tick);
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <Typography variant="h6" style={{ marginBottom: '20px' }}>
        This histogram represents the frequency distribution of response times for cache and no-cache data.
      </Typography>
      <ResponsiveContainer width="100%" height={700}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" tickFormatter={tickFormatter} interval={5}>
            <Label value="Response time (milliseconds)" offset={-30} position="insideBottom" />
          </XAxis>
          <YAxis>
            <Label value="Number of Requests" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
          </YAxis>
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          <Bar dataKey="cacheValue" name="Cache" fill="#8884d8" stackId="a" />
          <Bar dataKey="noCacheValue" name="No Cache" fill="#82ca9d" stackId="a" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default FrequencyDistribution;
