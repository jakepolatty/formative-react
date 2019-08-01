// @flow
import React from 'react';
import Form from 'react-bootstrap/Form';
import type {StringInputProps} from '../inputFlowTypes.js';

type Props = {
  ...StringInputProps,
  multiple?: boolean,
  accept?: string
};

export default function FileInput(props: Props) {
  let {id, onUpdate, multiple, accept} = props;

  const handleFileSelection = (event: any) => {
    if (event) {
      if (multiple) {
        let files = event.target.files;
        if (onUpdate !== undefined) {
          onUpdate(files);
        }
      } else {
        let file = event.target.files[0];
        if (onUpdate !== undefined) {
          onUpdate(file);
        }
      }
    }
  }

  return (
    <Form.Control
      id={id}
      name={id}
      type="file"
      onChange={(event) => handleFileSelection(event)}
      multiple={multiple !== undefined ? multiple : false}
      accept={accept !== undefined ? accept : ""}
    />
  )
}