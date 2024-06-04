import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import SummaryBarChart from './SummaryBarChart';
import FrequencyDistribution from './FrequencyDistribution';
import cacheDataJson from '../data/responseTimes-cache.json';
import noCacheDataJson from '../data/responseTimes-no-cache.json';

const fullBenchmarkDataCache: object = cacheDataJson;
const fullBenchmarkDataNoCache: object = noCacheDataJson;

const SummaryContainer: React.FC = () => {
  const [cacheData, setCacheData] = useState(null);
  const [noCacheData, setNoCacheData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCacheData = async () => {
    const requestBody = {
      clients: 5, // clients running in parallel
      requests: 500, // requests per client
      queryKey: 'SELECT_CITIES_COSTLY',
      'Cache-Control': null
    };
  
    try {
      const response = await fetch('/benchmark', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const result = await response.json();
      setCacheData(result);
    } catch (error) {
      console.error('Fetch cache data failed, using fallback data', error);
      setCacheData(fullBenchmarkDataCache);
    }
  };
  

  const fetchNoCacheData = async () => {
    const requestBody = {
      clients: 5, // clients running in parallel
      requests: 500, // requests per client
      queryKey: 'SELECT_CITIES_COSTLY',
      'Cache-Control': 'no-cache' 
    };
  
    try {
      const response = await fetch('/benchmark', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const result = await response.json();
      setNoCacheData(result);
    } catch (error) {
      console.error('Fetch no cache data failed, using fallback data', error);
      setNoCacheData(fullBenchmarkDataNoCache);
      console.log('noCacheData', noCacheData);
    }
  };
  

  const fetchData = async () => {
    setLoading(true);
  
    try {
      await fetchCacheData();
      await fetchNoCacheData();
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display='flex' flexDirection='column' alignItems='center' padding={3} minHeight='30vh'>
      <LoadingButton
        variant='contained'
        color='primary'
        onClick={fetchData}
        loading={loading}
      >
        Run Benchmark Test
      </LoadingButton>
      {cacheData && noCacheData && (
        <>
          <Box padding={5} width='100%'>
            <Typography variant='h6'>Summary Statistics</Typography>
            <SummaryBarChart cacheData={cacheData} noCacheData={noCacheData} />
          </Box>
          <Box padding={5} width='100%'>
            <Typography variant='h6'>Frequency Distribution</Typography>
            <FrequencyDistribution cacheData={cacheData} noCacheData={noCacheData} />
          </Box>
        </>
      )}
    </Box>
  );
};

export default SummaryContainer;

