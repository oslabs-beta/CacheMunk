// components/ResponseTimeChart.tsx
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2'; // for rendering bar charts
import 'chart.js/auto'; // register chart.js components

const ResponseTimeChart: React.FC = () => {
  // defined as functional component type
  const [responseTimes, setResponseTimes] = useState<number[]>([]); // state variable initialized to empty array of numbers

  // asynchronous function that fetches response times from specified endpoint
  const fetchResponseTimes = async () => {
    try {
      const response = await fetch('http://localhost:3030/cache-response-times');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setResponseTimes(data); // setter function updates responseTimes state
    } catch (error) {
      console.error('Failed to fetch response times:', error);
    }
  };

  const fetchAndLogResponseTime = async () => {
    try {
      const start = performance.now(); // performance.now method start
      const response = await fetch('http://localhost:3030/data/cache'); // time for this fetch request is measured
      const end = performance.now(); // performance.now method end
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const newResponseTime = end - start; // calculate time
      setResponseTimes((prev) => [...prev, newResponseTime]); // adds the new time to the end of the response times array
    } catch (error) {
      console.error('Failed to fetch /cache:', error);
    }
  };

  useEffect(() => {
    fetchResponseTimes();
  }, []);

  const data = {
    labels: responseTimes.map((_, index) => `Request ${index + 1}`),
    datasets: [
      {
        label: 'Response Time (ms)',
        data: responseTimes,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <h2>Response Times for /cache Endpoint</h2>
      <Bar data={data} options={options} />
      <button onClick={fetchAndLogResponseTime}>Fetch /cache and Update</button>
    </div>
  );
};

export default ResponseTimeChart;
