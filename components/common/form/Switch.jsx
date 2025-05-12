import React, { useState } from 'react';

const Switch = ({ labelText, onToggle, isChecked }) => {

  return (
    <div className="form-check form-switch">
      <input
        className="form-check-input"
        type="checkbox"
        role="switch"
        id="flexSwitchCheck"
        checked={isChecked}
        onChange={onToggle}
      />
      <label className="form-check-label" htmlFor="flexSwitchCheck">
        {labelText}
      </label>
    </div>
  );
};

export default Switch;