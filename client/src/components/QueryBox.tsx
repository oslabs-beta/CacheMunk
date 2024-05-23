import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface QueryBoxProps {
  querySelect: string;
  setQuerySelect: (newString: string) => void;
}

const BasicSelect: React.FC<QueryBoxProps> = ({ querySelect, setQuerySelect }) => {
  const handleChange = (event: SelectChangeEvent) => {
    setQuerySelect(event.target.value as string);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id='demo-simple-select-label'>Query Type</InputLabel>
        <Select
          labelId='demo-simple-select-label'
          id='demo-simple-select'
          value={querySelect}
          label='Query Type'
          onChange={handleChange}
        >
          <MenuItem value={'insert'}>Insert Query</MenuItem>
          <MenuItem value={'select'}>Select Query</MenuItem>
          <MenuItem value={'costly'}>Costly Select Query</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default BasicSelect;
