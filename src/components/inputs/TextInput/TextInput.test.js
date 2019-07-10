import React from 'react';
import Form from 'react-bootstrap/Form';
import {shallow} from 'enzyme';
import TextInput from './TextInput';

const updateFn = jest.fn();

describe("<TextInput>", () => {
  it("should render correctly", () => {
    let component = shallow(<TextInput/>);
    let input = component.find(Form.Control).dive();
    expect(input.type()).toEqual("input");
  });

  it("should have the correct id", () => {
    let component = shallow(<TextInput id="test-id"/>);
    let input = component.find(Form.Control).dive();
    expect(input.prop("id")).toEqual("test-id");
  });

  it("should have a default value", () => {
    let component = shallow(<TextInput id="test-id" initialValue="Test"/>);
    let input = component.find(Form.Control).dive();
    expect(input.prop("defaultValue")).toEqual("Test");
  });

  it("should send back updates", () => {
    let component = shallow(<TextInput id="test-id" initialValue="Test" onUpdate={updateFn}/>);
    component.simulate("change", {target: {name: "test-id", value: "New Value"}});
    expect(updateFn).toHaveBeenCalledWith("New Value");
  });
});