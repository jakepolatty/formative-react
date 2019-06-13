const inputTypeMap = {
  string: {
    text: "TextInput",
    textarea: "TextAreaInput",
    password: "PasswordInput",
    email: "EmailInput",
    uri: "UrlInput",
    file: "FileInput",
    select: "SelectInput",
    date: "DateInput",
    datetime: "DatetimeInput",
    hidden: "HiddenInput",
  },
  number: {
    float: "FloatInput",
    text: "TextInput",
    hidden: "HiddenInput",
  },
  boolean: {
    radio: "RadioInput",
    checkbox: "CheckboxInput",
    hidden: "HiddenInput",
  },
  integer: {
    integer: "IntegerInput",
    text: "TextInput",
    hidden: "HiddenInput",
  },
  array: {
    select: "MultiSelectInput",
    checkboxes: "MultiCheckboxInput",
    files: "MultiFileInput",
    hidden: "HiddenInput",
  },
};

export default inputTypeMap;