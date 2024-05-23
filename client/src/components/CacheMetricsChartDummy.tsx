import React from 'react';
import { Box, Button, Typography } from '@mui/material';

const CacheMetricsChart: React.FC = () => {
  const fetchMetrics = () => {
    console.log('Reload Data button clicked');
    // Dummy function to simulate fetch logic
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
        border={1}
        borderColor='grey.300'
        width='100%'
        height='100%'
      >
        <Typography variant='body1' color='textSecondary'>
          Doughnut chart will be displayed here
        </Typography>
      </Box>
      <Button variant='contained' color='primary' onClick={fetchMetrics} style={{ marginTop: 16 }}>
        Reload Data
      </Button>
    </Box>
  );
};

export default CacheMetricsChart;
