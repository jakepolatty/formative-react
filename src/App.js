import React from 'react';
import TextInput from './components/inputs/TextInput';
import NumberInput from './components/inputs/NumberInput';
import RadioInput from './components/inputs/RadioInput';

function App() {
  return (
    <div className="App">
      <TextInput
        id="test-id"
        initialValue="Brian"
        onUpdate={(n, v) => console.log(n, v)}
      />
      <NumberInput
        id="num-input"
        initialValue={42}
      />
      <RadioInput
        id="radio-input"
        options={["A", "B", 3]}
        initialIndex={2}
      />
    </div>
  );
}

export default App;
