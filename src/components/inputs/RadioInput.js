// @flow
import React from 'react';
import Form from 'react-bootstrap/Form';
import type {GenericSelectionInputProps} from '../../utils/inputFlowTypes.js';

export default function RadioInput(props: GenericSelectionInputProps) {
  let {id, initialValue, onUpdate, options} = props;

  if (options === undefined) {
    options = [true, false];
  }

  const handleUpdate = (newValue) => {
    if (onUpdate !== undefined) {
      // Handle the case of a simple true/false radio button
      if (newValue === "true" && options.length === 2) {
        onUpdate(true);
      } else if (newValue === "false" && options.length === 2) {
        onUpdate(false);
      } else {
        onUpdate(newValue);
      }
    }
  }

	return(
    <div>
      {options.map((option, i) => {
        const defaultChecked = option === initialValue;
        return (
          <Form.Check
            id={id + i}
            key={id + i}
            name={id}
            value={option}
            label={option.toString()}
            defaultChecked={defaultChecked}
            onChange={(event) => handleUpdate(event.target.value)}
            type="radio"
          />
        );
      })}
    </div>
	);
}
