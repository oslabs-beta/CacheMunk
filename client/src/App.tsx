import React, { useState, useEffect } from 'react';
import CacheMetricsChart from './components/CacheMetricsChart';
import ResponseTimeChart from './components/ResponseTimeChart';

const App: React.FC = () => {
  const [cacheHits, setCacheHits] = useState(0);
  const [cacheMisses, setCacheMisses] = useState(0);

  const fetchMetrics = async () => {
    try {
      const response = await fetch('http://localhost:3030/metrics');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.text();
      const hitsMatch = data.match(/cache_hits (\d+)/);
      const missesMatch = data.match(/cache_misses (\d+)/);
      if (hitsMatch) setCacheHits(parseInt(hitsMatch[1], 10));
      if (missesMatch) setCacheMisses(parseInt(missesMatch[1], 10));
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return (
    <div>
      <header>
        <h1>{`Hi Ocelots! We're making Cachemunk`}</h1>
        <p>{`Here's where our amazing dashboard is going to go`}</p>
      </header>
      <section>
        <h1>Cache Metrics</h1>
        <div className='chart-container'>
          <CacheMetricsChart hits={cacheHits} misses={cacheMisses} />
        </div>
        <button onClick={fetchMetrics}>Reload Data</button>
      </section>
      <section>
        <h1>Response Times</h1>
        <div className='chart-container'>
          <ResponseTimeChart />
        </div>
      </section>
    </div>
  );
};

export default App;
