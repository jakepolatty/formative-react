import React from 'react';
import Form from 'react-bootstrap/Form';
import {shallow} from 'enzyme';
import SelectInput from './SelectInput';

describe("<SelectInput>", () => {
  it("should render a select field correctly", () => {
    let component = shallow(<SelectInput/>);
    let input = component.find(Form.Control).dive();
    expect(input.type()).toEqual("select");
  });

  it("should have the correct id", () => {
    let component = shallow(<SelectInput id="test-id"/>);
    let input = component.find("#test-id");
    expect(input.prop("id")).toEqual("test-id");
  });

  it("should render options", () => {
    let component = shallow(<SelectInput id="test-id" options={["a", "b", "c"]}/>);
    let options = component.find("#test-id").children();
    expect(options.length).toEqual(3);
    expect(options.at(0).text()).toEqual("a");
    expect(options.at(1).text()).toEqual("b");
    expect(options.at(2).text()).toEqual("c");
  });

  it("should have options with values", () => {
    let component = shallow(<SelectInput id="test-id" options={["Test", true, 5]}/>);
    let options = component.find("#test-id").children();
    expect(options.length).toEqual(3);
    expect(options.at(0).prop("value")).toEqual("Test");
    expect(options.at(1).prop("value")).toEqual(true);
    expect(options.at(2).prop("value")).toEqual(5);
  });

  it("should take a default selection", () => {
    let component = shallow(<SelectInput id="test-id" options={["a", "b", "c"]} initialValue="b"/>);
    let input = component.find("#test-id");
    expect(input.prop("defaultValue")).toEqual("b");
  });

  it("should send back updates", () => {
    const updateFn = jest.fn();
    let component = shallow(<SelectInput id="test-id" options={["a", "b", "c"]} onUpdate={updateFn}/>);
    component.simulate("change", {target: {name: "test-id", value: "c"}});
    expect(updateFn).toHaveBeenCalledWith("c");
  });
});