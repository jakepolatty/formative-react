import React from 'react';
import {shallow} from 'enzyme';
import GeoBoundingBoxInput from './GeoBoundingBoxInput';
import NumberInput from '../NumberInput/NumberInput';

describe("<NumberInput>", () => {
  const setState = jest.fn();
  const useStateSpy = jest.spyOn(React, "useState");
  useStateSpy.mockImplementation((init) => [init, setState]);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render four number inputs", () => {
    let component = shallow(<GeoBoundingBoxInput/>);
    let inputs = component.find(NumberInput);
    expect(inputs.length).toEqual(4);
  });

  it("should have the correct id and child ids", () => {
    let component = shallow(<GeoBoundingBoxInput id="test-id"/>);
    expect(component.prop("id")).toEqual("test-id");

    let inputs = component.find(NumberInput);
    expect(inputs.at(0).prop("id")).toEqual("test-id-lon1");
    expect(inputs.at(1).prop("id")).toEqual("test-id-lat1");
    expect(inputs.at(2).prop("id")).toEqual("test-id-lon2");
    expect(inputs.at(3).prop("id")).toEqual("test-id-lat2");
  });

  it("should parse a correctly formatted coordinates string", () => {
    let component = shallow(<GeoBoundingBoxInput
      id="test-id" initialValue="(-130.2, 43.76), (141, -12.4)"/>);
    let inputs = component.find(NumberInput);
    expect(inputs.at(0).prop("initialValue")).toEqual(-130.2);
    expect(inputs.at(1).prop("initialValue")).toEqual(43.76);
    expect(inputs.at(2).prop("initialValue")).toEqual(141);
    expect(inputs.at(3).prop("initialValue")).toEqual(-12.4);
  });

  it("should not parse for incorrect string format", () => {
    let component = shallow(<GeoBoundingBoxInput id="test-id" initialValue="12.23 -13 170.6 test"/>);
    let inputs = component.find(NumberInput);
    expect(inputs.at(0).prop("initialValue")).toEqual(undefined);
    expect(inputs.at(1).prop("initialValue")).toEqual(undefined);
    expect(inputs.at(2).prop("initialValue")).toEqual(undefined);
    expect(inputs.at(3).prop("initialValue")).toEqual(undefined);
  });

  it("should update the output string for each number input", () => {
    const updateFn = jest.fn();
    let component = shallow(<GeoBoundingBoxInput
      id="test-id" initialValue="(-130.2, 43.76), (141, -12.4)" onUpdate={updateFn}/>);

    let inputs = component.find(NumberInput);
    inputs.at(0).dive().simulate("change", {target: {name: "test-id-lon1", value: -140.3}});
    expect(updateFn).toHaveBeenCalledWith("(-140.3, 43.76), (141, -12.4)");
    inputs.at(1).dive().simulate("change", {target: {name: "test-id-lat1", value: 43.768}});
    expect(updateFn).toHaveBeenCalledWith("(-140.3, 43.768), (141, -12.4)");
    inputs.at(3).dive().simulate("change", {target: {name: "test-id-lat2", value: -12.9}});
    expect(updateFn).toHaveBeenCalledWith("(-140.3, 43.768), (141, -12.9)");
    inputs.at(2).dive().simulate("change", {target: {name: "test-id-lon2", value: -141}});
    expect(updateFn).toHaveBeenCalledWith("(-140.3, 43.768), (-141, -12.9)");
  });
});