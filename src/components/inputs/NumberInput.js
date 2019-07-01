// @flow
import React, {useState} from 'react';
import Form from 'react-bootstrap/Form';
import type {NumberInputProps} from '../../utils/inputFlowTypes.js';

export default function NumberInput(props: NumberInputProps) {
  let {id, initialValue, onUpdate} = props;

  const [isInvalid, setIsInvalid] = useState(Number.isNaN(Number(initialValue)));
 
  const handleChange = (newValue: string) => {
    let parsedNum = Number(newValue);
    if (Number.isNaN(parsedNum) || newValue === "") {
      setIsInvalid(true);
    } else {
      setIsInvalid(false);
      onUpdate(parsedNum);
    }
  };

	return(
    <div>
      <Form.Control
        id={id}
        name={id}
        type="number"
        defaultValue={initialValue}
        onChange={onUpdate !== undefined ? 
          (event) => handleChange(event.target.value) : undefined}
        isInvalid={isInvalid}
      />
      <Form.Control.Feedback type="invalid">
        Please enter a number.
      </Form.Control.Feedback>
    </div>
	);
}
