import React from 'react';
import {shallow, mount} from 'enzyme';
import APISchemaForms from './APISchemaForms';

describe("<APISchemaForms>", () => {
  it("should fetch the schema and data on load", () => {
    let component = shallow(<APISchemaForms
      schemaEndpoint="http://localhost:8888/schema/"
      schemas={{wms: {schema: "wms", include: ["layer", "style", "opacity"]}}}
      dataApiEndpoint="http://localhost:8888/api/"
      uiSchema={{wms: {opacity: {"ui:component": "NumberSliderInput"}}}}/>);
  });
});

