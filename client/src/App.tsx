import React from 'react';
import { InputSlot } from './Components/InputSlot';
import { Switch } from './Components/Switch';
import './stylesheets/styles.css';

const App: React.FC = () => (
  <div className='frame'>
    <div className='div'>
      <img className='image' alt='Image' src='/images/image-1.png' />
      <Switch
        className='switch-2'
        disabled={false}
        ellipseClassName='switch-instance'
        selected={false}
        hover={false}
      />
      <InputSlot
        className='input-slot-instance'
        divClassName='design-component-instance-node'
        text='Cache Switch'
      />
      <img className='query-select' alt='Query select' src='images/query-select.png' />
      <div className='text-wrapper'>CacheMunk Demo</div>
      <img className='donut-chart' alt='Donut chart' src='images/donut-chart-1.png' />
      <div className='text-wrapper-2'>Hit/Miss Ratio</div>
    </div>
  </div>
);

export default App;
