import React from 'react';
import { Box, Typography } from '@mui/material';

interface QueryResultProps {
  queryResult: Record<string, any> | null; // Specify a more concrete type
}

const QueryResultBox: React.FC<QueryResultProps> = ({ queryResult }) => {
  // Debugging: Log the queryresult to see what it contains at runtime
  console.log('Query Result:', queryResult);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      border={1}
      borderColor="grey.500"
      padding={2}
      width="100%"
      height="350px"
    >
      <Typography variant="h6" gutterBottom>
        Query Result
      </Typography>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        border={1}
        borderColor="grey.300"
        width="100%"
        height="100%"
        sx={{
          backgroundColor: 'white',
          overflow: 'auto',
        }}
      >
        <pre
          style={{
            margin: 0,
            padding: '10px',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            maxHeight: '100%',
            width: '100%',
          }}
        >
          <Typography variant="body1" color="black" component="span">
            {queryResult ? JSON.stringify(queryResult, null, 2) : 'No data available'}
          </Typography>
        </pre>
      </Box>
    </Box>
  );
};

export default QueryResultBox;

