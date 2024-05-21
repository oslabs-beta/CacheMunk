import React, { useState, useEffect } from 'react';
import CacheMetricsChart from './components/CacheMetricsChart';
import ResponseTimeChart from './components/ResponseTimeChart';

const App: React.FC = () => {
  return (
    <div>
      <header>
        <h1>{`Hi Ocelots! We're making Cachemunk`}</h1>
        <p>{`Here's where our amazing dashboard is going to go`}</p>
      </header>
      <div className='main-content'>
        <section className='section-container'>
          <h1>Cache Metrics</h1>
          <div className='doughnut-chart-container'>
            <CacheMetricsChart />
          </div>
        </section>
        <section className='section-container'>
          <h1>Response Times</h1>
          <div className='bar-chart-container'>
            <ResponseTimeChart />
          </div>
        </section>
      </div>
    </div>
  );
};

export default App;
