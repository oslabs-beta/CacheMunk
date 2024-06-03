import React from 'react';
import Plot from 'react-plotly.js';
import { Box, Typography, useTheme } from '@mui/material';

const calculateBins = (data, binSize) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const bins = [];

  for (let i = min; i <= max; i += binSize) {
    bins.push(i);
  }

  return bins;
};

const FrequencyDistribution = ({ cacheData, noCacheData, binSize = 0.1 }) => {
  const theme = useTheme(); // Use the theme hook
  const combinedData = [...cacheData.responseTimes, ...noCacheData.responseTimes];
  const bins = calculateBins(combinedData, binSize);

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, backgroundColor: theme.palette.background.default }}>
      <Typography variant="h6" style={{ marginBottom: '20px', color: theme.palette.text.primary }}>
        This histogram represents the frequency distribution of response times for cache and no-cache data.
      </Typography>
      <Plot
        style={{ width: "100%", height: "100%" }}
        data={[
          {
            x: cacheData.responseTimes,
            type: 'histogram',
            name: 'Cache',
            marker: { color: '#8884d8' },
            opacity: 0.7,
            autobinx: false,
            xbins: {
              start: bins[0],
              end: bins[bins.length - 1],
              size: binSize,
            },
          },
          {
            x: noCacheData.responseTimes,
            type: 'histogram',
            name: 'No Cache',
            marker: { color: '#82ca9d' },
            opacity: 0.7,
            autobinx: false,
            xbins: {
              start: bins[0],
              end: bins[bins.length - 1],
              size: binSize,
            },
          },
        ]}
        layout={{
          height: 700,  // Set height here
          title: {
            text: 'Frequency Distribution of Response Times',
            font: {
              color: theme.palette.text.primary
            }
          },
          paper_bgcolor: theme.palette.background.paper,
          plot_bgcolor: theme.palette.background.paper,
          xaxis: {
            title: 'Response Time (seconds, log scale)',
            type: 'log',  // Uncomment to set the x-axis to logarithmic scale
            color: theme.palette.text.primary,
            gridcolor: theme.palette.text.secondary
          },
          yaxis: {
            title: 'Number of Requests',
            // type: 'log',  // Uncomment to set the y-axis to logarithmic scale
            color: theme.palette.text.primary,
            gridcolor: theme.palette.text.secondary
          },
          bargap: 0.05,
          barmode: 'stack',
        }}
        config={{ responsive: true }}
      />
    </Box>
  );
};

export default FrequencyDistribution;

