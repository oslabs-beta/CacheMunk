import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Box, Typography } from '@mui/material';
import 'chart.js/auto';

interface ResponseTimeChartProps {
  responseTimes: number[]; // Array of response times in milliseconds
}

const ResponseTimeChart: React.FC<ResponseTimeChartProps> = ({ responseTimes }) => {
  const data = {
    labels: responseTimes.map((_, index) => `Request ${index + 1}`),
    datasets: [
      {
        label: 'Response Time (ms)',
        data: responseTimes,
        backgroundColor: 'rgba(75, 192, 192, 0.4)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  return (
    <Box
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      border={1}
      borderColor='grey.500'
      padding={2}
      width='100%'
      height='350px'
    >
      <Typography variant='h6' gutterBottom>
        Response Times for /cache Endpoint
      </Typography>
      <Box
        display='flex'
        alignItems='center'
        justifyContent='center'
        border={1}
        borderColor='grey.300'
        width='100%'
        height='100%'
      >
        <Bar data={data} options={options} />
      </Box>
    </Box>
  );
};

export default ResponseTimeChart;
