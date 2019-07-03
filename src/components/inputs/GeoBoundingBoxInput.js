// @flow
import React, {useState} from 'react';
import Form from 'react-bootstrap/Form';
import NumberInput from './NumberInput';
import type {StringInputProps} from '../../utils/inputFlowTypes.js';

export default function GeoBoundingBoxInput(props: StringInputProps) {
  let {id, initialValue, onUpdate} = props;

  const initialVals = (initialValue.match()) ?
    {lon1: undefined, lat1: undefined, lon2: undefined, lat2: undefined} :
    {lon1: undefined, lat1: undefined, lon2: undefined, lat2: undefined}
  const [vals, setVals] = useState(initialVals);
 
  const handleUpdate = (newValue: string, key: string) => {
    setVals(prevVals => {
      let newVal = {[key]: newValue};
      return {...prevVals, ...newVal};
    });
    onUpdate(outputString());
  };

  const outputString = () => {
    return `(${initialVals.lon1}, ${initialVals.lat1}), (${initialVals.lon2}, ${initialVals.lat2})`;
  }

  return(
    <div>
      <p>Longitude 1</p>
      <NumberInput
        id={id+"-lon1"}
        initialValue={initialVals.lon1}
        onUpdate={onUpdate !== undefined ? (newValue) => handleUpdate(newValue, "lon1") : undefined}
      />
      <p>Latitude 1</p>
      <NumberInput
        id={id+"-lat1"}
        initialValue={initialVals.lat1}
        onUpdate={onUpdate !== undefined ? (newValue) => handleUpdate(newValue, "lat1") : undefined}
      />
      <p>Longitude 2</p>
      <NumberInput
        id={id+"-lon2"}
        initialValue={initialVals.lon2}
        onUpdate={onUpdate !== undefined ? (newValue) => handleUpdate(newValue, "lon2") : undefined}
      />
      <p>Latitude 2</p>
      <NumberInput
        id={id+"-lat2"}
        initialValue={initialVals.lat2}
        onUpdate={onUpdate !== undefined ? (newValue) => handleUpdate(newValue, "lat2") : undefined}
      />
    </div>
  );
}
