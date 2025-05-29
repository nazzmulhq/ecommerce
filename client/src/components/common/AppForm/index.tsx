import {
    CopyOutlined,
    DeleteOutlined,
    DownloadOutlined,
    EditOutlined,
    EyeOutlined,
    MinusCircleOutlined,
    PlusOutlined,
    UploadOutlined,
} from "@ant-design/icons";
import {
    Alert,
    AutoComplete,
    Button,
    Card,
    Cascader,
    Checkbox,
    Col,
    Collapse,
    ColorPicker,
    DatePicker,
    Divider,
    FloatButton,
    Form,
    FormRule,
    Input,
    InputNumber,
    Mentions,
    Popconfirm,
    Radio,
    Rate,
    Row,
    Segmented,
    Select,
    Slider,
    Space,
    Steps,
    Switch,
    Tabs,
    TimePicker,
    Tooltip,
    Transfer,
    TreeSelect,
    Typography,
    Upload,
} from "antd";
import type { ColProps } from "antd/es/col";
import type { FormInstance, FormListFieldData, FormListOperation } from "antd/es/form";
import type { DefaultOptionType } from "antd/es/select";
import type { UploadChangeParam, UploadFile } from "antd/es/upload/interface";
import React, { useCallback, useEffect, useRef, useState } from "react";

const { TextArea, Password, Search } = Input;
const { Title, Text } = Typography;
const { Step } = Steps;
const { TabPane } = Tabs;
const { Panel } = Collapse;

// Enhanced Field Types
export const FIELD_TYPES = {
    // Basic Inputs
    INPUT: "input",
    INPUT_PASSWORD: "input.password",
    INPUT_SEARCH: "input.search",
    INPUT_TEXT_AREA: "input.text_area",
    INPUT_OTP: "input.otp",
    INPUT_NUMBER: "input_number",

    // Selections
    SELECT: "select",
    AUTO_COMPLETE: "auto_complete",
    CASCADER: "cascader",
    TREE_SELECT: "tree_select",

    // Choices
    RADIO: "radio",
    RADIO_BUTTON: "radio.button",
    RADIO_GROUP: "radio.group",
    CHECKBOX: "checkbox",
    CHECKBOX_GROUP: "checkbox_group",
    SEGMENTED: "segmented",

    // Date/Time
    DATE_PICKER: "date_picker",
    DATE_PICKER_RANGE: "date_picker_range",
    TIME_PICKER: "time_picker",
    TIME_PICKER_RANGE: "time_picker_range",

    // Interactive
    SWITCH: "switch",
    SLIDER: "slider",
    RATE: "rate",
    COLOR_PICKER: "color_picker",

    // File
    UPLOAD: "upload",
    UPLOAD_DRAGGER: "upload.dragger",
    UPLOAD_IMG_CROP: "upload.img_crop",

    // Special
    TRANSFER: "transfer",
    MENTION: "mention",

    // Layout & Structure
    FORM_LIST: "form.list",
    FORM_ITEM: "form.item",
    DIVIDER: "divider",
    TITLE: "title",
    TEXT: "text",
    ALERT: "alert",
    STEPS: "steps",
    TABS: "tabs",
    COLLAPSE: "collapse",
    TABLE: "table",

    // Custom Components
    CUSTOM: "custom",
    NESTED_FORM: "nested_form",
    CONDITIONAL_GROUP: "conditional_group",
} as const;

// Enhanced Dependency Types
export const DEPENDENCY_TYPES = {
    // Visibility
    SHOW: "show",
    HIDE: "hide",
    SHOW_IF: "show_if",
    HIDE_IF: "hide_if",

    // State
    ENABLE: "enable",
    DISABLE: "disable",
    ENABLE_IF: "enable_if",
    DISABLE_IF: "disable_if",

    // Validation
    REQUIRED: "required",
    OPTIONAL: "optional",
    REQUIRED_IF: "required_if",
    OPTIONAL_IF: "optional_if",

    // Value
    SET_VALUE: "set_value",
    CLEAR_VALUE: "clear_value",
    SET_OPTIONS: "set_options",
    FILTER_OPTIONS: "filter_options",
    CALCULATE: "calculate",
    SYNC_VALUE: "sync_value",

    // Style
    SET_CLASS: "set_class",
    REMOVE_CLASS: "remove_class",
    SET_STYLE: "set_style",

    // Complex
    CUSTOM: "custom",
    CHAIN: "chain",
    GROUP: "group",
    ASYNC: "async",

    // Form Structure
    ADD_FIELD: "add_field",
    REMOVE_FIELD: "remove_field",
    REORDER_FIELDS: "reorder_fields",
} as const;

// Enhanced Operators
export const OPERATORS = {
    EQUALS: "equals",
    NOT_EQUALS: "not_equals",
    GREATER_THAN: "greater_than",
    LESS_THAN: "less_than",
    GREATER_EQUAL: "greater_equal",
    LESS_EQUAL: "less_equal",
    CONTAINS: "contains",
    NOT_CONTAINS: "not_contains",
    STARTS_WITH: "starts_with",
    ENDS_WITH: "ends_with",
    REGEX: "regex",
    IN: "in",
    NOT_IN: "not_in",
    IS_EMPTY: "is_empty",
    IS_NOT_EMPTY: "is_not_empty",
    BETWEEN: "between",
    NOT_BETWEEN: "not_between",
    LENGTH_EQUALS: "length_equals",
    LENGTH_GREATER: "length_greater",
    LENGTH_LESS: "length_less",
    HAS_KEY: "has_key",
    ARRAY_INCLUDES: "array_includes",
    DEEP_EQUALS: "deep_equals",
} as const;

// Enhanced Button Types
export const BUTTON_TYPES = {
    DELETE: "delete",
    EDIT: "edit",
    COPY: "copy",
    CLEAR: "clear",
    RESET: "reset",
    MOVE_UP: "move_up",
    MOVE_DOWN: "move_down",
    ADD: "add",
    REMOVE: "remove",
    UPLOAD: "upload",
    DOWNLOAD: "download",
    PREVIEW: "preview",
    DUPLICATE: "duplicate",
    EXPORT: "export",
    IMPORT: "import",
    VALIDATE: "validate",
    SAVE_DRAFT: "save_draft",
    LOAD_TEMPLATE: "load_template",
    CUSTOM: "custom",
} as const;

// Enhanced Type Definitions
interface Option extends DefaultOptionType {
    label: string;
    value: any;
    children?: Option[];
    disabled?: boolean;
    icon?: React.ReactNode;
    description?: string;
    group?: string;
}

interface DependencyCondition {
    field: string;
    operator: (typeof OPERATORS)[keyof typeof OPERATORS];
    value: any;
    values?: any[];
    path?: string; // For nested field access
}

interface FormDependency {
    type: (typeof DEPENDENCY_TYPES)[keyof typeof DEPENDENCY_TYPES];
    conditions: DependencyCondition[];
    logic?: "AND" | "OR";
    target?: any;
    callback?: (form: FormInstance, values: any, fieldName?: string) => void | Promise<void>;
    debounce?: number;
    async?: boolean;
}

interface ExtraButton {
    type: (typeof BUTTON_TYPES)[keyof typeof BUTTON_TYPES];
    label?: string;
    icon?: React.ReactNode;
    position?: "before" | "after" | "inline";
    callback?: (fieldName: string, form: FormInstance, fieldData?: any) => void | Promise<void>;
    visible?: boolean | ((values: any) => boolean);
    disabled?: boolean | ((values: any) => boolean);
    confirm?: {
        title: string;
        description?: string;
    };
    tooltip?: string;
    loading?: boolean;
}

// Use type intersection instead of interface extension for ValidationRule
type ValidationRule = FormRule & {
    asyncValidator?: (rule: any, value: any, callback: (error?: string) => void) => Promise<void> | void;
    dependencies?: string[];
    crossField?: boolean;
};

interface FormListConfig {
    min?: number;
    max?: number;
    addText?: string;
    removeText?: string;
    allowReorder?: boolean;
    allowDuplicate?: boolean;
    template?: FieldConfig[];
    renderItem?: (field: FormListFieldData, operations: FormListOperation, index: number) => React.ReactNode;
    itemProps?: Record<string, any>;
}

interface ConditionalGroup {
    condition: DependencyCondition;
    fields: FieldConfig[];
    layout?: "horizontal" | "vertical" | "inline";
}

interface NestedFormConfig {
    schema: FormSchema;
    isolateValues?: boolean;
    prefix?: string;
}

interface FieldConfig {
    name: string;
    type: (typeof FIELD_TYPES)[keyof typeof FIELD_TYPES];
    label?: string;
    placeholder?: string;
    tooltip?: string;
    description?: string;
    required?: boolean;
    disabled?: boolean;
    hidden?: boolean;
    readOnly?: boolean;
    options?: Option[];
    props?: Record<string, any>;
    dependencies?: FormDependency[];
    validations?: ValidationRule[];
    extras?: ExtraButton[];
    grid?: ColProps;
    style?: React.CSSProperties;
    className?: string;

    // Enhanced properties
    formList?: FormListConfig;
    conditionalGroups?: ConditionalGroup[];
    nestedForm?: NestedFormConfig;
    customComponent?: React.ComponentType<any>;
    dataSource?: any[];
    formatter?: (value: any) => any;
    parser?: (value: any) => any;

    // Layout properties
    span?: number;
    offset?: number;
    order?: number;
    flex?: string | number;

    // Advanced features
    debounce?: number;
    lazy?: boolean;
    memoize?: boolean;
    transform?: (value: any, allValues: any) => any;
}

interface FormSection {
    title?: string;
    description?: string;
    fields: FieldConfig[];
    collapsible?: boolean;
    defaultCollapsed?: boolean;
    icon?: React.ReactNode;
    extra?: React.ReactNode;
}

interface FormStep {
    title: string;
    description?: string;
    fields: FieldConfig[];
    icon?: React.ReactNode;
    status?: "wait" | "process" | "finish" | "error";
    validation?: () => Promise<boolean>;
}

interface FormTab {
    key: string;
    tab: string;
    fields: FieldConfig[];
    icon?: React.ReactNode;
    disabled?: boolean;
    closable?: boolean;
}

interface FormSchema {
    layout?: "horizontal" | "vertical" | "inline";
    size?: "small" | "middle" | "large";
    colon?: boolean;
    labelAlign?: "left" | "right";
    labelCol?: object;
    wrapperCol?: object;

    // Structure
    fields?: FieldConfig[];
    sections?: FormSection[];
    steps?: FormStep[];
    tabs?: FormTab[];

    // Permissions & Security
    permissions?: {
        read?: boolean;
        write?: boolean;
        delete?: boolean;
        fields?: Record<string, { read?: boolean; write?: boolean }>;
    };

    // Meta information
    meta?: {
        version?: string;
        createdAt?: string;
        updatedAt?: string;
        createdBy?: string;
        title?: string;
        description?: string;
        category?: string;
        tags?: string[];
    };

    // Advanced features
    autoSave?: {
        enabled: boolean;
        interval?: number;
        key?: string;
    };

    validation?: {
        validateOnChange?: boolean;
        validateOnBlur?: boolean;
        validateTrigger?: string | string[];
        scrollToError?: boolean;
    };

    ui?: {
        theme?: "default" | "compact" | "comfortable";
        showProgress?: boolean;
        showFieldCount?: boolean;
        compactMode?: boolean;
        floatingLabels?: boolean;
    };

    hooks?: {
        beforeSubmit?: (values: any) => Promise<any> | any;
        afterSubmit?: (values: any, result: any) => void;
        beforeReset?: () => Promise<boolean> | boolean;
        afterReset?: () => void;
        onFieldChange?: (field: string, value: any, allValues: any) => void;
    };
}

interface AppFormProps {
    schema: FormSchema;
    initialValues?: Record<string, any>;
    onFinish?: (values: any) => void | Promise<void>;
    onFinishFailed?: (errorInfo: any) => void;
    onValuesChange?: (changedValues: any, allValues: any) => void;
    form?: FormInstance;
    loading?: boolean;
    disabled?: boolean;
    readonly?: boolean;

    // Enhanced props
    mode?: "create" | "edit" | "view";
    autoSave?: boolean;
    validateOnMount?: boolean;
    preserveFormData?: boolean;
    formKey?: string;

    // Event handlers
    onAutoSave?: (values: any) => void;
    onValidationChange?: (errors: any[]) => void;
    onFormReady?: (form: FormInstance) => void;

    // UI customization
    renderHeader?: () => React.ReactNode;
    renderFooter?: (form: FormInstance, loading: boolean) => React.ReactNode;
    renderField?: (field: FieldConfig, defaultRender: React.ReactNode) => React.ReactNode;

    // Advanced features
    plugins?: Array<(form: FormInstance, schema: FormSchema) => void>;
    middleware?: Array<(values: any) => any>;
}

// Enhanced AppForm Component
const AppForm: React.FC<AppFormProps> = ({
    schema,
    initialValues,
    onFinish,
    onFinishFailed,
    onValuesChange,
    form: externalForm,
    loading = false,
    disabled = false,
    readonly = false,
    mode = "create",
    autoSave = false,
    validateOnMount = false,
    preserveFormData = false,
    formKey,
    onAutoSave,
    onValidationChange,
    onFormReady,
    renderHeader,
    renderFooter,
    renderField,
    plugins = [],
    middleware = [],
}) => {
    const [form] = Form.useForm(externalForm);
    const [fieldStates, setFieldStates] = useState<Record<string, any>>({});
    const [fileList, setFileList] = useState<Record<string, UploadFile[]>>({});
    const [currentStep, setCurrentStep] = useState(0);
    const [activeTab, setActiveTab] = useState<string>("");
    const [formErrors, setFormErrors] = useState<any[]>([]);
    const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);
    const debounceTimers = useRef<Record<string, NodeJS.Timeout>>({});
    const previousValues = useRef<any>({});

    // Enhanced condition evaluation
    const evaluateCondition = useCallback((condition: DependencyCondition, values: any): boolean => {
        const getFieldValue = (field: string, vals: any) => {
            if (condition.path) {
                return field.split(".").reduce((obj, key) => obj?.[key], vals);
            }
            return vals[field];
        };

        const fieldValue = getFieldValue(condition.field, values);

        switch (condition.operator) {
            case "equals":
                return fieldValue === condition.value;
            case "not_equals":
                return fieldValue !== condition.value;
            case "greater_than":
                return Number(fieldValue) > Number(condition.value);
            case "less_than":
                return Number(fieldValue) < Number(condition.value);
            case "greater_equal":
                return Number(fieldValue) >= Number(condition.value);
            case "less_equal":
                return Number(fieldValue) <= Number(condition.value);
            case "contains":
                return String(fieldValue).toLowerCase().includes(String(condition.value).toLowerCase());
            case "not_contains":
                return !String(fieldValue).toLowerCase().includes(String(condition.value).toLowerCase());
            case "starts_with":
                return String(fieldValue).startsWith(String(condition.value));
            case "ends_with":
                return String(fieldValue).endsWith(String(condition.value));
            case "regex":
                return new RegExp(condition.value).test(String(fieldValue));
            case "in":
                return condition.values?.includes(fieldValue) || false;
            case "not_in":
                return !condition.values?.includes(fieldValue) || true;
            case "is_empty":
                return !fieldValue || fieldValue === "" || (Array.isArray(fieldValue) && fieldValue.length === 0);
            case "is_not_empty":
                return fieldValue && fieldValue !== "" && (!Array.isArray(fieldValue) || fieldValue.length > 0);
            case "between":
                // Make sure we return false if condition.values is undefined
                return !!(
                    condition.values &&
                    condition.values.length >= 2 &&
                    Number(fieldValue) >= Number(condition.values[0]) &&
                    Number(fieldValue) <= Number(condition.values[1])
                );
            case "not_between":
                // Make sure we return true if condition.values is undefined
                return (
                    !condition.values ||
                    condition.values.length < 2 ||
                    Number(fieldValue) < Number(condition.values[0]) ||
                    Number(fieldValue) > Number(condition.values[1])
                );
            case "length_equals":
                return String(fieldValue).length === Number(condition.value);
            case "length_greater":
                return String(fieldValue).length > Number(condition.value);
            case "length_less":
                return String(fieldValue).length < Number(condition.value);
            case "has_key":
                return typeof fieldValue === "object" && fieldValue !== null && condition.value in fieldValue;
            case "array_includes":
                return Array.isArray(fieldValue) && fieldValue.includes(condition.value);
            case "deep_equals":
                return JSON.stringify(fieldValue) === JSON.stringify(condition.value);
            default:
                return false;
        }
    }, []);

    // Enhanced dependency processing
    const processDependencies = useCallback(
        async (field: FieldConfig, values: any) => {
            if (!field.dependencies) return {};

            const state: any = {};

            for (const dependency of field.dependencies) {
                const conditionsMet =
                    dependency.logic === "OR"
                        ? dependency.conditions.some(condition => evaluateCondition(condition, values))
                        : dependency.conditions.every(condition => evaluateCondition(condition, values));

                if (dependency.async && dependency.callback) {
                    if (conditionsMet) {
                        await dependency.callback(form, values, field.name);
                    }
                    continue;
                }

                switch (dependency.type) {
                    case "show_if":
                        state.hidden = !conditionsMet;
                        break;
                    case "hide_if":
                        state.hidden = conditionsMet;
                        break;
                    case "enable_if":
                        state.disabled = !conditionsMet;
                        break;
                    case "disable_if":
                        state.disabled = conditionsMet;
                        break;
                    case "required_if":
                        state.required = conditionsMet;
                        break;
                    case "optional_if":
                        state.required = !conditionsMet;
                        break;
                    case "set_value":
                        if (conditionsMet && dependency.target !== undefined) {
                            form.setFieldValue(field.name, dependency.target);
                        }
                        break;
                    case "clear_value":
                        if (conditionsMet) {
                            form.setFieldValue(field.name, undefined);
                        }
                        break;
                    case "set_options":
                        if (conditionsMet && dependency.target) {
                            state.options = dependency.target;
                        }
                        break;
                    case "filter_options":
                        if (conditionsMet && field.options) {
                            state.options = field.options.filter(option => dependency.target?.includes(option.value));
                        }
                        break;
                    case "calculate":
                        if (conditionsMet && dependency.callback) {
                            const calculatedValue = dependency.callback(form, values, field.name);
                            if (calculatedValue !== undefined) {
                                form.setFieldValue(field.name, calculatedValue);
                            }
                        }
                        break;
                    case "custom":
                        if (conditionsMet && dependency.callback) {
                            await dependency.callback(form, values, field.name);
                        }
                        break;
                }
            }

            return state;
        },
        [form, evaluateCondition],
    );

    // Auto-save functionality
    const handleAutoSave = useCallback(
        (values: any) => {
            if (!autoSave || !onAutoSave) return;

            if (autoSaveTimer) {
                clearTimeout(autoSaveTimer);
            }

            const timer = setTimeout(() => {
                onAutoSave(values);
            }, schema.autoSave?.interval || 5000);

            setAutoSaveTimer(timer);
        },
        [autoSave, onAutoSave, autoSaveTimer, schema.autoSave?.interval],
    );

    // Enhanced form values change handler
    const handleValuesChange = useCallback(
        async (changedValues: any, allValues: any) => {
            const newFieldStates: Record<string, any> = {};
            const allFields = [
                ...(schema.fields || []),
                ...(schema.sections?.flatMap(s => s.fields) || []),
                ...(schema.steps?.flatMap(s => s.fields) || []),
                ...(schema.tabs?.flatMap(t => t.fields) || []),
            ];

            // Process dependencies for all fields
            for (const field of allFields) {
                const state = await processDependencies(field, allValues);
                newFieldStates[field.name] = { ...fieldStates[field.name], ...state };

                // Handle field-specific hooks
                if (changedValues[field.name] !== undefined && schema.hooks?.onFieldChange) {
                    schema.hooks.onFieldChange(field.name, changedValues[field.name], allValues);
                }
            }

            setFieldStates(newFieldStates);

            // Handle auto-save
            if (autoSave) {
                handleAutoSave(allValues);
            }

            // Apply middleware
            let processedValues = allValues;
            for (const mw of middleware) {
                processedValues = mw(processedValues);
            }

            onValuesChange?.(changedValues, processedValues);
            previousValues.current = allValues;
        },
        [schema, fieldStates, processDependencies, onValuesChange, autoSave, handleAutoSave, middleware],
    );

    // Render Form.List
    const renderFormList = (field: FieldConfig) => {
        const { formList } = field;
        if (!formList) return null;

        return (
            <Form.List name={field.name}>
                {(fields, { add, remove, move }) => (
                    <div>
                        {fields.map((listField, index) => (
                            <Card
                                key={listField.key}
                                size="small"
                                title={`${field.label} ${index + 1}`}
                                extra={
                                    <Space>
                                        {formList.allowReorder && (
                                            <>
                                                <Button
                                                    size="small"
                                                    disabled={index === 0}
                                                    onClick={() => move(index, index - 1)}
                                                >
                                                    ↑
                                                </Button>
                                                <Button
                                                    size="small"
                                                    disabled={index === fields.length - 1}
                                                    onClick={() => move(index, index + 1)}
                                                >
                                                    ↓
                                                </Button>
                                            </>
                                        )}
                                        {formList.allowDuplicate && (
                                            <Button
                                                size="small"
                                                icon={<CopyOutlined />}
                                                onClick={() => {
                                                    const currentValue = form.getFieldValue([field.name, index]);
                                                    add(currentValue);
                                                }}
                                            >
                                                Duplicate
                                            </Button>
                                        )}
                                        <Popconfirm
                                            title="Delete this item?"
                                            onConfirm={() => remove(listField.name)}
                                            disabled={formList.min !== undefined && fields.length <= formList.min}
                                        >
                                            <Button
                                                size="small"
                                                danger
                                                icon={<MinusCircleOutlined />}
                                                disabled={formList.min !== undefined && fields.length <= formList.min}
                                            >
                                                Remove
                                            </Button>
                                        </Popconfirm>
                                    </Space>
                                }
                                style={{ marginBottom: 16 }}
                            >
                                <Row gutter={16}>
                                    {formList.template?.map(templateField => (
                                        <Col key={templateField.name} {...templateField.grid}>
                                            <Form.Item
                                                {...listField}
                                                name={[listField.name, templateField.name]}
                                                label={templateField.label}
                                                rules={templateField.validations}
                                            >
                                                {renderFieldComponent(templateField)}
                                            </Form.Item>
                                        </Col>
                                    ))}
                                </Row>
                            </Card>
                        ))}

                        <Button
                            type="dashed"
                            onClick={() => add()}
                            disabled={formList.max !== undefined && fields.length >= formList.max}
                            icon={<PlusOutlined />}
                            style={{ width: "100%", marginTop: 16 }}
                        >
                            {formList.addText || `Add ${field.label}`}
                        </Button>
                    </div>
                )}
            </Form.List>
        );
    };

    // Render field component
    const renderFieldComponent = (field: FieldConfig) => {
        const fieldState = fieldStates[field.name] || {};
        const isDisabled = disabled || readonly || field.disabled || fieldState.disabled;
        const commonProps = {
            disabled: isDisabled,
            placeholder: field.placeholder,
            ...field.props,
        };

        // Use custom component if provided
        if (field.customComponent) {
            const CustomComponent = field.customComponent;
            return <CustomComponent {...commonProps} />;
        }

        switch (field.type) {
            case "input":
                return <Input {...commonProps} />;
            case "input.password":
                return <Password {...commonProps} />;
            case "input.search":
                return <Search {...commonProps} />;
            case "input.text_area":
                return <TextArea {...commonProps} />;
            case "input.otp":
                return <Input.OTP {...commonProps} />;
            case "input_number":
                return <InputNumber {...commonProps} style={{ width: "100%" }} />;
            case "select":
                return <Select {...commonProps} options={fieldState.options || field.options} />;
            case "auto_complete":
                return <AutoComplete {...commonProps} options={fieldState.options || field.options} />;
            case "cascader":
                return <Cascader {...commonProps} options={fieldState.options || field.options} />;
            case "tree_select":
                return <TreeSelect {...commonProps} treeData={fieldState.options || field.options} />;
            case "date_picker":
                return <DatePicker {...commonProps} style={{ width: "100%" }} />;
            case "date_picker_range":
                return (
                    <DatePicker.RangePicker
                        {...commonProps}
                        placeholder={
                            Array.isArray(commonProps.placeholder) && commonProps.placeholder.length === 2
                                ? [String(commonProps.placeholder[0]), String(commonProps.placeholder[1])]
                                : typeof commonProps.placeholder === "string"
                                  ? [commonProps.placeholder, commonProps.placeholder]
                                  : undefined
                        }
                        style={{ width: "100%" }}
                    />
                );
            case "time_picker":
                return <TimePicker {...commonProps} style={{ width: "100%" }} />;
            case "time_picker_range":
                return (
                    <TimePicker.RangePicker
                        {...commonProps}
                        placeholder={
                            Array.isArray(commonProps.placeholder) && commonProps.placeholder.length === 2
                                ? [String(commonProps.placeholder[0]), String(commonProps.placeholder[1])]
                                : typeof commonProps.placeholder === "string"
                                  ? [commonProps.placeholder, commonProps.placeholder]
                                  : undefined
                        }
                        style={{ width: "100%" }}
                    />
                );
            case "switch":
                return <Switch {...commonProps} />;
            case "slider":
                return <Slider {...commonProps} />;
            case "rate":
                return <Rate {...commonProps} />;
            case "color_picker":
                return <ColorPicker {...commonProps} />;
            case "segmented":
                // Ensure we always have an array of options for Segmented component
                return <Segmented {...commonProps} options={fieldState.options || field.options || []} />;
            case "radio.group":
                return (
                    <Radio.Group {...commonProps}>
                        {(fieldState.options || field.options)?.map((option: Option) => (
                            <Radio key={option.value} value={option.value}>
                                {option.label}
                            </Radio>
                        ))}
                    </Radio.Group>
                );
            case "checkbox_group":
                return <Checkbox.Group {...commonProps} options={fieldState.options || field.options} />;
            case "transfer":
                return <Transfer {...commonProps} dataSource={field.dataSource} />;
            case "mention":
                return <Mentions {...commonProps} options={field.options} />;
            case "upload":
                return (
                    <Upload
                        {...commonProps}
                        fileList={fileList[field.name] || []}
                        onChange={(info: UploadChangeParam<UploadFile>) =>
                            setFileList(prev => ({ ...prev, [field.name]: info.fileList }))
                        }
                    >
                        <Button icon={<UploadOutlined />}>Upload</Button>
                    </Upload>
                );
            case "upload.dragger":
                return (
                    <Upload.Dragger
                        {...commonProps}
                        fileList={fileList[field.name] || []}
                        onChange={(info: UploadChangeParam<UploadFile>) =>
                            setFileList(prev => ({ ...prev, [field.name]: info.fileList }))
                        }
                    >
                        <p>Click or drag file to this area to upload</p>
                    </Upload.Dragger>
                );
            case "form.list":
                return renderFormList(field);
            case "divider":
                return <Divider {...commonProps}>{field.label}</Divider>;
            case "title":
                return (
                    <Title level={field.props?.level || 4} {...commonProps}>
                        {field.label}
                    </Title>
                );
            case "text":
                return <Text {...commonProps}>{field.label}</Text>;
            case "alert":
                return <Alert message={field.label} {...commonProps} />;
            default:
                return <Input {...commonProps} />;
        }
    };

    // Render extra buttons
    const renderExtraButtons = (field: FieldConfig, values?: any) => {
        if (!field.extras?.length) return null;

        return (
            <Space>
                {field.extras.map((extra, index) => {
                    const isVisible =
                        typeof extra.visible === "function" ? extra.visible(values || {}) : extra.visible !== false;

                    const isDisabled =
                        typeof extra.disabled === "function" ? extra.disabled(values || {}) : extra.disabled;

                    if (!isVisible) return null;

                    const handleClick = async () => {
                        if (extra.loading) return;
                        await extra.callback?.(field.name, form, values);
                    };

                    const buttonProps = {
                        key: index,
                        size: "small" as const,
                        disabled: isDisabled,
                        loading: extra.loading,
                        onClick: handleClick,
                    };

                    const button = (() => {
                        switch (extra.type) {
                            case "delete":
                                return (
                                    <Button {...buttonProps} icon={<DeleteOutlined />} danger>
                                        {extra.label || "Delete"}
                                    </Button>
                                );
                            case "edit":
                                return (
                                    <Button {...buttonProps} icon={<EditOutlined />}>
                                        {extra.label || "Edit"}
                                    </Button>
                                );
                            case "copy":
                                return (
                                    <Button {...buttonProps} icon={<CopyOutlined />}>
                                        {extra.label || "Copy"}
                                    </Button>
                                );
                            case "preview":
                                return (
                                    <Button {...buttonProps} icon={<EyeOutlined />}>
                                        {extra.label || "Preview"}
                                    </Button>
                                );
                            case "download":
                                return (
                                    <Button {...buttonProps} icon={<DownloadOutlined />}>
                                        {extra.label || "Download"}
                                    </Button>
                                );
                            default:
                                return (
                                    <Button {...buttonProps} icon={extra.icon}>
                                        {extra.label}
                                    </Button>
                                );
                        }
                    })();

                    if (extra.confirm) {
                        return (
                            <Popconfirm
                                key={index}
                                title={extra.confirm.title}
                                description={extra.confirm.description}
                                onConfirm={handleClick}
                            >
                                {button}
                            </Popconfirm>
                        );
                    }

                    if (extra.tooltip) {
                        return (
                            <Tooltip key={index} title={extra.tooltip}>
                                {button}
                            </Tooltip>
                        );
                    }

                    return button;
                })}
            </Space>
        );
    };

    // Render individual field
    const renderFieldItem = (field: FieldConfig, values?: any) => {
        const fieldState = fieldStates[field.name] || {};
        const isDisabled = disabled || readonly || field.disabled || fieldState.disabled;
        const isRequired = field.required || fieldState.required;
        const isHidden = field.hidden || fieldState.hidden;

        if (isHidden) return null;

        // Handle nested forms
        if (field.type === "nested_form" && field.nestedForm) {
            return (
                <Col {...field.grid} key={field.name}>
                    <Form.Item label={field.label}>
                        <Card>
                            <AppForm
                                schema={field.nestedForm.schema}
                                form={field.nestedForm.isolateValues ? undefined : form}
                                disabled={isDisabled}
                                readonly={readonly}
                            />
                        </Card>
                    </Form.Item>
                </Col>
            );
        }

        // Handle conditional groups
        if (field.type === "conditional_group" && field.conditionalGroups) {
            return (
                <Col {...field.grid} key={field.name}>
                    {field.conditionalGroups.map((group, index) => {
                        const conditionMet = evaluateCondition(group.condition, values || {});
                        if (!conditionMet) return null;

                        return (
                            <div key={index}>
                                <Row gutter={24}>
                                    {group.fields.map(groupField => renderFieldItem(groupField, values))}
                                </Row>
                            </div>
                        );
                    })}
                </Col>
            );
        }

        const rules: ValidationRule[] = [];
        if (isRequired) {
            rules.push({ required: true, message: `${field.label || field.name} is required` });
        }
        if (field.validations) {
            rules.push(...field.validations);
        }

        const component = renderFieldComponent(field);
        const extraButtons = renderExtraButtons(field, values);

        const formItemProps = {
            name: field.name,
            label: field.label,
            rules,
            style: field.style,
            className: field.className,
            tooltip: field.tooltip,
            extra: extraButtons,
            help: field.description,
        };

        const renderedField = (
            <Col {...field.grid} key={field.name}>
                <Form.Item {...formItemProps}>{component}</Form.Item>
            </Col>
        );

        // Use the renderField prop if provided, otherwise return the default rendering
        return renderField ? renderField(field, renderedField) : renderedField;
    };

    // Render form sections
    const renderSections = () => {
        if (!schema.sections?.length) return null;

        return (
            <Collapse defaultActiveKey={schema.sections.map((_, index) => index.toString())}>
                {schema.sections.map((section, index) => (
                    <Panel header={section.title} key={index.toString()} extra={section.extra}>
                        {section.description && (
                            <Alert message={section.description} type="info" style={{ marginBottom: 16 }} />
                        )}
                        <Row gutter={24}>
                            {section.fields.map(field => renderFieldItem(field, form.getFieldsValue()))}
                        </Row>
                    </Panel>
                ))}
            </Collapse>
        );
    };

    // Render form steps
    const renderSteps = () => {
        if (!schema.steps?.length) return null;

        const currentStepFields = schema.steps[currentStep]?.fields || [];

        return (
            <div>
                <Steps current={currentStep} style={{ marginBottom: 24 }}>
                    {schema.steps.map((step, index) => (
                        <Step
                            key={index}
                            title={step.title}
                            description={step.description}
                            icon={step.icon}
                            status={step.status}
                        />
                    ))}
                </Steps>

                <Row gutter={24}>{currentStepFields.map(field => renderFieldItem(field, form.getFieldsValue()))}</Row>

                <div style={{ marginTop: 24, textAlign: "center" }}>
                    <Space>
                        <Button disabled={currentStep === 0} onClick={() => setCurrentStep(currentStep - 1)}>
                            Previous
                        </Button>
                        <Button
                            type="primary"
                            onClick={async () => {
                                if (currentStep < schema.steps!.length - 1) {
                                    // Validate current step
                                    const stepObj = schema.steps![currentStep];
                                    if (stepObj.validation) {
                                        const isValid = await stepObj.validation();
                                        if (!isValid) return;
                                    }
                                    setCurrentStep(currentStep + 1);
                                } else {
                                    // Submit form
                                    form.submit();
                                }
                            }}
                        >
                            {currentStep === schema.steps.length - 1 ? "Submit" : "Next"}
                        </Button>
                    </Space>
                </div>
            </div>
        );
    };

    // Render form tabs
    const renderTabs = () => {
        if (!schema.tabs?.length) return null;

        return (
            <Tabs activeKey={activeTab || schema.tabs[0]?.key} onChange={setActiveTab} type="card">
                {schema.tabs.map(tab => (
                    <TabPane
                        tab={
                            <span>
                                {tab.icon}
                                {tab.tab}
                            </span>
                        }
                        key={tab.key}
                        disabled={tab.disabled}
                        closable={tab.closable}
                    >
                        <Row gutter={24}>{tab.fields.map(field => renderFieldItem(field, form.getFieldsValue()))}</Row>
                    </TabPane>
                ))}
            </Tabs>
        );
    };

    // Handle form submission
    const handleFinish = async (values: any) => {
        try {
            // Apply middleware
            let processedValues = values;
            for (const mw of middleware) {
                processedValues = mw(processedValues);
            }

            // Run before submit hook
            if (schema.hooks?.beforeSubmit) {
                processedValues = await schema.hooks.beforeSubmit(processedValues);
            }

            const result = await onFinish?.(processedValues);

            // Run after submit hook
            if (schema.hooks?.afterSubmit) {
                schema.hooks.afterSubmit(processedValues, result);
            }

            // Clear auto-save timer
            if (autoSaveTimer) {
                clearTimeout(autoSaveTimer);
                setAutoSaveTimer(null);
            }
        } catch (error) {
            console.error("Form submission error:", error);
            throw error;
        }
    };

    // Handle form reset
    const handleReset = async () => {
        if (schema.hooks?.beforeReset) {
            const shouldReset = await schema.hooks.beforeReset();
            if (!shouldReset) return;
        }

        form.resetFields();
        setFieldStates({});
        setFileList({});

        if (schema.hooks?.afterReset) {
            schema.hooks.afterReset();
        }
    };

    // Initialize form
    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue(initialValues);
            handleValuesChange({}, initialValues);
        }

        // Apply plugins
        plugins.forEach(plugin => plugin(form, schema));

        // Notify form ready
        onFormReady?.(form);

        // Validate on mount if required
        if (validateOnMount) {
            form.validateFields().catch(() => {});
        }
    }, [initialValues, form, handleValuesChange, plugins, schema, onFormReady, validateOnMount]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (autoSaveTimer) {
                clearTimeout(autoSaveTimer);
            }
            Object.values(debounceTimers.current).forEach(timer => clearTimeout(timer));
        };
    }, [autoSaveTimer]);

    // Main render
    return (
        <div>
            {renderHeader && renderHeader()}

            <Card>
                <Form
                    form={form}
                    layout={schema.layout || "vertical"}
                    size={schema.size || "middle"}
                    colon={schema.colon}
                    labelAlign={schema.labelAlign}
                    labelCol={schema.labelCol}
                    wrapperCol={schema.wrapperCol}
                    onFinish={handleFinish}
                    onFinishFailed={onFinishFailed}
                    onValuesChange={handleValuesChange}
                    disabled={loading || disabled}
                    initialValues={initialValues}
                    validateTrigger={schema.validation?.validateTrigger}
                    scrollToFirstError={schema.validation?.scrollToError}
                >
                    {/* Render based on structure type */}
                    {schema.steps ? (
                        renderSteps()
                    ) : schema.tabs ? (
                        renderTabs()
                    ) : schema.sections ? (
                        renderSections()
                    ) : (
                        <Row gutter={24}>
                            {schema.fields?.map(field => renderFieldItem(field, form.getFieldsValue()))}
                        </Row>
                    )}

                    {/* Custom footer or default buttons */}
                    {renderFooter
                        ? renderFooter(form, loading)
                        : !schema.steps && (
                              <Form.Item style={{ marginTop: 24 }}>
                                  <Space>
                                      <Button type="primary" htmlType="submit" loading={loading} disabled={readonly}>
                                          {mode === "edit" ? "Update" : "Submit"}
                                      </Button>
                                      <Button onClick={handleReset} disabled={loading || readonly}>
                                          Reset
                                      </Button>
                                      {autoSave && <Text type="secondary">Auto-save enabled</Text>}
                                  </Space>
                              </Form.Item>
                          )}
                </Form>
            </Card>

            {/* Floating buttons for advanced features */}
            {schema.ui?.showProgress && (
                <FloatButton.Group trigger="hover" type="primary" style={{ right: 24 }} icon={<EyeOutlined />}>
                    <FloatButton
                        tooltip="Save Draft"
                        icon={<UploadOutlined />}
                        onClick={() => handleAutoSave(form.getFieldsValue())}
                    />
                    <FloatButton tooltip="Reset Form" icon={<DeleteOutlined />} onClick={handleReset} />
                </FloatButton.Group>
            )}
        </div>
    );
};

export default AppForm;

// Enhanced Example Schemas
export const basicFormSchema: FormSchema = {
    layout: "vertical",
    size: "middle",
    fields: [
        {
            name: "name",
            type: FIELD_TYPES.INPUT,
            label: "Full Name",
            placeholder: "Enter your full name",
            required: true,
            grid: { xs: 24, md: 12 },
            tooltip: "Enter your legal name as it appears on documents",
        },
        {
            name: "email",
            type: FIELD_TYPES.INPUT,
            label: "Email Address",
            placeholder: "Enter your email",
            required: true,
            grid: { xs: 24, md: 12 },
            validations: [{ type: "email", message: "Please enter a valid email" }],
            extras: [
                {
                    type: BUTTON_TYPES.CUSTOM,
                    label: "Verify",
                    icon: <EyeOutlined />,
                    callback: (fieldName, form) => {
                        const email = form.getFieldValue(fieldName);
                        alert(`Verifying email: ${email}`);
                    },
                },
            ],
        },
        {
            name: "age",
            type: FIELD_TYPES.INPUT_NUMBER,
            label: "Age",
            grid: { xs: 24, md: 8 },
            props: { min: 0, max: 120 },
        },
        {
            name: "country",
            type: FIELD_TYPES.SELECT,
            label: "Country",
            grid: { xs: 24, md: 16 },
            options: [
                { label: "USA", value: "usa" },
                { label: "Canada", value: "canada" },
                { label: "UK", value: "uk" },
                { label: "Australia", value: "australia" },
            ],
        },
    ],
};

export const advancedFormSchema: FormSchema = {
    layout: "vertical",
    size: "middle",
    autoSave: {
        enabled: true,
        interval: 3000,
    },
    validation: {
        validateOnChange: true,
        scrollToError: true,
    },
    sections: [
        {
            title: "Personal Information",
            description: "Basic personal details",
            fields: [
                {
                    name: "firstName",
                    type: FIELD_TYPES.INPUT,
                    label: "First Name",
                    required: true,
                    grid: { xs: 24, md: 12 },
                },
                {
                    name: "lastName",
                    type: FIELD_TYPES.INPUT,
                    label: "Last Name",
                    required: true,
                    grid: { xs: 24, md: 12 },
                },
                {
                    name: "birthDate",
                    type: FIELD_TYPES.DATE_PICKER,
                    label: "Birth Date",
                    grid: { xs: 24, md: 8 },
                },
                {
                    name: "gender",
                    type: FIELD_TYPES.SEGMENTED,
                    label: "Gender",
                    grid: { xs: 24, md: 16 },
                    options: [
                        { label: "Male", value: "male" },
                        { label: "Female", value: "female" },
                        { label: "Other", value: "other" },
                    ],
                },
            ],
        },
        {
            title: "Contact Information",
            fields: [
                {
                    name: "contacts",
                    type: FIELD_TYPES.FORM_LIST,
                    label: "Contact Methods",
                    grid: { xs: 24 },
                    formList: {
                        min: 1,
                        max: 5,
                        addText: "Add Contact",
                        allowReorder: true,
                        allowDuplicate: true,
                        template: [
                            {
                                name: "type",
                                type: FIELD_TYPES.SELECT,
                                label: "Type",
                                options: [
                                    { label: "Email", value: "email" },
                                    { label: "Phone", value: "phone" },
                                    { label: "Address", value: "address" },
                                ],
                                grid: { xs: 24, md: 8 },
                            },
                            {
                                name: "value",
                                type: FIELD_TYPES.INPUT,
                                label: "Value",
                                grid: { xs: 24, md: 12 },
                            },
                            {
                                name: "primary",
                                type: FIELD_TYPES.SWITCH,
                                label: "Primary",
                                grid: { xs: 24, md: 4 },
                            },
                        ],
                    },
                },
            ],
        },
    ],
};

export const stepFormSchema: FormSchema = {
    layout: "vertical",
    size: "middle",
    steps: [
        {
            title: "Basic Info",
            description: "Enter your basic information",
            fields: [
                {
                    name: "name",
                    type: FIELD_TYPES.INPUT,
                    label: "Full Name",
                    required: true,
                    grid: { xs: 24 },
                },
                {
                    name: "email",
                    type: FIELD_TYPES.INPUT,
                    label: "Email",
                    required: true,
                    validations: [{ type: "email" }],
                    grid: { xs: 24 },
                },
            ],
            validation: async () => {
                // Custom step validation
                return true;
            },
        },
        {
            title: "Preferences",
            description: "Set your preferences",
            fields: [
                {
                    name: "notifications",
                    type: FIELD_TYPES.CHECKBOX_GROUP,
                    label: "Notification Preferences",
                    options: [
                        { label: "Email Notifications", value: "email" },
                        { label: "SMS Notifications", value: "sms" },
                        { label: "Push Notifications", value: "push" },
                    ],
                    grid: { xs: 24 },
                },
                {
                    name: "theme",
                    type: FIELD_TYPES.RADIO_GROUP,
                    label: "Theme Preference",
                    options: [
                        { label: "Light", value: "light" },
                        { label: "Dark", value: "dark" },
                        { label: "Auto", value: "auto" },
                    ],
                    grid: { xs: 24 },
                },
            ],
        },
        {
            title: "Confirmation",
            description: "Review and submit",
            fields: [
                {
                    name: "terms",
                    type: FIELD_TYPES.CHECKBOX,
                    label: "I agree to the terms and conditions",
                    required: true,
                    grid: { xs: 24 },
                },
            ],
        },
    ],
};

export const tabFormSchema: FormSchema = {
    layout: "vertical",
    size: "middle",
    tabs: [
        {
            key: "personal",
            tab: "Personal",
            icon: <EditOutlined />,
            fields: [
                {
                    name: "name",
                    type: FIELD_TYPES.INPUT,
                    label: "Name",
                    required: true,
                    grid: { xs: 24 },
                },
                {
                    name: "bio",
                    type: FIELD_TYPES.INPUT_TEXT_AREA,
                    label: "Biography",
                    grid: { xs: 24 },
                    props: { rows: 4 },
                },
            ],
        },
        {
            key: "professional",
            tab: "Professional",
            icon: <UploadOutlined />,
            fields: [
                {
                    name: "company",
                    type: FIELD_TYPES.INPUT,
                    label: "Company",
                    grid: { xs: 24, md: 12 },
                },
                {
                    name: "position",
                    type: FIELD_TYPES.INPUT,
                    label: "Position",
                    grid: { xs: 24, md: 12 },
                },
                {
                    name: "resume",
                    type: FIELD_TYPES.UPLOAD,
                    label: "Resume",
                    grid: { xs: 24 },
                    props: {
                        accept: ".pdf,.doc,.docx",
                        maxCount: 1,
                    },
                },
            ],
        },
    ],
};

export const conditionalFormSchema: FormSchema = {
    layout: "vertical",
    size: "middle",
    fields: [
        {
            name: "userType",
            type: FIELD_TYPES.RADIO_GROUP,
            label: "User Type",
            required: true,
            options: [
                { label: "Individual", value: "individual" },
                { label: "Business", value: "business" },
            ],
            grid: { xs: 24 },
        },
        {
            name: "personalName",
            type: FIELD_TYPES.INPUT,
            label: "Full Name",
            grid: { xs: 24 },
            dependencies: [
                {
                    type: DEPENDENCY_TYPES.SHOW_IF,
                    conditions: [{ field: "userType", operator: OPERATORS.EQUALS, value: "individual" }],
                },
                {
                    type: DEPENDENCY_TYPES.REQUIRED_IF,
                    conditions: [{ field: "userType", operator: OPERATORS.EQUALS, value: "individual" }],
                },
            ],
        },
        {
            name: "companyName",
            type: FIELD_TYPES.INPUT,
            label: "Company Name",
            grid: { xs: 24, md: 12 },
            dependencies: [
                {
                    type: DEPENDENCY_TYPES.SHOW_IF,
                    conditions: [{ field: "userType", operator: OPERATORS.EQUALS, value: "business" }],
                },
                {
                    type: DEPENDENCY_TYPES.REQUIRED_IF,
                    conditions: [{ field: "userType", operator: OPERATORS.EQUALS, value: "business" }],
                },
            ],
        },
        {
            name: "taxId",
            type: FIELD_TYPES.INPUT,
            label: "Tax ID",
            grid: { xs: 24, md: 12 },
            dependencies: [
                {
                    type: DEPENDENCY_TYPES.SHOW_IF,
                    conditions: [{ field: "userType", operator: OPERATORS.EQUALS, value: "business" }],
                },
            ],
        },
        {
            name: "hasEmployees",
            type: FIELD_TYPES.SWITCH,
            label: "Has Employees",
            grid: { xs: 24 },
            dependencies: [
                {
                    type: DEPENDENCY_TYPES.SHOW_IF,
                    conditions: [{ field: "userType", operator: OPERATORS.EQUALS, value: "business" }],
                },
            ],
        },
        {
            name: "employeeCount",
            type: FIELD_TYPES.INPUT_NUMBER,
            label: "Number of Employees",
            grid: { xs: 24 },
            props: { min: 1, max: 10000 },
            dependencies: [
                {
                    type: DEPENDENCY_TYPES.SHOW_IF,
                    conditions: [
                        { field: "userType", operator: OPERATORS.EQUALS, value: "business" },
                        { field: "hasEmployees", operator: OPERATORS.EQUALS, value: true },
                    ],
                    logic: "AND",
                },
                {
                    type: DEPENDENCY_TYPES.REQUIRED_IF,
                    conditions: [
                        { field: "userType", operator: OPERATORS.EQUALS, value: "business" },
                        { field: "hasEmployees", operator: OPERATORS.EQUALS, value: true },
                    ],
                    logic: "AND",
                },
            ],
        },
    ],
};
