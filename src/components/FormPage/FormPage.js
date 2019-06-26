import React from 'react';
import APISchemaForms from '../Form/APISchemaForms';
// These will be local to the project
import sampleUISchema from '../../sample/sampleUISchema.js';
import '../../sample/sampleCSS.css';

export default function FormPage({index, schemaEndpoint, schemas, dataApiEndpoint, uiSchema}) {
  return (
    <div id={"page-" + index}>
      <APISchemaForms
        schemaEndpoint={schemaEndpoint}
        schemas={schemas}
        dataApiEndpoint={dataApiEndpoint}
        uiSchema={uiSchema}
      />
    </div>
  );
};