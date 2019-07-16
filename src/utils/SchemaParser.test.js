import SchemaParser from './SchemaParser';

const stringSchema = {
  title: "Description",
  description: "Human-readable description of the distribution",
  type: "string",
  minLength: 1
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
  type: "number"
};

const integerSchema = {
  title: "Opacity",
  description: "The percentage opacity of the layer",
  type: "integer"
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

  });

  it("should parse number layers", () => {

  });

  it("should parse integer layers", () => {

  });

  it("should parse boolean layers", () => {

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