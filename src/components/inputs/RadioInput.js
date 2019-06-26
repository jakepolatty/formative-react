import React from 'react';
import Form from 'react-bootstrap/Form';

export default function RadioInput({id, initialValue, onUpdate, options}) {
  if (options === undefined) {
    options = [true, false];
  }

  const handleUpdate = (newValue) => {
    // Handle the case of a simple true/false radio button
    if (newValue === "true" && options.length === 2) {
      onUpdate(true);
    } else if (newValue === "false" && options.length === 2) {
      onUpdate(false);
    } else {
      onUpdate(newValue);
    }
  }

	return(
    <div>
      {options.map((option, i) => {
        const defaultChecked = option === initialValue;
        return (
          <Form.Check
            id={id + "" + i}
            key={id + "" + i}
            name={id}
            value={option}
            label={option.toString()}
            defaultChecked={defaultChecked}
            onChange={onUpdate !== undefined ?
              (event) => handleUpdate(event.target.value) : undefined}
            type="radio"
          />
        );
      })}
    </div>
	);
}
