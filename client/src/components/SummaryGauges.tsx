import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';  // import path - installed @mui/x-charts

const SummaryGauges = () => {
    const [gaugeValue1, setGaugeValue1] = useState(75);  // Initial dummy value
    const [gaugeValue2, setGaugeValue2] = useState(25);  // Initial dummy value

    const handleGenerateSummary = () => {
        // Random values for demonstration
        setGaugeValue1(Math.round(Math.random() * 100));
        setGaugeValue2(Math.round(Math.random() * 100));
    };

    return (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Gauge
                value={gaugeValue1}
                startAngle={-110}
                endAngle={110}
                sx={{
                    [`& .${gaugeClasses.valueText}`]: {
                        fontSize: 40,
                        transform: 'translate(0px, 0px)',
                    },
                    width: 300, height: 300
                }}
                text={({ value, valueMax }) => `${value} / ${valueMax}`}
            />
            <Gauge
                value={gaugeValue2}
                startAngle={-110}
                endAngle={110}
                sx={{
                    [`& .${gaugeClasses.valueText}`]: {
                        fontSize: 40,
                        transform: 'translate(0px, 0px)',
                    },
                    width: 300, height: 300
                }}
                text={({ value, valueMax }) => `${value} / ${valueMax}`}
            />
            <Button variant="contained" onClick={handleGenerateSummary}>
                Generate Summary
            </Button>
        </Box>
    );
};

export default SummaryGauges;

