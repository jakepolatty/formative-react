// @flow
import React, {useState} from 'react';
import Form from 'react-bootstrap/Form';
import type {NumberInputProps} from '../inputFlowTypes.js';

type Props = {
  ...NumberInputProps,
  step?: number
}

export default function NumberInput(props: Props) {
  let {id, initialValue, onUpdate, step} = props;

  const [isInvalid, setIsInvalid] = useState(false);

  const handleChange = (newValue: string) => {
    let parsedNum = Number(newValue);
    if (Number.isNaN(parsedNum) || newValue === "") {
      setIsInvalid(true);
    } else {
      setIsInvalid(false);
      if (onUpdate !== undefined) {
        onUpdate(parsedNum);
      }
    }
  };

  return(
    <div>
      <Form.Control
        id={id}
        name={id}
        type="number"
        defaultValue={initialValue}
        step={step !== undefined ? step : "any"}
        isInvalid={isInvalid}
        onChange={(event) => handleChange(event.target.value)}
      />
    </div>
  );
}
