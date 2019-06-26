import React from 'react';
import APISchemaForms from './components/Form/APISchemaForms';
// import sampleSchema from './sample/sampleSchema.js';

function App() {
  return (
    <div className="App" margin="20px">
      <APISchemaForms
        schemaEndpoint="https://comt.s3.amazonaws.com/schema/"
        schemas={{
          "wms-a": {
            "schema": "wms",
            "include": ["layer", "style"]
          },
          "comt": {
            "schema": "comt",
            "include": ["project", "subproject", "model"]
          },
          "wms-b": {
            "schema": "wms",
            "include": ["opacity", "transparent", "elevation"]
          },
          
        }}
        dataApiEndpoint="http://localhost:8888/api/"
        uiSchema={{
          "wms": {
            "opacity": {
              "ui:component": "NumberSliderInput"
            },
            "transparent": {
              "ui:component": "RadioInput"
            }
          },
          "comt": {
            "subproject": {
              "ui:component": "TextAreaInput",
              "rows": 1
            }
          }
        }}
      />
    </div>
  );
}

export default App;
