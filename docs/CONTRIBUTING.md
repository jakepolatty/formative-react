# Style and Contribution Guide

All new input fields proposed for `react-schema-form` must follow this style guide
in order to be a candidate for acceptance into the repository.

## Installation and Contributing
1. [Create a fork](https://github.com/jakepolatty/react-schema-form/fork) of the repository and clone
the fork locally with `git clone`.
2. Within the project root directory, run `npm install` to install all dependencies for development.
3. Create a new feature branch with a descriptive name for your new component.
4. Follow the guide [below](#adding-a-new-component) when writing your new component and testing it.
5. Confirm that all unit tests still pass with the command `npm run test`.
6. Confirm that there are no Flow type errors with the command `npm run flow`.
7. Submit a pull request!


## Adding a New Component
In order to add a new component to the repository that can be referenced from the `uiSchema` and displayed
dynamically in a `Form`, follow these steps (described for a component named `SomeInput`):
1. Create a new functional input field component `SomeInput.js` in the `src/components/inputs` directory,
adhering to all of the design patterns described [below](#design-patterns).
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
4. In the directory `src/components/inputs/SomeInput`, create a test file `SomeInput.test.js` and add
comprehensive unit tests for the component.  Additional details on best practices for testing are
[below](#testing).


## Design Patterns
### Functional Components
This repository follows the development standard introduced in React 16.8 with the
[Hooks API](https://reactjs.org/docs/hooks-reference.html) of writing functional components
with hooks rather than stateful class-based components.

The expected format for a new functional input component is included below:
```
import React from 'react';
export default function SomeInput(props: GenericInputProps) {
  let {id, initialValue, onUpdate} = props;
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

### Directory Usage
All inputs should be added to an appropriate subdirectory within the `src/components/inputs` directory.

### Flow Static Typing
Every component in this project employs the [Flow](https://flow.org/en/) static type checker to ensure
type safety when passing form data between components.  All new components should follow this pattern by
placing a `// @flow` annotation at the top of the file so that the type checker can parse the file.

New components should import one of the default Flow input prop types defined in the file
`src/inputs/inputFlowTypes.js` to provide the main data type interface for the new component.  If the
component takes additional props passed in from the UI Schema, one of these default prop types should
still be imported and can be composed with the additional props to give a custom props type for the
component.  An example from the `TextAreaInput` component is shown below:
```
import type {StringInputProps} from '../inputFlowTypes.js';
type Props = {
  ...StringInputProps,
  rows: number
}

export default function TextAreaInput(props: Props) {
  let {id, initialValue, onUpdate, rows} = props;
  ...
}
```


## Testing
Unit testing for the project is powered by [Jest](https://jestjs.io/en/) and
[Enzyme](https://airbnb.io/enzyme/), with individual input component tests relying on the Enzyme
[shallow renderer](https://airbnb.io/enzyme/docs/api/shallow.html) to access props and test event
handlers.

### Running Tests
- A testing server can be launched in watch mode with the command `npm run test`, which will allow for
tests to be re-run on save for the relevant files.
- A full coverage report can be generated with the command `npm run coverage`.  In addition to the report
generated in the terminal, more detailed information can be viewed by opening the file
`coverage/lcov-report/index.html` in a web browser.

### Expected Tests
All input components should include unit tests covering the following core behaviors to ensure that they
will interface correctly with the library.
1. The component renders without crashing
- This should also check that the component still renders when all non-required props are left undefined.
2. The component uses the id prop that is passed in
- This requirement ensures that the new input follows the CSS conventions for the project and can be styled
with reference to the id.
2. The component renders a default value correctly
- This will typically require traversal of the component tree generated by the shallow render in order to
confirm that the default value is presented in the UI.
3. The component sends back the new value on update events
- This test is critical to ensure that new inputs are propagated back to the `Form` data manager so that
they can be sent back to the server on save events.  The standard format for writing this test is to
pass in a Jest mock function as the `onUpdate` prop to the component and confirm that the mock function
has been called with the new value after simulating an update using the Enzyme `component.simulate()`
function.  An example from the `TextInput.test.js` file is shown below:
```
it("should send back updates", () => {
  const updateFn = jest.fn();
  let component = shallow(<TextInput id="test-id" initialValue="Test" onUpdate={updateFn}/>);
  component.simulate("change", {target: {name: "test-id", value: "New Value"}});
  expect(updateFn).toHaveBeenCalledWith("New Value");
});
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
