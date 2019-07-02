// @flow
import * as React from 'react';
import type {ComponentType, Element, Node} from 'react';
import Input from '../../inputs/Input';
import type {InputFieldProps} from '../../inputs/Input';

type InputProps = {
  Field: ComponentType<InputFieldProps>,
  id: string,
  initialValue: any,
  arrayIndex?: number,
  label?: string,
  description?: string,
  rest?: any
};

type FieldProps = {
  ...InputProps,
  formData: {[key: string]: any},
  setFormData: ({[key: string]: any}) => void,
  updatedDict: {[key: string]: any},
  setUpdatedDict: ({[key: string]: any}) => void,
  handleSave: Function
}

export default function InputFormField(props: FieldProps) {
  let {Field, id, initialValue, arrayIndex, label, description,
    formData, setFormData, updatedDict, setUpdatedDict, handleSave, ...rest} = props;

  if (arrayIndex !== undefined) {
    let indexId = id + "-" + arrayIndex;
    return (
      <Input
        Type={Field}
        id={indexId}
        initialValue={initialValue}
        updated={updatedDict !== undefined ? updatedDict[indexId] : false}
        label={label}
        description={description}
        onUpdate={
          (newValue) => {
            // Overwrite the new value in the correct array data index
            if (formData[id] === undefined) {
              formData[id] = [];
            }
            let arrayData = formData[id];

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
            setUpdatedDict(prevDict => {
              return {...prevDict, ...newUpdatedState}
            });

            setFormData(prevData => {
              return {...prevData, ...{[id]: arrayData}};
            });
          }
        }
        handleSave={
          () => {
            let newData = {[id]: formData[id]};

            // Remove the updated key on save
            const {[indexId]: tmp, ...rest} = updatedDict;
            setUpdatedDict(rest);

            handleSave(newData);
          }
        }
        {...rest}
      />);
  } else {
    return (
      <Input
        Type={Field}
        id={id}
        initialValue={initialValue}
        updated={updatedDict !== undefined ? updatedDict[id] : false}
        label={label}
        description={description}
        onUpdate={
          (newValue) => {
            // Overwrite the new value in the form data and use the hook setter
            let newData = {[id]: newValue};

            // Set the updated state for the field to true on update
            let newUpdatedState = {[id]: true};
            setUpdatedDict(prevDict => {
              return {...prevDict, ...newUpdatedState};
            });

            setFormData(prevData => {
              return {...prevData, ...newData};
            });
          }
        }
        handleSave={
          () => {
            let newData = {[id]: formData[id]};

            // Remove the updated key on save
            const {[id]: tmp, ...rest} = updatedDict;
            setUpdatedDict(rest);

            handleSave(newData);
          }
        }
        {...rest}
      />);
  }
};