import React from 'react';
import Form from 'react-bootstrap/Form';
import {shallow} from 'enzyme';
import HiddenInput from './HiddenInput';

describe("<HiddenInput>", () => {
  it("should render correctly", () => {
    let component = shallow(<HiddenInput/>);
    let input = component.find(Form.Control).dive();
    expect(input.type()).toEqual("input");
  });

  it("should have type hidden", () => {
    let component = shallow(<HiddenInput/>);
    let input = component.find(Form.Control).dive();
    expect(input.prop("type")).toEqual("hidden");
  });

  it("should have the correct id", () => {
    let component = shallow(<HiddenInput id="test-id"/>);
    let input = component.find(Form.Control).dive();
    expect(input.prop("id")).toEqual("test-id");
  });

  it("should store a default value", () => {
    let component = shallow(<HiddenInput id="test-id" initialValue="Test"/>);
    let input = component.find(Form.Control).dive();
    expect(input.prop("defaultValue")).toEqual("Test");
  });
});