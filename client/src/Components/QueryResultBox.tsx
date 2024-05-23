import React from 'react';
import { Box, Typography } from '@mui/material';

interface QueryResultProps {
  queryresult: Record<string, any> | null; // Specify a more concrete type
}

const QueryResultBox: React.FC<QueryResultProps> = ({ queryresult }) => (
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
      // sx={{
      //   backgroundColor: 'white',
      //   overflow: 'auto',
      // }}
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
            {queryresult ? JSON.stringify(queryresult, null, 2) : 'No data available'}
          </Typography>
        </pre>
      </Box>
    </Box>
  );

export default QueryResultBox;

