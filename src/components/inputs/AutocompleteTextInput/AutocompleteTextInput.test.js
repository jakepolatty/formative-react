import React from 'react';
import {Typeahead} from 'react-bootstrap-typeahead'
import {shallow} from 'enzyme';
import AutocompleteTextInput from './AutocompleteTextInput';

const testOptions = [
  "AutocompleteTextInput",
  "NumberInput",
  "RadioInput",
  "SelectInput",
  "TextInput"
];

describe("<AutocompleteTextInput>", () => {
  it("should render correctly with an id", () => {
    let component = shallow(<AutocompleteTextInput id="test-id" options={testOptions}/>);
    let input = component.find(Typeahead);
    expect(input.prop("id")).toEqual("test-id");
  });

  it("should pass through an options array", () => {
    let component = shallow(<AutocompleteTextInput id="test-id" options={testOptions}
      initialValue={testOptions[0]}/>);
    let input = component.find(Typeahead);
    expect(input.prop("options")).toEqual(testOptions);
  });

  it("should have a settable multiple flag", () => {
    let component = shallow(<AutocompleteTextInput id="test-id" options={testOptions} multiple={true}/>);
    let input = component.find(Typeahead);
    expect(input.prop("multiple")).toEqual(true);
  });

  it("should render a placeholder with no default value", () => {
    let component = shallow(<AutocompleteTextInput id="test-id" options={testOptions}
      placeholder="Select an input type"/>);
    let input = component.find(Typeahead);
    expect(input.prop("placeholder")).toEqual("Select an input type");
  });

  it("should send back updates", () => {
    const updateFn = jest.fn();
    let component1 = shallow(<AutocompleteTextInput id="test-id" options={testOptions}
      initialValue="TextInput" onUpdate={updateFn}/>);
    component1.simulate("change", ["SelectInput"]);
    expect(updateFn).toHaveBeenCalledWith("SelectInput");

    // Multiple Selections
    let component2 = shallow(<AutocompleteTextInput id="test-id" options={testOptions}
      initialValue={["TextInput", "RadioInput"]} multiple={true} onUpdate={updateFn}/>);
    component2.simulate("change", ["TextInput", "RadioInput", "NumberInput"]);
    expect(updateFn).toHaveBeenCalledWith(["TextInput", "RadioInput", "NumberInput"]);
  });
});