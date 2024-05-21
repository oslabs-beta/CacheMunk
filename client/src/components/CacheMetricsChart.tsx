import React, { useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface CacheMetricsChartProps {
  hits: number;
  misses: number;
}

const CacheMetricsChart: React.FC<CacheMetricsChartProps> = ({ hits, misses }) => {
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

  useEffect(() => {
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

  return <Doughnut data={data} />;
};

export default CacheMetricsChart;
