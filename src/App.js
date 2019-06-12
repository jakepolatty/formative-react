import React from 'react';
import {default as TextInput} from './components/inputs/TextInput.js';

function App() {
  return (
    <div className="App">
      <TextInput
        id="test-id"
        initialValue="Brian"
        onChange={(v) => console.log(v)}
      />
    </div>
  );
}

export default App;
