import React from 'react';
import {shallow, mount} from 'enzyme';
import Form, {updateReducer} from './Form';
import InputFormField from './FormGeneration/InputFormField';

const sampleSchema = {
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
      title: "Opacity",
      default: 100
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
      default: 0
    }
  }
};

describe("<Form>", () => {
  it("should render a schema that is passed in", () => {
    let form = shallow(<Form schema={sampleSchema}
      uiSchema={{opacity: {"ui:component": "NumberSliderInput"}}} externalData={{elevation: 30}}
      schemaID="wms" includeFields={['style', 'opacity', 'transparent', 'elevation']}/>);
    expect(form.hasClass("wms-FORM")).toEqual(true);
  });

  it("should render a save button", () => {
    let saveFn = jest.fn();

    let form = shallow(<Form schema={sampleSchema}
      uiSchema={{opacity: {"ui:component": "NumberSliderInput"}}} externalData={{elevation: 30}}
      schemaID="wms" includeFields={['style', 'opacity', 'transparent', 'elevation']} handleSave={saveFn}/>);
    
    let saveButton = form.find("#wms-SAVE");
    saveButton.simulate("click");
    expect(saveFn).toHaveBeenCalledWith({elevation: 30});
  });

  it("should correctly reduce update dispatches", () => {
    let sampleUpdatedDict = {layer: true, opacity: true};

    let reduced1 = updateReducer(sampleUpdatedDict, {type: "reset", payload: ""});
    expect(reduced1).toEqual({});

    let reduced2 = updateReducer(sampleUpdatedDict, {type: "update", payload: "elevation"});
    expect(reduced2).toEqual({layer: true, opacity: true, elevation: true});

    let reduced3 = updateReducer(sampleUpdatedDict, {type: "save-field", payload: "layer"});
    expect(reduced3).toEqual({opacity: true});

    let reduced4 = updateReducer(sampleUpdatedDict, {type: "other", payload: ""});
    expect(reduced4).toEqual({layer: true, opacity: true});
  })
});