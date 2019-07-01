// @flow
import React from 'react';
import Form from 'react-bootstrap/Form';

export type Props = {
  id: string,
  initialValue: string,
  onUpdate: Function
};

export default function TextInput({id, initialValue, onUpdate}: Props) {
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
