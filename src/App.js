import React from 'react';
import APISchemaForm from './components/Form/APISchemaForm';
// import sampleSchema from './sample/sampleSchema.js';

function App() {
  return (
    <div className="App" margin="20px">
      <APISchemaForm
        apiEndpoint="http://localhost:8888/api/"
        uiSchema={{
          "bio": {
            "ui:component": "TextAreaInput",
            "rows": 4
          }
        }}
      />
    </div>
  );
}

export default App;
