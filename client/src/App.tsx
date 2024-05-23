import React, { useState, useEffect } from 'react';
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
import ResponseTimeChartDummy from './Components/ResponseTimeChartDummy';
import CacheMetricsChartDummy from './Components/CacheMetricsChartDummy';
import QueryResultBox from './Components/QueryResultBox';
import CacheMetricsChart from './Components/CacheMetricsChart';
import ResponseTimeChart from './Components/ResponseTimeChart';

const App: React.FC = () => {
  //State to manage the cache switch is on or off
  const [cacheSwitch, setCacheSwitch] = useState<boolean>(true);

  //QueryDropown state
  const [querySelect, setQuerySelect] = useState<string>('');

  const [cacheHits, setCacheHits] = useState<number>(0);
  const [cacheMisses, setCacheMisses] = useState<number>(0);
  const [responseTimes, setResponseTimes] = useState<number[]>([]);
  const [queryResult, setQueryResult] = useState<any>({});

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
          minHeight='30vh'
        >
          <CacheSwitch cacheSwitch={cacheSwitch} setCacheSwitch={setCacheSwitch} />
          <Box padding={2} width='50%'>
            <QueryBox querySelect={querySelect} setQuerySelect={setQuerySelect} />
          </Box>
          <SubmitButton
            cacheSwitch={cacheSwitch}
            querySelect={querySelect}
            cacheHits={cacheHits}
            setCacheHits={setCacheHits}
            cacheMisses={cacheMisses}
            setCacheMisses={setCacheMisses}
            responseTimes={responseTimes}
            setResponseTimes={setResponseTimes}
            queryResult={queryResult}
            setQueryResult={setQueryResult}
          />
        </Box>
        <ResponseTimeChart responseTimes={responseTimes} />
        <CacheMetricsChart cacheHits={cacheHits} cacheMisses={cacheMisses} />
        <QueryResultBox queryresult={queryResult}/>
      </div>
    </ThemeProvider>
  );
};

export default App;
