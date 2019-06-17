import $RefParser from "json-schema-ref-parser";
import inputTypeMap from "./inputTypeMap.js";

class SchemaParser {
  /**********************
   * Main Parsing Methods
   **********************/

  // Converts the JSON schema into a fields object that can be displayed by the Form component
  static parseSchema(jsonSchema, callback) {
    $RefParser.dereference(jsonSchema, (err, schema) => {
      if (err) {
        callback(null, err);
      } else {
        callback(SchemaParser.convertSchemaLayer(schema, "root", {}), null);
      }
    });
  }

  // Converts the JSON schema and UI schema into a fields object that can be displayed by Form.js
  static parseSchemaWithUI(jsonSchema, uiSchema, callback) {
    // == null coerces the variable to cover both the null and undefined cases
    if (uiSchema == null || SchemaParser.isEmptyObject(uiSchema)) {
      SchemaParser.parseSchema(jsonSchema, callback);
    } else {
      $RefParser.dereference(jsonSchema, (err, schema) => {
      if (err) {
        callback(null, err);
      } else {
        callback(SchemaParser.convertSchemaLayer(schema, "root", uiSchema), null);
      }
    });
    }
  }

  /***************************
   * JSON Manipulation Methods
   ***************************/

  // Takes in the current layer of the schema, the key referring to that layer, and the whole UI schema,
  // and returns an object representing that level of the schema that can be processed by the Form component
  static convertSchemaLayer(schema, currentKey, uiSchema) {
    if (schema.type === "object") {
      let fields = schema.properties;
      return SchemaParser.parseObjectLayer(schema, currentKey, uiSchema)
    } else if (schema.type === "array") {
      let fields = schema.items;
      return SchemaParser.parseArrayLayer(schema, currentKey, uiSchema);
    } else if (schema.type === "string") {
      return SchemaParser.parseStringLayer(schema, currentKey, uiSchema[currentKey]);
    } else if (schema.type === "number") {
      return SchemaParser.parseNumberLayer(schema, currentKey, uiSchema[currentKey]);
    } else if (schema.type === "integer") {
      return SchemaParser.parseIntegerLayer(schema, currentKey, uiSchema[currentKey]);
    } else if (schema.type === "boolean") {
      return SchemaParser.parseBooleanLayer(schema, currentKey, uiSchema[currentKey]);
    } else if (schema.type === "null" || schema.type === undefined) {
      return null;
    }
  }

  // Parses an object section of the schema and all of its component elements
  static parseObjectLayer(objLayer, key, uiSchema) {
    return {};
  }

  // Parses an array section of the schema and its elements
  static parseArrayLayer(arrayLayer, key, uiSchema) {
    let inputType = undefined;
    let fieldObject;
    const arrayTypes = inputTypeMap.array;

    if (uiSchema === undefined || uiSchema[key] === undefined
      || uiSchema[key]["ui:widget"] === undefined) {
      // The array should be rendered as a selection input if it has a single enumerated child,
      // otherwise it should be presented as a list of inputs
      if (arrayLayer.items !== undefined && arrayLayer.items.enum !== undefined) {
        inputType = arrayTypes.select;
        fieldObject = {type: inputType, id: key};
        fieldObject.items = arrayLayer.items.enum;
      } else {
        fieldObject = {type: "InputGroup", id: key};
        if (Array.isArray(arrayLayer.items)) {
          // Tuple Validation
          let itemsArray = arrayLayer.items.map((item, index) => {
            let itemKey = key + "-" + index;
            return SchemaParser.convertSchemaLayer(item, itemKey, uiSchema);
          });
          fieldObject.items = itemsArray;
        } else {
          // List Validation
          let itemKey = key + "-item"; 
          fieldObject.itemFormat = SchemaParser.convertSchemaLayer(arrayLayer.items, itemKey, uiSchema);
        }
      }
    } else {
      inputType = arrayTypes[uiSchema[key]["ui:widget"]];
      // The array should be rendered as a selection input if it has a single enumerated child,
      // otherwise it should be presented as a list of inputs
      if (inputType !== undefined && arrayLayer.items !== undefined && arrayLayer.items.enum !== undefined) {
        fieldObject = {type: inputType, id: key};
        // Append the UI schema options to the field
        Object.assign(fieldObject, uiSchema[key]);
        fieldObject.items = arrayLayer.items.enum;
      } else {
        if (Array.isArray(arrayLayer.items)) {
          let itemsArray = arrayLayer.items.map((item, index) => {
            let itemKey = key + "-" + index;
            return SchemaParser.convertSchemaLayer(item, itemKey, uiSchema);
          });
          fieldObject.items = itemsArray;
        } else {
          // List Validation
          let itemKey = key + "-item"; 
          fieldObject.itemFormat = SchemaParser.convertSchemaLayer(arrayLayer.items, itemKey, uiSchema);
        }
      }
    }

    // Append the top level JSON schema fields to the field data object
    Object.assign(fieldObject,
      arrayLayer.title !== undefined && {label: arrayLayer.title},
      arrayLayer.description !== undefined && {description: arrayLayer.description},
      arrayLayer.default !== undefined && {default: arrayLayer.default},
      arrayLayer.minItems !== undefined && {minItems: arrayLayer.minItems},
      arrayLayer.maxItems !== undefined && {maxItems: arrayLayer.maxItems},
      arrayLayer.uniqueItems !== undefined && {unique: arrayLayer.uniqueItems});

    // Add additional items field if it exists and is not set to false
    if (arrayLayer.additionalItems !== undefined && arrayLayer.additionalItems !== false) {
      let itemKey = key + "-addItem";
      fieldObject.additionalItemFormat = SchemaParser.convertSchemaLayer(arrayLayer.additionalItems,
        itemKey, uiSchema);
    }

    return fieldObject;
  }

  // Parses a string valued field from the schema
  static parseStringLayer(strLayer, key, uiOptions) {
    let inputType = undefined;
    let fieldObject;
    const stringTypes = inputTypeMap.string;
    const defaultType = strLayer.enum !== undefined ? strLayer.select : strLayer.text;

    if (uiOptions === undefined || uiOptions["ui:widget"] === undefined) {
      // Check for a special string format passed in with the schema JSON
      if (strLayer.format !== undefined) {
        inputType = stringTypes[strLayer.format];
      }

      inputType = (inputType !== undefined) ? inputType : defaultType;
      fieldObject = {type: inputType, id: key};
    } else {
      inputType = stringTypes[uiOptions["ui:widget"]];
      inputType = (inputType !== undefined) ? inputType : defaultType;

      fieldObject = {type: inputType, id: key};
      // Append the UI schema options to the field
      Object.assign(fieldObject, uiOptions);
    }

    // Append the relevant JSON schema fields to the field data
    Object.assign(fieldObject,
      strLayer.title !== undefined && {label: strLayer.title},
      strLayer.description !== undefined && {description: strLayer.description},
      strLayer.default !== undefined && {initialValue: strLayer.default});

    // If the schema contains an enum field, append these options
    if (strLayer.enum !== undefined) {
      fieldObject.options = strLayer.enum;
    }

    return fieldObject;
  }

  // Parses a numerical field from the schema
  static parseNumberLayer(numLayer, key, uiOptions) {
    let inputType;
    let fieldObject;
    const numberTypes = inputTypeMap.number;
    const defaultType = numLayer.enum !== undefined ? numberTypes.select : numberTypes.number;

    if (uiOptions === undefined || uiOptions["ui:widget"] === undefined) {
      inputType = defaultType;
      fieldObject = {type: inputType, id: key};
    } else {
      inputType = numberTypes[uiOptions["ui:widget"]];
      inputType = (inputType !== undefined) ? inputType : defaultType;
      fieldObject = {type: inputType, id: key};

      // Append the UI schema options to the field
      Object.assign(fieldObject, uiOptions);
    }

    // Append the relevant JSON schema fields to the field data
    Object.assign(fieldObject,
      numLayer.title !== undefined && {label: numLayer.title},
      numLayer.description !== undefined && {description: numLayer.description},
      numLayer.default !== undefined && {initialValue: numLayer.default},
      numLayer.multipleOf !== undefined && {increment: numLayer.multipleOf},
      numLayer.minimum !== undefined && {min: numLayer.minimum},
      numLayer.maximum !== undefined && {max: numLayer.maximum},
      numLayer.exclusiveMinimum !== undefined && {exclusiveMin: numLayer.exclusiveMinimum},
      numLayer.exclusiveMaximum !== undefined && {exclusiveMax: numLayer.exclusiveMaximum});

    // If the schema contains an enum field, append these options
    if (numLayer.enum !== undefined) {
      fieldObject.options = numLayer.enum;
    }

    return fieldObject;
  }

  // Parses an integer field from the schema
  static parseIntegerLayer(intLayer, key, uiOptions) {
    let inputType;
    let fieldObject;
    const integerTypes = inputTypeMap.integer;
    const defaultType = intLayer.enum !== undefined ? integerTypes.select : integerTypes.integer;

    if (uiOptions === undefined || uiOptions["ui:widget"] === undefined) {
      inputType = defaultType;
      fieldObject = {type: inputType, id: key};
    } else {
      inputType = integerTypes[uiOptions["ui:widget"]];
      inputType = (inputType !== undefined) ? inputType : defaultType;
      fieldObject = {type: inputType, id: key};

      // Append the UI schema options to the field
      Object.assign(fieldObject, uiOptions);
    }

    // Append the relevant JSON schema fields to the field data
    Object.assign(fieldObject,
      intLayer.title !== undefined && {label: intLayer.title},
      intLayer.description !== undefined && {description: intLayer.description},
      intLayer.default !== undefined && {initialValue: intLayer.default},
      intLayer.multipleOf !== undefined && {increment: intLayer.multipleOf},
      intLayer.minimum !== undefined && {min: intLayer.minimum},
      intLayer.maximum !== undefined && {max: intLayer.maximum},
      intLayer.exclusiveMinimum !== undefined && {exclusiveMin: intLayer.exclusiveMinimum},
      intLayer.exclusiveMaximum !== undefined && {exclusiveMax: intLayer.exclusiveMaximum});

    // If the schema contains an enum field, append these options
    if (intLayer.enum !== undefined) {
      fieldObject.options = intLayer.enum;
    }

    return fieldObject;
  }

  // Parses a boolean field from the schema
  static parseBooleanLayer(boolLayer, key, uiOptions) {
    let inputType;
    let fieldObject;
    const booleanTypes = inputTypeMap.boolean;

    if (uiOptions === undefined || uiOptions["ui:widget"] === undefined) {
      inputType = booleanTypes.checkbox;
      fieldObject = {type: inputType, id: key};
    } else {
      inputType = booleanTypes[uiOptions["ui:widget"]];
      inputType = (inputType !== undefined) ? inputType : booleanTypes.checkbox;
      fieldObject = {type: inputType, id: key};

      // Append the UI schema options to the field
      Object.assign(fieldObject, uiOptions);
    }

    // Append the relevant JSON schema fields to the field data
    Object.assign(fieldObject,
      boolLayer.title !== undefined && {label: boolLayer.title},
      boolLayer.description !== undefined && {description: boolLayer.description},
      boolLayer.default !== undefined && {initialValue: boolLayer.default});
    return fieldObject;
  }


  /****************
   * Helper Methods
   ****************/

  // Helper method for checking whether an object is empty
  static isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
  }
}

export default SchemaParser;