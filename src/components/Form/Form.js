// @flow
import React, {useState, useEffect, useReducer} from 'react';
import type {Element} from 'react';
import FormGenerator from './FormGeneration/FormGenerator.js';
import type {FieldsType} from './FormGeneration/FormGenerator.js'
import SchemaParser from '../../utils/SchemaParser.js';
import Button from 'react-bootstrap/Button';


// Updated context type and definition
type UpdatedContextType = {
  updatedDict: {[key: string]: any},
  dispatch: Function
}

export const UpdatedContext = React.createContext<UpdatedContextType>(
  {updatedDict: {}, dispatch: () => {return null}});


// Updated dictionary reducer
type ReducerActionType = {
  type: string,
  payload: string
}

function updateReducer(dict: {[key: string]: any}, {type, payload}: ReducerActionType) {
  switch (type) {
    case "reset":
      return {};
    case "update":
      return {...dict, [payload]: true};
    case "save-field":
      const {[payload]: _, ...rest} = dict;
      return rest;
    default:
      return dict;
  }
}


type FormProps = {
  schema: {[key: string]: any} | null,
  uiSchema: {[key: string]: any} | null,
  externalData: {[key: string]: any} | null,
  schemaID: string,
  includeFields: Array<string>,
  handleSave: ({[key: string]: any}) => void
};

export default function Form(props: FormProps): Element<'div'> {
  let {schema, uiSchema, externalData, schemaID, includeFields, handleSave} = props;

  const [parsedSchema: ?FieldsType, setParsedSchema] = useState({});
  const [formData: ?{[key: string]: any}, setFormData] = useState({});
  const [updatedDict: ?{[key: string]: any}, dispatch] = useReducer(updateReducer, {});
  const [generatedForm, setGeneratedForm] = useState(null);

  // When a new schema is passed in, parse it to reload the form
  useEffect(() => {
    SchemaParser.parseSchemaWithUI(schema, uiSchema, schemaID, (parsed, err) => {
      if (err) {
        console.error("Malformatted JSON schema");
      } else {
        setParsedSchema(parsed);
      }
    });
  }, [schema, uiSchema, schemaID]);

  // When new form data is passed in, reset the state object
  useEffect(() => {
    if (externalData === undefined || externalData === null) {
      setFormData({});
    } else {
      setFormData(externalData);
    }
  }, [externalData]);

  // When either the schema or the form data updates, reload the form
  useEffect(() => {
    setGeneratedForm(generator.generateForm(parsedSchema));
  }, [parsedSchema, externalData]);

  const saveForm = () => {
    dispatch({type: "reset", payload: ""});
    handleSave(formData);
  };

  const saveField = (id) => {
    setFormData(data => {
      handleSave({[id]: data[id]});
      return data;
    });
  }

  let generator = new FormGenerator(formData, setFormData, includeFields, saveField);

  return (
    <div className={schemaID+"-FORM"}>
      <UpdatedContext.Provider value={{updatedDict, dispatch}}>
        {generatedForm}
      </UpdatedContext.Provider>
      <Button
        variant={Object.entries(updatedDict).length === 0 ? "light" : "success"}
        disabled={Object.entries(updatedDict).length === 0}
        id={schemaID+"-SAVE"}
        onClick={() => saveForm()}
      >
        Save
      </Button>
    </div>
  );
}
