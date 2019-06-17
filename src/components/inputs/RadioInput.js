import React, {useState, useEffect} from 'react';
import Form from 'react-bootstrap/Form';

export default function RadioInput({id, options, initialValue, label, description, onUpdate}) {
  if (options === undefined) {
    options = ["Yes", "No"];

    if (initialValue === true) {
      initialValue = "Yes";
    } else if (initialValue === false) {
      initialValue = "No";
    }
  }

  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (onUpdate !== undefined) {
      onUpdate(id, value)
    }
  });

	return(
    <Form.Group>
      {label !== undefined &&
        <Form.Label>{label}</Form.Label>}
      {options.map((option, i) => {
        const checked = option === value;
        return (
          <Form.Check
            id={id + "" + i}
            key={id + "" + i}
            name={id}
            value={option}
            checked={checked}
            label={option}
            onChange={_ => setValue(option)}
            type="radio"
          />
        );
      })}
      {description !== undefined &&
        <Form.Text>{description}</Form.Text>}
    </Form.Group>
	);
}
