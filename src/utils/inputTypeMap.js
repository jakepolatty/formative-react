export default const inputTypeMap = {
  string: {
    text: "TextInput",
    password: "PasswordInput",
    email: "EmailInput",
    url: "UrlInput",
    file: "FileInput",
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