import React from 'react';
import { Button } from '@mui/material';

interface SubmitButtonProps {
  cacheSwitch: boolean;
  querySelect: string;
  label?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  cacheSwitch,
  querySelect,
  label = 'Submit',
  onClick,
  disabled = false,
}) => {
  const showNotification = () => {
    if (Notification.permission === 'granted') {
      new Notification('Button was clicked');
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification('Button was clicked');
        }
      });
    }
  };

  const handleClick = async () => {
    console.log('Cache Switch:', cacheSwitch);
    console.log('Query Select:', querySelect);
    showNotification();

    let endpoint = ''; // initialize endpoint to empty string
    let method: 'GET' | 'POST' = 'GET'; // default method will be POST

    if (querySelect === 'insert') {
      endpoint = 'http://localhost:3030/test/insert';
      method = 'POST';
    } else if (querySelect === 'select' && cacheSwitch) {
      endpoint = 'http://localhost:3030/test/select-cache';
    } else if (querySelect === 'select' && !cacheSwitch) {
      endpoint = 'http://localhost:3030/test/select-no-cache';
    } else if (querySelect === 'costly' && cacheSwitch) {
      endpoint = 'http://localhost:3030/test/costly-cache';
    } else if (querySelect === 'costly' && !cacheSwitch) {
      endpoint = 'http://localhost:3030/test/costly-no-cache';
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
    } catch (error) {
      console.error('Error fetching data:', error);
    }

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
