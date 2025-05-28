"use client";
import {
    Button,
    Cascader,
    Checkbox,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Mentions,
    Radio,
    Rate,
    Select,
    Slider,
    Space,
    Switch,
    TimePicker,
    TreeSelect,
    Upload,
} from "antd";
import { RangePickerProps } from "antd/es/date-picker";
import { UploadFile } from "antd/es/upload/interface";
import React, { FC, useEffect, useState } from "react";

export interface IAppForm {}

// Enhanced unified field configuration for both regular fields and form lists
export interface FieldConfigBase {
    name: string;
    label: string;
    type: string;
    dependencies?: string[];
    showIf?: (values: any) => boolean;
    disabledIf?: (values: any) => boolean;
    rules?: any[];
    props?: any;
    options?: { label: string; value: string | number }[];
    placeholder?: string;
    children?: FieldConfigBase[]; // Add this for checkbox groups
}

// Configuration for simple fields
export interface SimpleFieldConfig extends FieldConfigBase {
    type:
        | "input"
        | "textarea"
        | "password"
        | "select"
        | "checkbox"
        | "radio"
        | "datepicker"
        | "rangepicker"
        | "timepicker"
        | "switch"
        | "upload"
        | "slider"
        | "inputnumber"
        | "rate"
        | "cascader"
        | "treeselect"
        | "mentions";
}

// Configuration for form lists
interface ListFieldConfig extends FieldConfigBase {
    type: "list";
    fields: (SimpleFieldConfig | ListFieldConfig)[];
    addButtonText: string;
    removeButtonText?: string;
    maxItems?: number;
    minItems?: number;
}

// Unified type that can be either a simple field or a list
export type UnifiedFieldConfig = SimpleFieldConfig | ListFieldConfig;

// Example of the merged config
const formConfig: UnifiedFieldConfig[] = [
    {
        name: "username",
        label: "Username",
        type: "input",
        rules: [{ required: true, message: "Username is required" }],
    },
    {
        name: "role",
        label: "Role",
        type: "select",
        options: [
            { label: "User", value: "user" },
            { label: "Admin", value: "admin" },
        ],
        rules: [{ required: true, message: "Role is required" }],
    },
    {
        name: "department",
        label: "Department",
        type: "select",
        options: [
            { label: "Engineering", value: "engineering" },
            { label: "HR", value: "hr" },
        ],
        dependencies: ["role"],
        showIf: values => values.role === "admin",
        rules: [{ required: true, message: "Department is required for Admin" }],
    },
    {
        name: "users",
        label: "Users",
        type: "list",
        addButtonText: "Add User",
        removeButtonText: "Remove",
        fields: [
            {
                name: "first",
                label: "First Name",
                type: "input",
                rules: [{ required: true, message: "First name required" }],
            },
            {
                name: "last",
                label: "Last Name",
                type: "input",
                rules: [{ required: true, message: "Last name required" }],
            },
            {
                name: "isActive",
                label: "Active",
                type: "switch",
                dependencies: ["first"],
                disabledIf: values => !values.first,
            },
        ],
    },
    {
        name: "contacts",
        label: "Contacts",
        type: "list",
        addButtonText: "+ Add Contact",
        fields: [
            {
                name: "name",
                label: "Name",
                type: "input",
                rules: [{ required: true, message: "Name is required" }],
            },
            {
                name: "type",
                label: "Contact Type",
                type: "select",
                options: [
                    { label: "Personal", value: "personal" },
                    { label: "Work", value: "work" },
                    { label: "Other", value: "other" },
                ],
                rules: [{ required: true, message: "Contact type is required" }],
            },
            {
                name: "phones",
                label: "Phone Numbers",
                type: "list",
                addButtonText: "+ Add Phone Number",
                fields: [
                    {
                        name: "number",
                        label: "Phone Number",
                        type: "input",
                        rules: [{ required: true, message: "Phone number required" }],
                    },
                    {
                        name: "label",
                        label: "Label",
                        type: "select",
                        options: [
                            { label: "Home", value: "home" },
                            { label: "Work", value: "work" },
                            { label: "Mobile", value: "mobile" },
                        ],
                        props: { style: { width: 120 } },
                    },
                ],
            },
        ],
    },
];

interface AppFormProps {
    config: UnifiedFieldConfig[];
    initialValues?: any;
    onFinish: (values: any) => void;
    onValuesChange?: (changedValues: any, allValues: any) => void;
}

const AppForm: FC<AppFormProps> = ({ config, initialValues = {}, onFinish, onValuesChange }) => {
    const [form] = Form.useForm();
    const [fields, setFields] = useState<any>(initialValues);
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue(initialValues);
        }
    }, [form, initialValues]);

    const handleValuesChange = (changed: any, all: any) => {
        setFields(all);
        if (onValuesChange) {
            onValuesChange(changed, all);
        }
    };

    // Check if a field is a list configuration
    const isList = (field: UnifiedFieldConfig): field is ListFieldConfig => {
        return field.type === "list";
    };

    // Helper function to render the appropriate field component based on type
    const renderFieldComponent = (field: FieldConfigBase) => {
        switch (field.type) {
            case "input":
                return <Input {...field.props} />;
            case "textarea":
                return <Input.TextArea {...field.props} />;
            case "password":
                return <Input.Password {...field.props} />;
            case "select":
                return <Select options={field.options} {...field.props} />;
            case "checkbox":
                return field.children ? (
                    <Checkbox.Group options={field.options} {...field.props} />
                ) : (
                    <Checkbox {...field.props}>{field.label}</Checkbox>
                );
            case "radio":
                return <Radio.Group options={field.options} {...field.props} />;
            case "datepicker":
                return <DatePicker {...field.props} />;
            case "rangepicker":
                return <DatePicker.RangePicker {...(field.props as RangePickerProps)} />;
            case "timepicker":
                return <TimePicker {...field.props} />;
            case "switch":
                return <Switch {...field.props} />;
            case "upload":
                return (
                    <Upload fileList={fileList} onChange={({ fileList }) => setFileList(fileList)} {...field.props}>
                        <Button>Click to Upload</Button>
                    </Upload>
                );
            case "slider":
                return <Slider {...field.props} />;
            case "inputnumber":
                return <InputNumber {...field.props} />;
            case "rate":
                return <Rate {...field.props} />;
            case "cascader":
                return <Cascader options={field.options} {...field.props} />;
            case "treeselect":
                return <TreeSelect treeData={field.options} {...field.props} />;
            case "mentions":
                return <Mentions options={field.options} {...field.props} />;
            default:
                return <Input {...field.props} />;
        }
    };

    // Enhanced function to render form items based on config
    const renderFormItems = (fieldConfigs: UnifiedFieldConfig[], parentPath: string[] = []) => {
        return fieldConfigs.map(field => {
            // Handle dependencies and conditional rendering
            if (field.dependencies && field.showIf && !field.showIf(fields)) {
                return null;
            }

            const disabled = field.dependencies && field.disabledIf && field.disabledIf(fields);

            // Calculate the full path for nested fields
            const fieldPath = [...parentPath, field.name];

            if (isList(field)) {
                return (
                    <React.Fragment key={fieldPath.join(".")}>
                        {field.label && <h4>{field.label}</h4>}
                        <Form.List name={field.name}>
                            {(listFields, { add, remove, move }) => (
                                <>
                                    {listFields.map((listField, index) => (
                                        <div
                                            key={listField.key}
                                            style={{
                                                marginBottom: 24,
                                                border: "1px dashed #d9d9d9",
                                                padding: 16,
                                                borderRadius: 8,
                                            }}
                                        >
                                            <Space
                                                align="start"
                                                style={{
                                                    marginBottom: 16,
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                }}
                                            >
                                                <h4>
                                                    {field.label} #{index + 1}
                                                </h4>
                                                <Space>
                                                    {index > 0 && (
                                                        <Button type="text" onClick={() => move(index, index - 1)}>
                                                            Move Up
                                                        </Button>
                                                    )}
                                                    {index < listFields.length - 1 && (
                                                        <Button type="text" onClick={() => move(index, index + 1)}>
                                                            Move Down
                                                        </Button>
                                                    )}
                                                    <Button onClick={() => remove(listField.name)} danger>
                                                        {field.removeButtonText || "Remove"}
                                                    </Button>
                                                </Space>
                                            </Space>

                                            {/* Recursively render nested fields */}
                                            {renderFormItems(field.fields, [...fieldPath, listField.name.toString()])}
                                        </div>
                                    ))}

                                    <Form.Item>
                                        <Button
                                            type="dashed"
                                            onClick={() => add()}
                                            block
                                            disabled={field.maxItems ? listFields.length >= field.maxItems : false}
                                        >
                                            {field.addButtonText}
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                    </React.Fragment>
                );
            }

            // Handle regular fields
            return (
                <Form.Item key={fieldPath.join(".")} name={field.name} label={field.label} rules={field.rules}>
                    {renderFieldComponent({
                        ...field,
                        props: {
                            ...(field.props || {}),
                            disabled,
                        },
                    } as SimpleFieldConfig)}{" "}
                </Form.Item>
            );
        });
    };

    return (
        <Form
            form={form}
            layout="vertical"
            initialValues={initialValues}
            onValuesChange={handleValuesChange}
            onFinish={onFinish}
        >
            {renderFormItems(config)}

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

export default AppForm;

// Usage example:
// <AppForm
//   config={formConfig}
//   initialValues={{
//     username: "john_doe",
//     role: "admin",
//     department: "engineering",
//     users: [
//       { first: "Jane", last: "Smith", isActive: true },
//       { first: "Bob", last: "Johnson", isActive: false },
//     ],
//   }}
//   onFinish={values => console.log(values)}
// />
