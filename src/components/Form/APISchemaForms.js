import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Form from './Form';

export default function APISchemaForms({schemaEndpoint, schemas, dataApiEndpoint, uiSchema}) {
  const [schemaObject, setSchemaObject] = useState({});
  const [dataObject, setDataObject] = useState({});

  useEffect(() => {
    async function fetchSchemas() {
      // Make axios get requests to retrieve the schema for each of the specified keys
      let schemaKeys = Object.keys(schemas);
      let schemaData = await Promise.all(schemaKeys.map((schema) => {
        return axios.get(schemaEndpoint + schema + ".json").then(res => {
          return {schema: res.data, key: schema};
        });
      }));

      let formData = await Promise.all(schemaKeys.map((schema) => {
        return axios.get(dataApiEndpoint + schema + "/").then(res => {
          return {data: res.data, key: schema};
        });
      }));

      let schemaObject = {};
      schemaData.map((data) => {
        schemaObject[data.key] = data.schema;
      });

      let dataObject = {};
      formData.map((data) => {
        dataObject[data.key] = data.data;
      })

      setSchemaObject(schemaObject);
      setDataObject(dataObject);
    }

    fetchSchemas();
  }, [schemaEndpoint, schemas, dataApiEndpoint]);

  const saveFormData = (formData, schemaKey) => {
    axios.post(dataApiEndpoint + schemaKey + "/", formData).then(res => {
      if (res.data !== undefined && res.data !== null) {
        setDataObject(res.data);
      } else {
        console.error("There was a problem saving the data to the server.");
      }
    }).catch(err => {
      console.error(err);
    });
  };

  return (
    <div className="APISchemaForm">
      {
        Object.keys(schemaObject).map((key) => {
          return (
            <Form
              schema={schemaObject[key]}
              uiSchema={uiSchema[key]}
              externalData={dataObject[key]}
              handleSave={(formData) => saveFormData(formData, key)}
              key={key}
            />
          );
        })
      }
    </div>
  );
};