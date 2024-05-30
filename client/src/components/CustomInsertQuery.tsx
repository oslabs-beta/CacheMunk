import React, { useState } from 'react';
import { Box, Button, TextField, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const stateCodes = {
  "AK": 1400,
  "AL": 1456,
  "AR": 1444,
  "AZ": 1434,
  "CA": 1416,
  "CO": 1450,
  "CT": 1435,
  "DC": 1437,
  "DE": 1399,
  "FL": 1436,
  "GA": 1455,
  "HI": 1411,
  "IA": 1459,
  "ID": 1460,
  "IL": 1425,
  "IN": 1440,
  "KS": 1406,
  "KY": 1419,
  "LA": 1457,
  "MA": 1433,
  "MD": 1401,
  "ME": 1453,
  "MI": 1426,
  "MN": 1420,
  "MO": 1451,
  "MS": 1430,
  "MT": 1446,
  "NC": 1447,
  "ND": 1418,
  "NE": 1408,
  "NH": 1404,
  "NJ": 1417,
  "NM": 1423,
  "NV": 1458,
  "NY": 1452,
  "OH": 4851,
  "OK": 1421,
  "OR": 1415,
  "PA": 1422,
  "PR": 1449,
  "RI": 1461,
  "SC": 1443,
  "SD": 1445,
  "TN": 1454,
  "TX": 1407,
  "UT": 1414,
  "VA": 1427,
  "VT": 1409,
  "WA": 1462,
  "WI": 1441,
  "WV": 1429,
  "WY": 1442
};

const getRandomCoordinates = () => {
  const latitude = (Math.random() * (49.384358 - 24.396308) + 24.396308).toFixed(6);
  const longitude = (Math.random() * (-66.93457 - -125.00165) + -125.00165).toFixed(6);
  return { latitude, longitude };
};

const NewEntryForm = () => {
  const [formData, setFormData] = useState({
    id: '153725',
    name: '',
    state_code: '',
    country_id: 233,
    country_code: 'US',
    latitude: '',
    longitude: '',
    flag: true,
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
      state_id: name === 'state_code' ? stateCodes[value] : formData.state_id,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess(false);

    const { latitude, longitude } = getRandomCoordinates();
    const submissionData = {
      ...formData,
      latitude,
      longitude,
    };

    try {
      const response = await fetch('https://4920a04e-c579-4e3e-8106-1c179e75ac0e.mock.pstmn.io/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setSuccess(true);
    } catch (err) {
      setError('Error submitting form');
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" padding={2}>
      <Typography variant="h6" gutterBottom>
        Add a New City in the United States
      </Typography>
      <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" width="100%" maxWidth="600px">
        <TextField
          label="ID"
          name="id"
          type="number"
          variant="outlined"
          fullWidth
          value={formData.id}
          onChange={handleChange}
          margin="normal"
          helperText="Choose an integer greater than 153725"
          defaultValue={153725}
        />
        <TextField
          label="Name"
          name="name"
          type="text"
          variant="outlined"
          fullWidth
          value={formData.name}
          onChange={handleChange}
          margin="normal"
          helperText="Choose the name of your new city"
        />
        <FormControl variant="outlined" margin="normal" fullWidth>
          <InputLabel>State Code</InputLabel>
          <Select
            name="state_code"
            value={formData.state_code}
            onChange={handleChange}
            label="State Code"
          >
            {Object.keys(stateCodes).map((code) => (
              <MenuItem key={code} value={code}>
                {code}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </Box>
      {error && <Typography color="error">{error}</Typography>}
      {success && <Typography color="primary">Form submitted successfully!</Typography>}
    </Box>
  );
};

export default NewEntryForm;
