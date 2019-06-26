import React from 'react';
import Form from 'react-bootstrap/Form';

export default function SelectInput({id, initialValue, onUpdate, options}) {
  return(
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
  );
}