import React, {useState, useEffect} from 'react';
import Form from 'react-bootstrap/Form';

export default function CheckboxInput({id, initialValue, onUpdate}) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (onUpdate !== undefined) {
      onUpdate(value)
    }
  }, [value, onUpdate]);

  return(
    <Form.Check
      id={id}
      name={id}
      defaultChecked={value}
      onChange={_ => setValue(!value)}
      type="checkbox"
    />
  );
}
