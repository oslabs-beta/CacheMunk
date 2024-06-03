import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface StatusCardProps {
  cacheStatus: string;
}

const StatusCard: React.FC<StatusCardProps> = ({ cacheStatus }) => {
  const theme = useTheme();

  console.log("CacheStatus in CacheStatus component: ", cacheStatus)

  const getStatusColor = () => {
    switch (cacheStatus) {
      case 'hit':
        return '#FF6384';
      case 'miss':
        return '#36A2EB';
      default:
        return 'transparent';
    }
  };

  const imageSrc = cacheStatus === 'hit'
    ? '/images/happy_cachemunk_png_transparent.png'
    : cacheStatus === 'miss'
      ? '/images/sad_cachemunk_png_transparent.png'
      : '';

  return (
    <Card sx={{ backgroundColor: theme.palette.background.paper, color: getStatusColor() }}>
      <CardContent>
        <Typography variant="h6" component="div">
          {cacheStatus ? `Cache ${cacheStatus}!` : ''}
        </Typography>
        {cacheStatus && (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <img src={imageSrc} alt={cacheStatus} style={{ maxWidth: '100px', maxHeight: '100px' }} />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default StatusCard;
