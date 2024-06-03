import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js/auto';
import { Box, Typography, Card, CardContent, useTheme } from '@mui/material';

ChartJS.register(ArcElement, Tooltip, Legend);

interface CacheMetricsChartProps {
  cacheHits: number;
  cacheMisses: number;
  cacheSize: number; // Add cacheSize to props
  cacheStatus: string; // Add cacheStatus to props
}

const MetricCard: React.FC<{ title: string; value: number }> = ({ title, value }) => {
  const theme = useTheme();
  return (
    <Card sx={{ backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary }}>
      <CardContent>
        <Typography variant="h6" component="div" style={{ whiteSpace: 'pre-line' }}>
          {title}
        </Typography>
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <Typography variant="h4" component="div">
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};


const CacheMetricsChart: React.FC<CacheMetricsChartProps> = ({ cacheHits, cacheMisses, cacheSize }) => {
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

  const theme = useTheme();

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
      sx={{ backgroundColor: theme.palette.background.default, color: theme.palette.text.primary }}
    >
      <Typography variant='h6' gutterBottom>
        Cache Metrics
      </Typography>
      <Box
        display='flex'
        alignItems='center'
        justifyContent='space-between'
        width='100%'
        height='100%'
      >
        <Box
          display='flex'
          alignItems='center'
          justifyContent='center'
          width='50%'
          height='100%'
        >
          <Doughnut data={data} options={{ maintainAspectRatio: false }} />
        </Box>
        <Box
          display='flex'
          alignItems='center'
          justifyContent='center'
          width='50%'
          height='100%'
          paddingLeft={2}
        >
          <MetricCard title={'number of query keys\nin the Redis cache'} value={cacheSize} />
        </Box>
      </Box>
    </Box>
  );
};

export default CacheMetricsChart;
