// @flow
import React from 'react';
import Form from 'react-bootstrap/Form';
import type {BooleanInputProps} from '../inputFlowTypes.js';

export default function CheckboxInput(props: BooleanInputProps) {
  let {id, initialValue, onUpdate} = props;
  
  return(
    <Form.Check
      id={id}
      name={id}
      defaultChecked={initialValue}
      onInput={onUpdate !== undefined ?
        (event) => onUpdate(event.target.checked) : undefined}
      type="checkbox"
    />
  );
}
