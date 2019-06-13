import $RefParser from "json-schema-ref-parser";

class SchemaParser {
  /*
   * Converts the JSON schema into a fields object that can be displayed by Form.js
   */
  static parseSchema(jsonSchema) {
    $RefParser.dereference(jsonSchema, (err, schema) => {
      if (err) {
        console.error(err);
      } else {
        console.log(schema);
      }
    });
  }

  /*
   * Converts the JSON schema and UI schema into a fields object that can be displayed by Form.js
   */
  static parseSchemaWithUI(jsonSchema, uiSchema) {

  }
}

export default SchemaParser;