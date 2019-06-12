import React, {useState, useEffect} from 'react';
import Form from 'react-bootstrap/Form';

export default function RadioInput({id, options, initialValue, onUpdate}) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    onUpdate(id, value)
  });

	return(
    <div id={id}>
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
    </div>
	);
}
