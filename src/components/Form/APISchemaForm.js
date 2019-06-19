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
          setSchema(json.schema);
          setData(json.data);
        } else {
          console.error("There was an error retrieving the data from the specified endpoint.")
        }
      });
    }

    fetchSchema();
  }, [apiEndpoint]);

  const saveFormData = (formData) => {
    let headers = {
      "Access-Control-Allow-Origin": "*"
    };

    axios.post(apiEndpoint, formData).then(res => {
      if (res.data !== undefined && res.data !== null) {
        const json = JSON.parse(res.data);
        setData(json.data);
      } else {
        console.error("There was a problem saving the data to the server.");
      }
    }).catch(err => {
      console.error(err);
    });
  };

  return (
    <div className="App">
      <Form
        schema={schema}
        uiSchema={uiSchema}
        externalData={data}
        handleSave={(formData) => saveFormData(formData)}
      />
    </div>
  );
};