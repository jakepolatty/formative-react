import React from 'react';
import Form from 'react-bootstrap/Form';

export default function TextInput({id, initialValue, onChange}) {
	return(
    <Form.Control
      id={id}
      defaultValue={initialValue}
      onChange={onChange}
    />
	);
}
