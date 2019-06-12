import React from 'react';
import TextInput from './components/inputs/TextInput';
import NumberInput from './components/inputs/NumberInput';

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
    </div>
  );
}

export default App;
