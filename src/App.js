import React from 'react';
import Form from './components/Form/Form';
import sampleSchema from './sample/sampleSchema.js';

function App() {
  return (
    <Form
      schema={{
  "title": "A single-field form",
  "type": "boolean",
}}
      uiSchema={{}}
    />
  );
}

export default App;
