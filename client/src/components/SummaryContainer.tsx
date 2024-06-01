import React from 'react';
import { Box } from '@mui/material';
import SummaryGauges from './SummaryGauges';
import FrequencyDistribution from './FrequencyDistribution';

const SummaryContainer: React.FC = () => {
  return (
    <Box display='flex' flexDirection='column' alignItems='center' padding={3} minHeight='30vh'>
      <Box padding={2} width='100%'>
        <SummaryGauges />
      </Box>
      <Box padding={2} width='100%'>
        <FrequencyDistribution />
      </Box>
    </Box>
  );
};

export default SummaryContainer;
