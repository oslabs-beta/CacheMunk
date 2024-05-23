import * as React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

interface CacheSwitchProps {
  cacheSwitch: boolean;
  setCacheSwitch: React.Dispatch<React.SetStateAction<boolean>>;
}
const CacheSwitch: React.FC<CacheSwitchProps> = ({ cacheSwitch, setCacheSwitch }) => {
  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCacheSwitch(event.target.checked);
  };

  return (
    <FormGroup>
      <FormControlLabel
        control={<Switch checked={cacheSwitch} onChange={handleToggle} />}
        label='Cache'
      />
    </FormGroup>
  );
};

export default CacheSwitch;
