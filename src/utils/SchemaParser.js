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
      return SchemaParser.parseObjectLayer(schema, currentKey, uiSchema)
    } else if (schema.type === "array") {
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
    let fieldGroupObject = {type: "InputGroup", id: key};

    let itemsArray = Object.keys(objLayer.properties).map((propKey) => {
      let itemLayer = SchemaParser.convertSchemaLayer(objLayer.properties[propKey], propKey, uiSchema);
      // Add a required flag to the layer if it is required
      if (objLayer.required !== undefined && objLayer.required.includes(propKey)) {
        itemLayer.required = true;
      }
      return itemLayer;
    });
    fieldGroupObject.items = itemsArray;

    // Append the top level fields to the group object
    Object.assign(fieldGroupObject,
      objLayer.title !== undefined && {label: objLayer.title},
      objLayer.description !== undefined && {description: objLayer.description},
      {groupType: "object"});

    return fieldGroupObject;
  }

  // Parses an array section of the schema and its elements
  static parseArrayLayer(arrayLayer, key, uiSchema) {
    let inputType = undefined;
    let fieldObject;
    const arrayTypes = inputTypeMap.array;
    const defaultType = "SelectInput";

    if (uiSchema === undefined || uiSchema[key] === undefined
      || uiSchema[key]["ui:component"] === undefined) {
      // The array should be rendered as a selection input if it has a single enumerated child,
      // otherwise it should be presented as a list of inputs
      if (arrayLayer.items !== undefined && arrayLayer.items.enum !== undefined) {
        inputType = defaultType;
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
      inputType = uiSchema[key]["ui:component"];
      if (!arrayTypes.includes(inputType)) {
        inputType = defaultType;
      }
      // The array should be rendered as a selection input if it has a single enumerated child,
      // otherwise it should be presented as a list of inputs
      if (arrayLayer.items !== undefined && arrayLayer.items.enum !== undefined) {
        fieldObject = {type: inputType, id: key};
        // Append the UI schema options to the field
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
      arrayLayer.default !== undefined && {defaultValue: arrayLayer.default},
      arrayLayer.minItems !== undefined && {minItems: arrayLayer.minItems},
      arrayLayer.maxItems !== undefined && {maxItems: arrayLayer.maxItems},
      arrayLayer.uniqueItems !== undefined && {unique: arrayLayer.uniqueItems},
      {groupType: "array"});

    // Add additional items field if it exists and is not set to false
    if (arrayLayer.additionalItems !== undefined && arrayLayer.additionalItems !== false) {
      let itemKey = key + "-addItem";
      fieldObject.additionalItemFormat = SchemaParser.convertSchemaLayer(arrayLayer.additionalItems,
        itemKey, uiSchema);
    }

    // Append the UI fields last to override any JSON schema defaults
    if (uiSchema !== undefined) {
      Object.assign(fieldObject, uiSchema[key]);
    }

    return fieldObject;
  }

  // Parses a string valued field from the schema
  static parseStringLayer(strLayer, key, uiOptions) {
    let inputType = undefined;
    let fieldObject;
    const stringTypes = inputTypeMap.string;
    const defaultType = strLayer.enum !== undefined ? "SelectInput" : "TextInput";

    if (uiOptions === undefined || uiOptions["ui:component"] === undefined) {
      // Check for a special string format passed in with the schema JSON
      inputType = defaultType;
      fieldObject = {type: inputType, id: key};
    } else {
      inputType = uiOptions["ui:component"];
      if (!stringTypes.includes(inputType)) {
        inputType = defaultType;
      }
      fieldObject = {type: inputType, id: key};
    }

    // Append the relevant JSON schema fields to the field data
    Object.assign(fieldObject,
      strLayer.title !== undefined && {label: strLayer.title},
      strLayer.description !== undefined && {description: strLayer.description},
      strLayer.default !== undefined && {defaultValue: strLayer.default});

    // If the schema contains an enum field, append these options
    if (strLayer.enum !== undefined) {
      fieldObject.options = strLayer.enum;
    }

    // Append the UI fields last to override any JSON schema defaults
    if (uiOptions !== undefined) {
      Object.assign(fieldObject, uiOptions);
    }


    return fieldObject;
  }

  // Parses a numerical field from the schema
  static parseNumberLayer(numLayer, key, uiOptions) {
    let inputType;
    let fieldObject;
    const numberTypes = inputTypeMap.number;
    const defaultType = numLayer.enum !== undefined ? "SelectInput" : "NumberInput";

    if (uiOptions === undefined || uiOptions["ui:component"] === undefined) {
      inputType = defaultType;
      fieldObject = {type: inputType, id: key};
    } else {
      inputType = uiOptions["ui:component"];
      if (!numberTypes.includes(inputType)) {
        inputType = defaultType;
      }
      fieldObject = {type: inputType, id: key};
    }

    // Append the relevant JSON schema fields to the field data
    Object.assign(fieldObject,
      numLayer.title !== undefined && {label: numLayer.title},
      numLayer.description !== undefined && {description: numLayer.description},
      numLayer.default !== undefined && {defaultValue: numLayer.default},
      numLayer.multipleOf !== undefined && {increment: numLayer.multipleOf},
      numLayer.minimum !== undefined && {min: numLayer.minimum},
      numLayer.maximum !== undefined && {max: numLayer.maximum},
      numLayer.exclusiveMinimum !== undefined && {exclusiveMin: numLayer.exclusiveMinimum},
      numLayer.exclusiveMaximum !== undefined && {exclusiveMax: numLayer.exclusiveMaximum});

    // If the schema contains an enum field, append these options
    if (numLayer.enum !== undefined) {
      fieldObject.options = numLayer.enum;
    }

    // Append the UI fields last to override any JSON schema defaults
    if (uiOptions !== undefined) {
      Object.assign(fieldObject, uiOptions);
    }

    return fieldObject;
  }

  // Parses an integer field from the schema
  static parseIntegerLayer(intLayer, key, uiOptions) {
    let inputType;
    let fieldObject;
    const integerTypes = inputTypeMap.integer;
    const defaultType = intLayer.enum !== undefined ? "SelectInput" : "NumberInput";

    if (uiOptions === undefined || uiOptions["ui:component"] === undefined) {
      inputType = defaultType;
      fieldObject = {type: inputType, id: key};
    } else {
      inputType = uiOptions["ui:component"];
      if (!integerTypes.includes(inputType)) {
        inputType = defaultType;
      }
      fieldObject = {type: inputType, id: key};
    }

    // Append the relevant JSON schema fields to the field data
    Object.assign(fieldObject,
      intLayer.title !== undefined && {label: intLayer.title},
      intLayer.description !== undefined && {description: intLayer.description},
      intLayer.default !== undefined && {defaultValue: intLayer.default},
      intLayer.multipleOf !== undefined && {increment: intLayer.multipleOf},
      intLayer.minimum !== undefined && {min: intLayer.minimum},
      intLayer.maximum !== undefined && {max: intLayer.maximum},
      intLayer.exclusiveMinimum !== undefined && {exclusiveMin: intLayer.exclusiveMinimum},
      intLayer.exclusiveMaximum !== undefined && {exclusiveMax: intLayer.exclusiveMaximum});

    // If the schema contains an enum field, append these options
    if (intLayer.enum !== undefined) {
      fieldObject.options = intLayer.enum;
    }

    // Append the UI fields last to override any JSON schema defaults
    if (uiOptions !== undefined) {
      Object.assign(fieldObject, uiOptions);
    }

    return fieldObject;
  }

  // Parses a boolean field from the schema
  static parseBooleanLayer(boolLayer, key, uiOptions) {
    let inputType;
    let fieldObject;
    const booleanTypes = inputTypeMap.boolean;
    const defaultType = "CheckboxInput";

    if (uiOptions === undefined || uiOptions["ui:component"] === undefined) {
      inputType = defaultType;
      fieldObject = {type: inputType, id: key};
    } else {
      inputType = uiOptions["ui:component"];
      if (!booleanTypes.includes(inputType)) {
        inputType = defaultType;
      }
      fieldObject = {type: inputType, id: key};
    }

    // Append the relevant JSON schema fields to the field data
    Object.assign(fieldObject,
      boolLayer.title !== undefined && {label: boolLayer.title},
      boolLayer.description !== undefined && {description: boolLayer.description},
      boolLayer.default !== undefined && {defaultValue: boolLayer.default});

    // Append the UI fields last to override any JSON schema defaults
    if (uiOptions !== undefined) {
      Object.assign(fieldObject, uiOptions);
    }

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