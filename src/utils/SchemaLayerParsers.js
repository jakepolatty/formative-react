import inputTypeMap from "../inputMaps/inputTypeMap.js";
import SchemaParser from './SchemaParser';
import isEqual from 'lodash.isequal';

class SchemaLayerParsers {
  // Parses an object section of the schema and all of its component elements
  static parseObjectLayer(objLayer, key, uiSchema) {
    let fieldGroupObject = {type: "InputGroup", id: key};

    let itemsArray = Object.keys(objLayer.properties).map((propKey) => {
      let itemLayer = SchemaParser.convertSchemaLayer(objLayer.properties[propKey], propKey, uiSchema);
      // Add a required flag to the layer if it is required
      if (itemLayer !== null && itemLayer !== undefined) {
        if (objLayer.required !== undefined && objLayer.required.includes(propKey)) {
          itemLayer.required = true;
        }
        return itemLayer;
      } else {
        return null;
      }
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

    if (arrayLayer.items !== undefined && arrayLayer.items.enum !== undefined) {
      if (uiSchema === undefined || uiSchema[key] === undefined
        || uiSchema[key]["ui:component"] === undefined) {
        inputType = defaultType;
      } else {
        inputType = uiSchema[key]["ui:component"];
        if (!arrayTypes.includes(inputType)) {
          inputType = defaultType;
        }
      }

      fieldObject = {type: inputType, id: key};
      fieldObject.options = arrayLayer.items.enum;
    } else {
      fieldObject = {type: "InputGroup", id: key};
      if (Array.isArray(arrayLayer.items)) {
        // Tuple Validation
        let itemsArray = arrayLayer.items.map((item) => {
          return SchemaParser.convertSchemaLayer(item, key, uiSchema);
        });
        fieldObject.items = itemsArray;
      } else {
        // List Validation
        fieldObject.itemFormat = SchemaParser.convertSchemaLayer(arrayLayer.items, key, uiSchema);
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
      fieldObject.additionalItemFormat = SchemaParser.convertSchemaLayer(arrayLayer.additionalItems,
        key, uiSchema);
    }

    // Append the UI fields last to override any JSON schema defaults
    if (uiSchema !== undefined) {
      Object.assign(fieldObject, uiSchema[key]);
    }

    return fieldObject;
  }

  // Parses a section of the schema wrapped by an anyOf validator
  static parseAnyOfLayer(anyOfLayer, key, uiSchema) {
    // Filter out any {type: "null"} fields, whose functionality is included in inputs by default
    let filteredLayers = [];
    for (let i = 0; i < anyOfLayer.anyOf.length; i++) {
      let childSchema = anyOfLayer.anyOf[i];
      if (childSchema.type !== "null") {
        filteredLayers.push(childSchema);
      }
    }

    let filteredLayer =
      {title: anyOfLayer.title, description: anyOfLayer.description, items: filteredLayers};

    return SchemaLayerParsers.parseSelectionOfLayer(filteredLayer, key, uiSchema);
  }

  // Parses a section of the schema wrapped by a oneOf validator
  static parseOneOfLayer(oneOfLayer, key, uiSchema) {
    // Filter out any {type: "null"} fields, whose functionality is included in inputs by default
    let filteredLayers = [];
    for (let i = 0; i < oneOfLayer.oneOf.length; i++) {
      let childSchema = oneOfLayer.oneOf[i];
      if (childSchema.type !== "null") {
        filteredLayers.push(childSchema);
      }
    }

    let filteredLayer =
      {title: oneOfLayer.title, description: oneOfLayer.description, items: filteredLayers};

    return SchemaLayerParsers.parseSelectionOfLayer(filteredLayer, key, uiSchema);
  }

  static parseSelectionOfLayer(ofLayer, key, uiSchema) {
    let parsedLayer = null;

    if (ofLayer.items.length === 1) {
      // In this case the anyOf field can be rendered directly as its non-null child
      parsedLayer = SchemaParser.convertSchemaLayer(ofLayer.items[0], key, uiSchema);
    } else if (ofLayer.items.length >= 2 && uiSchema !== undefined && uiSchema[key] !== undefined
      && uiSchema[key]["ui:format"] !== undefined) {
      // TODO: Handle anyOf schemas with multiple non-null children
      let format = uiSchema[key]["ui:format"];
      
      if (typeof format === "string") {
        for (let option of ofLayer.items) {
          if (format === option.title) {
            parsedLayer = SchemaParser.convertSchemaLayer(option, key, uiSchema);
          }
        }
      } else if (typeof format === "object") {
        for (let option of ofLayer.items) {
          if (isEqual(format, option)) {
            parsedLayer = SchemaParser.convertSchemaLayer(option, key, uiSchema);
          }
        }
      }
    } else {
      // The schema is incorrectly formatted if it has no remaining children
      return null;
    }

    if (parsedLayer !== null) {
      Object.assign(parsedLayer,
        ofLayer.title !== undefined && {label: ofLayer.title},
        ofLayer.description !== undefined && {description: ofLayer.description});

      return parsedLayer;
    } else {
      return null;
    }
  }

  // Parses a string valued field from the schema
  static parseStringLayer(strLayer, key, uiOptions) {
    let fieldObject;
    const stringTypes = inputTypeMap.string;
    const defaultType = strLayer.enum !== undefined ? "SelectInput" : "TextInput";

    fieldObject = SchemaLayerParsers.generateFieldObject(uiOptions, defaultType, stringTypes, key);

    // Append the relevant JSON schema fields to the field data
    Object.assign(fieldObject,
      strLayer.title !== undefined && {label: strLayer.title},
      strLayer.description !== undefined && {description: strLayer.description},
      strLayer.default !== undefined && {defaultValue: strLayer.default},
      strLayer.minLength !== undefined && {minLength: strLayer.minLength},
      strLayer.maxLength !== undefined && {maxLength: strLayer.maxLength},
      strLayer.pattern !== undefined && {pattern: strLayer.pattern});

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
    let fieldObject;
    const numberTypes = inputTypeMap.number;
    const defaultType = numLayer.enum !== undefined ? "SelectInput" : "NumberInput";

    fieldObject = SchemaLayerParsers.generateFieldObject(uiOptions, defaultType, numberTypes, key);

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
    let fieldObject;
    const integerTypes = inputTypeMap.integer;
    const defaultType = intLayer.enum !== undefined ? "SelectInput" : "NumberInput";

    fieldObject = SchemaLayerParsers.generateFieldObject(uiOptions, defaultType, integerTypes, key);

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
    let fieldObject;
    const booleanTypes = inputTypeMap.boolean;
    const defaultType = "CheckboxInput";

    fieldObject = SchemaLayerParsers.generateFieldObject(uiOptions, defaultType, booleanTypes, key);

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

  // Helper method for generating fieldObject type and id template from ui schema and valid options
  static generateFieldObject(uiOptions, defaultType, validTypes, key) {
    let inputType;
    let fieldObject;

    if (uiOptions === undefined || uiOptions["ui:component"] === undefined) {
      inputType = defaultType;
      fieldObject = {type: inputType, id: key};
    } else {
      inputType = uiOptions["ui:component"];
      if (!validTypes.includes(inputType)) {
        inputType = defaultType;
      }
      fieldObject = {type: inputType, id: key};
    }

    return fieldObject;
  }
}

export default SchemaLayerParsers;