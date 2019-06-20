import React, {useState} from 'react';
import Form from 'react-bootstrap/Form';

export default function IntegerInput({id, initialValue, label, description, onUpdate}) {
  const [isInvalid, setIsInvalid] = useState(Number.isNaN(parseInt(initialValue)));

  const handleChange = (newValue) => {
    let parsedInt = parseInt(newValue);
    if (Number.isNaN(parsedInt) || parsedInt === "") {
      setIsInvalid(true);
    } else {
      setIsInvalid(false);
      onUpdate(parsedInt);
    }
  };

	return(
    <Form.Group>
      {label !== undefined &&
        <Form.Label>{label}</Form.Label>}
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
        Please enter an integer.
      </Form.Control.Feedback>
      {description !== undefined &&
        <Form.Text>{description}</Form.Text>}
    </Form.Group>
	);
}
