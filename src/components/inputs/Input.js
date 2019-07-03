// @flow
import React, {useEffect, useContext} from 'react';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheck} from '@fortawesome/free-solid-svg-icons';
import {UpdatedContext} from '../Form/Form.js';

/**
 * All custom input fields must accept the following props:
 * - id: A unique identifier key designating the field
 * - initialValue: The initial value that the field should take on
 * - onUpdate: A callback that handles updates to the field value
**/

export type InputFieldProps = {
  id: string,
  initialValue: any,
  onUpdate: Function,
}

export type InputWrapperProps = {
  Type: React.ComponentType<InputFieldProps>,
  id: string,
  initialValue: any,
  label?: string,
  description?: string,
  onUpdate: Function,
  onSave: Function
};

export default function Input(props: InputWrapperProps) {
  let {Type, id, initialValue, label, description, onUpdate, onSave, ...rest} = props;

  const {updatedDict, setUpdatedDict} = useContext(UpdatedContext);

  console.log("input")

  const handleUpdate = (newValue) => {
    if (!updatedDict[id]) {
      let newUpdated = {[id]: true}
      setUpdatedDict(prevDict => {
        return {...prevDict, ...newUpdated}
      });
    }
    onUpdate(newValue);
  }

  const handleSave = () => {
    setUpdatedDict(prevDict => {
      const {[id]: tmp, ...rest} = prevDict;
      return rest;
    });
    onSave();
  }

  return(
    <Form.Group id={id + "-GROUP"}>
      {label !== undefined &&
        <Form.Label id={id + "-LABEL"}>{label}</Form.Label>}
      <InputGroup>
        <Type
          id={id}
          name={id}
          initialValue={initialValue}
          onUpdate={onUpdate !== undefined ? (newValue) => handleUpdate(newValue) : undefined}
          {...rest}
        />
        <InputGroup.Append>
          <Button
            variant={updatedDict[id] ? "outline-success" : "outline-light"}
            disabled={!updatedDict[id]}
            onClick={onSave !== undefined ? () => handleSave() : undefined}
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
