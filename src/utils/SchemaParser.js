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
      return {};
    } else if (schema.type === "array") {
      let fields = schema.items;
      return {};
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

  // Parses a string valued field from the schema
  static parseStringLayer(strLayer, key, uiOptions) {
    let inputType = undefined;
    let fieldObject;
    const stringTypes = inputTypeMap.string;

    if (uiOptions === undefined || uiOptions["ui:widget"] === undefined) {
      if (strLayer.format !== undefined) {
        inputType = stringTypes[strLayer.format];
      }

      inputType = (inputType !== undefined) ? inputType : stringTypes.text;
      fieldObject = {type: inputType, id: key};
    } else {
      inputType = stringTypes[uiOptions["ui:widget"]];
      inputType = (inputType !== undefined) ? inputType : stringTypes.text;

      fieldObject = {type: inputType, id: key};
      // Append the UI schema options to the field
      Object.assign(fieldObject, uiOptions);
    }

    // Append the relevant JSON schema fields to the field data
    Object.assign(fieldObject,
      strLayer.title !== undefined && {label: strLayer.title},
      strLayer.description !== undefined && {description: strLayer.description},
      strLayer.default !== undefined && {initialValue: strLayer.default});
    return fieldObject;
  }

  // Parses a numerical field from the schema
  static parseNumberLayer(numLayer, key, uiOptions) {
    let inputType;
    let fieldObject;
    const numberTypes = inputTypeMap.number;

    if (uiOptions === undefined || uiOptions["ui:widget"] === undefined) {
      if (numLayer.format !== undefined) {
        inputType = numberTypes[numLayer.format];
      }

      inputType = (inputType !== undefined) ? inputType : numberTypes.number;
      fieldObject = {type: inputType, id: key};
    } else {
      inputType = numberTypes[uiOptions["ui:widget"]];
      inputType = (inputType !== undefined) ? inputType : numberTypes.number
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
    return fieldObject;
  }

  // Parses an integer field from the schema
  static parseIntegerLayer(intLayer, key, uiOptions) {
    let inputType;
    let fieldObject;
    const integerTypes = inputTypeMap.integer;

    if (uiOptions === undefined || uiOptions["ui:widget"] === undefined) {
      if (intLayer.format !== undefined) {
        inputType = integerTypes[intLayer.format];
      }

      inputType = (inputType !== undefined) ? inputType : integerTypes.integer;
      fieldObject = {type: inputType, id: key};
    } else {
      inputType = integerTypes[uiOptions["ui:widget"]];
      inputType = (inputType !== undefined) ? inputType : integerTypes.integer;
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
    return fieldObject;
  }

  // Parses a boolean field from the schema
  static parseBooleanLayer(boolLayer, key, uiOptions) {
    let inputType;
    let fieldObject;
    const booleanTypes = inputTypeMap.boolean;

    if (uiOptions === undefined || uiOptions["ui:widget"] === undefined) {
      if (boolLayer.format !== undefined) {
        inputType = booleanTypes[boolLayer.format];
      }

      inputType = (inputType !== undefined) ? inputType : booleanTypes.checkbox;
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