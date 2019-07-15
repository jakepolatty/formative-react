// @flow
import React from 'react';
import Form from 'react-bootstrap/Form';
import type {GenericSelectionInputProps} from '../utils/inputFlowTypes.js';

export default function RadioInput(props: GenericSelectionInputProps) {
  let {id, initialValue, onUpdate, options} = props;

  if (options === undefined) {
    options = [true, false];
  }

  const handleUpdate = (newValue) => {
    if (onUpdate !== undefined) {
      onUpdate(newValue);
    }
  }

  return(
    <div id={id}>
      {options.map((option, i) => {
        const defaultChecked = option === initialValue;
        return (
          <Form.Check
            id={id + "-" + i}
            key={id + "-" + i}
            name={id}
            value={option}
            label={option.toString()}
            defaultChecked={defaultChecked}
            onChange={_ => handleUpdate(option)}
            type="radio"
          />
        );
      })}
    </div>
  );
}
