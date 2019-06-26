import React from 'react';
import Form from 'react-bootstrap/Form';
import reactInputMap from '../../utils/reactInputMap.js';

/**
 * All custom input fields must accept the following props:
 * - id: A unique identifier key designating the field
 * - initialValue: The initial value that the field should take on
 * - onUpdate: A callback that handles updates to the field value
**/
export default function Input({Type, id, initialValue, label, description, onUpdate, onSave, ...rest}) {
  return(
    <Form.Group id={id + "-group"}>
      {label !== undefined &&
        <Form.Label id={id + "-label"}>{label}</Form.Label>}
      <Type
        id={id}
        name={id}
        initialValue={initialValue}
        onUpdate={onUpdate}
        {...rest}
      />
      {description !== undefined &&
        <Form.Text id={id + "-description"}>{description}</Form.Text>}
    </Form.Group>
  );
}
