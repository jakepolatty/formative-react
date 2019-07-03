// @flow
import React from 'react';
import type {ComponentType} from 'react';
import Input from '../../inputs/Input';
import type {InputFieldProps} from '../../inputs/Input';

type InputProps = {
  Field: ComponentType<InputFieldProps>,
  id: string,
  initialValue: any,
  arrayIndex?: number,
  label?: string,
  description?: string,
  info?: string,
  rest?: any
};

type FieldProps = {
  ...InputProps,
  setFormData: ({[key: string]: any}) => void,
  handleSave: Function
}

export default function InputFormField(props: FieldProps) {
  let {Field, id, initialValue, arrayIndex, label, description, info,
    setFormData, handleSave, ...rest} = props;
  
  if (id !== undefined && Field !== undefined) {
    if (arrayIndex !== undefined) {
      let indexId = id + "-" + arrayIndex;
      return (
        <Input
          Type={Field}
          id={indexId}
          initialValue={initialValue}
          label={label}
          description={description}
          info={info}
          onUpdate={
            (newValue) => {
              setFormData(prevData => {
                let arrayData = prevData[id];
                if (arrayData === undefined) {
                  arrayData = [];
                }
                
                if (arrayIndex < arrayData.length) {
                  arrayData[arrayIndex] = newValue;
                } else {
                  // If the earlier elements in the array have no values yet, set them to null
                  for (let i = arrayData.length; i < arrayIndex; i++) {
                    arrayData.push(null);
                  }
                  arrayData.push(newValue); // pushes at the correct index for this field
                } 

                return {...prevData, ...{[id]: arrayData}};
              });
            }
          }
          onSave={
            () => {
              handleSave(id);
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
          label={label}
          description={description}
          info={info}
          onUpdate={
            (newValue) => {
              // Overwrite the new value in the form data and use the hook setter
              let newData = {[id]: newValue};
              setFormData(prevData => {
                return {...prevData, ...newData};
              });
            }
          }
          onSave={
            () => {
              handleSave(id);
            }
          }
          {...rest}
        />);
    }
  } else {
    return null;
  }
};