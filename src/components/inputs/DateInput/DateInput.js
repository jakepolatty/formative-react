// @flow
import React from 'react';
import Form from 'react-bootstrap/Form';
import type {StringInputProps} from '../inputFlowTypes.js';

type Props = {
  ...StringInputProps
};

export default function DateInput(props: Props) {
  let {id, initialValue, onUpdate} = props;

  const handleChange = (newValue: string) => {
    if (onUpdate !== undefined) {
      return onUpdate(newValue);
    }
  }

  return (
    <Form.Control
      id={id}
      name={id}
      type="date"
      defaultValue={initialValue}
      onChange={(event) => handleChange(event.target.value)}
    />
  )
}