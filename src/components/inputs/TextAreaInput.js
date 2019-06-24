import React from 'react';
import Form from 'react-bootstrap/Form';

export default function TextAreaInput({id, initialValue, label, description, rows, onUpdate}) {
  return(
    <Form.Group id={id + "-group"}>
      {label !== undefined &&
        <Form.Label id={id + "-label"}>{label}</Form.Label>}
      <Form.Control
        id={id}
        name={id}
        as="textarea"
        rows={rows !== undefined ? rows : 3}
        defaultValue={initialValue}
        onChange={onUpdate !== undefined ? 
          (event) => onUpdate(event.target.value) : undefined}
      />
      {description !== undefined &&
        <Form.Text id={id + "-description"}>{description}</Form.Text>}
    </Form.Group>
  );
}
