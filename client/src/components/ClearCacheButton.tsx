import React from 'react';
import { Button } from '@mui/material';

interface ClearCacheButtonProps {
  setCacheHits: React.Dispatch<React.SetStateAction<number>>;
  setCacheMisses: React.Dispatch<React.SetStateAction<number>>;
  setResponseTimes: React.Dispatch<React.SetStateAction<number[]>>;
  setQueryResult: React.Dispatch<React.SetStateAction<any>>;
  setCacheSize?: React.Dispatch<React.SetStateAction<number>>;
  label?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const ClearCacheButton: React.FC<ClearCacheButtonProps> = ({
  setCacheHits,
  setCacheMisses,
  setResponseTimes,
  setQueryResult,
  setCacheSize,
  label = 'Clear Cache',
  onClick,
  disabled = false,
}) => {
  const handleClick = async () => {
    try {
      await fetch('/deleteCache', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setCacheHits(0);
      setCacheMisses(0);
      setResponseTimes([]);
      setQueryResult({});
      setCacheSize(0);

      if (onClick) {
        onClick();
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  };

  return (
    <Button variant='contained' color='secondary' onClick={handleClick} disabled={disabled}>
      {label}
    </Button>
  );
};

export default ClearCacheButton;
