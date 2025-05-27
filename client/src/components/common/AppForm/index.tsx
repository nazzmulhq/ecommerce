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
import React, { FC, useState } from "react";

export interface IAppForm {}

// Expanded field types to include all Ant Design form controls
interface FieldConfig {
    name: string;
    label: string;
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
    options?: { label: string; value: string | number }[];
    dependencies?: string[];
    showIf?: (values: any) => boolean;
    rules?: any[];
    props?: any; // Additional props for the field component
    children?: FieldConfig[]; // For radio groups, checkbox groups, etc.
}

const fieldList: FieldConfig[] = [
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
        name: "note",
        label: "Note",
        type: "input",
        dependencies: ["role"],
        showIf: values => values.role === "user",
    },
];

// Add new interfaces for Form.List configurations
interface ListFieldConfig {
    name: string;
    fieldsList: {
        name: string;
        label?: string;
        type: string;
        placeholder?: string;
        options?: { label: string; value: string | number }[];
        rules?: any[];
        props?: any;
    }[];
    addButtonText: string;
    removeButtonText?: string;
    nested?: boolean;
    nestedListConfig?: {
        name: string;
        fieldsList: {
            name: string;
            label?: string;
            type: string;
            placeholder?: string;
            options?: { label: string; value: string | number }[];
            rules?: any[];
            props?: any;
        }[];
        addButtonText: string;
    };
}

// Sample dynamic list configurations
const listFieldConfigs: ListFieldConfig[] = [
    {
        name: "users",
        fieldsList: [
            {
                name: "first",
                type: "input",
                placeholder: "First Name",
                rules: [{ required: true, message: "First name required" }],
            },
            {
                name: "last",
                type: "input",
                placeholder: "Last Name",
                rules: [{ required: true, message: "Last name required" }],
            },
        ],
        addButtonText: "Add User",
        removeButtonText: "Remove",
    },
    {
        name: "contacts",
        fieldsList: [
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
        ],
        addButtonText: "+ Add Contact",
        nested: true,
        nestedListConfig: {
            name: "phones",
            fieldsList: [
                {
                    name: "number",
                    type: "input",
                    placeholder: "Phone number",
                    rules: [{ required: true, message: "Phone number required" }],
                },
                {
                    name: "label",
                    type: "select",
                    placeholder: "Label",
                    options: [
                        { label: "Home", value: "home" },
                        { label: "Work", value: "work" },
                        { label: "Mobile", value: "mobile" },
                    ],
                    props: { style: { width: 120 } },
                },
            ],
            addButtonText: "+ Add Phone Number",
        },
    },
];

const AppForm: FC<IAppForm> = () => {
    const [form] = Form.useForm();
    const [fields, setFields] = useState<any>({});
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const onValuesChange = (changed: any, all: any) => {
        setFields(all);
    };

    // Helper function to render the appropriate field component based on type
    const renderFieldComponent = (field: FieldConfig) => {
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

    // Function to render a Form.List based on configuration
    const renderFormList = (config: ListFieldConfig) => {
        return (
            <Form.List name={config.name}>
                {(fields, { add, remove, move }) => (
                    <>
                        {fields.map((field, index) => (
                            <div
                                key={field.key}
                                style={
                                    config.nested
                                        ? {
                                              marginBottom: 24,
                                              border: "1px dashed #d9d9d9",
                                              padding: 16,
                                              borderRadius: 8,
                                          }
                                        : undefined
                                }
                            >
                                {config.nested && (
                                    <Space
                                        align="start"
                                        style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}
                                    >
                                        <h4>
                                            {config.name.charAt(0).toUpperCase() + config.name.slice(1)} #{index + 1}
                                        </h4>
                                        <Space>
                                            {index > 0 && (
                                                <Button type="text" onClick={() => move(index, index - 1)}>
                                                    Move Up
                                                </Button>
                                            )}
                                            {index < fields.length - 1 && (
                                                <Button type="text" onClick={() => move(index, index + 1)}>
                                                    Move Down
                                                </Button>
                                            )}
                                            <Button onClick={() => remove(field.name)} danger>
                                                {config.removeButtonText || "Remove"}
                                            </Button>
                                        </Space>
                                    </Space>
                                )}

                                <div style={{ display: config.nested ? "block" : "flex" }}>
                                    {config.fieldsList.map(fieldConfig => (
                                        <Form.Item
                                            key={`${field.key}-${fieldConfig.name}`}
                                            // Remove {...field} to avoid key conflict
                                            name={[field.name, fieldConfig.name]}
                                            label={fieldConfig.label}
                                            rules={fieldConfig.rules}
                                        >
                                            {/* Fixed type conversion for renderFieldComponent */}
                                            {renderFieldComponent({
                                                name: fieldConfig.name,
                                                label: fieldConfig.label || fieldConfig.name,
                                                type: fieldConfig.type as any,
                                                options: fieldConfig.options,
                                                rules: fieldConfig.rules,
                                                props: {
                                                    ...(fieldConfig.props || {}),
                                                    placeholder: fieldConfig.placeholder,
                                                },
                                            } as FieldConfig)}
                                        </Form.Item>
                                    ))}

                                    {!config.nested && (
                                        <Button onClick={() => remove(field.name)} danger>
                                            {config.removeButtonText || "Remove"}
                                        </Button>
                                    )}

                                    {/* Render nested Form.List if configured */}
                                    {config.nested && config.nestedListConfig && (
                                        <Form.Item
                                            label={`${config.nestedListConfig.name.charAt(0).toUpperCase() + config.nestedListConfig.name.slice(1)}`}
                                        >
                                            <Form.List name={[field.name, config.nestedListConfig.name]}>
                                                {(subFields, subOps) => (
                                                    <div style={{ marginLeft: 20 }}>
                                                        {subFields.map(subField => (
                                                            <Space
                                                                key={subField.key}
                                                                align="baseline"
                                                                style={{ display: "flex", marginBottom: 8 }}
                                                            >
                                                                {config.nestedListConfig?.fieldsList.map(
                                                                    subFieldConfig => (
                                                                        <Form.Item
                                                                            key={`${subField.key}-${subFieldConfig.name}`}
                                                                            name={[subField.name, subFieldConfig.name]}
                                                                            rules={subFieldConfig.rules}
                                                                        >
                                                                            {/* Fixed type conversion for nested renderFieldComponent */}
                                                                            {renderFieldComponent({
                                                                                name: subFieldConfig.name,
                                                                                label:
                                                                                    subFieldConfig.label ||
                                                                                    subFieldConfig.name,
                                                                                type: subFieldConfig.type as any,
                                                                                options: subFieldConfig.options,
                                                                                rules: subFieldConfig.rules,
                                                                                props: {
                                                                                    ...(subFieldConfig.props || {}),
                                                                                    placeholder:
                                                                                        subFieldConfig.placeholder,
                                                                                },
                                                                            } as FieldConfig)}
                                                                        </Form.Item>
                                                                    ),
                                                                )}
                                                                <Button
                                                                    onClick={() => subOps.remove(subField.name)}
                                                                    danger
                                                                >
                                                                    Remove
                                                                </Button>
                                                            </Space>
                                                        ))}
                                                        <Button
                                                            type="dashed"
                                                            onClick={() => subOps.add()}
                                                            style={{ width: "100%" }}
                                                        >
                                                            {config.nestedListConfig?.addButtonText}
                                                        </Button>
                                                    </div>
                                                )}
                                            </Form.List>
                                        </Form.Item>
                                    )}
                                </div>
                            </div>
                        ))}
                        <Form.Item>
                            <Button type="dashed" onClick={() => add()} block style={{ marginBottom: 24 }}>
                                {config.addButtonText}
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>
        );
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onValuesChange={onValuesChange}
            onFinish={values => {
                // handle submit
                console.log(values);
            }}
        >
            {fieldList.map(field => {
                // Handle dependencies and conditional rendering
                if (field.dependencies && field.showIf && !field.showIf(fields)) {
                    return null;
                }

                return (
                    <Form.Item key={field.name} name={field.name} label={field.label} rules={field.rules}>
                        {renderFieldComponent(field)}
                    </Form.Item>
                );
            })}

            {/* Render dynamic Form.Lists based on configurations */}
            {listFieldConfigs.map(config => (
                <React.Fragment key={config.name}>
                    {config.name === "contacts" && <h3>Advanced Dynamic Fields</h3>}
                    {renderFormList(config)}
                </React.Fragment>
            ))}

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

export default AppForm;
