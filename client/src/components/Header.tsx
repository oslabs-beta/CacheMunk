import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

function Header() {
  return (
    <AppBar position='static'>
      <Toolbar>
        <Box display='flex' alignItems='center' width='100%'>
          <img src='/images/circle_logo.png' alt='logo' style={{ marginRight: 16, height: 150 }} />
          <Box display='flex' flexDirection='column' alignItems='flex-start'>
            <Typography variant='h4' style={{ fontWeight: 'bold' }}>
              CacheMunk
            </Typography>
            <Typography variant='subtitle1'>
              Performance-Optimized Caching Middleware for Node.js: Efficiently abstracts Redis to
              cache RDBMS query results, enhancing Node.js applications with sub-millisecond
              latency. Designed for high-demand production environments.
            </Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
