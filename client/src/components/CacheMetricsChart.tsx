import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const CacheMetricsChart: React.FC = () => {
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);

  const fetchMetrics = async () => {
    try {
      const response = await fetch('http://localhost:3030/metrics');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.text();
      const hitsMatch = data.match(/cache_hits (\d+)/);
      const missesMatch = data.match(/cache_misses (\d+)/);
      if (hitsMatch) setHits(parseInt(hitsMatch[1], 10));
      if (missesMatch) setMisses(parseInt(missesMatch[1], 10));
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    }
  };

  useEffect(() => {
    fetchMetrics();

    // Cleanup function to destroy the chart instance on unmount
    return () => {
      Object.keys(ChartJS.instances).forEach((key) => {
        const chart = ChartJS.instances[key];
        if (chart) {
          chart.destroy();
        }
      });
    };
  }, []);

  const data = {
    labels: ['Cache Hits', 'Cache Misses'],
    datasets: [
      {
        label: 'Cache Metrics',
        data: [hits, misses],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  return (
    <div>
      <Doughnut data={data} />
      <button onClick={fetchMetrics}>Reload Data</button>
    </div>
  );
};

export default CacheMetricsChart;
