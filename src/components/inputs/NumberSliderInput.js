import React, {useState} from 'react';
import Form from 'react-bootstrap/Form';

export default function NumberSliderInput({id, initialValue, min, max, increment,
  label, description, onUpdate}) {
  return(
    <Form.Group id={id + "-group"}>
      {label !== undefined &&
        <Form.Label id={id + "-label"}>{label}</Form.Label>}
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
        <Form.Text id={id + "-description"}>{description}</Form.Text>}
    </Form.Group>
  );
}
