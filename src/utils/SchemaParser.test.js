import SchemaParser from './SchemaParser';

const stringSchema = {
  title: "Description",
  description: "Human-readable description of the distribution",
  type: "string",
  minLength: 1,
  default: "Dataset #"
};

const stringEnumSchema = {
  title: "Public Access Level",
  description: "This may include information regarding access or restrictions",
  enum: [
    "public",
    "restricted public",
    "non-public"
  ]
};

const numberSchema = {
  title: "Elevation",
  description: "The elevation of a layer in meters",
  type: "number",
  minimum: -10994,
  maximum: 8848,
  multipleOf: 0.1
};

const integerSchema = {
  title: "Opacity",
  description: "The percentage opacity of the layer",
  type: "integer",
  exclusiveMaximum: 100,
  exclusiveMinimum: 0
};

const booleanSchema = {
  title: "Data Quality",
  description:  "Whether the dataset meets the agency’s Information Quality Guidelines (true/false).",
  type: "boolean"
};

const arrayFormatSchema = {
  title: "Tags",
  description:  "Tags (or keywords) help users discover your dataset",
  type: "array",
  items: {
    "type": "string",
    "minLength": 1
  },
  minItems: 1
};

const objectSchema = {
  title: "WMS",
  description: "A simple form for WMS specification.",
  type: "object",
  required: [
    "layer",
    "style"
  ],
  properties: {
    layer: {
      type: "string",
      title: "LAYER",
      enum: [
        "LayerA",
        "LayerB",
        "LayerC",
        "TODO_populate_this_enum_with_endpoint"
      ]
    },
    style: {
      type: "string",
      title: "STYLE",
      enum: [
        "StyleA",
        "StyleB",
        "StyleC",
        "TODO_populate_this_enum_with_endpoint"
      ]
    },
    opacity: {
      type: "integer",
      title: "Opacity"
    },
    transparent: {
      type: "boolean",
      title: "Transparent"
    },
    elevation: {
      type: "integer",
      title: "Elevation",
      enum: [
        1,
        2,
        3,
        4
      ]
    }
  }
};

const anyOfSchema = {
  title: "Spatial",
  description: "The range of spatial applicability of a dataset. Could include a spatial region like a bounding box or a named place.",
  anyOf: [
    {
      type: "string",
      minLength: 1
    },
    {
      type: "null"
    }
  ]
};

describe("SchemaParser", () => {
  it("should return null for an empty schema", () => {
    let parsed1 = SchemaParser.convertSchemaLayer(null, "root", {});
    expect(parsed1).toBeNull();

    let parsed2 = SchemaParser.convertSchemaLayer(undefined, "root", {});
    expect(parsed2).toBeNull();

    let parsed3 = SchemaParser.convertSchemaLayer({}, "root", {});
    expect(parsed3).toBeNull();
  });

  it("should parse string layers", () => {
    let parsed1 = SchemaParser.convertSchemaLayer(stringSchema, "description", {});
    expect(parsed1.label).toEqual("Description");
    expect(parsed1.description).toEqual("Human-readable description of the distribution");
    expect(parsed1.type).toEqual("TextInput");
    expect(parsed1.defaultValue).toEqual("Dataset #");
    expect(parsed1.minLength).toEqual(1);

    // Simple UI schema
    let parsed2 = SchemaParser.convertSchemaLayer(stringSchema, "description",
      {description: {"ui:component": "TextAreaInput", info: "An info popup"}});
    expect(parsed2.type).toEqual("TextAreaInput");
    expect(parsed2.info).toEqual("An info popup");

    // Invalid ui:component flag
    let parsed3 = SchemaParser.convertSchemaLayer(stringSchema, "description",
      {description: {"ui:component": "TextAreaInpu"}});
    expect(parsed3.type).toEqual("TextInput");
  });

  it("should parse enumerated value layers", () => {
    let parsed1 = SchemaParser.convertSchemaLayer(stringEnumSchema, "accessLevel", {});
    expect(parsed1.label).toEqual("Public Access Level");
    expect(parsed1.description).toEqual("This may include information regarding access or restrictions");
    expect(parsed1.type).toEqual("SelectInput");
    expect(parsed1.options).toEqual(["public", "restricted public", "non-public"]);

    // Simple UI schema
    let parsed2 = SchemaParser.convertSchemaLayer(stringEnumSchema, "accessLevel",
      {accessLevel: {"ui:component": "TextInput", "default": "public"}});
    expect(parsed2.type).toEqual("TextInput");
    expect(parsed2.default).toEqual("public");

    // Invalid ui:component flag
    let parsed3 = SchemaParser.convertSchemaLayer(stringEnumSchema, "accessLevel",
      {accessLevel: {"ui:component": "TextInpu"}});
    expect(parsed3.type).toEqual("SelectInput");
  });

  it("should parse number layers", () => {
    let parsed1 = SchemaParser.convertSchemaLayer(numberSchema, "elevation", {});
    expect(parsed1.label).toEqual("Elevation");
    expect(parsed1.description).toEqual("The elevation of a layer in meters");
    expect(parsed1.type).toEqual("NumberInput");
    expect(parsed1.min).toEqual(-10994);
    expect(parsed1.max).toEqual(8848);
    expect(parsed1.increment).toEqual(0.1);

    // Simple UI schema
    let parsed2 = SchemaParser.convertSchemaLayer(numberSchema, "elevation",
      {elevation: {"ui:component": "NumberSliderInput", "increment": 1}});
    expect(parsed2.type).toEqual("NumberSliderInput");
    expect(parsed2.increment).toEqual(1);

    // Invalid ui:component flag
    let parsed3 = SchemaParser.convertSchemaLayer(numberSchema, "elevation",
      {elevation: {"ui:component": "RadioInput"}});
    expect(parsed3.type).toEqual("NumberInput");
  });

  it("should parse integer layers", () => {
    let parsed1 = SchemaParser.convertSchemaLayer(integerSchema, "opacity", {});
    expect(parsed1.label).toEqual("Opacity");
    expect(parsed1.description).toEqual("The percentage opacity of the layer");
    expect(parsed1.type).toEqual("NumberInput");
    expect(parsed1.exclusiveMin).toEqual(0);
    expect(parsed1.exclusiveMax).toEqual(100);

    // Simple UI schema
    let parsed2 = SchemaParser.convertSchemaLayer(integerSchema, "opacity",
      {opacity: {"ui:component": "NumberSliderInput", "multipleOf": 5}});
    expect(parsed2.type).toEqual("NumberSliderInput");
    expect(parsed2.multipleOf).toEqual(5);

    // Invalid ui:component flag
    let parsed3 = SchemaParser.convertSchemaLayer(integerSchema, "opacity",
      {opacity: {"ui:component": "NumberSliderInpu"}});
    expect(parsed3.type).toEqual("NumberInput");
  });

  it("should parse boolean layers", () => {
    let parsed1 = SchemaParser.convertSchemaLayer(booleanSchema, "dataQuality", {});
    expect(parsed1.label).toEqual("Data Quality");
    expect(parsed1.description).toEqual("Whether the dataset meets the agency’s Information Quality Guidelines (true/false).");
    expect(parsed1.type).toEqual("CheckboxInput");

    // Simple UI schema
    let parsed2 = SchemaParser.convertSchemaLayer(booleanSchema, "dataQuality",
      {dataQuality: {"ui:component": "RadioInput"}});
    expect(parsed2.type).toEqual("RadioInput");

    // Invalid ui:component flag
    let parsed3 = SchemaParser.convertSchemaLayer(booleanSchema, "dataQuality",
      {dataQuality: {"ui:component": "RadioInpu"}});
    expect(parsed3.type).toEqual("CheckboxInput");
  });

  it("should recursively parse array layers", () => {

  });

  it("should recursively parse object layers", () => {

  });

  it("should parse simple nullable anyOf layers", () => {

  });

  it("correctly identifies empty objects", () => {
    expect(SchemaParser.isEmptyObject({})).toBeTruthy();
    expect(SchemaParser.isEmptyObject({a: 1})).toBeFalsy();
    expect(SchemaParser.isEmptyObject({"a": "b"})).toBeFalsy();
  });
});