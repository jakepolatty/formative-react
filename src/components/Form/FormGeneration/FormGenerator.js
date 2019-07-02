// @flow
import React from 'react';
import type {ComponentType, Element, Node} from 'react';
import reactInputMap from '../../../utils/reactInputMap.js';
import InputFormField from './InputFormField';

export type FieldsType = {
  type: string,
  id: string,
  defaultValue: any,
  arrayIndex?: number,
  label?: string,
  description?: string,
  groupType?: string,
  minItems?: number,
  items?: Array<any>,
  itemFormat?: any,
  rest?: Array<any>
}

class FormGenerator {
  formData: {[key: string]: any};
  setFormData: ({[key: string]: any}) => void;
  updatedDict: {[key: string]: any};
  setUpdatedDict: ({[key: string]: any}) => void;
  includeFields: Array<string>;
  handleSave: Function;

  constructor(formData: {[key: string]: any}, setFormData: ({[key: string]: any}) => void,
    updatedDict: {[key: string]: any}, setUpdatedDict: ({[key: string]: any}) => void,
    includeFields: Array<string>, handleSave: Function) {
    this.formData = formData;
    this.setFormData = setFormData;
    this.updatedDict = updatedDict;
    this.setUpdatedDict = setUpdatedDict;
    this.includeFields = includeFields;
    this.handleSave = handleSave;
  }

  // Generates the React component heirarchy for the form from the parsed schema
  generateForm(fields: FieldsType | {[key: string]: any}): ?Node {
    console.log("test")
    if (fields !== undefined && fields !== null) {
      if (fields.type === "InputGroup") {
        if (fields.items !== undefined && fields.items !== null) {
          return this.generateInputList(fields);
        } else if (fields.itemFormat !== undefined && fields.itemFormat !== null) {
          return this.generateInputFormat(fields);
        } else {
          // There was an error constructing the input group
          return null;
        }
      } else {
        const Field = reactInputMap[fields.type];
        if (Field !== undefined) {
          // At this point the fields argument is at the level of a single field that can be rendered
          const {type, id, defaultValue, arrayIndex, label, description, ...rest} = fields;
          
          // If the form data contains this field, overwrite the default value
          // Otherwise pass in the default if there is one
          let initialValue;
          if (this.formData[id] !== undefined) {
            initialValue = this.formData[id];
          } else if (defaultValue !== undefined) {
            initialValue = defaultValue;
          }
          
          // Only standalone fields will be directly in the include list
          if (this.includeFields.includes(id)) {
            let displayId = arrayIndex !== undefined ? id + + "-" + arrayIndex : id;
            return (
              <InputFormField
                Field={Field}
                id={displayId}
                key={displayId}
                initialValue={initialValue}
                arrayIndex={arrayIndex}
                label={label}
                description={description}
                formData={this.formData}
                setFormData={this.setFormData}
                updated={this.updatedDict[displayId]}
                setUpdatedDict={this.setUpdatedDict}
                handleSave={this.handleSave}
                {...rest}
              />
            );
          } else {
            // This field should not be rendered to the page if it is not in the include list
            return null;
          }
        } else {
          // In the case where no matching field exists, return null
          return null;
        }
      }
    } else {
      // In the case where fields is empty, return null
      return null;
    }
  };

  // Generates an explicit list of input fields for an InputGroup
  generateInputList(fields: FieldsType): ?Element<'div'> {
    // The specific list of items has been provided
    let hasVisibleChild = false;
    let itemGroup;
    if (fields.items !== null && fields.items !== undefined) {
      itemGroup = (
        <div id={fields.id} key={fields.id}>
          {fields.label !== undefined &&
            <h2 id={fields.id + "-LABEL"}>{fields.label}</h2>}
          <div id={fields.id+"-INPUTS"}>
            {fields.items.map((field, i) => {
              // If initial values have been passed in with the form data, overwrite the field object
              if (this.formData[fields.id] !== undefined &&
                Array.isArray(this.formData[fields.id]) && i < this.formData[fields.id].length) {
                field.defaultValue = this.formData[fields.id][i];
              }
              // If the input group is of type array, add the array index for update handling
              if (fields.groupType === "array") {
                field.arrayIndex = i;
              }
              
              // If a child is visible, indicate that the group should be shown
              let child = this.generateForm(field);
              if (child !== null) {
                hasVisibleChild = true;
              }

              return child;
            })}
          </div>
          {fields.description !== undefined &&
            <p id={fields.id + "-DESCRIPTION"}>{fields.description}</p>}
        </div>
      );
    }

    // Only show the input group if it has a child to display
    if (hasVisibleChild) {
      return itemGroup;
    } else {
      return null;
    }
  };

  // Generates a list of input fields of the correct length for a generic InputGroup array
  generateInputFormat(fields: FieldsType): ?Element<'div'> {
    // A generic item format has been provided, so compute the number of elements that
    // should be rendered
    let listLength = 1;
    let valueCount = 0;
    let defaultsCount = 0;

    // If the list has a min length set that to the current list length
    if (fields.minItems !== undefined && fields.minItems > 0) {
      listLength = fields.minItems;
    }
    // If more values have been passed in with the form data than the min length, update the length 
    if (this.formData[fields.id] !== undefined && Array.isArray(this.formData[fields.id])) {
      valueCount = this.formData[fields.id].length;
      listLength = Math.max(listLength, valueCount);
    }
    // If there are more default values than the current list length, 
    if (fields.defaultValue !== undefined && fields.defaultValue.length > 0) {
      defaultsCount = fields.defaultValue.length;
      listLength = Math.max(listLength, defaultsCount);
    }
    
    if (this.includeFields.includes(fields.id)) {
      return (
        <div id={fields.id} key={fields.id}>
          {fields.label !== undefined &&
            <h2 id={fields.id + "-LABEL"}>{fields.label}</h2>}
          <div id={fields.id+"-INPUTS"}>
            {[...Array(listLength)].map((_, i) => {
              // For each element within the computed list length, check whether it has an initial value
              let format = fields.itemFormat;
              if (format !== null && format !== undefined) {
                format.arrayIndex = i;
                if (i < valueCount) {
                  format.defaultValue = this.formData[fields.id][i];
                } else if (i < defaultsCount) {
                  format.defaultValue = fields.defaultValue[i];
                } else {
                  format.defaultValue = undefined;
                }
                return this.generateForm(format);
              } else {
                return null;
              }
            })}
          </div>
          {fields.description !== undefined &&
            <p id={fields.id + "-DESCRIPTION"}>{fields.description}</p>}
        </div>
      );
    } else {
      // The field is not included in the list
      return null;
    }
  };
}

export default FormGenerator;