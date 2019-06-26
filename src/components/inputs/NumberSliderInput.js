import React from 'react';
import Form from 'react-bootstrap/Form';

export default function NumberSliderInput({id, initialValue, onUpdate, min, max, increment}) {
  return(
    <Form.Control
      id={id}
      name={id}
      type="range"
      min={min}
      max={max}
      step={increment}
      defaultValue={initialValue}
      onChange={onUpdate !== undefined ? 
        (event) => onUpdate(Number(event.target.value)) : undefined}
    />
  );
}
