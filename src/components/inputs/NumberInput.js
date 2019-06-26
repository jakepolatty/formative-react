import React, {useState} from 'react';
import Form from 'react-bootstrap/Form';

export default function NumberInput({id, initialValue, onUpdate}) {
  const [isInvalid, setIsInvalid] = useState(Number.isNaN(Number(initialValue)));
 
  const handleChange = (newValue) => {
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
