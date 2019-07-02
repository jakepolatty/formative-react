// @flow
import React from 'react';
import type {ComponentType, Element, Node} from 'react';
import reactInputMap from '../../../utils/reactInputMap.js';
import Input from '../../inputs/Input';
import type {InputFieldProps} from '../../inputs/Input';

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
            if (arrayIndex !== undefined) {
              return this.generateArrayField(Field, id, initialValue, arrayIndex, label, description, rest);
            } else {
              return this.generateSingleField(Field, id, initialValue, label, description, rest);
            }
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

  // Generates an input of type Field with the specified id and initial value
  generateSingleField(Field: ComponentType<InputFieldProps>, id: string, initialValue: any,
    label?: string, description?: string, rest: any): Element<typeof Input> {
    return (
      <Input
        Type={Field}
        id={id}
        key={id}
        initialValue={initialValue}
        updated={this.updatedDict[id]}
        label={label}
        description={description}
        onUpdate={
          (newValue) => {
            // Overwrite the new value in the form data and use the hook setter
            let newData = {[id]: newValue};

            // Set the updated state for the field to true on update
            let newUpdatedState = {[id]: true};
            this.setUpdatedDict(prevDict => {
              console.log(newUpdatedState, prevDict)
              return {...prevDict, ...newUpdatedState};
            });

            this.setFormData(prevData => {
              return {...prevData, ...newData};
            });
          }
        }
        handleSave={
          () => {
            let newData = {[id]: this.formData[id]};

            // Remove the updated key on save
            const {[id]: tmp, ...rest} = this.updatedDict;
            this.setUpdatedDict(rest);

            this.handleSave(newData);
          }
        }
        {...rest}
      />);
  };

  // Generates a single input of type Field that sits at the specified index within an array of inputs
  generateArrayField(Field: ComponentType<InputFieldProps>, id: string, initialValue: any,
    arrayIndex: number, label?: string, description?: string, rest: any): Element<typeof Input> {
    // If the input exists in an array, use the id with the index appended as a unique id
    let indexId = id + "-" + arrayIndex;
    return (
      <Input
        Type={Field}
        id={indexId}
        key={indexId}
        initialValue={initialValue}
        updated={this.updatedDict[indexId]}
        label={label}
        description={description}
        onUpdate={
          (newValue) => {
            // Overwrite the new value in the correct array data index
            if (this.formData[id] === undefined) {
              this.formData[id] = [];
            }
            let arrayData = this.formData[id];

            if (arrayIndex < arrayData.length) {
              arrayData[arrayIndex] = newValue;
            } else {
              // If the earlier elements in the array have no values yet, set them to null
              for (let i = arrayData.length; i < arrayIndex; i++) {
                arrayData.push(null);
              }
              arrayData.push(newValue); // pushes at the correct index for this field
            }

            // Set the updated state for the field to true on update
            let newUpdatedState = {[indexId]: true};
            this.setUpdatedDict(prevDict => {
              return {...prevDict, ...newUpdatedState}
            });

            this.setFormData(prevData => {
              return {...prevData, ...{[id]: arrayData}};
            });
          }
        }
        handleSave={
          () => {
            let newData = {[id]: this.formData[id]};

            // Remove the updated key on save
            const {[indexId]: tmp, ...rest} = this.updatedDict;
            this.setUpdatedDict(rest);

            this.handleSave(newData);
          }
        }
        {...rest}
      />);
  };
}

export default FormGenerator;