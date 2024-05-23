import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';

interface QueryResultProps {
  queryresult: any;
}

const QueryResultBox: React.FC<QueryResultProps> = ({ queryresult }) => {
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
        Query Result
      </Typography>
      <Box
        display='flex'
        alignItems='center'
        justifyContent='center'
        border={1}
        borderColor='grey.300'
        width='100%'
        height='100%'
        style={{
          backgroundColor: 'white', // Set background color to white
        }}
      >
        <Typography variant='body1' color='textSecondary'>
          {JSON.stringify(queryresult, null, 2) || 'No data available'}
        </Typography>
      </Box>
    </Box>
  );
};

export default QueryResultBox;
