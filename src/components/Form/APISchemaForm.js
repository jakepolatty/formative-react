import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Form from './Form';

export default function APISchemaForm({apiEndpoint, uiSchema}) {
  const [schema, setSchema] = useState({});
  const [data, setData] = useState({});

  useEffect(() => {
    async function fetchSchema() {
      axios.get(apiEndpoint).then(res => {
        if (res.data !== undefined && res.data !== null) {
          const json = JSON.parse(res.data);
          console.log(json)
          setSchema(json.schema);
          setData(json.data);
        } else {
          console.error("There was an error retrieving the data from the specified endpoint.")
        }
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