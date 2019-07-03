// @flow
import React, {useContext, useMemo} from 'react';
import type {ComponentType} from 'react';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip'
import Form from 'react-bootstrap/Form';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheck, faInfoCircle} from '@fortawesome/free-solid-svg-icons';
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
  Type: ComponentType<InputFieldProps>,
  id: string,
  initialValue: any,
  label?: string,
  description?: string,
  info?: string,
  onUpdate: Function,
  onSave: Function
};

export default function Input(props: InputWrapperProps) {
  let {Type, id, initialValue, label, description, info, onUpdate, onSave, ...rest} = props;

  const {updatedDict, dispatch} = useContext(UpdatedContext);

  const handleUpdate = (newValue) => {
    if (!updatedDict[id]) {
      dispatch({type: "update", payload: id});
    }
    onUpdate(newValue);
  }

  const handleSave = () => {
    dispatch({type: "save-field", payload: id});
    onSave();
  }

  let currentUpdated = updatedDict[id];

  return useMemo(() => (
    <Form.Group id={id + "-GROUP"}>
      {label !== undefined &&
        <Form.Label id={id + "-LABEL"}>{label}</Form.Label>}
      <InputGroup>
        {info !== undefined &&
          <InputGroup.Prepend>
            <OverlayTrigger
              trigger={['hover', 'focus']}
              overlay={
                <Tooltip>
                  {info}
                </Tooltip>
              }
            >
              <Button
                variant="primary">
                <FontAwesomeIcon icon={faInfoCircle}/>
              </Button>
            </OverlayTrigger>
          </InputGroup.Prepend>}
        <Type
          id={id}
          name={id}
          initialValue={initialValue}
          onUpdate={onUpdate !== undefined ? (newValue) => handleUpdate(newValue) : undefined}
          {...rest}
        />
        <InputGroup.Append>
          <Button
            variant={currentUpdated ? "outline-success" : "outline-light"}
            disabled={!currentUpdated}
            onClick={onSave !== undefined ? () => handleSave() : undefined}
          >
            <FontAwesomeIcon icon={faCheck}/>
          </Button>
        </InputGroup.Append>
      </InputGroup>
      {description !== undefined &&
        <Form.Text id={id + "-DESCRIPTION"}>{description}</Form.Text>}
    </Form.Group>
  ), [currentUpdated]);
}
