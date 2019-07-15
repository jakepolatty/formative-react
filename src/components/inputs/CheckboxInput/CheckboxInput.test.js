import React from 'react';
import Form from 'react-bootstrap/Form';
import {shallow} from 'enzyme';
import CheckboxInput from './CheckboxInput';

describe("<CheckboxInput>", () => {
  it("should render an input correctly", () => {
    let component = shallow(<CheckboxInput/>);
    let input = component.find(Form.Check).first().dive().dive().childAt(0).dive();
    expect(input.type()).toEqual("input");
  });

  it("should render an input of type 'checkbox'", () => {
    let component = shallow(<CheckboxInput/>);
    let input = component.find(Form.Check).first().dive().dive().childAt(0).dive();
    expect(input.prop("type")).toEqual("checkbox");
  });

  it("should have the correct id", () => {
    let component = shallow(<CheckboxInput id="test-id"/>);
    let input = component.find("#test-id");
    expect(input.prop("id")).toEqual("test-id");
  });

  it("should take a default checked", () => {
    let component = shallow(<CheckboxInput id="test-id" initialValue={true}/>);
    let input = component.find("#test-id");
    expect(input.prop("defaultChecked")).toEqual(true);
  });

  it("should send back updates", () => {
    const updateFn = jest.fn();
    let component = shallow(<CheckboxInput id="test-id" onUpdate={updateFn}/>);
    component.simulate("input", {target: {name: "test-id", checked: true}});
    expect(updateFn).toHaveBeenCalledWith(true);
  });
});