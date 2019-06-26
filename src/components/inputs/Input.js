import React from 'react';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheck} from '@fortawesome/free-solid-svg-icons';

/**
 * All custom input fields must accept the following props:
 * - id: A unique identifier key designating the field
 * - initialValue: The initial value that the field should take on
 * - onUpdate: A callback that handles updates to the field value
**/
export default function Input({Type, id, initialValue, label, description, updated, onUpdate, handleSave,
  ...rest}) {
  return(
    <Form.Group id={id + "-GROUP"}>
      {label !== undefined &&
        <Form.Label id={id + "-LABEL"}>{label}</Form.Label>}
      <InputGroup>
        <Type
          id={id}
          name={id}
          initialValue={initialValue}
          onUpdate={onUpdate !== undefined ? (newValue) => onUpdate(newValue) : undefined}
          {...rest}
        />
        <InputGroup.Append>
          <Button
            variant={updated ? "outline-success" : "outline-light"}
            disabled={!updated}
            onClick={handleSave !== undefined ? () => handleSave() : undefined}
          >
            <FontAwesomeIcon icon={faCheck}/>
          </Button>
        </InputGroup.Append>
      </InputGroup>
      {description !== undefined &&
        <Form.Text id={id + "-DESCRIPTION"}>{description}</Form.Text>}
    </Form.Group>
  );
}
