import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';

interface SubmitButtonProps {
  cacheSwitch: boolean;
  querySelect: string;
  label?: string;
  onClick?: () => void;
  disabled?: boolean;
  cacheHits: number;
  cacheMisses: number;
  responseTimes: number[];
  queryResult: any;
  cacheSize: number;
  cacheStatus: string;
  setCacheHits: React.Dispatch<React.SetStateAction<number>>;
  setCacheMisses: React.Dispatch<React.SetStateAction<number>>;
  setResponseTimes: React.Dispatch<React.SetStateAction<number[]>>;
  setQueryResult: React.Dispatch<React.SetStateAction<any>>;
  setCacheSize: React.Dispatch<React.SetStateAction<number>>;
  setCacheStatus: React.Dispatch<React.SetStateAction<string>>;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  cacheSwitch,
  querySelect,
  cacheHits,
  cacheMisses,
  responseTimes,
  cacheStatus,
  queryResult,
  cacheSize,
  setCacheHits,
  setCacheMisses,
  setResponseTimes,
  setQueryResult,
  setCacheSize,
  setCacheStatus,
  label = 'Submit',
  onClick,
  disabled = false,
}) => {
  // const showNotification = () => {
  //   if (Notification.permission === 'granted') {
  //     new Notification('Button was clicked');
  //   } else if (Notification.permission !== 'denied') {
  //     Notification.requestPermission().then((permission) => {
  //       if (permission === 'granted') {
  //         new Notification('Button was clicked');
  //       }
  //     });
  //   }
  // };

  const fetchChartData = async () => {
    try {
      const cacheHitMissReponse = await fetch('/cache-analytics'); // fetches from endpoint
      const cacheHitMissData = await cacheHitMissReponse.json(); // converts to Javascript object
      setCacheHits(cacheHitMissData.cacheHits); // uses key to retrieve value and set state
      setCacheMisses(cacheHitMissData.cacheMisses);
      if (cacheHitMissData.cacheStatus !== undefined) {
        const randomValue = Math.random();
        if (randomValue < 0.5) {
          setCacheStatus("hit");
        } else {
          setCacheStatus("miss");
        }
      } else {
      setCacheStatus(cacheHitMissData.cacheStatus);
      }

      const responseTimesResponse = await fetch('/cache-response-times');
      const responseTimesData = await responseTimesResponse.json();
      setResponseTimes(responseTimesData);

      const cacheSizeResponse = await fetch('/cacheSize');
      const cacheSizeData = await cacheSizeResponse.json();
      setCacheSize(cacheSizeData);

    } catch (error) {
      console.error('Error fetching Chart Data:', error);
    }
  };

  const handleClick = async () => {
    console.log('Cache Switch:', cacheSwitch);
    console.log('Query Select:', querySelect);
    // showNotification();

    let endpoint = ''; // initialize endpoint to empty string
    let method: 'GET' | 'POST' = 'GET'; // default method will be POST

    switch (querySelect) {
      case 'insert':
        endpoint = '/data/cities';
        method = 'POST';
        break;
      case 'select':
        endpoint = cacheSwitch ? '/data/cache' : '/data/no-cache';
        break;
      case 'costly':
        endpoint = cacheSwitch ? '/data/cache/costly' : '/data/no-cache/costly';
        break;
      default:
        // Handle unexpected querySelect values if necessary
        break;
    }

    try {
      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log('Response:', data);
      setQueryResult(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }

    // fetch Chart Data
    fetchChartData();

    if (onClick) {
      onClick();
    }
  };

  return (
    <Button variant='contained' color='primary' onClick={handleClick} disabled={disabled}>
      {label}
    </Button>
  );
};

export default SubmitButton;
