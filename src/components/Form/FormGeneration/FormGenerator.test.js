import React from 'react';
import {shallow, mount} from 'enzyme';
import FormGenerator from './FormGenerator';
import Input from '../../inputs/Input/Input';
import TextInput from '../../inputs/TextInput/TextInput';
import SelectInput from '../../inputs/SelectInput/SelectInput';
import CheckboxInput from '../../inputs/CheckboxInput/CheckboxInput';

const textField = {
  "type": "TextInput",
  "id": "rights",
  "label": "Rights",
  "description": "This may include information regarding access or restrictions.",
  "info": "This should also provide an explanation for the selected \"accessLevel\". Text, 255 characters.",
  "defaultValue": "private"
};

const selectField = {
  "type": "SelectInput",
  "id": "accessLevel",
  "label": "Public Access Level",
  "description": "The degree to which this dataset could be made publicly-available",
  "options": [
    "public",
    "restricted public",
    "non-public"
  ],
  "required": true,
};

const checkboxField = {
  "type": "CheckboxInput",
  "id": "dataQuality",
  "label": "Data Quality",
  "description": "Whether the dataset meets the agency’s Information Quality Guidelines (true/false)."
};

const nonexistentField = {
  "type": "NotAnInput",
  "id": "doesNotExist",
  "label": "Nothing",
  "description": "void"
};

const inputList = {
  "type": "InputGroup",
  "id": "dataset",
  "label": "Project Open Data Dataset",
  "groupType": "object",
  "description": "The metadata format for all federal open data.",
  "items": [
    textField,
    selectField,
    checkboxField
  ]
};

const inputFormatGroup = {
  "type": "InputGroup",
  "id": "references",
  "itemFormat": {
    "type": "TextInput",
    "id": "references"
  },
  "minItems": 3,
  "groupType": "array",
  "label": "Related Documents",
  "description": "Related documents such as technical information about a dataset, developer documentation, etc."
};

const inputFormatGroupWithDefaults = {
  "type": "InputGroup",
  "id": "references",
  "itemFormat": {
    "type": "TextInput",
    "id": "references"
  },
  "minItems": 2,
  "defaultValue": ["Ref A", "Ref B", "Ref C"],
  "groupType": "array",
  "label": "Related Documents",
  "description": "Related documents such as technical information about a dataset, developer documentation, etc."
};

describe("FormGenerator", () => {
  it("should return null for empty fields", () => {
    let generator = new FormGenerator({}, () => null, [], () => null);
    let form1 = generator.generateForm(undefined);
    expect(form1).toBeNull();
    let form2 = generator.generateForm(null);
    expect(form2).toBeNull();
    let form3 = generator.generateForm({});
    expect(form3).toBeNull();

    let input = generator.generateInputList({});
    expect(input).toBeNull();

    let format = generator.generateInputFormat({});
    expect(format).toBeNull();
  });

  it("should generate single fields from an input", () => {
    let generator = new FormGenerator({}, () => null,
      ["rights", "accessLevel", "dataQuality"], () => null);

    let field1 = mount(generator.generateForm(textField));
    let input1 = field1.find(TextInput);
    expect(input1.length).toEqual(1);
    expect(input1.prop("id")).toEqual("rights");
    expect(input1.prop("initialValue")).toEqual("private");

    let field2 = mount(generator.generateForm(selectField));
    expect(field2.prop("label")).toEqual("Public Access Level");
    expect(field2.prop("description")).toEqual("The degree to which this dataset could be made publicly-available");
    let input2 = field2.find(SelectInput);
    expect(input2.length).toEqual(1);
    expect(input2.prop("id")).toEqual("accessLevel");
    expect(input2.prop("options")).toEqual(["public", "restricted public", "non-public"]);

    let field3 = mount(generator.generateForm(checkboxField));
    let input3 = field3.find(CheckboxInput);
    expect(input3.length).toEqual(1);
    expect(input3.prop("id")).toEqual("dataQuality");
  });

  it("should skip single fields that are not in the include list", () => {
    let generator = new FormGenerator({}, () => null, [], () => null);

    let field1 = generator.generateForm(textField);
    expect(field1).toBeNull();

    let field2 = generator.generateForm(selectField);
    expect(field2).toBeNull();

    let field3 = generator.generateForm(checkboxField);
    expect(field3).toBeNull();
  });

  it("should return null for fields with unavailable types", () => {
    let generator = new FormGenerator({}, () => null, ["nonexistentField"], () => null);

    let field = generator.generateForm(nonexistentField);
    expect(field).toBeNull();
  });

  it("should merge in prepopulated form data when it exists", () => {
    let generator = new FormGenerator({"rights": "public", "accessLevel": "public", "dataQuality": true},
      () => null, ["rights", "accessLevel", "dataQuality"], () => null);

    let field1 = shallow(generator.generateForm(textField));
    expect(field1.prop("initialValue")).toEqual("public");

    let field2 = shallow(generator.generateForm(selectField));
    expect(field2.prop("initialValue")).toEqual("public");

    let field3 = shallow(generator.generateForm(checkboxField));
    expect(field3.prop("initialValue")).toEqual(true);
  });

  it("should generate lists of fields for a specific input group", () => {
    let generator = new FormGenerator({"dataQuality": true}, () => null,
      ["rights", "dataQuality"], () => null);

    let fieldGroup = mount(generator.generateForm(inputList));
    expect(fieldGroup.prop("id")).toEqual("dataset");

    let label = fieldGroup.find("#dataset-LABEL");
    expect(label.text()).toEqual("Project Open Data Dataset");

    let description = fieldGroup.find("#dataset-DESCRIPTION");
    expect(description.text()).toEqual("The metadata format for all federal open data.");

    let inputs = fieldGroup.find("#dataset-INPUTS");
    expect(inputs.children().length).toEqual(2);

    let input1 = inputs.childAt(0);
    expect(input1.find(TextInput).length).toEqual(1);
    expect(input1.prop("initialValue")).toEqual("private");
    let input2 = inputs.childAt(1);
    expect(input2.find(CheckboxInput).length).toEqual(1);
    expect(input2.prop("initialValue")).toEqual(true);
  });

  it("should skip lists of fields for which none are in the include list", () => {
    let generator = new FormGenerator({}, () => null, [], () => null);

    let fieldGroup = generator.generateForm(inputList);
    expect(fieldGroup).toBeNull();
  });

  it("should generate lists of fields for a generic input group", () => {
    let generator = new FormGenerator({}, () => null, ["references"], () => null);

    let fieldGroup = mount(generator.generateForm(inputFormatGroup));
    expect(fieldGroup.prop("id")).toEqual("references");

    let label = fieldGroup.find("#references-LABEL");
    expect(label.text()).toEqual("Related Documents");

    let description = fieldGroup.find("#references-DESCRIPTION");
    expect(description.text()).toEqual("Related documents such as technical information about a dataset, developer documentation, etc.");

    let inputs = fieldGroup.find("#references-INPUTS");
    expect(inputs.children().length).toEqual(3);

    let input1 = inputs.childAt(0);
    expect(input1.find(TextInput).length).toEqual(1);
    expect(input1.prop("id")).toEqual("references-0");
    let input2 = inputs.childAt(1);
    expect(input2.find(TextInput).length).toEqual(1);
    expect(input2.prop("id")).toEqual("references-1");
    let input3 = inputs.childAt(2);
    expect(input3.find(TextInput).length).toEqual(1);
    expect(input3.prop("id")).toEqual("references-2");
  });

  it("should populate the input format fields with form data", () => {
    // Case where the data length is shorter than the min length
    let generator1 = new FormGenerator({references: [1, 2]}, () => null, ["references"], () => null);
    
    let fieldGroup1 = mount(generator1.generateForm(inputFormatGroup));
    let inputs1 = fieldGroup1.find("#references-INPUTS");
    expect(inputs1.children().length).toEqual(3);

    let input1 = inputs1.childAt(0);
    expect(input1.prop("initialValue")).toEqual(1);
    let input2 = inputs1.childAt(1);
    expect(input2.prop("initialValue")).toEqual(2);
    let input3 = inputs1.childAt(2);
    expect(input3.prop("initialValue")).toEqual(undefined);

    // Case where the data length is longer than the min length
    let generator2 = new FormGenerator({references: ["A", "B", "C", "D"]}, () => null,
      ["references"], () => null);

    let fieldGroup2 = mount(generator2.generateForm(inputFormatGroup));
    let inputs2 = fieldGroup2.find("#references-INPUTS");
    expect(inputs2.children().length).toEqual(4);

    let input4 = inputs2.childAt(0);
    expect(input4.prop("initialValue")).toEqual("A");
    let input5 = inputs2.childAt(1);
    expect(input5.prop("initialValue")).toEqual("B");
    let input6 = inputs2.childAt(2);
    expect(input6.prop("initialValue")).toEqual("C");
    let input7 = inputs2.childAt(3);
    expect(input7.prop("initialValue")).toEqual("D");
  });

  it("should overwrite default value fields with form data", () => {
    // Case where the data length is shorter than the defaults length
    let generator1 = new FormGenerator({references: [1, 2]}, () => null, ["references"], () => null);
    
    let fieldGroup1 = mount(generator1.generateForm(inputFormatGroupWithDefaults));
    let inputs1 = fieldGroup1.find("#references-INPUTS");
    expect(inputs1.children().length).toEqual(3);

    let input1 = inputs1.childAt(0);
    expect(input1.prop("initialValue")).toEqual(1);
    let input2 = inputs1.childAt(1);
    expect(input2.prop("initialValue")).toEqual(2);
    let input3 = inputs1.childAt(2);
    expect(input3.prop("initialValue")).toEqual("Ref C");

    // Case where the data length is longer than the defaults length
    let generator2 = new FormGenerator({references: ["A", "B", "C", "D"]}, () => null,
      ["references"], () => null);

    let fieldGroup2 = mount(generator2.generateForm(inputFormatGroup));
    let inputs2 = fieldGroup2.find("#references-INPUTS");
    expect(inputs2.children().length).toEqual(4);

    let input4 = inputs2.childAt(0);
    expect(input4.prop("initialValue")).toEqual("A");
    let input5 = inputs2.childAt(1);
    expect(input5.prop("initialValue")).toEqual("B");
    let input6 = inputs2.childAt(2);
    expect(input6.prop("initialValue")).toEqual("C");
    let input7 = inputs2.childAt(3);
    expect(input7.prop("initialValue")).toEqual("D");
  });

  it("should skip format fields not in the include list", () => {
    let generator = new FormGenerator({}, () => null, [], () => null);

    let fields = generator.generateForm(inputFormatGroup);
    expect(fields).toBeNull();
  });
});