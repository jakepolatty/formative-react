import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import {shallow} from 'enzyme';
import Input from './Input';
import TextInput from '../TextInput/TextInput';

describe("<Input>", () => {
  it("should render an input of the specified type", () => {
    let component = shallow(<Input Type={TextInput} id="test-id"/>);
    let input = component.find(TextInput);
    expect(input.length).toEqual(1);
  });

  it("should render a label", () => {
    let component = shallow(<Input Type={TextInput} id="test-id" label="Test Label"/>);
    let label = component.find(Form.Label);
    expect(label.length).toEqual(1);
    expect(label.text()).toEqual("Test Label");
  });

  it("should render a description", () => {
    let component = shallow(<Input Type={TextInput} id="test-id" description="Test Description"/>);
    let description = component.find(Form.Text);
    expect(description.length).toEqual(1);
    expect(description.text()).toEqual("Test Description");
  });

  it("should render an info hover tooltip", () => {
    let component = shallow(<Input Type={TextInput} id="test-id" info="Test Info Text"/>);
    let infoGroup = component.find(InputGroup.Prepend);
    let overlay = infoGroup.find(OverlayTrigger);
    let tooltip = shallow(overlay.prop("overlay"));
    expect(tooltip.prop("children")).toEqual("Test Info Text");
  });

  it("should apply dynamic ids to all sections", () => {
    let component = shallow(<Input Type={TextInput} id="test-id"
      label="Test Label" description="Test Description" info="Test Info Text"/>);
    expect(component.prop("id")).toEqual("test-id-GROUP");

    let label = component.find(Form.Label);
    expect(label.prop("id")).toEqual("test-id-LABEL");

    let description = component.find(Form.Text);
    expect(description.prop("id")).toEqual("test-id-DESCRIPTION");

    let info = component.find(InputGroup.Prepend);
    expect(info.find(Button).prop("id")).toEqual("test-id-INFO");

    let input = component.find(TextInput);
    expect(input.prop("id")).toEqual("test-id");

    let saveButton = component.find(InputGroup.Append).find(Button);
    expect(saveButton.prop("id")).toEqual("test-id-SAVE");
  });

  it("should apply a default value", () => {
    let component = shallow(<Input Type={TextInput} id="test-id" initialValue="Test Value"/>);
    let input = component.find(TextInput);
    expect(input.prop("initialValue")).toEqual("Test Value");
  });

  it("should send back updates", () => {
    const updateFn = jest.fn();
    let component = shallow(<Input Type={TextInput} id="test-id" onUpdate={updateFn}/>);
    let input = component.find(TextInput);
    input.dive().simulate("change", {target: {name: "test-id", value: "New Value"}});
    expect(updateFn).toHaveBeenCalledWith("New Value");
  });

  it("should send back save events", () => {
    const saveFn = jest.fn();
    let component = shallow(<Input Type={TextInput} id="test-id" onSave={saveFn}/>);
    let saveButton = component.find(InputGroup.Append).find(Button);
    saveButton.simulate("click");
    expect(saveFn).toHaveBeenCalled();
  });
});