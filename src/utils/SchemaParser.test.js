import SchemaParser from './SchemaParser';
import SchemaLayerParsers from './SchemaLayerParsers';

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

const altNumberSchema = {
  title: "Elevation",
  description: "The elevation of a layer in meters",
  type: "number",
  exclusiveMaximum: 8849,
  exclusiveMinimum: -10995,
  default: 0,
  enum: [-10994, 0, 8849]
};

const integerSchema = {
  title: "Opacity",
  description: "The percentage opacity of the layer",
  type: "integer",
  default: 99,
  multipleOf: 3,
  exclusiveMaximum: 100,
  exclusiveMinimum: 0
};

const altIntegerSchema = {
  title: "Opacity",
  description: "The percentage opacity of the layer",
  type: "integer",
  enum: [0, 25, 50, 75, 100],
  minimum: 0,
  maximum: 100,
};

const booleanSchema = {
  title: "Data Quality",
  description:  "Whether the dataset meets the agency’s Information Quality Guidelines (true/false).",
  type: "boolean",
  default: false
};

const arrayFormatSchema = {
  title: "Tags",
  description:  "Tags (or keywords) help users discover your dataset",
  type: "array",
  items: {
    "type": "string",
    "minLength": 1
  },
  minItems: 2,
  maxItems: 5,
  uniqueItems: true
};

const arrayEnumSchema = {
  title: "Time Zone (US)",
  description: "An American time zone",
  type: "array",
  items: {
    enum: [
      "PST",
      "MST",
      "CST",
      "EST"
    ]
  },
  default: "EST"
}

const arrayListSchema = {
  title: "Attribution",
  description: "Attribution information for the project",
  type: "array",
  items: [
    {
      title: "Name",
      type: "string"
    },
    {
      title: "ID Number",
      type: "integer"
    }
  ],
  additionalItems: {
    type: "string"
  }
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
      type: "number",
      title: "Elevation",
      minimum: -10994,
      maximum: 8848,
    }
  }
};

const anyOfSchema = {
  title: "Spatial",
  description: "The range of spatial applicability of a dataset.",
  anyOf: [
    {
      type: "string",
      maxLength: 10,
      pattern: "\d+"
    },
    {
      type: "null"
    }
  ]
};

const multiAnyOfSchema = {
  title: "Options",
  anyOf: [
    {
      type: "string"
    },
    {
      type: "number"
    }
  ]
};

const emptyAnyOfSchema = {
  title: "Test",
  anyOf: [
    {
      type: "null"
    }
  ]
};

describe("SchemaParser", () => {
  it("should return the parsed schema in a callback", done => {
    function callback1(parsed, err) {
      expect(err).toBeNull();

      expect(parsed.type).toEqual("InputGroup");
      expect(parsed.groupType).toEqual("object");
      expect(parsed.label).toEqual("WMS");
      expect(parsed.description).toEqual("A simple form for WMS specification.");

      let children = parsed.items;
      expect(children.length).toEqual(5);

      let opacity = children[2];
      expect(opacity.label).toEqual("Opacity");
      expect(opacity.type).toEqual("NumberInput");
      done();
    }

    SchemaParser.parseSchema(objectSchema, "wms", callback1);

    // With UI schema
    function callback2(parsed, err) {
      expect(err).toBeNull();

      expect(parsed.type).toEqual("InputGroup");
      expect(parsed.groupType).toEqual("object");
      expect(parsed.label).toEqual("WMS");
      expect(parsed.description).toEqual("A simple form for WMS specification.");

      let children = parsed.items;
      expect(children.length).toEqual(5);

      let opacity = children[2];
      expect(opacity.label).toEqual("Opacity");
      expect(opacity.type).toEqual("NumberSliderInput");
      done();
    }

    SchemaParser.parseSchemaWithUI(objectSchema, {opacity: {"ui:component": "NumberSliderInput"}},
      "wms", callback2);
  });

  it("should return an error for a malformed schema", done => {
    function callback(parsed, err) {
      expect(parsed).toBeNull();
      expect(err).toBeTruthy();
      done();
    }

    SchemaParser.parseSchema({"$ref": "not-a-ref"}, "root", callback);
  });

  it("should return an error for a malformed schema with ui schema", done => {
    function callback(parsed, err) {
      expect(parsed).toBeNull();
      expect(err).toBeTruthy();
      done();
    }

    SchemaParser.parseSchemaWithUI({"$ref": "not-a-ref"}, {test: {"ui:component": "TextInput"}},
      "root", callback);
  });

  it("should return null for an empty schema", () => {
    let parsed1 = SchemaParser.convertSchemaLayer(null, "root", {});
    expect(parsed1).toBeNull();

    let parsed2 = SchemaParser.convertSchemaLayer(undefined, "root", {});
    expect(parsed2).toBeNull();

    let parsed3 = SchemaParser.convertSchemaLayer({}, "root", {});
    expect(parsed3).toBeNull();
  });

  it("should return null for a null typed schema", () => {
    let parsed = SchemaParser.convertSchemaLayer({type: "null"}, "root", {});
    expect(parsed).toBeNull();
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

    // Extra options
    let parsed4 = SchemaParser.convertSchemaLayer(altNumberSchema, "elevation", {});
    expect(parsed4.type).toEqual("SelectInput");
    expect(parsed4.exclusiveMin).toEqual(-10995);
    expect(parsed4.exclusiveMax).toEqual(8849);
    expect(parsed4.defaultValue).toEqual(0);
    expect(parsed4.options).toEqual([-10994, 0, 8849]);
  });

  it("should parse integer layers", () => {
    let parsed1 = SchemaParser.convertSchemaLayer(integerSchema, "opacity", {});
    expect(parsed1.label).toEqual("Opacity");
    expect(parsed1.description).toEqual("The percentage opacity of the layer");
    expect(parsed1.type).toEqual("NumberInput");
    expect(parsed1.exclusiveMin).toEqual(0);
    expect(parsed1.exclusiveMax).toEqual(100);
    expect(parsed1.defaultValue).toEqual(99);
    expect(parsed1.increment).toEqual(3);

    // Simple UI schema
    let parsed2 = SchemaParser.convertSchemaLayer(integerSchema, "opacity",
      {opacity: {"ui:component": "NumberSliderInput", "multipleOf": 5}});
    expect(parsed2.type).toEqual("NumberSliderInput");
    expect(parsed2.multipleOf).toEqual(5);

    // Invalid ui:component flag
    let parsed3 = SchemaParser.convertSchemaLayer(integerSchema, "opacity",
      {opacity: {"ui:component": "NumberSliderInpu"}});
    expect(parsed3.type).toEqual("NumberInput");

    // Extra options
    let parsed4 = SchemaParser.convertSchemaLayer(altIntegerSchema, "opacity", {});
    expect(parsed4.type).toEqual("SelectInput");
    expect(parsed4.min).toEqual(0);
    expect(parsed4.max).toEqual(100);
    expect(parsed4.options).toEqual([0, 25, 50, 75, 100]);
  });

  it("should parse boolean layers", () => {
    let parsed1 = SchemaParser.convertSchemaLayer(booleanSchema, "dataQuality", {});
    expect(parsed1.label).toEqual("Data Quality");
    expect(parsed1.description).toEqual("Whether the dataset meets the agency’s Information Quality Guidelines (true/false).");
    expect(parsed1.type).toEqual("CheckboxInput");
    expect(parsed1.defaultValue).toEqual(false);

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
    let parsed1 = SchemaParser.convertSchemaLayer(arrayFormatSchema, "keywords", {});
    expect(parsed1.type).toEqual("InputGroup");
    expect(parsed1.groupType).toEqual("array");
    expect(parsed1.label).toEqual("Tags");
    expect(parsed1.description).toEqual("Tags (or keywords) help users discover your dataset");
    expect(parsed1.minItems).toEqual(2);
    expect(parsed1.maxItems).toEqual(5);
    expect(parsed1.unique).toEqual(true);

    let tagField = parsed1.itemFormat;
    expect(tagField.type).toEqual("TextInput");
    expect(tagField.minLength).toEqual(1);

    // Simple UI schema - should default to InputGroup
    let parsed2 = SchemaParser.convertSchemaLayer(arrayFormatSchema, "keywords",
      {keywords: {"ui:component": "MultiSelectInput", minItems: 1, maxItems: 4}});
    expect(parsed2.type).toEqual("InputGroup");
    expect(parsed2.minItems).toEqual(1);
    expect(parsed2.maxItems).toEqual(4);

    let tagField2 = parsed2.itemFormat;
    expect(tagField2.type).toEqual("TextInput");
    expect(tagField.minLength).toEqual(1);
  });

  it("should parse array tuple validation list layers", () => {
    let parsed1 = SchemaParser.convertSchemaLayer(arrayListSchema, "attribution", {});
    expect(parsed1.type).toEqual("InputGroup");
    expect(parsed1.groupType).toEqual("array");
    expect(parsed1.label).toEqual("Attribution");
    expect(parsed1.description).toEqual("Attribution information for the project");

    let items1 = parsed1.items;
    expect(items1[0].type).toEqual("TextInput");
    expect(items1[0].label).toEqual("Name");
    expect(items1[1].type).toEqual("NumberInput");
    expect(items1[1].label).toEqual("ID Number");

    expect(parsed1.additionalItemFormat).toEqual({type: "TextInput", id: "attribution"});

    // Simple UI schema
    let parsed2 = SchemaParser.convertSchemaLayer(arrayListSchema, "attribution",
      {attribution: {"ui:component": "MultiSelectInput"}});
    expect(parsed2.type).toEqual("InputGroup");
    expect(parsed2.groupType).toEqual("array");
    expect(parsed2.label).toEqual("Attribution");

    let items2 = parsed2.items;
    expect(items2[0].type).toEqual("TextInput");
    expect(items2[0].label).toEqual("Name");
    expect(items2[1].type).toEqual("NumberInput");
    expect(items2[1].label).toEqual("ID Number");
  });

  it("should parse array wrappers for enums", () => {
    let parsed1 = SchemaParser.convertSchemaLayer(arrayEnumSchema, "timeZones", {});
    expect(parsed1.label).toEqual("Time Zone (US)");
    expect(parsed1.description).toEqual("An American time zone");
    expect(parsed1.type).toEqual("SelectInput");
    expect(parsed1.options).toEqual(["PST", "MST", "CST", "EST"]);
    expect(parsed1.defaultValue).toEqual("EST");

    // Simple UI schema
    let parsed2 = SchemaParser.convertSchemaLayer(arrayEnumSchema, "timeZones",
      {timeZones: {"ui:component": "MultiSelectInput", maxItems: 3}});
    expect(parsed2.type).toEqual("MultiSelectInput");
    expect(parsed2.options).toEqual(["PST", "MST", "CST", "EST"]);
    expect(parsed2.maxItems).toEqual(3);

    // Invalid ui:component flag
    let parsed3 = SchemaParser.convertSchemaLayer(arrayEnumSchema, "timeZones",
      {timeZones: {"ui:component": "MultiSelectInpu"}});
    expect(parsed3.type).toEqual("SelectInput");
  });

  it("should recursively parse object layers", () => {
    let parsed1 = SchemaParser.convertSchemaLayer(objectSchema, "wms",
      {opacity: {"ui:component": "NumberSliderInput", min: 0, max: 100}});
    expect(parsed1.type).toEqual("InputGroup");
    expect(parsed1.groupType).toEqual("object");
    expect(parsed1.label).toEqual("WMS");
    expect(parsed1.description).toEqual("A simple form for WMS specification.");

    let children1 = parsed1.items;
    expect(children1.length).toEqual(5);

    let layer = children1[0];
    expect(layer.label).toEqual("LAYER");
    expect(layer.required).toEqual(true);
    expect(layer.type).toEqual("SelectInput");
    expect(layer.options).toEqual(["LayerA", "LayerB", "LayerC", "TODO_populate_this_enum_with_endpoint"]);

    let style = children1[1];
    expect(style.label).toEqual("STYLE");
    expect(style.required).toEqual(true);
    expect(style.type).toEqual("SelectInput");
    expect(style.options).toEqual(["StyleA", "StyleB", "StyleC", "TODO_populate_this_enum_with_endpoint"]);

    let opacity = children1[2];
    expect(opacity.label).toEqual("Opacity");
    expect(opacity.type).toEqual("NumberSliderInput");
    expect(opacity.min).toEqual(0);
    expect(opacity.max).toEqual(100);

    let transparent = children1[3];
    expect(transparent.label).toEqual("Transparent");
    expect(transparent.type).toEqual("CheckboxInput");

    let elevation = children1[4];
    expect(elevation.label).toEqual("Elevation");
    expect(elevation.type).toEqual("NumberInput");
    expect(elevation.min).toEqual(-10994);
    expect(elevation.max).toEqual(8848);
  });

  it("should return null items for an object layer with no valid children", () => {
    let parsed = SchemaParser.convertSchemaLayer(
      {title: "Test", type: "object", properties: [emptyAnyOfSchema]}, "test", {});
    expect(parsed.items).toEqual([null]);
  });

  it("should parse simple nullable anyOf layers", () => {
    let parsed1 = SchemaParser.convertSchemaLayer(anyOfSchema, "spatial", {});
    expect(parsed1.label).toEqual("Spatial");
    expect(parsed1.description).toEqual("The range of spatial applicability of a dataset.");
    expect(parsed1.type).toEqual("TextInput");
    expect(parsed1.maxLength).toEqual(10);
    expect(parsed1.pattern).toEqual("\d+")

    // Simply UI schema
    let parsed2 = SchemaParser.convertSchemaLayer(anyOfSchema, "spatial",
      {spatial: {"ui:component": "GeoBoundingBoxInput", "default": "(0, 0), (0, 0)"}});
    expect(parsed2.type).toEqual("GeoBoundingBoxInput");
    expect(parsed2.default).toEqual("(0, 0), (0, 0)");

    // Invalid ui:component flag
    let parsed3 = SchemaParser.convertSchemaLayer(anyOfSchema, "spatial",
      {spatial: {"ui:component": "GeoBoundingBoxInpu"}});
    expect(parsed3.type).toEqual("TextInput");
  });

  it("should return other anyOfLayers as null", () => {
    let parsed1 = SchemaParser.convertSchemaLayer(emptyAnyOfSchema);
    expect(parsed1).toBeNull();

    // TODO: Add functionality for multi-layer parsing and remove this test
    let parsed2 = SchemaParser.convertSchemaLayer(multiAnyOfSchema, "options", {});
    expect(parsed2).toBeNull();
  });

  it("correctly identifies empty objects", () => {
    expect(SchemaParser.isEmptyObject({})).toBeTruthy();
    expect(SchemaParser.isEmptyObject({a: 1})).toBeFalsy();
    expect(SchemaParser.isEmptyObject({"a": "b"})).toBeFalsy();
  });
});