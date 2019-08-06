import React from 'react';
import {AsyncTypeahead} from 'react-bootstrap-typeahead'
import {shallow, mount} from 'enzyme';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import AsyncAutocompleteInput from './AsyncAutocompleteInput';

const mockData = {
  "total_count": 1,
  items: [
    {
      login: "jakepolatty"
    }
  ]
};

const queryUrl = "https://api.github.com/search/users?q=";
const queryKey = "login";

describe("<AsyncAutocompleteInput>", () => {
  const setState = jest.fn();
  const useStateSpy = jest.spyOn(React, "useState");
  useStateSpy.mockImplementation((init) => [init, setState]);

  const flushPromises = () => new Promise(setImmediate);

  beforeEach(() => {
    const mock = new MockAdapter(axios);
    mock.onGet("https://api.github.com/search/users?q=jakepolatty").reply(200, mockData);
    mock.onGet("https://api.github.com/search/users?q=badrequest").reply(403, {message: "API rate limit exceeded"});
  });

  it("should render correctly with an id", () => {
    let component = shallow(<AsyncAutocompleteInput id="test-id" queryUrl={queryUrl} queryKey={queryKey}/>);
    let input = component.find(AsyncTypeahead);
    expect(input.prop("id")).toEqual("test-id");
  });

  it("should have settable typeahead parameters", () => {
    let component = shallow(<AsyncAutocompleteInput id="test-id" queryUrl={queryUrl} queryKey={queryKey}
      multiple={true} placeholder={"Search for a user"} initialValue="jakepolatty"/>);
    let input = component.find(AsyncTypeahead);
    expect(input.prop("multiple")).toEqual(true);
    expect(input.prop("placeholder")).toEqual("Search for a user");
    expect(input.prop("defaultSelected")).toEqual(["jakepolatty"]);
  });

  it("should retrieve an options array on search", async () => {
    let component = shallow(<AsyncAutocompleteInput id="test-id" queryUrl={queryUrl} queryKey={queryKey}/>);

    component.simulate("search", "jakepolatty");
    await flushPromises();
    expect(setState).toHaveBeenCalledWith([{login: "jakepolatty"}])

    // Cache check
    component.simulate("search", "jakepolatty");
    expect(setState).toHaveBeenCalledTimes(4); // Loading true and false and two setOptions calls
  });

  it("should handle api errors without crashing", async () => {
    let component = shallow(<AsyncAutocompleteInput id="test-id" queryUrl={queryUrl} queryKey={queryKey}/>);

    component.simulate("search", "badrequest");
    await flushPromises();
    expect(setState).toHaveBeenCalledWith(false);
    expect(setState).toHaveBeenCalledWith([]);
  });

  it("should send back updates", () => {
    const updateFn = jest.fn();
    let component1 = shallow(<AsyncAutocompleteInput id="test-id" queryUrl={queryUrl} queryKey={queryKey}
      onUpdate={updateFn}/>);
    component1.simulate("change", [{login: "jakepolatty"}]);
    expect(updateFn).toHaveBeenCalledWith("jakepolatty");

    // Multiple selections
    let component2 = shallow(<AsyncAutocompleteInput id="test-id" queryUrl={queryUrl} queryKey={queryKey}
      onUpdate={updateFn} multiple={true}/>);
    component2.simulate("change", [{login: "jakepolatty"}, {login: "test"}]);
    expect(updateFn).toHaveBeenCalledWith(["jakepolatty", "test"]);

    // Empty selections
    let component3 = shallow(<AsyncAutocompleteInput id="test-id" queryUrl={queryUrl} queryKey={queryKey}
      onUpdate={updateFn}/>);
    component3.simulate("change", []);
    expect(updateFn).toHaveBeenCalledTimes(2);
  });
});