// @flow
import React from 'react';
import {AsyncTypeahead} from 'react-bootstrap-typeahead'
import type {MultiStringInputProps} from '../inputFlowTypes.js';
import axios from 'axios';
import 'react-bootstrap-typeahead/css/Typeahead.css';

type Props = {
  ...MultiStringInputProps,
  queryUrl: string,
  queryKey: string,
  multiple?: boolean,
  placeholder?: string
};

export default function AsyncAutocompleteInput(props: Props) {
  let {id, initialValue, onUpdate, queryUrl, queryKey, multiple, placeholder} = props;

  let [isLoading, setIsLoading] = React.useState(false);
  let [options, setOptions] = React.useState([]);

  let cache = {};

  if (!Array.isArray(initialValue) && initialValue !== undefined) {
    initialValue = [initialValue];
  }

  const handleChange = (selections: Array<any>) => {
    if (onUpdate !== undefined && selections[0] !== undefined) {
      if (!multiple) {
        onUpdate(selections[0][queryKey]);
      } else {
        let values = [];
        for (let selection of selections) {
          values.push(selection[queryKey]);
        }
        onUpdate(values);
      }
    }
  }

  const handleSearch = (query: string) => {
    if (cache[query]) {
      setOptions(cache[query].items);
    } else {
      setIsLoading(true);
      axios.get(queryUrl + query)
        .then(res => res.data)
        .then(data => {
          cache[query] = data;
          setIsLoading(false);
          setOptions(data.items);
        });
    }
  }

  return (
    <AsyncTypeahead
      id={id}
      labelKey={queryKey}
      isLoading={isLoading}
      options={options}
      multiple={multiple}
      placeholder={placeholder}
      defaultSelected = {initialValue}
      onChange={(selected) => handleChange(selected)}
      onSearch={(query) => handleSearch(query)}
    />
  );
};