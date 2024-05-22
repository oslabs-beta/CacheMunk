import React from 'react';
import { Button } from '@mui/material';

interface SubmitButtonProps {
  label?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
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

  const handleClick = () => {
    showNotification();
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
