import React from 'react';
import Form from 'react-bootstrap/Form';

export default function SelectInput({id, options, initialValue, label, description, onUpdate}) {
  return(
    <Form.Group id={id + "-group"}>
      {label !== undefined &&
        <Form.Label id={id + "-label"}>{label}</Form.Label>}
      <Form.Control
        id={id}
        name={id}
        as="select"
        defaultValue={initialValue}
        onChange={onUpdate !== undefined ? 
          (event) => onUpdate(event.target.value) : undefined}
      >
        {options.map((option, i) => {
          return (<option key={i}>{option}</option>);
        })}
      </Form.Control>
      {description !== undefined &&
        <Form.Text id={id + "-description"}>{description}</Form.Text>}
    </Form.Group>
  );
}