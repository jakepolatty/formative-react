import React from 'react';
import Form from 'react-bootstrap/Form';
import {shallow} from 'enzyme';
import NumberInput from './NumberInput';

describe("<NumberInput>", () => {
  const setState = jest.fn();
  const useStateSpy = jest.spyOn(React, "useState");
  useStateSpy.mockImplementation((init) => [init, setState]);

  it("should render correctly", () => {
    let component = shallow(<NumberInput/>);
    let input = component.find(Form.Control).dive();
    expect(input.type()).toEqual("input");
  });

  it("should have type 'number'", () => {
    let component = shallow(<NumberInput/>);
    let input = component.find(Form.Control).dive();
    expect(input.prop("type")).toEqual("number");
  });

  it("should have the correct id", () => {
    let component = shallow(<NumberInput id="test-id"/>);
    let input = component.find(Form.Control).dive();
    expect(input.prop("id")).toEqual("test-id");
  });

  it("should have a default value", () => {
    let component = shallow(<NumberInput id="test-id" initialValue={12}/>);
    let input = component.find(Form.Control).dive();
    expect(input.prop("defaultValue")).toEqual(12);
  });

  it("should default to any step", () => {
    let component = shallow(<NumberInput/>);
    let input = component.find(Form.Control).dive();
    expect(input.prop("step")).toEqual("any");
  });

  it("should have a settable step", () => {
    let component = shallow(<NumberInput step={0.1}/>);
    let input = component.find(Form.Control).dive();
    expect(input.prop("step")).toEqual(0.1);
  });

  // it("should send back updates", () => {
  //   const updateFn = jest.fn();
  //   let component = shallow(<NumberInput id="test-id" initialValue={12} onUpdate={updateFn}/>);
  //   const handleChangeSpy = jest.spyOn(component.instance(), "handleChange");
  //   component.simulate("change", {target: {name: "test-id", value: 7}});
  //   expect(handleChangeSpy).toHaveBeenCalledWith(7);
  // });

  // it("should display invalid on non-numeric input", () => {
  //   let component = shallow(<NumberInput id="test-id" initialValue={12}/>);
  //   component.simulate("change", {target: {name: "test-id", value: "a"}});
  //   expect(setState).toHaveBeenCalledWith(true);
  // });
});