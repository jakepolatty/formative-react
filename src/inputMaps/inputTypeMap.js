const inputTypeMap = {
  string: [
    "AsyncAutocompleteInput",
    "AutocompleteTextInput",
    "TextInput",
    "TextAreaInput",
    "FileInput",
    "SelectInput",
    "DateInput",
    "DatetimeInput",
    "GeoBoundingBoxInput",
    "HiddenInput",
  ],
  number: [
    "NumberInput",
    "NumberSliderInput",
    "TextInput",
    "RangeInput",
    "HiddenInput",
  ],
  boolean: [
    "RadioInput",
    "CheckboxInput",
    "HiddenInput",
  ],
  integer: [
    "NumberInput",
    "NumberSliderInput",
    "TextInput",
    "RangeInput",
    "HiddenInput",
  ],
  array: [
    "MultiSelectInput",
    "MultiCheckboxInput",
    "MultiFileInput",
    "HiddenInput",
  ],
};

export default inputTypeMap;