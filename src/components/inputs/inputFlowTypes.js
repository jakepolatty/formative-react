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

export type MultiStringInputProps = {
  id: string,
  initialValue: string | Array<string>,
  onUpdate: (string | Array<string>) => void
}

export type StringSelectionInputProps = {
  id: string,
  initialValue: string,
  onUpdate: (string) => void,
  options: Array<string>
};

export type GenericSelectionInputProps = {
  id: string,
  initialValue: string | number | boolean,
  onUpdate: (string | number | boolean) => void,
  options: Array<string | number | boolean>
};