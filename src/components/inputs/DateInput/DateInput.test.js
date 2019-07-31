import React from 'react';
import Form from 'react-bootstrap/Form';
import {shallow} from 'enzyme';
import DateInput from './DateInput';

describe("<DateInput>", () => {
  it("should render correctly", () => {
    let component = shallow(<DateInput/>);
    let input = component.find(Form.Control).dive();
    expect(input.type()).toEqual("input");
  });

  it("should have the correct id", () => {
    let component = shallow(<DateInput id="test-id"/>);
    let input = component.find(Form.Control).dive();
    expect(input.prop("id")).toEqual("test-id");
  });

  it("should have a default value", () => {
    let component = shallow(<DateInput id="test-id" initialValue="2019-01-01"/>);
    let input = component.find(Form.Control).dive();
    expect(input.prop("defaultValue")).toEqual("2019-01-01");
  });

  it("should send back updates", () => {
    const updateFn = jest.fn();
    let component = shallow(<DateInput id="test-id" initialValue="2019-01-01" onUpdate={updateFn}/>);
    component.simulate("change", {target: {name: "test-id", value: "2019-01-02"}});
    expect(updateFn).toHaveBeenCalledWith("2019-01-02");
  });
});