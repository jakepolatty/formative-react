import React from 'react';
import Form from 'react-bootstrap/Form';

export default function TextInput({id, initialValue, onUpdate}) {
	return(
    <Form.Control
      id={id}
      name={id}
      defaultValue={initialValue}
      onChange={onUpdate !== undefined ? 
        (event) => onUpdate(event.target.value) : undefined}
    />
	);
}
