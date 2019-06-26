import React, {useState, useEffect} from 'react';
import Form from 'react-bootstrap/Form';

export default function CheckboxInput({id, initialValue, onUpdate}) {
  return(
    <Form.Check
      id={id}
      name={id}
      defaultChecked={initialValue}
      onInput={onUpdate !== undefined ?
        (event) => onUpdate(event.target.checked) : undefined}
      type="checkbox"
    />
  );
}
