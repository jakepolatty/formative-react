# React Schema Form
[![Build Status](https://travis-ci.com/jakepolatty/react-schema-form.svg?branch=master)](https://travis-ci.com/jakepolatty/react-schema-form)
[![Coverage Status](https://coveralls.io/repos/github/jakepolatty/react-schema-form/badge.svg?branch=master)](https://coveralls.io/github/jakepolatty/react-schema-form?branch=master)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

> Dynamic React forms, with generation driven by a JSON schema and full visual customizability
provided through a UI schema and standardized CSS id hooks.

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

## Contributing to the repository
If you wish to add a new input component to the repository for your use case, please read the
[Style and Contribution Guide](CONTRIBUTING.md).

## Authors
Jacob Polatty<sup>1</sup>

<sup>1</sup>Computer Science Department, Brown University, 115 Waterman Street, Providence, RI 02912

## Funding
This work was done at RPS Group, in support of the U.S. Integrated Ocean Observing System (IOOS®)
