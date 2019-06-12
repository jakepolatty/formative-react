import React, {useState} from 'react';
import Form from 'react-bootstrap/Form';

export default function RadioInput({id, options, initialValue, onUpdate}) {
  const [value, setValue] = useState(initialValue);

	return(
    <div id={id}>
      {options.map((option, i) => {
        const checked = option === value;
        return (
          <Form.Check
            id={id + "" + i}
            name={option}
            value={option}
            checked={checked}
            label={option}
            onChange={_ => setValue(option)}
            type="radio"
          />
        );
      })}
    </div>
	);
}
