import React, {useState, useEffect} from 'react';
import SchemaParser from '../../utils/SchemaParser.js';
import TextInput from '../inputs/TextInput';
import IntegerInput from '../inputs/IntegerInput';
import RadioInput from '../inputs/RadioInput';
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
  }, []);

  const generateForm = (fields) => {
    if (fields !== {}) {
      if (fields.type === "InputGroup") {
        if (fields.items !== undefined) {
          // The specific list of items has been provided
        } else {
          // A generic item format has been provided
          return (
            <div id={fields.id}>

            </div>
          );
        }
      } else {
        const Field = reactInputMap[fields.type];
        if (Field !== undefined) {
          // At this point the fields argument is at the level of a single field that can be rendered
          const {type, ...rest} = fields;
          return (<Field {...rest}/>);
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
      <TextInput
        id="test-id"
        initialValue="Brian"
        onUpdate={(n, v) => console.log(n, v)}
      />
      <IntegerInput
        id="num-input"
        initialValue={42}
        onUpdate={(n, v) => console.log(n, v)}
      />
      <RadioInput
        id="radio-input"
        options={["A", "B", 3]}
        initialValue="B"
        onUpdate={(n, v) => console.log(n, v)}
      />
      {generateForm(parsedSchema)}
    </div>
  );
}
