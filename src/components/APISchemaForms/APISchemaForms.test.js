import React from 'react';
import {shallow, mount} from 'enzyme';
import APISchemaForms from './APISchemaForms';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {act} from 'react-dom/test-utils';
import Form from '../Form/Form';
import Input from '../inputs/Input/Input';
import SelectInput from '../inputs/SelectInput/SelectInput';
import Button from 'react-bootstrap/Button';

const mockSchema = {
  title: "WMS",
  description: "A simple form for WMS specification.",
  type: "object",
  required: [
    "layer",
    "style"
  ],
  properties: {
    layer: {
      type: "string",
      title: "LAYER",
      enum: [
        "LayerA",
        "LayerB",
        "LayerC",
        "TODO_populate_this_enum_with_endpoint"
      ]
    },
    style: {
      type: "string",
      title: "STYLE",
      enum: [
        "StyleA",
        "StyleB",
        "StyleC",
        "TODO_populate_this_enum_with_endpoint"
      ]
    },
    opacity: {
      type: "integer",
      title: "Opacity"
    },
    transparent: {
      type: "boolean",
      title: "Transparent"
    },
    elevation: {
      type: "number",
      title: "Elevation",
      minimum: -10994,
      maximum: 8848,
    }
  }
};

const mockData = {
  layer: "LayerB",
  opacity: 72,
  transparent: true
};

describe("<APISchemaForms>", () => {
  const setState = jest.fn();
  const useStateSpy = jest.spyOn(React, "useState");
  useStateSpy.mockImplementation((init) => [init, setState]);

  beforeEach(() => {
    const mock = new MockAdapter(axios);
    mock.onGet("http://localhost:8888/schema/wms.json").reply(200, mockSchema);
    mock.onGet("http://localhost:8888/api/wms/").reply(200, mockData);
    mock.onPost("http://localhost:8888/api/wms/", {layer: "LayerA", style: undefined, opacity: 72, transparent: true})
      .reply(200, {layer: "LayerA", style: undefined, opacity: 72, transparent: true});
  });

  it("should fetch the schema and data on load", done => {
    let component = mount(<APISchemaForms
      schemaEndpoint="http://localhost:8888/schema/"
      schemas={{wms: {schema: "wms", include: ["layer", "style", "opacity", "transparent"]}}}
      dataApiEndpoint="http://localhost:8888/api/"
      uiSchema={{wms: {opacity: {"ui:component": "NumberSliderInput"}}}}/>);

    setImmediate(() => {
      component.update();
      
      let form = component.find(Form);
      expect(form.prop("schemaID")).toEqual("wms");
      expect(form.prop("externalData")).toEqual({layer: "LayerB", opacity: 72, style: undefined, transparent: true});
      expect(form.prop("includeFields")).toEqual(["layer", "style", "opacity", "transparent"]);

      let schema = form.prop("schema");
      expect(schema.description).toEqual("A simple form for WMS specification.");

      done();
    })
  });

  it("should send back save data on save events", done => {
    let component = mount(<APISchemaForms
      schemaEndpoint="http://localhost:8888/schema/"
      schemas={{wms: {schema: "wms", include: ["layer", "style", "opacity", "transparent"]}}}
      dataApiEndpoint="http://localhost:8888/api/"
      uiSchema={{wms: {opacity: {"ui:component": "NumberSliderInput"}}}}/>);

    setImmediate(() => {
      component.update();

      let form = component.find(Form);

      // Single field save
      let inputs = form.find(Input);
      let layerInput = inputs.at(0);
      let inputField1 = layerInput.find(SelectInput);
      inputField1.simulate("change", {target: {name: "layer", value: "LayerA"}});
      // let saveButton1 = layerInput.find(Button);
      // saveButton1.simulate("click");

      //expect(setState).toHaveBeenCalledWith(true);

      done();
    });
  });

  it("should give an empty includes list if no include list is provided", done => {
    let component = mount(<APISchemaForms
      schemaEndpoint="http://localhost:8888/schema/"
      schemas={{wms: {schema: "wms"}}}
      dataApiEndpoint="http://localhost:8888/api/"
      uiSchema={{}}/>);

    setImmediate(() => {
      component.update();

      let form = component.find(Form);
      expect(form.prop("includeFields")).toEqual([]);

      done();
    });
  });
});

