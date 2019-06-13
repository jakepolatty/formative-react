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
    // == null coerces the variable to cover both the null and undefined cases
    if (uiSchema == null || SchemaParser.isEmptyObject(uiSchema)) {
      return SchemaParser.parseSchema(jsonSchema);
    } else {
      return {};
    }
  }

  /*
   * Helper method for checking whether an object is empty
   */
  static isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
  }
}

export default SchemaParser;