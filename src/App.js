import React from 'react';
import Form from './components/Form/Form';
import sampleSchema from './sample/sampleSchema.js';

function App() {
  return (
    <Form
      schema={{
  "title": "A single-field form",
  "format": "range",
  "type": "integer",
  "minimum": 20,
  "maximum": 30
}}
      uiSchema={{}}
    />
  );
}

export default App;
