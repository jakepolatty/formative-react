import React, {useState, useEffect} from 'react';
import SchemaParser from '../../utils/SchemaParser.js';
import reactInputMap from '../../utils/reactInputMap.js';

export default function Form({schema, uiSchema}) {
  const [parsedSchema, setParsedSchema] = useState({});

  useEffect(() => {
    SchemaParser.parseSchemaWithUI(schema, uiSchema, (parsed, err) => {
      if (err) {
        console.error(err);
      } else {
        console.log(parsed)
        setParsedSchema(parsed);
      }
    });
    // Disable the eslint warning for [] didMount syntax
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateForm = (fields) => {
    if (fields !== undefined && fields !== {}) {
      if (fields.type === "InputGroup") {
        if (fields.items !== undefined) {
          // The specific list of items has been provided
          return (
            <div id={fields.id} key={fields.id}>
              {fields.items.map((field) => {
                return generateForm(field);
              })}
            </div>
          );
        } else {
          // A generic item format has been provided, so compute the number of elements that
          // should be rendered
          let listLength = 1;
          let initialValuesCount = 0;

          if (fields.minLength !== undefined && fields.minLength > 0) {
            listLength = fields.minLength;
          }
          if (fields.initialValues !== undefined && fields.initialValues.length > 0) {
            initialValuesCount = fields.initialValues.length;
            listLength = Math.max(listLength, fields.initialValuesCount);
          }

          return (
            <div id={fields.id} key={fields.id}>
              {[...Array(listLength)].map((_, i) => {
                // For each element within the default list link, check whether it has an initial value
                if (i < initialValuesCount) {
                  let format = fields.inputFormat;
                  format.initialValue = fields.initialValues[i];
                  return generateForm(format);
                } else {
                  return generateForm(fields.itemFormat);
                }
              })}
            </div>
          );
        }
      } else {
        const Field = reactInputMap[fields.type];
        if (Field !== undefined) {
          // At this point the fields argument is at the level of a single field that can be rendered
          const {type, id, ...rest} = fields;
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
    <div className="App">
      {generateForm(parsedSchema)}
    </div>
  );
}
