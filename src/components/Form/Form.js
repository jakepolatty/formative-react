import React, {useState, useEffect} from 'react';
import TextInput from '../inputs/TextInput';
import IntegerInput from '../inputs/IntegerInput';
import RadioInput from '../inputs/RadioInput';

export default function Form({schema, uiSchema}) {
  return (
    <div className="App">
      <TextInput
        id="test-id"
        initialValue="Brian"
        onUpdate={(n, v) => console.log(n, v)}
      />
      <IntegerInput
        id="num-input"
        initialValue={42}
        onUpdate={(n, v) => console.log(n, v)}
      />
      <RadioInput
        id="radio-input"
        options={["A", "B", 3]}
        initialValue="B"
        onUpdate={(n, v) => console.log(n, v)}
      />
    </div>
  );
}
