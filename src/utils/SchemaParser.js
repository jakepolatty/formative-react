import $RefParser from "json-schema-ref-parser";
import SchemaLayerParsers from "./SchemaLayerParsers";
import isEmpty from "lodash.isempty";

class SchemaParser {
  /**********************
   * Main Parsing Methods
   **********************/

  // Converts the JSON schema into a fields object that can be displayed by the Form component
  static parseSchema(jsonSchema, schemaID, customInputMap, callback) {
    $RefParser.dereference(jsonSchema, (err, schema) => {
      if (err) {
        callback(null, err);
      } else {
        callback(SchemaParser.convertSchemaLayer(schema, schemaID, {}, customInputMap), null);
      }
    });
  }

  // Converts the JSON schema and UI schema into a fields object that can be displayed by Form.js
  static parseSchemaWithUI(jsonSchema, uiSchema, schemaID, customInputMap, callback) {
    if (uiSchema === null || uiSchema === undefined || isEmpty(uiSchema)) {
      SchemaParser.parseSchema(jsonSchema, schemaID, customInputMap, callback);
    } else {
      $RefParser.dereference(jsonSchema, (err, schema) => {
        if (err) {
          callback(null, err);
        } else {
          callback(SchemaParser.convertSchemaLayer(schema, schemaID, uiSchema, customInputMap), null);
        }
      });
    }
  }

  // Takes in the current layer of the schema, the key referring to that layer, and the whole UI schema,
  // and returns an object representing that level of the schema that can be processed by the Form component
  static convertSchemaLayer(schema, currentKey, uiSchema, customInputMap) {
    if (schema === null || schema === undefined) {
      return null;
    } else if (schema.type === "object") {
      return SchemaLayerParsers.parseObjectLayer(schema, currentKey, uiSchema, customInputMap)
    } else if (schema.type === "array") {
      return SchemaLayerParsers.parseArrayLayer(schema, currentKey, uiSchema, customInputMap);
    } else if (schema.type === "string") {
      return SchemaLayerParsers.parseStringLayer(schema, currentKey, uiSchema[currentKey], customInputMap);
    } else if (schema.type === "number") {
      return SchemaLayerParsers.parseNumberLayer(schema, currentKey, uiSchema[currentKey], customInputMap);
    } else if (schema.type === "integer") {
      return SchemaLayerParsers.parseIntegerLayer(schema, currentKey, uiSchema[currentKey], customInputMap);
    } else if (schema.type === "boolean") {
      return SchemaLayerParsers.parseBooleanLayer(schema, currentKey, uiSchema[currentKey], customInputMap);
    } else if (schema.anyOf !== undefined && schema.anyOf.length > 0) {
      return SchemaLayerParsers.parseAnyOfLayer(schema, currentKey, uiSchema, customInputMap);
    } else if (schema.oneOf !== undefined && schema.oneOf.length > 0) {
      return SchemaLayerParsers.parseOneOfLayer(schema, currentKey, uiSchema, customInputMap);
    } else if (schema.enum !== undefined && schema.enum.length > 0) {
      return SchemaLayerParsers.parseStringLayer(schema, currentKey, uiSchema[currentKey], customInputMap);
    } else {
      return null;
    }
  }
}

export default SchemaParser;