import React from 'react';
import Form from './components/Form/Form';
import sampleSchema from './sample/sampleSchema.js';

function App() {
  return (
    <Form
      schema={{
        "type": "number",
      "title": "Number enum",
      "enum": [
        1,
        2,
        3
      ]
    }}
      uiSchema={{"numberEnumRadio": {
    "ui:widget": "radio",
    "ui:options": {
      "inline": true
    }
  }}}
    />
  );
}

export default App;
