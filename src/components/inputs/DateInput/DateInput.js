// @flow
import React from 'react';
import Form from 'react-bootstrap/Form';
import type {StringInputProps} from '../inputFlowTypes.js';

type Props = {
  ...StringInputProps
};

export default function DateInput(props: Props) {
  let {id, initialValue, onUpdate} = props;

  return (
    <Form.Control
      id={id}
      name={id}
      type="date"
      defaultValue={initialValue}
      onChange={onUpdate !== undefined ? (event) => onUpdate(event.target.value) : undefined}
    />
  )
}