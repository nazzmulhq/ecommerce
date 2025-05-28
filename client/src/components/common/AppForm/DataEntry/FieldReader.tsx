import AutoComplete from "./AutoComplete";
import Cascader from "./Cascader";
import Checkbox from "./Checkbox";
import CheckboxGroup from "./Checkbox/CheckboxGroup";
import ColorPicker from "./ColorPicker";
import DatePicker from "./DatePicker";
import RangeDatePicker from "./DatePicker/RangePicker";
import Input from "./Input";
import InputPassword from "./Input/Password";
import InputSearch from "./Input/Search";
import InputTextArea from "./Input/TextArea";
import InputNumber from "./InputNumber";
import Mentions from "./Mentions";
import RadioButton from "./Radio/Button";
import RadioGroup from "./Radio/Group";
import Rate from "./Rate";
import Select from "./Select";
import Slider from "./Slider";
import Switch from "./Switch";
import TimePicker from "./TimePicker";
import TimeRangePicker from "./TimePicker/Range";
import Transfer from "./Transfer";
import TreeSelect from "./TreeSelect";
import { DataEntryFieldTypes } from "./types";
import Upload from "./Upload";
import UploadImageDraggable from "./Upload/ImageDragger";
import UploadImgCrop from "./Upload/ImgCrop";

const Field = {
    [DataEntryFieldTypes.AUTO_COMPLETE]: AutoComplete,
    [DataEntryFieldTypes.CASCADER]: Cascader,
    [DataEntryFieldTypes.CHECKBOX]: Checkbox,
    [DataEntryFieldTypes.CHECKBOX_GROUP]: CheckboxGroup,
    [DataEntryFieldTypes.COLOR_PICKER]: ColorPicker,
    [DataEntryFieldTypes.DATE_PICKER]: DatePicker,
    [DataEntryFieldTypes.DATE_PICKER_RANGE]: RangeDatePicker,
    [DataEntryFieldTypes.INPUT]: Input,
    [DataEntryFieldTypes.INPUT_PASSWORD]: InputPassword,
    [DataEntryFieldTypes.INPUT_SEARCH]: InputSearch,
    [DataEntryFieldTypes.INPUT_TEXT_AREA]: InputTextArea,
    [DataEntryFieldTypes.INPUT_NUMBER]: InputNumber,
    [DataEntryFieldTypes.MENTION]: Mentions,
    [DataEntryFieldTypes.RADIO_BUTTON]: RadioButton,
    [DataEntryFieldTypes.RADIO_GROUP]: RadioGroup,
    [DataEntryFieldTypes.RADIO]: Rate,
    [DataEntryFieldTypes.SELECT]: Select,
    [DataEntryFieldTypes.SLIDER]: Slider,
    [DataEntryFieldTypes.SWITCH]: Switch,
    [DataEntryFieldTypes.TIME_PICKER]: TimePicker,
    [DataEntryFieldTypes.TIME_PICKER_RANGE]: TimeRangePicker,
    [DataEntryFieldTypes.TRANSFER]: Transfer,
    [DataEntryFieldTypes.TREE_SELECT]: TreeSelect,
    [DataEntryFieldTypes.UPLOAD]: Upload,
    [DataEntryFieldTypes.UPLOAD_DRAGGER]: UploadImageDraggable,
    [DataEntryFieldTypes.UPLOAD_IMG_CROP]: UploadImgCrop,
};
