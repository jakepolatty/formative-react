// @flow
export type StringInputProps = {
  id: string,
  initialValue: string,
  onUpdate: (string) => void
};

export type BooleanInputProps = {
  id: string,
  initialValue: boolean,
  onUpdate: (boolean) => void
};

export type NumberInputProps = {
  id: string,
  initialValue: number,
  onUpdate: (number) => void
};

export type GenericInputProps = {
  id: string,
  initialValue: string | number | boolean,
  onUpdate: (string | number | boolean) => void
};

export type StringSelectionInputProps = {
  ...StringInputProps,
  options: Array<string>
};

export type GenericSelectionInputProps = {
  ...GenericInputProps,
  options: Array<string | number | boolean>
};