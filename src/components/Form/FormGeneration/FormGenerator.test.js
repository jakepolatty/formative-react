import React from 'react';
import {shallow, mount} from 'enzyme';
import FormGenerator from './FormGenerator';
import Input from '../../inputs/Input/Input';
import TextInput from '../../inputs/TextInput/TextInput';
import SelectInput from '../../inputs/SelectInput/SelectInput';

const textField = {
  "type": "TextInput",
  "id": "rights",
  "label": "Rights",
  "description": "This may include information regarding access or restrictions.",
  "info": "This should also provide an explanation for the selected \"accessLevel\". Text, 255 characters."
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
  "required": true
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
    let generator = new FormGenerator({}, () => null, [], () => null);
    let field1 = generator.generateForm
  });

  it("should skip single fields that are not in the include list", () => {

  });

  it("should merge in prepopulated form data when it exists", () => {

  });

  it("should generate lists of fields for a specific input group", () => {

  });

  it("should skip lists of fields for which none are in the include list", () => {

  });

  it("should generate lists of fields for a generic input group", () => {

  });

  it("should generate the correct minimum length for a format group", () => {

  });

  it("should skip format fields not in the include list", () => {

  });
});