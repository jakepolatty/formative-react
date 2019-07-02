// @flow
import React, {useState, useEffect} from 'react';
import type {ComponentType, Element, Node} from 'react';
import FormGenerator from '../../utils/FormGenerator.js';
import SchemaParser from '../../utils/SchemaParser.js';
import Button from 'react-bootstrap/Button';

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

  const [formData: ?{[key: string]: any}, setFormData] = useState({});
  const [updatedDict: ?{[key: string]: any}, setUpdatedDict] = useState({});
  const [generatedForm, setGeneratedForm] = useState(null);

  // When a new schema is passed in, parse it to reload the form
  useEffect(() => {
    SchemaParser.parseSchemaWithUI(schema, uiSchema, schemaID, (parsed, err) => {
      if (err) {
        console.error(err);
      } else {
        let generator = new FormGenerator(formData, setFormData, updatedDict, setUpdatedDict,
          includeFields, handleSave);
        setGeneratedForm(generator.generateForm(parsed));
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

  const saveForm = () => {
    setUpdatedDict({});
    handleSave(formData);
  };

  return (
    <div className={schemaID+"-FORM"}>
      {generatedForm}
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
