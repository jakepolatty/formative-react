import React from 'react';
import APISchemaForm from './components/Form/APISchemaForm';
// import sampleSchema from './sample/sampleSchema.js';

function App() {
  return (
    <APISchemaForm
      apiEndpoint="http://localhost:8888/api/"
      uiSchema={{
        "bio": {
          "ui:component": "TextAreaInput",
          "rows": 4
        }
      }}
    />
  );
}

export default App;
