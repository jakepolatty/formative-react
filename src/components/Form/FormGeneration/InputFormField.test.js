import React from 'react';
import {shallow, mount} from 'enzyme';
import InputFormField from './InputFormField';
import Input from '../../inputs/Input/Input';
import TextInput from '../../inputs/TextInput/TextInput';

describe("<InputFormField>", () => {
  it("should render an input of the specified type", () => {
    let component = mount(<InputFormField Field={TextInput} id="test-id"/>);
    let input = component.find(TextInput);
    expect(input.length).toEqual(1);
  });

  it("should render a label", () => {
    let component = shallow(<InputFormField Field={TextInput} id="test-id" label="Test Label"/>);
    let input = component.find(Input);
    expect(input.prop("label")).toEqual("Test Label");
  });

  it("should render a description", () => {
    let component = shallow(<InputFormField Field={TextInput} id="test-id" description="Test Description"/>);
    let input = component.find(Input);
    expect(input.prop("description")).toEqual("Test Description");
  });

  it("should render an info popup", () => {
    let component = shallow(<InputFormField Field={TextInput} id="test-id" info="Test Info Text"/>);
    let input = component.find(Input);
    expect(input.prop("info")).toEqual("Test Info Text");
  });

  it("applies index-based ids for fields in arrays", () => {
    let component = shallow(<InputFormField Field={TextInput} id="test-id" arrayIndex={3}/>);
    let input = component.find(Input);
    expect(input.prop("id")).toEqual("test-id-3");
  });

  it("should pass an initial value", () => {
    let component = shallow(<InputFormField Field={TextInput} id="test-id" initialValue="Test Value"/>);
    let input = component.find(Input);
    expect(input.prop("initialValue")).toEqual("Test Value");
  });

  it("should return form data updates", () => {
    let updateDataFn = jest.fn();
    let component = shallow(<InputFormField Field={TextInput} id="test-id" setFormData={updateDataFn}/>);
    let input = component.find(Input);
    input.simulate("update", "New Value");
    expect(updateDataFn).toHaveBeenCalledTimes(1);
  });

  it("should send back save events", () => {
    let saveFn = jest.fn();
    let component = shallow(<InputFormField Field={TextInput} id="test-id" handleSave={saveFn}/>);
    let input = component.find(Input);
    input.simulate("save");
    expect(saveFn).toHaveBeenCalled();
  });
});