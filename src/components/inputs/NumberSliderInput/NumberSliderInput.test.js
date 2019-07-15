import React from 'react';
import Form from 'react-bootstrap/Form';
import {shallow} from 'enzyme';
import NumberSliderInput from './NumberSliderInput';

describe("<NumberSliderInput>", () => {
  it("should render correctly", () => {
    let component = shallow(<NumberSliderInput/>);
    let input = component.find(Form.Control).dive();
    expect(input.type()).toEqual("input");
  });

  it("should have type 'range'", () => {
    let component = shallow(<NumberSliderInput/>);
    let input = component.find(Form.Control).dive();
    expect(input.prop("type")).toEqual("range");
  });

  it("should have the correct id", () => {
    let component = shallow(<NumberSliderInput id="test-id"/>);
    let input = component.find(Form.Control).dive();
    expect(input.prop("id")).toEqual("test-id");
  });

  it("should have a default value", () => {
    let component = shallow(<NumberSliderInput id="test-id" initialValue={12}/>);
    let input = component.find(Form.Control).dive();
    expect(input.prop("defaultValue")).toEqual(12);
  });

  it("should have a settable step", () => {
    let component = shallow(<NumberSliderInput increment={0.1}/>);
    let input = component.find(Form.Control).dive();
    expect(input.prop("step")).toEqual(0.1);
  });

  it("should have the ability to set no discrete steps", () => {
    let component = shallow(<NumberSliderInput increment="any"/>);
    let input = component.find(Form.Control).dive();
    expect(input.prop("step")).toEqual("any");
  });

  it("should send back updates", () => {
    const updateFn = jest.fn();
    let component = shallow(<NumberSliderInput id="test-id" initialValue={12} onUpdate={updateFn}/>);
    component.simulate("change", {target: {name: "test-id", value: "7"}});
    expect(updateFn).toHaveBeenCalledWith(7);
  });
});