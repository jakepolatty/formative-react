import React from 'react';
import Form from 'react-bootstrap/Form';

export default function HiddenInput({id, initialValue}) {
  return (
    <Form.Control
      id={id}
      name={id}
      defaultValue={initialValue}
      type="hidden"
    />
  );
}
