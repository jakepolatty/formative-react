// @flow
import React from 'react';
import Form from 'react-bootstrap/Form';

export type Props = {
  id: string,
  initialValue: string,
  onUpdate: (string) => void
};

export default function TextInput(props: Props) {
  let {id, initialValue, onUpdate} = props;

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
