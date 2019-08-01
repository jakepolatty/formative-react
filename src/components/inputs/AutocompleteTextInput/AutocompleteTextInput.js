// @flow
import React from 'react';
import {Typeahead} from 'react-bootstrap-typeahead'
import type {MultiStringInputProps} from '../inputFlowTypes.js';
import 'react-bootstrap-typeahead/css/Typeahead.css';

type Props = {
  ...MultiStringInputProps,
  options?: Array<string>,
  multiple?: boolean,
  placeholder?: string
};

export default function AutocompleteTextInput(props: Props) {
  let {id, initialValue, onUpdate, options, multiple, placeholder} = props;

  if (!Array.isArray(initialValue) && initialValue !== undefined) {
    initialValue = [initialValue];
  }

  const handleChange = (selections: Array<string>) => {
    if (onUpdate !== undefined) {
      if (!multiple) {
        onUpdate(selections[0]);
      } else {
        onUpdate(selections);
      }
    }
  }

  return (
    <Typeahead
      id={id}
      options={options}
      multiple={multiple}
      placeholder={placeholder}
      defaultSelected = {initialValue}
      onChange={(selected) => handleChange(selected)}
    />
  );
};