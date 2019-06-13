import React from 'react';
import Form from './components/Form/Form';
import sampleSchema from './sample/sampleSchema.js';

function App() {
  return (
    <Form
      schema={sampleSchema}
      uiSchema={{}}
    />
  );
}

export default App;
