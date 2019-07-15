import React from 'react';
import Form from 'react-bootstrap/Form';
import {shallow} from 'enzyme';
import RadioInput from './RadioInput';

describe("<RadioInput>", () => {
  it("should render inputs correctly", () => {
    let component = shallow(<RadioInput/>);
    let input = component.find(Form.Check).first().dive().dive().childAt(0).dive();
    expect(input.type()).toEqual("input");
  });

  it("should have inputs of type 'radio'", () => {
    let component = shallow(<RadioInput/>);
    let input = component.find(Form.Check).first().dive().dive().childAt(0).dive();
    expect(input.prop("type")).toEqual("radio");
  });

  it("should have the correct id", () => {
    let component = shallow(<RadioInput id="test-id"/>);
    let input = component.find("#test-id-0");
    expect(input.prop("id")).toEqual("test-id-0");
  });

  it("should have settable options", () => {
    let component = shallow(<RadioInput id="test-id" options={["a", "b", "c"]}/>);
    let formChecks = component.find(Form.Check);
    expect(formChecks.length).toEqual(3);
    let input1 = component.find("#test-id-0");
    expect(input1.prop("value")).toEqual("a");
    let input2 = component.find("#test-id-1");
    expect(input2.prop("value")).toEqual("b");
    let input3 = component.find("#test-id-2");
    expect(input3.prop("value")).toEqual("c");
  });

  it("should render option labels", () => {
    let component = shallow(<RadioInput id="test-id" options={["a", "b", "c"]}/>);
    let formChecks = component.find(Form.Check);
    expect(formChecks.length).toEqual(3);
    let label1 = formChecks.at(0).dive().dive();
    expect(label1.text()).toEqual("a");
    let label2 = formChecks.at(1).dive().dive();
    expect(label2.text()).toEqual("b");
    let label3 = formChecks.at(2).dive().dive();
    expect(label3.text()).toEqual("c");
  });

  it("should default to a true/false selection", () => {
    let component = shallow(<RadioInput id="test-id"/>);
    let formChecks = component.find(Form.Check);
    expect(formChecks.length).toEqual(2);
    let input1 = component.find("#test-id-0");
    expect(input1.prop("value")).toEqual(true);
    let input2 = component.find("#test-id-1");
    expect(input2.prop("value")).toEqual(false);
  });

  it("should take a default checked", () => {
    let component = shallow(<RadioInput id="test-id" options={["a", "b", "c"]} initialValue="b"/>);
    let input1 = component.find("#test-id-0");
    expect(input1.prop("defaultChecked")).toEqual(false);
    let input2 = component.find("#test-id-1");
    expect(input2.prop("defaultChecked")).toEqual(true);
    let input3 = component.find("#test-id-2");
    expect(input3.prop("defaultChecked")).toEqual(false);
  });

  it("should send back updates", () => {
    const updateFn = jest.fn();
    let component = shallow(<RadioInput
      id="test-id" options={["a", "b", "c"]} initialValue="b" onUpdate={updateFn}/>);
    let formCheck3 = component.find(Form.Check).at(2);
    formCheck3.simulate("change", {target: {name: "test-id", value: "c"}});
    expect(updateFn).toHaveBeenCalledWith("c");
  });

  it("should send back updates for default true/false", () => {
    const updateFn = jest.fn();
    let component = shallow(<RadioInput id="test-id" onUpdate={updateFn}/>);
    let formCheck1 = component.find(Form.Check).at(0);
    formCheck1.simulate("change", {target: {name: "test-id", value: true}});
    expect(updateFn).toHaveBeenCalledWith(true);
    let formCheck2 = component.find(Form.Check).at(1);
    formCheck2.simulate("change", {target: {name: "test-id", value: false}});
    expect(updateFn).toHaveBeenCalledWith(false);
  });
});