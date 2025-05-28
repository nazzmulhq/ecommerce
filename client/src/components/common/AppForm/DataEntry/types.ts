import { IAutoComplete } from "./AutoComplete";
import { ICascader } from "./Cascader";
import { ICheckbox } from "./Checkbox";
import { ICheckboxGroup } from "./Checkbox/CheckboxGroup";
import { IColorPicker } from "./ColorPicker";
import { IDatePicker } from "./DatePicker";
import { IRangePicker } from "./DatePicker/RangePicker";
import { IForm } from "./Form";
import { IFormItem } from "./Form/FormItem";
import { IFormList } from "./Form/FormList";
import { IFormProvider } from "./Form/FormProvider";
import { IInput } from "./Input";
import { IInputGroup } from "./Input/Group";
import { IInputOTP } from "./Input/OTP";
import { IInputPassword } from "./Input/Password";
import { IInputSearch } from "./Input/Search";
import { IInputTextArea } from "./Input/TextArea";
import { IInputNumber } from "./InputNumber";
import { IMentions } from "./Mentions";
import { IRadio } from "./Radio";
import { IRadioButton } from "./Radio/Button";
import { IRadioGroup } from "./Radio/Group";
import { IRate } from "./Rate";
import { ISelect } from "./Select";
import { ISlider } from "./Slider";
import { ISwitch } from "./Switch";
import { ITimePicker } from "./TimePicker";
import { ITimeRangePicker } from "./TimePicker/Range";
import { ITransfer } from "./Transfer";
import { ITreeSelect } from "./TreeSelect";
import { IUpload } from "./Upload";
import { IUploadImageDraggable } from "./Upload/ImageDragger";
import { IUploadImgCrop } from "./Upload/ImgCrop";

// Use enum for component types to enable better IDE support and type safety
export enum DataEntryFieldTypes {
    // Input-related
    AUTO_COMPLETE = "auto_complete",
    INPUT = "input",
    INPUT_PASSWORD = "input.password",
    INPUT_SEARCH = "input.search",
    INPUT_TEXT_AREA = "input.text_area",
    INPUT_OTP = "input.otp",
    INPUT_GROUP = "input_group",
    INPUT_NUMBER = "input_number",

    // Select-related
    CASCADER = "cascader",
    SELECT = "select",
    TREE_SELECT = "tree_select",
    MENTION = "mention",

    // Checkbox-related
    CHECKBOX = "checkbox",
    CHECKBOX_GROUP = "checkbox_group",

    // Radio-related
    RADIO = "radio",
    RADIO_BUTTON = "radio.button",
    RADIO_GROUP = "radio.group",

    // Date & Time
    DATE_PICKER = "date_picker",
    DATE_PICKER_RANGE = "date_picker_range",
    TIME_PICKER = "time_picker",
    TIME_PICKER_RANGE = "time_picker_range",

    // Form-related
    FORM = "form",
    FORM_ITEM = "form.item",
    FORM_LIST = "from.list",
    FORM_PROVIDER = "form.provider",

    // Upload-related
    UPLOAD = "upload",
    UPLOAD_DRAGGER = "upload.dragger",
    UPLOAD_IMG_CROP = "upload.img_crop",

    // Others
    COLOR_PICKER = "color_picker",
    RATE = "rate",
    SLIDER = "slider",
    SWITCH = "switch",
    TRANSFER = "transfer",
}

// Export type for component interfaces
export type TDataEntryFields =
    | IAutoComplete
    | ICascader
    | ICheckbox
    | ICheckboxGroup
    | IColorPicker
    | IDatePicker
    | IRangePicker
    | IForm
    | IFormItem
    | IFormList
    | IFormProvider
    | IInput
    | IInputTextArea
    | IInputOTP
    | IInputSearch
    | IInputPassword
    | IInputGroup
    | IInputNumber
    | IMentions
    | IRadio
    | IRadioButton
    | IRadioGroup
    | IRate
    | ISelect
    | ISlider
    | ISwitch
    | ITimePicker
    | ITimeRangePicker
    | ITransfer
    | ITreeSelect
    | IUpload
    | IUploadImgCrop
    | IUploadImageDraggable;

// Define dependency types for more granular control
export enum DependencyType {
    SHOW = "show", // Controls field visibility
    DISABLE = "disable", // Controls field disabled state
    RULES = "rules", // Controls dynamic validation rules
}

// Enhanced dependency configuration
export interface FieldDependency {
    type: DependencyType;
    name: string | string[]; // Dependent field name(s)
    cb: (values: any, field?: any) => boolean | any[] | object; // Callback function
}

// Base field configuration that all field types will extend
export interface BaseFieldConfig {
    name: string;
    label?: string;
    type: DataEntryFieldTypes;
    value?: any;
    placeholder?: string;
    defaultValue?: any;
    dependencies?: FieldDependency[];
    rules?: any[];
    props?: any;
    hidden?: boolean;
    disabled?: boolean;
    required?: boolean;
    readOnly?: boolean;
    tooltip?: string;
    extra?: string | React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    fieldKey?: string | number | (string | number)[];
    shouldUpdate?: boolean | ((prevValues: any, currentValues: any) => boolean);
    noStyle?: boolean;
    help?: string | React.ReactNode;
    validateStatus?: "success" | "warning" | "error" | "validating";
    hasFeedback?: boolean;
}

// Extend TDataEntryFields with the enhanced field config
export type TDataEntryField = BaseFieldConfig & TDataEntryFields;

// Define a form field group/section
export interface FieldGroup {
    title?: string;
    key: string;
    fields: TDataEntryField[];
    collapsed?: boolean;
    collapsible?: boolean;
    className?: string;
    style?: React.CSSProperties;
    extra?: React.ReactNode;
}

// Form configuration with advanced options
export interface FormConfig {
    fields: (TDataEntryField | FieldGroup)[];
    layout?: "horizontal" | "vertical" | "inline";
    labelCol?: object;
    wrapperCol?: object;
    initialValues?: object;
    onFinish?: (values: any) => void;
    onFinishFailed?: (errorInfo: any) => void;
    onValuesChange?: (changedValues: any, allValues: any) => void;
    onFieldsChange?: (changedFields: any[], allFields: any[]) => void;
    validateMessages?: object;
    validateTrigger?: string | string[];
    size?: "small" | "middle" | "large";
    preserve?: boolean;
    scrollToFirstError?: boolean | object;
}

// Helper function to check if a field is a field group
export const isFieldGroup = (field: any): field is FieldGroup => {
    return field && "fields" in field && Array.isArray(field.fields);
};

// Helper function to check component type
export const isComponentType = (type: string): type is DataEntryFieldTypes => {
    return Object.values(DataEntryFieldTypes).includes(type as DataEntryFieldTypes);
};
