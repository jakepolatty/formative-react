import React from 'react';
import Form from 'react-bootstrap/Form';

export default function SelectInput({id, options, initialValue, label, description, onUpdate}) {
  return(
    <Form.Group>
      {label !== undefined &&
        <Form.Label>{label}</Form.Label>}
      <Form.Control
        id={id}
        name={id}
        as="select"
        defaultValue={initialValue}
        onChange={onUpdate !== undefined ? 
          (event) => onUpdate(event.target.value) : undefined}
      >
        {options.map((option, i) => {
          return (<option key={i}>{option}</option>);
        })}
      </Form.Control>
      {description !== undefined &&
        <Form.Text>{description}</Form.Text>}
    </Form.Group>
  );
}