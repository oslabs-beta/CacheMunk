import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import QueryBox from './Components/QueryBox';
import Header from './Components/Header';
import SubmitButton from './Components/SubmitButton';
import Box from '@mui/material/Box';
import CacheSwitch from './Components/CacheSwitch';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        <Header />
        <Box
          display='flex'
          flexDirection='column'
          alignItems='center'
          // justifyContent='center'
          padding={3}
          minHeight='100vh'
        >
          <CacheSwitch />
          <Box padding={2} width='50%'>
            <QueryBox />
          </Box>
          <SubmitButton />
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default App;
