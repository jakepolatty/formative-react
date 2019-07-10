# Style Guide

All new input fields suggested to the `react-schema-form` must adhere to this style guide
in order to be a candidate for acceptance into the repository.

## Directory Usage
All inputs should be added to an appropriate subdirectory within the `src/components/inputs` directory.


## Design Patterns
### Functional Components
This repository follows the new development standard introduced in React 16.8 with the
[Hooks API](https://reactjs.org/docs/hooks-reference.html) of writing functional components
with hooks rather than stateful class-based components.

The expected format for a new functional input component is included below:
```
import React from 'react';
export default function SomeInput({id, initialValue, onUpdate}) {
  return (...);
}
```

### Expected Props
All custom input fields must accept the following props:
- `id`: A unique identifier key designating the field
- `initialValue`: The initial value that the field should take on
- `onUpdate`: A callback that handles updates to the field value
These props are all passed into any input field component from the `Input` wrapper.

### Label, Description, and Saving
New input field components should **not** accept props for label or description text or accept a callback
to handle saving functionality, as all of these props are handled by default in the `Input` wrapper component.

### Additional Props
Any additional props (for example, the `rows` prop for `TextAreaInput`) can be included in the object
destructuring list and passed in from the `uiSchema` for the containing `Form`.  It is highly recommended
that additional props are specified explicitly rather than including a `...rest` spread operator and
passing in the additional props into the input component with `{...rest}` in the props list.  This strict
specification of possible props ensures that excessive styling is not performed within the `uiSchema`,
which could override any field prop if `{...rest}` were used.


## Adding a New Component
In order to add a new component to the repository that can be referenced from the `uiSchema` and displayed
dynamically in a `Form`, follow these steps (described for a component named `SomeInput`):
1. Create a new functional input field component `SomeInput.js` in the `src/components/inputs` directory,
adhering to all of the design patterns described [above](#design-patterns).
2. In the file `src/inputMaps/reactInputMap.js` add an import for the location of the new component
and a new key-value pair to the object:
```
import SomeInput from '../components/inputs/SomeInputs/SomeInput';
...
const reactInputMap = {
  ...
  SomeInput: SomeInput,
  ...
};
```
3. In the file `src/inputMaps/inputTypeMap.js`, add the string `"SomeInput"` to the arrays for each of the
JSON schema data types that can be displayed in the field.  For example, if `SomeInput` can handle string
and number type data, the following edits would be made:
```
const inputTypeMap = {
  string: [
    ...
    "SomeInput",
  ],
  number: [
    ...
    "SomeInput",
  ],
  ...
};
```


## New Component Usage
New input components should never be used as a standalone field and should always be considered to be a part of an `Input` component wrapper.  Once the component has been registered in `reactInputMap.js` and
`inputTypeMap.js` as described [above](#adding-a-new-component), the field can be rendered by setting
the value of `ui:component` in the UISchema:
```
{
  sampleSchema: {
    testField: {
      "ui:component": "SomeInput"
    }
  }
}
```
