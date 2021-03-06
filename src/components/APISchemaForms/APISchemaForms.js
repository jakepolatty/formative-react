// @flow
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Form from '../Form/Form';

type SchemaType = {
  "schema": string,
  "include": Array<string>
}

export type FormsProps = {
  schemaEndpoint: string,
  schemas: {[schema: string]: SchemaType},
  dataApiEndpoint: string,
  uiSchema: {[key: string]: any},
  customInputMap: {[key: string]: any},
  onError: (string) => void
};

export default function APISchemaForms(props: FormsProps) {
  let {schemaEndpoint, schemas, dataApiEndpoint, uiSchema, customInputMap, onError} = props;
  const [schemaObject, setSchemaObject] = useState({});
  const [dataObject, setDataObject] = useState({});

  useEffect(() => {
    async function fetchSchemas() {
      // Make axios get requests to retrieve the schema for each of the specified keys
      let schemaKeys: Array<string> = Object.keys(schemas);
      let schemaData = await Promise.all(schemaKeys.map((key) => {
        let schema = schemas[key].schema;
        return axios.get(schemaEndpoint + schema + ".json").then(res => {
          return {schemaObject: res.data, key: key, schema: schema};
        })
      })).catch(err => {
        onError(err.message);
        return [];
      });;

      // Get all schemas used in the form group to retrieve data from the api
      let uniqueSchemas: Array<string> = [...new Set(schemaKeys.map(key => {
        return schemas[key].schema;
      }))];

      let formData = await Promise.all(uniqueSchemas.map(schema => {
        return axios.get(dataApiEndpoint + schema + "/").then(res => {
          return {data: res.data, schema: schema};
        });
      })).catch(err => {
        onError(err.message);
        return [];
      });;

      let schemaObject = {};
      schemaData.forEach((data) => {
        schemaObject[data.key] = {schemaObject: data.schemaObject, schema: data.schema};
      });

      let dataObject = {};
      formData.forEach((data) => {
        dataObject[data.schema] = data.data;
      })

      setSchemaObject(schemaObject);
      setDataObject(dataObject);
    }

    fetchSchemas();
  }, [schemaEndpoint, schemas, dataApiEndpoint]);

  const saveFormData = (formData: {[key: string]: any}, schemaType: string) => {
    let schemaData = dataObject[schemaType];
    let mergedData = Object.assign(schemaData, formData);
    axios.post(dataApiEndpoint + schemaType + "/", mergedData).then(res => {
      if (res.data !== undefined && res.data !== null) {
        setDataObject(Object.assign(dataObject, {[schemaType]: res.data}));
      } else {
        onError("There was a problem saving the data to the server.");
      }
    }).catch(err => {
      onError(err.message);
    });
  };

  return (
    <div className="APISchemaForm">
      {
        Object.keys(schemaObject).map((key) => {
          let schemaType = schemaObject[key].schema;
          let filteredData = {};
          if (dataObject[schemaType] !== undefined && schemas[key] !== undefined) {
            if (schemas[key].include === undefined) {
              schemas[key].include = [];
            }
            schemas[key].include.forEach((dataKey) => {
              filteredData[dataKey] = dataObject[schemaType][dataKey];
            });
          }

          return (
            <Form
              schema={schemaObject[key].schemaObject}
              uiSchema={uiSchema[schemaType]}
              customInputMap={customInputMap}
              externalData={filteredData}
              handleSave={(formData) => saveFormData(formData, schemaType)}
              schemaID={key}
              includeFields={schemas[key] !== undefined ? schemas[key].include : []}
              key={key}
              onError={onError}
            />
          );
        })
      }
    </div>
  );
};