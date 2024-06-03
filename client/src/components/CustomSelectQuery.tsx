import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';

//write interface for CustomSelectQueryProps
interface CustomSelectQueryProps {
  cacheSwitch: boolean;
  setCacheHits: React.Dispatch<React.SetStateAction<number>>;
  cacheMisses: number;
  setCacheMisses: React.Dispatch<React.SetStateAction<number>>;
  responseTimes: number[];
  setResponseTimes: React.Dispatch<React.SetStateAction<number[]>>;
  cacheSize: number;
  setCacheSize: React.Dispatch<React.SetStateAction<number>>;
}

// CustomSelectQuery component
const CustomSelectQuery: React.FC<CustomSelectQueryProps> = ({
  cacheSwitch,
  setCacheHits,
  cacheMisses,
  setCacheMisses,
  responseTimes,
  setResponseTimes,
  cacheSize,
  setCacheSize,
}) => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // fetchChartData function
  const fetchChartData = async () => {
    try {
      const cacheHitMissReponse = await fetch('/cache-analytics'); // fetches from endpoint
      const cacheHitMissData = await cacheHitMissReponse.json(); // converts to Javascript object
      setCacheHits(cacheHitMissData.cacheHits); // uses key to retrieve value and set state
      setCacheMisses(cacheHitMissData.cacheMisses);

      const responseTimesResponse = await fetch('/cache-response-times');
      const responseTimesData = await responseTimesResponse.json();
      setResponseTimes(responseTimesData);

      const cacheSizeResponse = await fetch('/cacheSize');
      const cacheSizeData = await cacheSizeResponse.json();
      setCacheSize(cacheSizeData);
    } catch (error) {
      console.error('Error fetching Chart Data:', error);
    }
  };

  // handleInputChange function
  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  // handleSubmit function
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission
    setError(''); // Clear any previous errors

    const endpoint = cacheSwitch ? '/data/cache/dynamic-select' : '/data/no-cache/dynamic-select';

    try {
      const response = await fetch(endpoint, { // Fetch the data from the endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Specify the content type
        },
        body: JSON.stringify({ query }), // Send the query as JSON
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json(); // Parse the response as JSON
      setResult(data); // Set the result state
    } catch (err) {
      setError('Error executing query');
    }

    // Fetch Chart Data after executing the query
    fetchChartData();
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" padding={2}>
      <Typography variant="h6" gutterBottom>
        Custom Select Query
      </Typography>
      <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" width="100%" maxWidth="600px">
        <TextField
          label="Enter your SELECT query"
          variant="outlined"
          fullWidth
          value={query}
          onChange={handleInputChange}
          multiline
          rows={4}
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Submit Query
        </Button>
      </Box>
      {error && <Typography color="error">{error}</Typography>}
      {result && (
        <Box marginTop={4} width="100%">
          <Typography variant="h6">Query Result</Typography>
          <pre // Display the result in a pre tag
            style={{
              backgroundColor: 'white',
              overflow: 'auto', // creates the scrollbar
              padding: '10px', // padding around the text
              border: '1px solid #ccc', // border around the text
              whiteSpace: 'pre-wrap', // keep the formatting
              wordWrap: 'break-word', // break the text
              height: '300px', // fixed height
              maxHeight: '300px', // max height
              color: 'black',
            }}
          >
            {JSON.stringify(result, null, 2)} {/* Display the result as JSON */}
          </pre>
        </Box>
      )}
    </Box>
  );
};

export default CustomSelectQuery;
