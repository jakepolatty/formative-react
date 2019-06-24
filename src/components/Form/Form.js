import React, {useState, useEffect} from 'react';
import SchemaParser from '../../utils/SchemaParser.js';
import reactInputMap from '../../utils/reactInputMap.js';

export default function Form({schema, uiSchema, externalData, handleSave}) {
  const [parsedSchema, setParsedSchema] = useState({});
  const [formData, setFormData] = useState({});

  // When a new schema is passed in, parse it to reload the form
  useEffect(() => {
    SchemaParser.parseSchemaWithUI(schema, uiSchema, (parsed, err) => {
      if (err) {
        console.error(err);
      } else {
        console.log(parsed);
        setParsedSchema(parsed);
      }
    });
  }, [schema, uiSchema]);

  // When new form data is passed in, reset the state object
  useEffect(() => {
    setFormData(externalData)
  }, [externalData]);

  // Generates the React component heirarchy for the form from the parsed schema
  const generateForm = (fields) => {
    if (fields !== undefined && fields !== null) {
      if (fields.type === "InputGroup") {
        if (fields.items !== undefined) {
          // The specific list of items has been provided
          return (
            <div id={fields.id} key={fields.id}>
              {fields.label !== undefined &&
                <h2 id={fields.id + "-label"}>{fields.label}</h2>}
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
              {fields.description !== undefined &&
                <p id={fields.id + "-description"}>{fields.description}</p>}
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
                <h2 id={fields.id + "-label"}>{fields.label}</h2>}
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
              {fields.description !== undefined &&
                <p id={fields.id + "-description"}>{fields.description}</p>}
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

          if (arrayIndex !== undefined) {
            return (
              <Field
                id={id + arrayIndex}
                key={id + arrayIndex}
                initialValue={initialValue}
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

                    setFormData(prevData => {
                      return {...prevData, ...arrayData};
                    });
                  }
                }
                {...rest}
              />);
          } else {
            return (
              <Field
                id={id}
                key={id}
                initialValue={initialValue}
                onUpdate={
                  (newValue) => {
                    // Overwrite the new value in the form data and use the hook setter
                    let newData = {[id]: newValue};
                    setFormData(prevData => {
                      return {...prevData, ...newData};
                    });
                  }
                }
                {...rest}
              />);
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
    <div className="SchemaForm">
      {generateForm(parsedSchema)}
      <button
        onClick={() => handleSave(formData)}
        id="save-button"
      >Save</button>
    </div>
  );
}
