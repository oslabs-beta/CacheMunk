import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box } from '@mui/material';

const SummaryBarChart = ({ cacheData, noCacheData }) => {
    const data = [
        { name: 'Min', Cache: cacheData.min, 'No Cache': noCacheData.min },
        // { name: 'Max', Cache: cacheData.max, 'No Cache': noCacheData.max },
        { name: 'Avg', Cache: cacheData.avg, 'No Cache': noCacheData.avg },
        { name: 'Stdev', Cache: cacheData.stdev, 'No Cache': noCacheData.stdev },
        { name: 'P50', Cache: cacheData.p50, 'No Cache': noCacheData.p50 },
        { name: 'P95', Cache: cacheData.p95, 'No Cache': noCacheData.p95 },
        { name: 'P99', Cache: cacheData.p99, 'No Cache': noCacheData.p99 },
    ];

    return (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <ResponsiveContainer width="100%" height={700}>
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis 
                        label={{ value: 'Milliseconds', angle: -90, position: 'insideLeft' }} 
                    />
                    <Tooltip />
                    <Legend verticalAlign="top" />
                    <Bar dataKey="Cache" fill="#8884d8" />
                    <Bar dataKey="No Cache" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default SummaryBarChart;


