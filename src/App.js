import React from 'react';
import APISchemaForm from './components/Form/APISchemaForm';
// import sampleSchema from './sample/sampleSchema.js';

function App() {
  return (
    <div className="App" margin="20px">
      <APISchemaForm
        schemaEndpoint="https://comt.s3.amazonaws.com/schema/"
        schemas={
          "acdd": {
            "include": []
          },
          "wms": {
            "include": []
          }
        }
        dataApiEndpoint="http://localhost:8888/api/"
        uiSchema={"wms": {
          "opacity": {
            "ui:component": "NumberSliderInput"
          }
        }}
      />
    </div>
  );
}

export default App;
