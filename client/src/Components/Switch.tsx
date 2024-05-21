import PropTypes from 'prop-types';
import React from 'react';
import { useReducer } from 'react';
import '../stylesheets/styles.css';

interface Props {
  selected: boolean;
  disabled: boolean;
  hover: boolean;
  className: any;
  ellipseClassName: any;
}

export const Switch = ({
  selected,
  disabled,
  hover,
  className,
  ellipseClassName,
}: Props): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, {
    selected: selected || true,
    disabled: disabled,

    hover: hover,
  });

  return (
    <div
      className={`switch selected-${state.selected} disabled-${state.disabled} ${className}`}
      onMouseLeave={() => {
        dispatch('mouse_leave');
      }}
      onMouseEnter={() => {
        dispatch('mouse_enter');
      }}
      onClick={() => {
        dispatch('click');
      }}
    >
      <div
        className={`ellipse hover-${state.hover} disabled-0-${state.disabled} selected-0-${state.selected} ${ellipseClassName}`}
      />
    </div>
  );
};

function reducer(state: any, action: any) {
  if (state.disabled === false && state.hover === true && state.selected === true) {
    switch (action) {
      case 'click':
        return {
          disabled: false,
          hover: false,
          selected: false,
        };
    }
  }

  if (state.disabled === false && state.hover === true && state.selected === false) {
    switch (action) {
      case 'click':
        return {
          disabled: false,
          hover: false,
          selected: true,
        };
    }
  }

  switch (action) {
    case 'mouse_enter':
      return {
        ...state,
        hover: true,
      };

    case 'mouse_leave':
      return {
        ...state,
        hover: false,
      };
  }

  return state;
}

Switch.propTypes = {
  selected: PropTypes.bool,
  disabled: PropTypes.bool,
  hover: PropTypes.bool,
};
