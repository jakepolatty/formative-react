import $RefParser from "json-schema-ref-parser";

class SchemaParser {
  /**********************
   * Main Parsing Methods
   **********************/

  // Converts the JSON schema into a fields object that can be displayed by the Form component
  static parseSchema(jsonSchema) {
    $RefParser.dereference(jsonSchema, (err, schema) => {
      if (err) {
        console.error(err);
      } else {
        return SchemaParser.convertSchemaLayer(schema, "root", {});
      }
    });
  }

  // Converts the JSON schema and UI schema into a fields object that can be displayed by Form.js
  static parseSchemaWithUI(jsonSchema, uiSchema) {
    // == null coerces the variable to cover both the null and undefined cases
    if (uiSchema == null || SchemaParser.isEmptyObject(uiSchema)) {
      return SchemaParser.parseSchema(jsonSchema);
    } else {
      $RefParser.dereference(jsonSchema, (err, schema) => {
      if (err) {
        console.error(err);
      } else {
        return SchemaParser.convertSchemaLayer(schema, "root", uiSchema);
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
    if schema.type === "object" {
      let fields = schema.properties;

    } else if schema.type === "array" {
      let fields = schema.items;

    } else if schema.type === "string" {
      return parseStringLayer(schema, currentKey, uiSchema[currentKey]);
    } else if schema.type === "number" {
      return parseNumberLayer(schema, currentKey, uiSchema[currentKey]);
    } else if schema.type === "integer" {
      return parseIntegerLayer(schema, currentKey, uiSchema[currentKey]);
    } else if schema.type === "boolean" {
      return parseBooleanLayer(schema, currentKey, uiSchema[currentKey]);
    } else if (schema.type === "null" || schema.type === undefined) {
      return null;
    }
  }

  // Parses a string valued field from the schema
  static parseStringLayer(strLayer, key, uiOptions) {

  }

  // Parses a numerical field from the schema
  static parseNumberLayer(numLayer, key, uiOptions) {

  }

  // Parses an integer field from the schema
  static parseIntegerLayer(intLayer, key, uiOptions) {

  }

  // Parses a boolean field from the schema
  static parseBooleanLayer(boolLayer, key, uiOptions) {

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