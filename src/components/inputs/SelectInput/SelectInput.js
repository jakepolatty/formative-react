// @flow
import React from 'react';
import Form from 'react-bootstrap/Form';
import type {StringSelectionInputProps} from '../utils/inputFlowTypes.js';

export default function SelectInput(props: StringSelectionInputProps) {
  let {id, initialValue, onUpdate, options} = props;

  return(
    <Form.Control
      id={id}
      name={id}
      as="select"
      defaultValue={initialValue}
      onChange={onUpdate !== undefined ? 
        (event) => onUpdate(event.target.value) : undefined}
    >
      {options.map((option, i) => {
        return (<option key={i}>{option}</option>);
      })}
    </Form.Control>
  );
}