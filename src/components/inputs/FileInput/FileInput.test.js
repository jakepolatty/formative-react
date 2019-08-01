import React from 'react';
import Form from 'react-bootstrap/Form';
import {shallow} from 'enzyme';
import FileInput from './FileInput';

describe("<FileInput>", () => {
  it("should render correctly", () => {
    let component = shallow(<FileInput/>);
    let input = component.find(Form.Control).dive();
    expect(input.type()).toEqual("input");
    expect(input.prop("type")).toEqual("file");
  });

  it("should have the correct id", () => {
    let component = shallow(<FileInput id="test-id"/>);
    let input = component.find(Form.Control).dive();
    expect(input.prop("id")).toEqual("test-id");
  });

  it("should have a settable multiple flag", () => {
    let component = shallow(<FileInput id="test-id" multiple={true}/>);
    let input = component.find(Form.Control).dive();
    expect(input.prop("multiple")).toEqual(true);
  });

  it("should have a settable accept string", () => {
    let component = shallow(<FileInput id="test-id" accept="image/png,image/jpg"/>);
    let input = component.find(Form.Control).dive();
    expect(input.prop("accept")).toEqual("image/png,image/jpg");
  });

  it("should send back updates", () => {
    const updateFn = jest.fn();
    let file1 = new File(["test"], "test.txt", {type: "text/plain"});
    let file2 = new File(["test2"], "test2.txt", {type: "text/plain"});

    let component1 = shallow(<FileInput id="test-id" onUpdate={updateFn}/>);
    component1.simulate("change", {target: {name: "test-id", files: [file1]}});
    expect(updateFn).toHaveBeenCalledWith(file1);

    // Not called if no update function
    let component2 = shallow(<FileInput id="test-id"/>);
    component2.simulate("change", {target: {name: "test-id", files: [file1]}});
    expect(updateFn).toHaveBeenCalledTimes(1);

    // Multiple files
    let component3 = shallow(<FileInput id="test-id" onUpdate={updateFn} multiple={true}/>);
    component3.simulate("change", {target: {name: "test-id", files: [file1, file2]}});
    expect(updateFn).toHaveBeenCalledWith([file1, file2]);

    // Not called if no update function
    let component4 = shallow(<FileInput id="test-id" multiple={true}/>);
    component4.simulate("change", {target: {name: "test-id", files: [file1, file2]}});
    expect(updateFn).toHaveBeenCalledTimes(2);
  });
});