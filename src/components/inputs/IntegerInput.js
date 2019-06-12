import React from 'react';
import Form from 'react-bootstrap/Form';

export default function IntegerInput({id, initialValue, onUpdate}) {
	return(
    <Form.Control
      id={id}
      name={id}
      type="number"
      defaultValue={initialValue}
      onChange={(event) => onUpdate(event.target.name, event.target.value)}
    />
	);
}
