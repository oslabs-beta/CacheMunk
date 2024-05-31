import React, { useState } from 'react';
import { Button, Container, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer, Label } from 'recharts';

const FrequencyDistribution = () => {
  const [data, setData] = useState([]);
  const [blurb, setBlurb] = useState('');

  const fallbackData = {
    labels: [
      "0.5", "1", "1.5", "2", "2.5", "3", "3.5", "4",
      "4.5", "5", "5.5", "6", "6.5", "7", "7.5", "8",
      "8.5", "9", "9.5", "10"
    ],
    values: [
      0, 0, 0, 0, 0, 256, 346, 213, 135, 41, 4, 0,
      0, 0, 0, 0, 0, 1, 1, 0
    ]
  };

  const fetchData = async () => {
    try {
      const response = await fetch('https://4920a04e-c579-4e3e-8106-1c179e75ac0e.mock.pstmn.io/distribution');
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const responseData = await response.json();
      const labels = responseData.labels;
      const values = responseData.values;

      const formattedData = labels.map((label, index) => ({
        label: label,
        value: values[index]
      }));

      setData(formattedData);
      setBlurb('This histogram represents the frequency distribution of response times for a given set of requests.');
    } catch (error) {
      console.error("Error fetching data: ", error);
      setBlurb('Error fetching data. Using fallback data.');
      const formattedFallbackData = fallbackData.labels.map((label, index) => ({
        label: label,
        value: fallbackData.values[index]
      }));
      setData(formattedFallbackData);
    }
  };

  return (
    <Container>
      <Button variant="contained" color="primary" onClick={fetchData} style={{ marginBottom: '20px' }}>
        Fetch Data
      </Button>
      <Typography variant="h6" style={{ marginBottom: '20px' }}>
        {blurb}
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label">
            <Label value="Response time (milliseconds)" offset={-30} position="insideBottom" />
          </XAxis>
          <YAxis>
            <Label value="Number of Requests" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
          </YAxis>
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          <Bar dataKey="value" name="CacheMunk" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </Container>
  );
};

export default FrequencyDistribution;
