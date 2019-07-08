// @flow
import React, {useState} from 'react';
import NumberInput from './NumberInput';
import type {StringInputProps} from '../../utils/inputFlowTypes.js';

export default function GeoBoundingBoxInput(props: StringInputProps) {
  let {id, initialValue, onUpdate} = props;

  const coordsRegex = /^\((-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)\),\s\((-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)\)$/;

  // Set up the initial value dictionary if values have already been provided
  let initialVals = {lon1: undefined, lat1: undefined, lon2: undefined, lat2: undefined};
  let matchArray = initialValue.match(coordsRegex);
  if (initialValue !== undefined && matchArray !== null) {
    // match format: ["(lon1, lat1), (lon2, lat2)", lon1, _, lat1, _, lon2, _, lat2, _]
    initialVals = {lon1: matchArray[1], lat1: matchArray[3], lon2: matchArray[5], lat2: matchArray[7]};
  }
  const [vals, setVals] = useState(initialVals);
 
  const handleUpdate = (newValue: string, key: string) => {
    setVals(prevVals => {
      let newVal = {[key]: newValue.toString()};
      let valsDict = {...prevVals, ...newVal};
      onUpdate(outputString(valsDict));
      return {...prevVals, ...newVal};
    });
  };

  const outputString = (valsDict) => {
    return `(${valsDict.lon1}, ${valsDict.lat1}), (${valsDict.lon2}, ${valsDict.lat2})`;
  }

  return(
    <div>
      <p id={id+"-lon1-LABEL"}>Longitude 1</p>
      <NumberInput
        id={id+"-lon1"}
        initialValue={vals.lon1}
        onUpdate={onUpdate !== undefined ? (newValue) => handleUpdate(newValue, "lon1") : undefined}
      />
      <p id={id+"-lat1-LABEL"}>Latitude 1</p>
      <NumberInput
        id={id+"-lat1"}
        initialValue={vals.lat1}
        onUpdate={onUpdate !== undefined ? (newValue) => handleUpdate(newValue, "lat1") : undefined}
      />
      <p id={id+"-lon2-LABEL"}>Longitude 2</p>
      <NumberInput
        id={id+"-lon2"}
        initialValue={vals.lon2}
        onUpdate={onUpdate !== undefined ? (newValue) => handleUpdate(newValue, "lon2") : undefined}
      />
      <p id={id+"-lat2-LABEL"}>Latitude 2</p>
      <NumberInput
        id={id+"-lat2"}
        initialValue={vals.lat2}
        onUpdate={onUpdate !== undefined ? (newValue) => handleUpdate(newValue, "lat2") : undefined}
      />
    </div>
  );
}
