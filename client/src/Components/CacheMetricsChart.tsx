import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Box, Typography } from '@mui/material';

ChartJS.register(ArcElement, Tooltip, Legend);

interface CacheMetricsChartProps {
  cacheHits: number;
  cacheMisses: number;
}

const CacheMetricsChart: React.FC<CacheMetricsChartProps> = ({ cacheHits, cacheMisses }) => {
  const data = {
    labels: ['Cache Hits', 'Cache Misses'],
    datasets: [
      {
        label: 'Cache Metrics',
        data: [cacheHits, cacheMisses],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
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
        Cache Metrics
      </Typography>
      <Box
        display='flex'
        alignItems='center'
        justifyContent='center'
        // border={1}
        // borderColor='grey.300'
        width='100%'
        height='100%'
      >
        <Doughnut data={data} options={{ maintainAspectRatio: false }} />
      </Box>
    </Box>
  );
};

export default CacheMetricsChart;
