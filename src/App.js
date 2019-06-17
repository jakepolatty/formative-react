import React from 'react';
import Form from './components/Form/Form';
import sampleSchema from './sample/sampleSchema.js';

function App() {
  return (
    <Form
      schema={{
        "type": "array",
      "title": "A list of strings",
      "items": {
        "type": "string",
        "default": "bazinga"
      }
    }}
      uiSchema={{}}
    />
  );
}

export default App;
