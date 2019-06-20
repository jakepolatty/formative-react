import React, {useState} from 'react';
import Form from 'react-bootstrap/Form';

export default function SliderInput({id, initialValue, min, max, increment, label, description, onUpdate}) {
  return(
    <Form.Group>
      {label !== undefined &&
        <Form.Label>{label}</Form.Label>}
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
      {description !== undefined &&
        <Form.Text>{description}</Form.Text>}
    </Form.Group>
  );
}
