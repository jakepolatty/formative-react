// @flow
import React from 'react';
import Form from 'react-bootstrap/Form';
import type {StringInputProps} from '../inputFlowTypes.js';

type Props = {
  ...StringInputProps,
  rows: number
}

export default function TextAreaInput(props: Props) {
  let {id, initialValue, onUpdate, rows} = props;

  return(
    <Form.Control
      id={id}
      name={id}
      as="textarea"
      rows={rows !== undefined ? rows : 3}
      defaultValue={initialValue}
      onChange={onUpdate !== undefined ? 
        (event) => onUpdate(event.target.value) : undefined}
    />
  );
}
