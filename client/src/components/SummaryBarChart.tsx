import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box } from '@mui/material';

const SummaryBarChart = ({ cacheData, noCacheData }) => {
    const data = [
        { name: 'Min', Cache: parseFloat(cacheData.min.toFixed(3)), 'No Cache': parseFloat(noCacheData.min.toFixed(3)) },
        { name: 'Max', Cache: parseFloat(cacheData.max.toFixed(3)), 'No Cache': parseFloat(noCacheData.max.toFixed(3)) },
        { name: 'Mean', Cache: parseFloat(cacheData.mean.toFixed(3)), 'No Cache': parseFloat(noCacheData.mean.toFixed(3)) },
        { name: 'Stdev', Cache: parseFloat(cacheData.stddev.toFixed(3)), 'No Cache': parseFloat(noCacheData.stddev.toFixed(3)) },
        { name: 'P50', Cache: parseFloat(cacheData.p50.toFixed(3)), 'No Cache': parseFloat(noCacheData.p50.toFixed(3)) },
        { name: 'P95', Cache: parseFloat(cacheData.p95.toFixed(3)), 'No Cache': parseFloat(noCacheData.p95.toFixed(3)) },
        { name: 'P99', Cache: parseFloat(cacheData.p99.toFixed(3)), 'No Cache': parseFloat(noCacheData.p99.toFixed(3)) },
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


