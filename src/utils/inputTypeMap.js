const inputTypeMap = {
  string: [
    "TextInput",
    "TextAreaInput",
    "PasswordInput",
    "EmailInput",
    "UrlInput",
    "FileInput",
    "SelectInput",
    "DateInput",
    "DatetimeInput",
    "HiddenInput",
  ],
  number: [
    "NumberInput",
    "NumberSliderInput",
    "TextInput",
    "RangeInput",
    // "SelectInput",
    "HiddenInput",
  ],
  boolean: [
    "RadioInput",
    "CheckboxInput",
    "HiddenInput",
  ],
  integer: [
    "IntegerInput",
    "NumberSliderInput",
    "TextInput",
    "RangeInput",
    // "SelectInput",
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