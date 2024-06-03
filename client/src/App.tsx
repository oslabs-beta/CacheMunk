import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, Tab, Tabs } from '@mui/material';
import theme from './theme';
import Header from './components/Header';
import CacheSwitch from './components/CacheSwitch';
import QueryBox from './components/QueryBox';
import SubmitButton from './components/SubmitButton';
import ResponseTimeChart from './components/ResponseTimeChart';
import CacheMetricsChart from './components/CacheMetricsChart';
import QueryResultBox from './components/QueryResultBox';
import SummaryGauges from './components/SummaryGauges';
import CustomSelectQuery from './components/CustomSelectQuery';
import CustomInsertQuery from './components/CustomInsertQuery';
import FrequencyDistribution from './components/FrequencyDistribution';
import ClearCacheButton from './components/ClearCacheButton';
import SummaryContainer from './components/SummaryContainer';

const App: React.FC = () => {
  const [cacheSwitch, setCacheSwitch] = useState<boolean>(true);
  const [querySelect, setQuerySelect] = useState<string>('');
  const [cacheHits, setCacheHits] = useState<number>(0);
  const [cacheMisses, setCacheMisses] = useState<number>(0);
  const [responseTimes, setResponseTimes] = useState<number[]>([]);
  const [queryResult, setQueryResult] = useState<any>({});
  const [tabValue, setTabValue] = useState(0);
  const [cacheSize, setCacheSize] = useState<number>(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header />
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="navigation tabs">
          <Tab label="Home" component={Link} to="/" />
          <Tab label="Summary" component={Link} to="/summary" />
        </Tabs>
        <Routes>
          <Route path="/" element={
            <Box display='flex' flexDirection='column' alignItems='center' padding={3} minHeight='30vh'>
              <Box display='flex' alignItems='center'>
                <CacheSwitch cacheSwitch={cacheSwitch} setCacheSwitch={setCacheSwitch} />
                <ClearCacheButton
                  setCacheHits={setCacheHits}
                  setCacheMisses={setCacheMisses}
                  setResponseTimes={setResponseTimes}
                  setQueryResult={setQueryResult}
                  setCacheSize={setCacheSize}
                />
              </Box>
              <Box padding={2} width='50%'>
                <QueryBox querySelect={querySelect} setQuerySelect={setQuerySelect} />
              </Box>
              <Box padding={2} width='50%' display='flex' justifyContent='center'>
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
                  cacheSize={cacheSize}
                  setCacheSize={setCacheSize}
                />
              </Box>
              <ResponseTimeChart responseTimes={responseTimes} />
              <CacheMetricsChart cacheHits={cacheHits} cacheMisses={cacheMisses} cacheSize={cacheSize}/>
              <QueryResultBox queryResult={queryResult} />
              <CustomSelectQuery
                cacheSwitch={cacheSwitch}
                cacheHits={cacheHits}
                setCacheHits={setCacheHits}
                cacheMisses={cacheMisses}
                setCacheMisses={setCacheMisses}
                responseTimes={responseTimes}
                setResponseTimes={setResponseTimes}
                cacheSize={cacheSize}
                setCacheSize={setCacheSize}
              />
              <CustomInsertQuery
                cacheHits={cacheHits}
                setCacheHits={setCacheHits}
                cacheMisses={cacheMisses}
                setCacheMisses={setCacheMisses}
                responseTimes={responseTimes}
                setResponseTimes={setResponseTimes}
              />
            </Box>
          } />
          <Route path="/summary" element={<SummaryContainer />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;

