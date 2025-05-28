"use client";

import { UploadOutlined } from "@ant-design/icons";
import {
    Button,
    Cascader,
    Checkbox,
    Collapse,
    ColorPicker,
    DatePicker,
    Divider,
    Form,
    Input,
    InputNumber,
    Mentions,
    Radio,
    Rate,
    Select,
    Slider,
    Switch,
    TimePicker,
    Transfer,
    TreeSelect,
    Typography,
    Upload,
} from "antd";
import { RangePickerProps } from "antd/es/date-picker";
import React, { useEffect, useState } from "react";
import { DataEntryFieldTypes, DependencyType, FieldGroup, FormConfig, isFieldGroup, TDataEntryField } from "./types";

const { RangePicker } = DatePicker;
const { TextArea, Password } = Input;
const { Title } = Typography;

/**
 * Dynamic Data Entry Component that renders different form fields based on configuration
 */
const DataEntry: React.FC<{ config: FormConfig }> = ({ config }) => {
    const [form] = Form.useForm();
    const [formValues, setFormValues] = useState<any>(config.initialValues || {});
    const [fieldsVisibility, setFieldsVisibility] = useState<Record<string, boolean>>({});
    const [fieldsDisabled, setFieldsDisabled] = useState<Record<string, boolean>>({});
    const [fieldRules, setFieldRules] = useState<Record<string, any[]>>({});

    // Initialize fields state based on dependencies
    useEffect(() => {
        const initialVisibility: Record<string, boolean> = {};
        const initialDisabled: Record<string, boolean> = {};
        const initialRules: Record<string, any[]> = {};

        // Process all fields recursively
        const processFields = (fields: (TDataEntryField | FieldGroup)[]) => {
            fields.forEach(field => {
                if (isFieldGroup(field)) {
                    processFields(field.fields);
                } else {
                    // Set initial visibility
                    initialVisibility[field.name] = field.hidden ? false : true;

                    // Set initial disabled state
                    initialDisabled[field.name] = field.disabled || false;

                    // Set initial rules
                    initialRules[field.name] = field.rules || [];

                    // Process dependencies
                    if (field.dependencies && field.dependencies.length > 0) {
                        field.dependencies.forEach(dep => {
                            // Evaluate dependency based on initial values
                            if (dep.type === DependencyType.SHOW) {
                                const isVisible = dep.cb(config.initialValues || {}, field);
                                initialVisibility[field.name] = !!isVisible;
                            } else if (dep.type === DependencyType.DISABLE) {
                                const isDisabled = dep.cb(config.initialValues || {}, field);
                                initialDisabled[field.name] = !!isDisabled;
                            } else if (dep.type === DependencyType.RULES) {
                                const rules = dep.cb(config.initialValues || {}, field);
                                if (Array.isArray(rules)) {
                                    initialRules[field.name] = rules;
                                }
                            }
                        });
                    }
                }
            });
        };

        processFields(config.fields);

        setFieldsVisibility(initialVisibility);
        setFieldsDisabled(initialDisabled);
        setFieldRules(initialRules);
    }, [config.initialValues, config.fields]);

    // Handle form values change to update dependencies
    const handleValuesChange = (changedValues: any, allValues: any) => {
        setFormValues(allValues);

        // Check dependencies and update visibility, disabled state, and rules
        const updatedVisibility = { ...fieldsVisibility };
        const updatedDisabled = { ...fieldsDisabled };
        const updatedRules = { ...fieldRules };

        // Helper function to process field dependencies
        const processFieldDependencies = (field: TDataEntryField) => {
            if (field.dependencies && field.dependencies.length > 0) {
                field.dependencies.forEach(dep => {
                    const dependentFields = Array.isArray(dep.name) ? dep.name : [dep.name];

                    // Check if any of the changed fields are dependencies of this field
                    const shouldUpdate = Object.keys(changedValues).some(changedField =>
                        dependentFields.includes(changedField),
                    );

                    if (shouldUpdate) {
                        if (dep.type === DependencyType.SHOW) {
                            updatedVisibility[field.name] = !!dep.cb(allValues, field);
                        } else if (dep.type === DependencyType.DISABLE) {
                            updatedDisabled[field.name] = !!dep.cb(allValues, field);
                        } else if (dep.type === DependencyType.RULES) {
                            const rules = dep.cb(allValues, field);
                            if (Array.isArray(rules)) {
                                updatedRules[field.name] = rules;
                            }
                        }
                    }
                });
            }
        };

        // Process all fields recursively
        const processFields = (fields: (TDataEntryField | FieldGroup)[]) => {
            fields.forEach(field => {
                if (isFieldGroup(field)) {
                    processFields(field.fields);
                } else {
                    processFieldDependencies(field);
                }
            });
        };

        processFields(config.fields);

        setFieldsVisibility(updatedVisibility);
        setFieldsDisabled(updatedDisabled);
        setFieldRules(updatedRules);

        // Call the original onValuesChange callback if provided
        if (config.onValuesChange) {
            config.onValuesChange(changedValues, allValues);
        }
    };

    // Render a specific field based on its type
    const renderField = (field: TDataEntryField) => {
        // Skip hidden fields
        if (!fieldsVisibility[field.name]) {
            return null;
        }

        const fieldProps = {
            ...field.props,
            disabled: fieldsDisabled[field.name] || field.disabled,
            placeholder: field.placeholder,
        };

        const rules = fieldRules[field.name] || field.rules || [];

        // Add required rule if the field is marked as required
        if (field.required && !rules.some(rule => "required" in rule)) {
            rules.push({ required: true, message: `${field.label} is required` });
        }

        switch (field.type) {
            case DataEntryFieldTypes.INPUT:
                return <Input {...fieldProps} />;

            case DataEntryFieldTypes.INPUT_PASSWORD:
                return <Password {...fieldProps} />;

            case DataEntryFieldTypes.INPUT_TEXT_AREA:
                return <TextArea {...fieldProps} />;

            case DataEntryFieldTypes.INPUT_SEARCH:
                return <Input.Search {...fieldProps} />;

            case DataEntryFieldTypes.INPUT_NUMBER:
                return <InputNumber {...fieldProps} />;

            case DataEntryFieldTypes.SELECT:
                return (
                    <Select {...fieldProps}>
                        {fieldProps.options?.map((option: any) => (
                            <Select.Option key={option.value} value={option.value}>
                                {option.label}
                            </Select.Option>
                        ))}
                    </Select>
                );

            case DataEntryFieldTypes.CHECKBOX:
                return <Checkbox {...fieldProps}>{field.label}</Checkbox>;

            case DataEntryFieldTypes.CHECKBOX_GROUP:
                return <Checkbox.Group options={fieldProps.options} {...fieldProps} />;

            case DataEntryFieldTypes.RADIO_GROUP:
                return <Radio.Group options={fieldProps.options} {...fieldProps} />;

            case DataEntryFieldTypes.RADIO_BUTTON:
                return (
                    <Radio.Group {...fieldProps}>
                        {fieldProps.options?.map((option: any) => (
                            <Radio.Button key={option.value} value={option.value}>
                                {option.label}
                            </Radio.Button>
                        ))}
                    </Radio.Group>
                );

            case DataEntryFieldTypes.DATE_PICKER:
                return <DatePicker {...fieldProps} />;

            case DataEntryFieldTypes.DATE_PICKER_RANGE:
                return <RangePicker {...(fieldProps as RangePickerProps)} />;

            case DataEntryFieldTypes.TIME_PICKER:
                return <TimePicker {...fieldProps} />;

            case DataEntryFieldTypes.TIME_PICKER_RANGE:
                return <TimePicker.RangePicker {...fieldProps} />;

            case DataEntryFieldTypes.SWITCH:
                return <Switch {...fieldProps} />;

            case DataEntryFieldTypes.SLIDER:
                return <Slider {...fieldProps} />;

            case DataEntryFieldTypes.RATE:
                return <Rate {...fieldProps} />;

            case DataEntryFieldTypes.UPLOAD:
                return (
                    <Upload {...fieldProps}>
                        <Button icon={<UploadOutlined />}>Upload</Button>
                    </Upload>
                );

            case DataEntryFieldTypes.UPLOAD_DRAGGER:
                return (
                    <Upload.Dragger {...fieldProps}>
                        <p className="ant-upload-drag-icon">
                            <UploadOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    </Upload.Dragger>
                );

            case DataEntryFieldTypes.CASCADER:
                return <Cascader options={fieldProps.options} {...fieldProps} />;

            case DataEntryFieldTypes.TREE_SELECT:
                return <TreeSelect treeData={fieldProps.treeData} {...fieldProps} />;

            case DataEntryFieldTypes.MENTION:
                return <Mentions {...fieldProps} />;

            case DataEntryFieldTypes.COLOR_PICKER:
                return <ColorPicker {...fieldProps} />;

            case DataEntryFieldTypes.TRANSFER:
                return <Transfer {...fieldProps} />;

            default:
                return <Input {...fieldProps} />;
        }
    };

    // Render form fields recursively
    const renderFields = (fields: (TDataEntryField | FieldGroup)[]) => {
        return fields.map((field, index) => {
            // Handle field groups
            if (isFieldGroup(field)) {
                return (
                    <div key={field.key || index} className={field.className} style={field.style}>
                        {field.title && (
                            <Divider orientation="left">
                                <Title level={5}>{field.title}</Title>
                            </Divider>
                        )}
                        {field.collapsible ? (
                            <Collapse
                                defaultActiveKey={field.collapsed ? [] : [field.key]}
                                items={[
                                    {
                                        key: field.key,
                                        label: field.title,
                                        children: renderFields(field.fields),
                                        extra: field.extra,
                                    },
                                ]}
                            />
                        ) : (
                            renderFields(field.fields)
                        )}
                    </div>
                );
            }

            // Handle regular fields
            if (!fieldsVisibility[field.name]) {
                return null;
            }

            return (
                <Form.Item
                    key={field.name}
                    name={field.name}
                    label={field.label}
                    rules={fieldRules[field.name] || field.rules}
                    tooltip={field.tooltip}
                    extra={field.extra}
                    validateStatus={field.validateStatus}
                    help={field.help}
                    hasFeedback={field.hasFeedback}
                    noStyle={field.noStyle}
                    shouldUpdate={field.shouldUpdate}
                    fieldKey={field.fieldKey}
                    className={field.className}
                    style={field.style}
                >
                    {renderField(field)}
                </Form.Item>
            );
        });
    };

    // Render form with layout options
    return (
        <Form
            form={form}
            layout={config.layout || "vertical"}
            labelCol={config.labelCol}
            wrapperCol={config.wrapperCol}
            initialValues={config.initialValues}
            onFinish={config.onFinish}
            onFinishFailed={config.onFinishFailed}
            onValuesChange={handleValuesChange}
            onFieldsChange={config.onFieldsChange}
            validateMessages={config.validateMessages}
            validateTrigger={config.validateTrigger}
            size={config.size}
            preserve={config.preserve}
            scrollToFirstError={config.scrollToFirstError}
        >
            {renderFields(config.fields)}

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

export default DataEntry;

// Example usage:
/*
import DataEntry from '@components/common/AppForm/DataEntry';
import { FormConfig, DataEntryFieldTypes, DependencyType } from '@components/common/AppForm/DataEntry/types';

const formConfig: FormConfig = {
  fields: [
    {
      name: "userType",
      label: "User Type",
      type: DataEntryFieldTypes.RADIO_GROUP,
      options: [
        { label: "Individual", value: "individual" },
        { label: "Business", value: "business" }
      ],
      defaultValue: "individual"
    },
    {
      name: "businessName",
      label: "Business Name",
      type: DataEntryFieldTypes.INPUT,
      dependencies: [
        {
          type: DependencyType.SHOW,
          name: "userType",
          cb: (values) => values.userType === "business"
        }
      ],
      rules: [{ required: true, message: "Please enter business name" }]
    },
    {
      name: "phoneVerified",
      label: "Phone Verified",
      type: DataEntryFieldTypes.SWITCH,
      defaultValue: false
    },
    {
      name: "phoneNumber",
      label: "Phone Number",
      type: DataEntryFieldTypes.INPUT,
      dependencies: [
        {
          type: DependencyType.DISABLE,
          name: "phoneVerified",
          cb: (values) => values.phoneVerified === true
        },
        {
          type: DependencyType.RULES,
          name: "userType",
          cb: (values) => {
            return values.userType === "business"
              ? [{ required: true, message: "Business phone is required" }]
              : [];
          }
        }
      ]
    },
    // Field group example
    {
      key: "addressGroup",
      title: "Address Information",
      collapsible: true,
      fields: [
        {
          name: "address",
          label: "Street Address",
          type: DataEntryFieldTypes.INPUT,
        },
        {
          name: "city",
          label: "City",
          type: DataEntryFieldTypes.INPUT,
        }
      ]
    }
  ],
  layout: "vertical",
  initialValues: {
    userType: "individual",
    phoneVerified: false
  },
  onFinish: (values) => {
    console.log("Success:", values);
  }
};

const YourComponent = () => {
  return <DataEntry config={formConfig} />;
};
*/
