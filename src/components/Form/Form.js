import React, {useState, useEffect} from 'react';
import SchemaParser from '../../utils/SchemaParser.js';
import reactInputMap from '../../utils/reactInputMap.js';
import Input from '../inputs/Input';
import Button from 'react-bootstrap/Button';

export default function Form({schema, uiSchema, externalData, schemaID, includeFields, handleSave}) {
  const [parsedSchema, setParsedSchema] = useState({});
  const [formData, setFormData] = useState({});
  const [updatedDict, setUpdatedDict] = useState({});

  // When a new schema is passed in, parse it to reload the form
  useEffect(() => {
    SchemaParser.parseSchemaWithUI(schema, uiSchema, schemaID, (parsed, err) => {
      if (err) {
        console.error(err);
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

  const saveForm = () => {
    setUpdatedDict({});
    handleSave(formData);
  };

  // Generates the React component heirarchy for the form from the parsed schema
  const generateForm = (fields) => {
    if (fields !== undefined && fields !== null) {
      if (fields.type === "InputGroup") {
        if (fields.items !== undefined) {
          // The specific list of items has been provided
          return (
            <div id={fields.id} key={fields.id}>
              {fields.label !== undefined &&
                <h2 id={fields.id + "-LABEL"}>{fields.label}</h2>}
              <div id={fields.id+"-INPUTS"}>
                {fields.items.map((field, i) => {
                  // If initial values have been passed in with the form data, overwrite the field object
                  if (formData[fields.id] !== undefined &&
                    Array.isArray(formData[fields.id]) && i < formData[fields.id].length) {
                    field.defaultValue = formData[fields.id][i];
                  }
                  // If the input group is of type array, add the array index for update handling
                  if (formData.groupType === "array") {
                    field.arrayIndex = i;
                  }

                  return generateForm(field);
                })}
              </div>
              {fields.description !== undefined &&
                <p id={fields.id + "-DESCRIPTION"}>{fields.description}</p>}
            </div>
          );
        } else {
          // A generic item format has been provided, so compute the number of elements that
          // should be rendered
          let listLength = 1;
          let valueCount = 0;
          let defaultsCount = 0;

          // If the list has a min length set that to the current list length
          if (fields.minItems !== undefined && fields.minItems > 0) {
            listLength = fields.minItems;
          }
          // If more values have been passed in with the form data than the min length, update the length 
          if (formData[fields.id] !== undefined && Array.isArray(formData[fields.id])) {
            valueCount = formData[fields.id].length;
            listLength = Math.max(listLength, valueCount);
          }
          // If there are more default values than the current list length, 
          if (fields.defaultValue !== undefined && fields.defaultValue.length > 0) {
            defaultsCount = fields.defaultValue.length;
            listLength = Math.max(listLength, defaultsCount);
          }

          return (
            <div id={fields.id} key={fields.id}>
              {fields.label !== undefined &&
                <h2 id={fields.id + "-LABEL"}>{fields.label}</h2>}
              <div id={fields.id+"-INPUTS"}>
                {[...Array(listLength)].map((_, i) => {
                  // For each element within the computed list length, check whether it has an initial value
                  let format = fields.itemFormat;
                  format.arrayIndex = i;
                  if (i < valueCount) {
                    format.defaultValue = formData[fields.id][i];
                    return generateForm(format);
                  } else if (i < defaultsCount) {
                    format.defaultValue = fields.defaultValue[i];
                    return generateForm(format);
                  } else {
                    format.defaultValue = undefined;
                    return generateForm(format);
                  }
                })}
              </div>
              {fields.description !== undefined &&
                <p id={fields.id + "-DESCRIPTION"}>{fields.description}</p>}
            </div>
          );
        }
      } else {
        const Field = reactInputMap[fields.type];
        if (Field !== undefined) {
          // At this point the fields argument is at the level of a single field that can be rendered
          const {type, id, defaultValue, arrayIndex, ...rest} = fields;
          
          // If the form data contains this field, overwrite the default value
          // Otherwise pass in the default if there is one
          let initialValue;
          if (formData[id] !== undefined) {
            initialValue = formData[id];
          } else if (defaultValue !== undefined) {
            initialValue = defaultValue;
          }

          if (includeFields.includes(id)) {
            if (arrayIndex !== undefined) {
              // If the input exists in an array, use the id with the index appended as a unique id
              let indexId = id + arrayIndex;
              return (
                <Input
                  Type={Field}
                  id={indexId}
                  key={indexId}
                  initialValue={initialValue}
                  updated={updatedDict[indexId]}
                  onUpdate={
                    (newValue) => {
                      // Overwrite the new value in the correct array data index
                      let arrayData = formData[id];
                      if (arrayIndex < arrayData.length) {
                        arrayData[arrayIndex] = newValue;
                      } else {
                        // If the earlier elements in the array have no values yet, set them to null
                        for (let i = arrayData.length; i < arrayIndex; i++) {
                          arrayData.push(null);
                        }
                        arrayData.push(newValue); // pushes at the correct index for this field
                      }

                      // Set the updated state for the field to true on update
                      let newUpdatedState = {[indexId]: true};
                      setUpdatedDict(prevDict => {
                        return {...prevDict, ...newUpdatedState}
                      });

                      setFormData(prevData => {
                        return {...prevData, ...arrayData};
                      });
                    }
                  }
                  handleSave={
                    () => {
                      let newData = {[id]: formData[id]};

                      // Remove the updated key on save
                      const {[indexId]: tmp, ...rest} = updatedDict;
                      setUpdatedDict(rest);

                      handleSave(newData);
                    }
                  }
                  {...rest}
                />);
            } else {
              return (
                <Input
                  Type={Field}
                  id={id}
                  key={id}
                  initialValue={initialValue}
                  updated={updatedDict[id]}
                  onUpdate={
                    (newValue) => {
                      // Overwrite the new value in the form data and use the hook setter
                      let newData = {[id]: newValue};

                      // Set the updated state for the field to true on update
                      let newUpdatedState = {[id]: true};
                      setUpdatedDict(prevDict => {
                        return {...prevDict, ...newUpdatedState};
                      });

                      setFormData(prevData => {
                        return {...prevData, ...newData};
                      });
                    }
                  }
                  handleSave={
                    () => {
                      let newData = {[id]: formData[id]};

                      // Remove the updated key on save
                      const {[id]: tmp, ...rest} = updatedDict;
                      setUpdatedDict(rest);

                      handleSave(newData);
                    }
                  }
                  {...rest}
                />);
            }
          } else {
            // This field should not be rendered to the page if it is not in the include list
            return null;
          }
        } else {
          // In the case where no matching field exists, return null
          return null;
        }
      }
    } else {
      // In the case where fields is empty, return null
      return null;
    }
  };

  return (
    <div className={schemaID+"-FORM"}>
      {generateForm(parsedSchema)}
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
