import PropTypes from 'prop-types';
import React from 'react';
import '../stylesheets/styles.css';

interface Props {
  className: any;
  divClassName: any;
  text: string;
}

export const InputSlot = ({
  className,
  divClassName,
  text = 'Default Slot',
}: Props): JSX.Element => {
  return (
    <div className={`input-slot ${className}`}>
      <div className={`default-slot ${divClassName}`}>{text}</div>
    </div>
  );
};

InputSlot.propTypes = {
  text: PropTypes.string,
};
