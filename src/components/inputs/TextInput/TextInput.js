// @flow
import React from 'react';
import Form from 'react-bootstrap/Form';
import type {StringInputProps} from '../utils/inputFlowTypes.js';

export default function TextInput(props: StringInputProps) {
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
