import { FormRule } from "antd";
import type { ColProps } from "antd/es/col";
import type { FormInstance, FormListFieldData, FormListOperation } from "antd/es/form";
import type { DefaultOptionType } from "antd/es/select";
import React from "react";

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
export interface Option extends DefaultOptionType {
    label: string;
    value: any;
    children?: Option[];
    disabled?: boolean;
    icon?: React.ReactNode;
    description?: string;
    group?: string;
}

export interface DependencyCondition {
    field: string;
    operator: (typeof OPERATORS)[keyof typeof OPERATORS];
    value: any;
    values?: any[];
    path?: string; // For nested field access
}

export interface FormDependency {
    type: (typeof DEPENDENCY_TYPES)[keyof typeof DEPENDENCY_TYPES];
    conditions: DependencyCondition[];
    logic?: "AND" | "OR";
    target?: any;
    callback?: (form: FormInstance, values: any, fieldName?: string) => void | Promise<void>;
    debounce?: number;
    async?: boolean;
}

export interface ExtraButton {
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
export type ValidationRule = FormRule & {
    asyncValidator?: (rule: any, value: any, callback: (error?: string) => void) => Promise<void> | void;
    dependencies?: string[];
    crossField?: boolean;
};

export interface FormListConfig {
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

export interface NestedFormConfig {
    schema: FormSchema;
    isolateValues?: boolean;
    prefix?: string;
}

export interface FieldConfig {
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
    filterable?: boolean;
    defaultValue?: any;
    initialValue?: any;
    props?: Record<string, any>;
    dependencies?: FormDependency[];
    rules?: ValidationRule[];
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

export interface FormSection {
    title?: string;
    description?: string;
    fields: FieldConfig[];
    collapsible?: boolean;
    defaultCollapsed?: boolean;
    icon?: React.ReactNode;
    extra?: React.ReactNode;
}

export interface FormStep {
    title: string;
    description?: string;
    fields: FieldConfig[];
    icon?: React.ReactNode;
    status?: "wait" | "process" | "finish" | "error";
    validation?: () => Promise<boolean>;
}

export interface FormTab {
    key: string;
    tab: string;
    fields: FieldConfig[];
    icon?: React.ReactNode;
    disabled?: boolean;
    closable?: boolean;
}

export interface FormSchema {
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

export interface AppFormProps {
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
