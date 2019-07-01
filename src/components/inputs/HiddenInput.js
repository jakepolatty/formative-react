// @flow
import React from 'react';
import Form from 'react-bootstrap/Form';
import type {GenericInputProps} from '../../utils/inputFlowTypes.js';

export default function HiddenInput(props: GenericInputProps) {
  let {id, initialValue} = props;

  return (
    <Form.Control
      id={id}
      name={id}
      defaultValue={initialValue}
      type="hidden"
    />
  );
}
