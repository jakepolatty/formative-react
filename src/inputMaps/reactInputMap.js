import CheckboxInput from '../components/inputs/CheckboxInput/CheckboxInput';
import DateInput from '../components/inputs/DateInput/DateInput';
import GeoBoundingBoxInput from '../components/inputs/GeoBoundingBoxInput/GeoBoundingBoxInput';
import HiddenInput from '../components/inputs/HiddenInput/HiddenInput';
import NumberInput from '../components/inputs/NumberInput/NumberInput';
import NumberSliderInput from '../components/inputs/NumberSliderInput/NumberSliderInput';
import RadioInput from '../components/inputs/RadioInput/RadioInput';
import SelectInput from '../components/inputs/SelectInput/SelectInput';
import TextAreaInput from '../components/inputs/TextAreaInput/TextAreaInput';
import TextInput from '../components/inputs/TextInput/TextInput';

const reactInputMap = {
  CheckboxInput: CheckboxInput,
  DateInput: DateInput,
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