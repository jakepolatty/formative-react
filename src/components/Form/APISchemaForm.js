import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Form from './Form';

export default function APISchemaForm({apiEndpoint, uiSchema}) {
  const [schema, setSchema] = useState({});

  useEffect(() => {
    async function fetchSchema() {
      axios.get(apiEndpoint).then(data => {
        const jsonSchema = JSON.parse(data);
        setSchema(jsonSchema);
      });
    }

    fetchSchema();
  }, [apiEndpoint]);

  return (
    <div className="App">
      <Form
        schema={schema}
        uiSchema={uiSchema}
      />
    </div>
  );
};