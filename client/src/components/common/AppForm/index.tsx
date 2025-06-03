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
import type { UploadChangeParam, UploadFile } from "antd/es/upload/interface";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { AppFormProps, DependencyCondition, FieldConfig, Option, ValidationRule } from "./form.type";

const { TextArea, Password, Search } = Input;
const { Title, Text } = Typography;
const { Step } = Steps;
const { TabPane } = Tabs;
const { Panel } = Collapse;

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
                            // Check if the value is different before setting to avoid loops
                            const currentValue = form.getFieldValue(field.name);
                            if (currentValue !== dependency.target) {
                                form.setFieldValue(field.name, dependency.target);
                            }
                        }
                        break;
                    case "clear_value":
                        if (conditionsMet) {
                            // Check if the field has a value before clearing
                            const currentValue = form.getFieldValue(field.name);
                            if (currentValue !== undefined && currentValue !== null && currentValue !== "") {
                                form.setFieldValue(field.name, undefined);
                            }
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
                                // Check if the value is different before setting to avoid loops
                                const currentValue = form.getFieldValue(field.name);
                                if (JSON.stringify(currentValue) !== JSON.stringify(calculatedValue)) {
                                    form.setFieldValue(field.name, calculatedValue);
                                }
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
            // Prevent unnecessary updates if values haven't actually changed
            if (JSON.stringify(previousValues.current) === JSON.stringify(allValues)) {
                return;
            }

            const newFieldStates: Record<string, any> = {};
            const allFields = [
                ...(schema.fields || []),
                ...(schema.sections?.flatMap(s => s.fields) || []),
                ...(schema.steps?.flatMap(s => s.fields) || []),
                ...(schema.tabs?.flatMap(t => t.fields) || []),
            ];

            // Process dependencies for all fields
            let hasStateChanges = false;
            for (const field of allFields) {
                const state = await processDependencies(field, allValues);

                // Only update state if there are actual changes
                if (JSON.stringify(fieldStates[field.name]) !== JSON.stringify(state)) {
                    newFieldStates[field.name] = { ...fieldStates[field.name], ...state };
                    hasStateChanges = true;
                } else {
                    newFieldStates[field.name] = fieldStates[field.name];
                }

                // Handle field-specific hooks
                if (changedValues[field.name] !== undefined && schema.hooks?.onFieldChange) {
                    schema.hooks.onFieldChange(field.name, changedValues[field.name], allValues);
                }
            }

            // Only update field states if there are actual changes
            if (hasStateChanges) {
                setFieldStates(newFieldStates);
            }

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
            previousValues.current = { ...allValues };
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
                                                rules={templateField.rules}
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
        const isHidden = field.hideInForm || fieldState.hideInForm;

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
        if (field.rules) {
            rules.push(...field.rules);
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
            hidden: field.hidden || fieldState.hidden,
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

        // Convert sections to items format for Collapse
        const items = schema.sections.map((section, index) => {
            // Sort fields by order property if available
            const sortedFields = [...section.fields].sort((a, b) =>
                a.order !== undefined && b.order !== undefined ? a.order - b.order : 0,
            );

            return {
                key: index.toString(),
                label: section.title,
                children: (
                    <>
                        {section.description && (
                            <Alert message={section.description} type="info" style={{ marginBottom: 16 }} />
                        )}
                        <Row gutter={24}>
                            {sortedFields.map(field => renderFieldItem(field, form.getFieldsValue()))}
                        </Row>
                    </>
                ),
                extra: section.extra,
            };
        });

        return <Collapse defaultActiveKey={schema.sections.map((_, index) => index.toString())} items={items} />;
    };

    // Render form steps
    const renderSteps = () => {
        if (!schema.steps?.length) return null;

        const currentStepFields = schema.steps[currentStep]?.fields || [];
        // Sort fields by order property if available
        const sortedFields = [...currentStepFields].sort((a, b) =>
            a.order !== undefined && b.order !== undefined ? a.order - b.order : 0,
        );

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

                <Row gutter={24}>{sortedFields.map(field => renderFieldItem(field, form.getFieldsValue()))}</Row>

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
                {schema.tabs.map(tab => {
                    // Sort fields by order property if available
                    const sortedFields = [...tab.fields].sort((a, b) =>
                        a.order !== undefined && b.order !== undefined ? a.order - b.order : 0,
                    );

                    return (
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
                            <Row gutter={24}>
                                {sortedFields.map(field => renderFieldItem(field, form.getFieldsValue()))}
                            </Row>
                        </TabPane>
                    );
                })}
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
                        {schema.fields
                            ?.sort((a, b) => (a.order !== undefined && b.order !== undefined ? a.order - b.order : 0))
                            .map(field => renderFieldItem(field, form.getFieldsValue()))}
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
