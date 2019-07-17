import React from 'react';
import {shallow} from 'enzyme';
import FormPage from './FormPage';
import APISchemaForms from '../APISchemaForms/APISchemaForms';

describe("<FormPage>", () => {
  it("should render correctly", () => {
    let component = shallow(<FormPage pageName="Test Page" schemaEndpoint="test1"
      schemas={{type: "string", minLength: 1}} dataApiEndpoint="test2"
      uiSchema={{demo: {"ui:component": "NumberInput"}}}/>);
    expect(component.prop("id")).toEqual("Test Page");

    let schemaForm = component.find(APISchemaForms);
    expect(schemaForm.prop("schemaEndpoint")).toEqual("test1");
    expect(schemaForm.prop("dataApiEndpoint")).toEqual("test2");
    expect(schemaForm.prop("schemas")).toEqual({type: "string", minLength: 1});
    expect(schemaForm.prop("uiSchema")).toEqual({demo: {"ui:component": "NumberInput"}});
  });
});