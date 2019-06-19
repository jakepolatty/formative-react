import React, {useState, useEffect} from 'react';
import SchemaParser from '../../utils/SchemaParser.js';
import reactInputMap from '../../utils/reactInputMap.js';

export default function Form({schema, uiSchema, externalData}) {
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
    console.log(externalData)
    setFormData(externalData)
  }, [externalData]);

  const generateForm = (fields) => {
    if (fields !== undefined && fields !== null) {
      if (fields.type === "InputGroup") {
        if (fields.items !== undefined) {
          // The specific list of items has been provided
          return (
            <div id={fields.id} key={fields.id}>
              {fields.label !== undefined &&
                <h2>{fields.label}</h2>}
              {fields.items.map((field) => {
                return generateForm(field);
              })}
              {fields.description !== undefined &&
                <p>{fields.description}</p>}
            </div>
          );
        } else {
          // A generic item format has been provided, so compute the number of elements that
          // should be rendered
          let listLength = 1;
          let defaultsCount = 0;

          if (fields.minLength !== undefined && fields.minLength > 0) {
            listLength = fields.minLength;
          }
          if (fields.defaultValue !== undefined && fields.defaultValue.length > 0) {
            defaultsCount = fields.defaultValue.length;
            listLength = Math.max(listLength, defaultsCount);
          }

          return (
            <div id={fields.id} key={fields.id}>
              {fields.label !== undefined &&
                <h2>{fields.label}</h2>}
              {[...Array(listLength)].map((_, i) => {
                // For each element within the default list link, check whether it has an initial value
                if (i < defaultsCount) {
                  let format = fields.inputFormat;
                  format.initialValue = fields.defaultValue[i];
                  return generateForm(format);
                } else {
                  return generateForm(fields.itemFormat);
                }
              })}
              {fields.description !== undefined &&
                <p>{fields.description}</p>}
            </div>
          );
        }
      } else {
        const Field = reactInputMap[fields.type];
        if (Field !== undefined) {
          // At this point the fields argument is at the level of a single field that can be rendered
          const {type, id, defaultValue, ...rest} = fields;

          return (<Field id={id} key={id} {...rest}/>);
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
    </div>
  );
}
