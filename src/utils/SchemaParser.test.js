import SchemaParser from './SchemaParser';

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