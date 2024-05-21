import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Box from './Components/Box';

const cache = ['test1', 'test2'];

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        <img className='image' alt='Image' src='/images/image-1.png' />
        <h1>Hi Cachemunk</h1>
        <Button className='button' variant='contained' color='primary'>
          Click Me
        </Button>
        <Switch {...cache} defaultChecked />
        <Box />
      </div>
    </ThemeProvider>
  );
};

export default App;
