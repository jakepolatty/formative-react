import React from 'react';
import Form from 'react-bootstrap/Form';

export default function TextAreaInput({id, initialValue, onUpdate, rows}) {
  return(
    <Form.Control
      id={id}
      name={id}
      as="textarea"
      rows={rows !== undefined ? rows : 3}
      defaultValue={initialValue}
      onChange={onUpdate !== undefined ? 
        (event) => onUpdate(event.target.value) : undefined}
    />
  );
}
