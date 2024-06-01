import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';

// CustomSelectQuery component
const CustomSelectQuery = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // handleInputChange function
  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  // handleSubmit function
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission
    setError(''); // Clear any previous errors
    try {
      const response = await fetch('/data/cache/dynamic-select', { // Fetch the query from the backend
        method: 'POST', // Use POST method
        headers: {
          'Content-Type': 'application/json', // Set the content type to JSON
        },
        body: JSON.stringify({ query }), // Send the query as JSON
      });

      if (!response.ok) { // Check if the response is not ok
        throw new Error('Network response was not ok'); // Throw an error
      }

      const data = await response.json(); // Parse the response as JSON
      setResult(data); // Set the result state to the data
    } catch (err) {
      setError('Error executing query'); // Set the error state
    }
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
