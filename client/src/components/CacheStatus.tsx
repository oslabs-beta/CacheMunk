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
      case 'CACHE_HIT':
        return '#36A2EB';
      case 'CACHE_MISS':
        return '#FF6384';
      default:
        return 'transparent';
    }
  };

  const imageSrc = cacheStatus === 'CACHE_HIT'
    ? '/images/happy_cachemunk_png_transparent.png'
    : cacheStatus === 'CACHE_MISS'
      ? '/images/sad_cachemunk_png_transparent.png'
      : null;

    const cacheMessage = cacheStatus === 'CACHE_HIT' 
    ? 'Cache Hit!' 
    : cacheStatus === 'CACHE_MISS' 
    ? 'Cache Miss!' 
    : null;

    const cardStyle = {
        width: '300px', 
        height: '200px', 
        backgroundColor: theme.palette.background.paper,
        color: getStatusColor(),
      };

    return (
        cacheStatus && (
          <Card sx={cardStyle}>
            <CardContent>
              <Typography variant="h6" component="div" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: '100%' }}>
                {cacheMessage}
              </Typography>
              <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <img src={imageSrc} alt={cacheMessage} style={{ maxWidth: '135x', maxHeight: '135px' }} />
              </Box>
            </CardContent>
          </Card>
        )
      );
      
};      

export default StatusCard;
