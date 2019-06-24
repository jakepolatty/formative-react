# React Schema Form

Dynamic React forms, generated from a JSON schema with full display options controlled by a UI schema.

## Installation
1. Install Node.js and npm (Node Package Manager)
2. Clone a local copy of the project with `git clone`
3. Install the Node package dependencies with `npm install`

## Testing the application
Run the test application in development mode with `npm start`.
By default, the app will launch at [http://localhost:3000](http://localhost:3000).

The test application renders an instance of the `App` component defined in `App.js`.
Any edits made to `App.js` or any of the input components will be reflected immediately
in development mode due to the live reload.  By default the app renders an `APISchemaForms`
component that takes in the following props:
- `schemaEndpoint`: An endpoint that stores schema objects in the format `schema_name.json`
- `schemas`: An object with keys defining the schemas that will be retrieved from the
  endpoint.  Each key references an object containing an `includes` array defining the fields
  that should be displayed in that form.
- `dataApiEndpoint`: The endpoint where the form data can be accessed and modified
- `uiSchema`: The UI schema object that controls the display and type of inputs used on the page.