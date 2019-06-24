import React, {useState, useEffect} from 'react';
import Form from 'react-bootstrap/Form';

export default function CheckboxInput({id, initialValue, label, description, onUpdate}) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (onUpdate !== undefined) {
      onUpdate(value)
    }
  }, [value, onUpdate]);

  return(
    <Form.Group id={id + "-group"}>
      {label !== undefined &&
        <Form.Label id={id + "-label"}>{label}</Form.Label>}
      <Form.Check
        id={id}
        name={id}
        defaultChecked={value}
        onChange={_ => setValue(!value)}
        type="checkbox"
      />
      {description !== undefined &&
        <Form.Text id={id + "-description"}>{description}</Form.Text>}
    </Form.Group>
  );
}
