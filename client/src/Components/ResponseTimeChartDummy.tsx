import React from 'react';
import { Box, Button, Typography } from '@mui/material';

const ResponseTimeChart: React.FC = () => {
  const fetchAndLogResponseTime = () => {
    console.log('Fetch /cache and Update button clicked');
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
        <Typography variant='body1' color='textSecondary'>
          Chart will be displayed here
        </Typography>
      </Box>
      <Button
        variant='contained'
        color='primary'
        onClick={fetchAndLogResponseTime}
        style={{ marginTop: 16 }}
      >
        Fetch /cache and Update
      </Button>
    </Box>
  );
};

export default ResponseTimeChart;
