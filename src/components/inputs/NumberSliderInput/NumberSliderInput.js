// @flow
import React from 'react';
import Form from 'react-bootstrap/Form';
import type {NumberInputProps} from '../inputFlowTypes.js';

type Props = {
  ...NumberInputProps,
  min: number,
  max: number,
  increment: number
};

export default function NumberSliderInput(props: Props) {
  let {id, initialValue, onUpdate, min, max, increment} = props;

  return(
    <Form.Control
      id={id}
      name={id}
      type="range"
      min={min}
      max={max}
      step={increment}
      defaultValue={initialValue}
      onChange={onUpdate !== undefined ? 
        (event) => onUpdate(Number(event.target.value)) : undefined}
    />
  );
}
