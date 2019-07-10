import React from 'react';
import Form from 'react-bootstrap/Form';
import {shallow} from 'enzyme';
import TextAreaInput from './TextAreaInput';

const updateFn = jest.fn();

describe("<TextAreaInput>", () => {
  it("should render correctly", () => {
    let component = shallow(<TextAreaInput/>);
    let input = component.find(Form.Control).dive();
    expect(input.type()).toEqual("textarea");
  });

  it("should have the correct id", () => {
    let component = shallow(<TextAreaInput id="test-id"/>);
    let input = component.find(Form.Control).dive();
    expect(input.prop("id")).toEqual("test-id");
  });

  it("should have a default value", () => {
    let component = shallow(<TextAreaInput id="test-id" initialValue="Test"/>);
    let input = component.find(Form.Control).dive();
    expect(input.prop("defaultValue")).toEqual("Test");
  });

  it("should default to 3 rows", () => {
    let component = shallow(<TextAreaInput id="test-id" initialValue="Test"/>);
    let input = component.find(Form.Control).dive();
    expect(input.prop("rows")).toEqual(3);
  });

  it("should have settable rows", () => {
    let component = shallow(<TextAreaInput id="test-id" initialValue="Test" rows={6}/>);
    let input = component.find(Form.Control).dive();
    expect(input.prop("rows")).toEqual(6);
  })

  it("should send back updates", () => {
    let component = shallow(<TextAreaInput id="test-id" initialValue="Test" onUpdate={updateFn}/>);
    component.simulate("change", {target: {name: "test-id", value: "New Value"}});
    expect(updateFn).toHaveBeenCalledWith("New Value");
  });
});