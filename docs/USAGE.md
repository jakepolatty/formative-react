# Usage Guide

## Using the `FormPage` Component
The `FormPage` component wraps the entire functionality of the library and wraps all library functionality,
including form generation and server calls for saving and loading schema data.  This component allows
for the rendering of fields from multiple schemas and is fully self-contained, so it can be added to any
React app without the need for additional setup beyond the following required props:
- `pageName`: A unique name to serve as the CSS id for the wrapper div for all form components
- `schemaEndpoint`: An endpoint that stores the JSON schema objects in the format
`schema_name.json`
- `dataApiEndpoint`: An endpoint where the form data can be retrieved with HTTP `GET` requests and
updated with HTTP `POST` requests
- `schemas`: An object with keys defining the schema groups that will be displayed in the form.  Each key
references an object with two keys, `schema` and `includes`.  The `schema` key is the official name of the
schema that will be retrieved from the `schemaEndpoint` as described above, while `includes` is an array of
the field names from that schema that should be visible in the form.  An example is provided
[below](#schemas-object-example).
- `uiSchema`: The UI schema object that controls the display and type of inputs used on the page.  The UI
schema is structured as a nested object with top level keys matching the schema names defined in `schemas`
and each of keys referring to an object keyed by field names for that schema.  These field keys reference
objects specifying the options for that schema field that will be loaded in when the JSON schema is parsed.
The most important option that is shared by all fields is `ui:component`, which allows for the
specification of a different input component type to render the data that the default option for that data
type.  The UI schema also provides the capability to display an info hover popup to the left of the input
component by including some description text with an `info` key.  An example UI schema is also provided
[below](#ui-schema-example).
- `customInputMap`: An optional object referencing user-defined input components to allow for the usage of
inputs from outside the core Formative React repository.  This object follows the style of the
[`reactInputMap`](src/inputMaps/reactInputMap.js) file with each string key that can be accessed within the
UI schema having a value of a React component type that should be generated for that key.  This input map
also allows the user to overwrite the base input components such as `TextInput` or `NumberInput` in cases
where they wish to use a different underlying framework such as Material UI instead of React Bootstrap.
- `onError`: A callback for handling error events that occur during API network operations.

### Schemas Object Example
```
<FormPage
  schemas={{
    "wms-a": {
      "schema": "wms",
      "include": ["layer", "style"]
    },
    "comt": {
      "schema": "comt",
      "include": ["project", "subproject", "model"]
    },
  }}
  .../>
```


## Using the `Form` Component
If your use case does not require server-side functionality for schema retrieval and saving or you wish to
provide your own implementation of these network operations, you can use the base `Form` component instead
of a `FormPage`.  The `Form` component provides the core schema parsing and form generation functionality
but expects the JSON schema and initial data to be passed in directly as props rather than retrieved
automatically from a server.  Note that unlike the `FormPage` component, the `Form` component **only
displays fields from a single JSON schema**, and additional schemas will require multiple `Form`
components. The `Form` component takes the following required props:
- `schema`: A JSON schema object from which the form structure will be generated.  Invalid schema formatting
will result in an error event being sent in the `onError` callback.
- `externalData`: An object keyed by the `schema` field names with any initial values that should be
presented in the form
- `schemaID`: The name of the schema described in `schema`
- `includeFields`: An array of the field names from `schema` that should be visible in the form
- `uiSchema`: The UI schema object that controls the display and type of inputs used on the page.  The UI
schema is structured as a nested object with top level keys matching the schema names defined in `schemas`
and each of keys referring to an object keyed by field names for that schema.  These field keys reference
objects specifying the options for that schema field that will be loaded in when the JSON schema is parsed.
The most important option that is shared by all fields is `ui:component`, which allows for the
specification of a different input component type to render the data that the default option for that data
type.  The UI schema also provides the capability to display an info hover popup to the left of the input
component by including some description text with an `info` key.  An example UI schema is also provided
[below](#ui-schema-example).
- `customInputMap`: An optional object referencing user-defined input components to allow for the usage of
inputs from outside the core Formative React repository.  This object follows the style of the
[`reactInputMap`](src/inputMaps/reactInputMap.js) file with each string key that can be accessed within the
UI schema having a value of a React component type that should be generated for that key.  This input map
also allows the user to overwrite the base input components such as `TextInput` or `NumberInput` in cases
where they wish to use a different underlying framework such as Material UI instead of React Bootstrap.
- `handleSave`: A callback that recieves updated fields on save events for handling in the parent component.
- `onError`: A callback for handling error events that occur during API network operations.


## UI Schema Example
```
{
  wms: {
    opacity: {
      "ui:component": "NumberSliderInput"
    }
  },
  "sample-schema": {
    bounds: {
      info: "The geospatial bounds for the project",
      "ui:component": "GeoBoundingBoxInput"
    },
    description: {
      "ui:component": "TextAreaInput",
      rows: 4,
      info: "A description of the project"
    }
  }
}
```


## CSS Style Guide
The form generation procedure provides all children within the `Form` component with consistently formatted
CSS ids to allow for full custom styling of the form and its fields.  All of the id formats are described
below:

### Form Ids
All ids in the top level form components are defined based upon the `schemaID` passed in as a prop (when
the `FormPage` component is used, this is the value of the `schema` key defined in the nested `schemas`
object).  For a sample schema named `wms`, the following ids would be accessible in CSS:
- `wms-FORM`: The wrapper div for the `Form` component that contains all fields and the form save button.
- `wms-SAVE`: The save button for the `Form` component.

### Input Group Ids
All ids at the level of groups of inputs are defined based upon the name of that field group defined in the
JSON schema.  For a sample group named `general`, the following id is always rendered to the page:
- `general-INPUTS`: A wrapper div for all inputs within the group, allowing for group-based styles.

Nodes with the following ids are optionally rendered if the JSON schema provides the relevant data:
- `general-LABEL`: A heading label displayed above the group of inputs
- `general-DESCRIPTION`: A text description of the contents of the group displayed below the list of inputs

### Input Ids
All ids at the level of individual inputs are defined based upon the name of that field defined in the
JSON schema (and referenced in other locations such as the `includes` list). For a sample input with field
name `project`, the following ids are always rendered to the page:
- `project-GROUP`: The React Bootstrap `Form.Group` wrapper around the input component and all associated
components
- `project`: The input component itself
- `project-SAVE`: The save button displayed to the right of the input component that becomes active when
the value of the input field is updated

Nodes with the following ids are optionally rendered if the JSON schema and UI schema provide the relevant
data:
- `project-LABEL`: The title label for the field
- `project-DESCRIPTION`: A text description displayed below the field
- `project-INFO`: An optional info hover button that displays additional information about the field

