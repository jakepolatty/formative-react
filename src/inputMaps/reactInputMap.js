import AsyncAutocompleteInput from '../components/inputs/AsyncAutocompleteInput/AsyncAutocompleteInput';
import AutocompleteTextInput from '../components/inputs/AutocompleteTextInput/AutocompleteTextInput';
import CheckboxInput from '../components/inputs/CheckboxInput/CheckboxInput';
import DateInput from '../components/inputs/DateInput/DateInput';
import FileInput from '../components/inputs/FileInput/FileInput';
import GeoBoundingBoxInput from '../components/inputs/GeoBoundingBoxInput/GeoBoundingBoxInput';
import HiddenInput from '../components/inputs/HiddenInput/HiddenInput';
import NumberInput from '../components/inputs/NumberInput/NumberInput';
import NumberSliderInput from '../components/inputs/NumberSliderInput/NumberSliderInput';
import RadioInput from '../components/inputs/RadioInput/RadioInput';
import SelectInput from '../components/inputs/SelectInput/SelectInput';
import TextAreaInput from '../components/inputs/TextAreaInput/TextAreaInput';
import TextInput from '../components/inputs/TextInput/TextInput';

const reactInputMap = {
  AsyncAutocompleteInput: AsyncAutocompleteInput,
  AutocompleteTextInput: AutocompleteTextInput,
  CheckboxInput: CheckboxInput,
  DateInput: DateInput,
  FileInput: FileInput,
  GeoBoundingBoxInput: GeoBoundingBoxInput,
  HiddenInput: HiddenInput,
  NumberInput: NumberInput,
  NumberSliderInput: NumberSliderInput,
  RadioInput: RadioInput,
  SelectInput: SelectInput,
  TextAreaInput: TextAreaInput,
  TextInput: TextInput,
};

export default reactInputMap;