// import React, { useState } from 'react';
// import { Box, Button, CircularProgress } from '@mui/material';
// import Plot from 'react-plotly.js';

// const LatencyTest = () => {
//     const [loading, setLoading] = useState(false);
//     const [latencies, setLatencies] = useState([]);
//     const [percentiles, setPercentiles] = useState({ p50: 0, p90: 0, p99: 0 });

//     const handleRunTest = async () => {
//         setLoading(true);

//         try {
//             // Make an HTTP request to the backend endpoint to run the load test
//             const response = await fetch('/cache-response-times2');
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             const data = await response.json();

//             // Extract latency data from the results
//             const latencies = data.intermediate.map(result => result.latency);
//             setLatencies(latencies);

//             // Calculate percentiles
//             const calculatePercentiles = (arr, percentiles) => {
//                 arr.sort((a, b) => a - b);
//                 return percentiles.map(p => {
//                     const index = Math.ceil(p / 100 * arr.length) - 1;
//                     return arr[index];
//                 });
//             };

//             const [p50, p90, p99] = calculatePercentiles(latencies, [50, 90, 99]);
//             setPercentiles({ p50, p90, p99 });

//         } catch (error) {
//             console.error('Error running load test:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
//             <Button variant="contained" onClick={handleRunTest} disabled={loading}>
//                 Run Load Test
//             </Button>
//             {loading && <CircularProgress />}
//             {!loading && latencies.length > 0 && (
//                 <>
//                     <Plot
//                         data={[
//                             {
//                                 x: latencies,
//                                 type: 'histogram',
//                             },
//                         ]}
//                         layout={{
//                             title: 'Latency Distribution',
//                             xaxis: { title: 'Latency (ms)' },
//                             yaxis: { title: 'Frequency' },
//                         }}
//                     />
//                     <Box sx={{ mt: 2 }}>
//                         <div>P50: {percentiles.p50} ms</div>
//                         <div>P90: {percentiles.p90} ms</div>
//                         <div>P99: {percentiles.p99} ms</div>
//                     </Box>
//                 </>
//             )}
//         </Box>
//     );
// };

// import React, { useState } from 'react';
// import { Box, Button, CircularProgress } from '@mui/material';
// import Plot from 'react-plotly.js';
// import results from '../../../results.json'; // Adjust the path if necessary

// const LatencyTest = () => {
//     const [loading, setLoading] = useState(false);
//     const [latencies, setLatencies] = useState([]);
//     const [percentiles, setPercentiles] = useState({ p50: 0, p90: 0, p99: 0 });

//     const handleRunTest = async () => {
//         setLoading(true);

//         try {
//             // Extract latency data from the results
//             const latencies = results.intermediate.map(result => result.summaries['http.response_time'].p50);
//             setLatencies(latencies);
//             console.log(latencies)

//             // Calculate percentiles
//             const calculatePercentiles = (arr, percentiles) => {
//                 arr.sort((a, b) => a - b);
//                 return percentiles.map(p => {
//                     const index = Math.ceil(p / 100 * arr.length) - 1;
//                     return arr[index];
//                 });
//             };

//             const [p50, p90, p99] = calculatePercentiles(latencies, [50, 90, 99]);
//             setPercentiles({ p50, p90, p99 });

//         } catch (error) {
//             console.error('Error running load test:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
//             <Button variant="contained" onClick={handleRunTest} disabled={loading}>
//                 Run Load Test
//             </Button>
//             {loading && <CircularProgress />}
//             {!loading && latencies.length > 0 && (
//                 <>
//                     <Plot
//                         data={[
//                             {
//                                 x: latencies,
//                                 type: 'histogram',
//                             },
//                         ]}
//                         layout={{
//                             title: 'Latency Distribution',
//                             xaxis: { title: 'Latency (ms)' },
//                             yaxis: { title: 'Frequency' },
//                         }}
//                     />
//                     <Box sx={{ mt: 2 }}>
//                         <div>P50: {percentiles.p50} ms</div>
//                         <div>P90: {percentiles.p90} ms</div>
//                         <div>P99: {percentiles.p99} ms</div>
//                     </Box>
//                 </>
//             )}
//         </Box>
//     );
// };

import React, { useState } from 'react';
import { Box, Button, CircularProgress } from '@mui/material';
import Plot from 'react-plotly.js';
import results from '../../../results.json'; // Adjust the path if necessary

const LatencyTest = () => {
    const [loading, setLoading] = useState(false);
    const [latencies, setLatencies] = useState([]);
    const [percentiles, setPercentiles] = useState({ p50: 0, p90: 0, p99: 0 });

    const generateSyntheticLatencies = (summary) => {
        const latencies = [];
        const { count, min, max, mean } = summary;
        for (let i = 0; i < count; i++) {
            // Generate a random latency value based on min and max, centered around mean
            const latency = Math.random() * (max - min) + min;
            latencies.push(latency);
        }
        return latencies;
    };

    const handleRunTest = async () => {
        setLoading(true);

        try {
            // Generate synthetic latency data from summaries
            const latencies = results.intermediate.flatMap(result => generateSyntheticLatencies(result.summaries['http.response_time']));
            setLatencies(latencies);

            // Calculate percentiles
            const calculatePercentiles = (arr, percentiles) => {
                arr.sort((a, b) => a - b);
                return percentiles.map(p => {
                    const index = Math.ceil(p / 100 * arr.length) - 1;
                    return arr[index];
                });
            };

            const [p50, p90, p99] = calculatePercentiles(latencies, [50, 90, 99]);
            setPercentiles({ p50, p90, p99 });

        } catch (error) {
            console.error('Error running load test:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Button variant="contained" onClick={handleRunTest} disabled={loading}>
                Run Load Test
            </Button>
            {loading && <CircularProgress />}
            {!loading && latencies.length > 0 && (
                <>
                    <Plot
                        data={[
                            {
                                x: latencies,
                                type: 'histogram',
                            },
                        ]}
                        layout={{
                            title: 'Latency Distribution',
                            xaxis: { title: 'Latency (ms)' },
                            yaxis: { title: 'Frequency' },
                        }}
                    />
                    <Box sx={{ mt: 2 }}>
                        <div>P50: {percentiles.p50.toFixed(2)} ms</div>
                        <div>P90: {percentiles.p90.toFixed(2)} ms</div>
                        <div>P99: {percentiles.p99.toFixed(2)} ms</div>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default LatencyTest;


