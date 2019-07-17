import React from 'react';
import {shallow, mount} from 'enzyme';
import Form from './Form';
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
});