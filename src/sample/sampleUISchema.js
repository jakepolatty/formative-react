const sampleUISchema = {
  wms: {
    opacity: {
      "ui:component": "NumberSliderInput"
    }
  },
  comt: {
    project: {
      info: "The project name",
      "ui:component": "GeoBoundingBoxInput"
    },
    subproject: {
      "ui:component": "TextAreaInput",
      rows: 1,
      info: "The subproject name"
    }
  }
};

export default sampleUISchema;