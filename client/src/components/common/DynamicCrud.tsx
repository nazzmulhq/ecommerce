"use client";
import {
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    FilterOutlined,
    PlusOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import {
    Button,
    Card,
    Checkbox,
    Col,
    DatePicker,
    Divider,
    Drawer,
    Form,
    Input,
    InputNumber,
    Modal,
    Popconfirm,
    Progress,
    Radio,
    Rate,
    Row,
    Select,
    Slider,
    Space,
    Switch,
    Table,
    Tabs,
    Tag,
    TimePicker,
    Tooltip,
    Typography,
    Upload,
    message,
} from "antd";
import { UploadFile } from "antd/es/upload";
import { ReactNode, useEffect, useMemo, useState } from "react";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

// Enhanced field type definitions
export type FieldType =
    | "input"
    | "input.password"
    | "input.search"
    | "input.text_area"
    | "email"
    | "phone"
    | "number"
    | "select"
    | "multi_select"
    | "boolean"
    | "switch"
    | "date"
    | "date_range"
    | "time"
    | "time_range"
    | "textarea"
    | "rate"
    | "slider"
    | "tags"
    | "upload"
    | "color"
    | "radio"
    | "checkbox"
    | "progress";

// Field definition
export type CrudField = {
    key: string;
    label: string;
    type: FieldType;
    options?: string[] | { label: string; value: any }[];
    required?: boolean;
    rules?: any[];
    searchable?: boolean;
    filterable?: boolean;
    sortable?: boolean;
    hidden?: boolean;
    hideInTable?: boolean;
    hideInForm?: boolean;
    width?: number | string;
    fixed?: boolean | "left" | "right";
    placeholder?: string;
    defaultValue?: any;
    transform?: (value: any, record: any) => any;
    render?: (value: any, record: any) => ReactNode;
    props?: any; // Additional props for the component
};

// Column definition
export type CrudColumn = {
    title: string;
    dataIndex: string;
    key: string;
    fixed?: boolean | "left" | "right";
    width?: number;
    render?: (value: any, record: any) => ReactNode;
    sorter?: boolean | ((a: any, b: any) => number);
    filters?: { text: string; value: any }[];
    onFilter?: (value: any, record: any) => boolean;
};

// Statistics item
export type StatItem = {
    key: string;
    label: string;
    value: number | string;
    color?: string;
    icon?: ReactNode;
};

// CRUD UI type
export type CrudType = "modal" | "drawer" | "page";

// Props for DynamicCrud
export interface DynamicCrudProps {
    title: string;
    fields: CrudField[];
    crudType?: CrudType;
    initialData?: any[];
    filterFields?: CrudField[];
    icon?: ReactNode;
    actions?: {
        view?: boolean;
        edit?: boolean;
        delete?: boolean;
        extraActions?: (record: any) => ReactNode[];
    };
    statistics?: StatItem[] | ((data: any[]) => StatItem[]);
    onDataChange?: (data: any[]) => void;
    onRecordView?: (record: any) => void;
    onRecordCreate?: (record: any) => Promise<any> | void;
    onRecordUpdate?: (record: any) => Promise<any> | void;
    onRecordDelete?: (record: any) => Promise<any> | void;
    tableProps?: any;
    formProps?: any;
    confirmTexts?: {
        delete?: string;
        create?: string;
        update?: string;
    };
    successMessages?: {
        create?: string;
        update?: string;
        delete?: string;
    };
    rowSelection?: boolean;
    batchActions?: (selectedRowKeys: any[], selectedRows: any[]) => ReactNode;
    emptyText?: string;
    showToggleCrudType?: boolean;
}

const DynamicCrud = ({
    title,
    fields,
    crudType = "modal",
    initialData = [],
    filterFields = [],
    icon,
    actions = { view: true, edit: true, delete: true },
    statistics,
    onDataChange,
    onRecordView,
    onRecordCreate,
    onRecordUpdate,
    onRecordDelete,
    tableProps = {},
    formProps = {},
    confirmTexts = {
        delete: "Are you sure you want to delete this record?",
        create: "Create",
        update: "Update",
    },
    successMessages = {
        create: "Record created successfully",
        update: "Record updated successfully",
        delete: "Record deleted successfully",
    },
    rowSelection = false,
    batchActions,
    emptyText = "No data found",
    showToggleCrudType = false,
}: DynamicCrudProps) => {
    // State management
    const [data, setData] = useState<any[]>(initialData);
    const [editingRecord, setEditingRecord] = useState<any | null>(null);
    const [viewingRecord, setViewingRecord] = useState<any | null>(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
    const [isViewVisible, setIsViewVisible] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<"list" | "form" | "view">("list");
    const [searchText, setSearchText] = useState<string>("");
    const [filters, setFilters] = useState<Record<string, any>>({});
    const [fileList, setFileList] = useState<Record<string, UploadFile[]>>({});
    const [form] = Form.useForm();
    const [filterForm] = Form.useForm();
    const [activeCrudType, setActiveCrudType] = useState<CrudType>(crudType);

    // Update internal data when initialData changes
    useEffect(() => {
        setData(initialData);
    }, [initialData]);

    // Process filter fields - extract from main fields if not provided
    const processedFilterFields = useMemo(() => {
        if (filterFields.length > 0) return filterFields;
        return fields.filter(field => field.filterable).slice(0, 4); // Limit to 4 fields
    }, [fields, filterFields]);

    // Filtered and sorted data
    const processedData = useMemo(() => {
        let result = [...data];

        // Apply search
        if (searchText.trim()) {
            const searchLower = searchText.toLowerCase();
            result = result.filter(record => {
                return fields
                    .filter(field => field.searchable)
                    .some(field => {
                        const value = record[field.key];
                        if (value === null || value === undefined) return false;
                        return String(value).toLowerCase().includes(searchLower);
                    });
            });
        }

        // Apply filters
        Object.entries(filters).forEach(([key, value]) => {
            if (
                value !== undefined &&
                value !== null &&
                value !== "" &&
                !(Array.isArray(value) && value.length === 0)
            ) {
                result = result.filter(record => {
                    const fieldValue = record[key];

                    if (Array.isArray(value)) {
                        return value.includes(fieldValue);
                    } else if (typeof value === "boolean") {
                        return fieldValue === value;
                    } else if (typeof value === "string" && value) {
                        return String(fieldValue).toLowerCase().includes(value.toLowerCase());
                    }

                    return false;
                });
            }
        });

        return result;
    }, [data, searchText, filters, fields]);

    // Render form field based on type
    const renderFormField = (field: CrudField) => {
        const props = field.props || {};

        switch (field.type) {
            case "input":
                return <Input placeholder={`Enter ${field.label.toLowerCase()}`} {...props} />;
            case "input.password":
                return <Input.Password placeholder={`Enter ${field.label.toLowerCase()}`} {...props} />;
            case "input.search":
                return <Input.Search placeholder={`Search ${field.label.toLowerCase()}`} {...props} />;
            case "input.text_area":
            case "textarea":
                return <TextArea rows={3} placeholder={`Enter ${field.label.toLowerCase()}`} {...props} />;
            case "email":
                return <Input type="email" placeholder={`Enter ${field.label.toLowerCase()}`} {...props} />;
            case "phone":
                return <Input placeholder="+1234567890" {...props} />;
            case "number":
                return (
                    <InputNumber
                        style={{ width: "100%" }}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                        {...props}
                    />
                );
            case "select":
                return (
                    <Select placeholder={`Select ${field.label.toLowerCase()}`} {...props}>
                        {(field.options || []).map((option: any) => {
                            const value = typeof option === "object" ? option.value : option;
                            const label = typeof option === "object" ? option.label : option;
                            return (
                                <Option key={value} value={value}>
                                    {label}
                                </Option>
                            );
                        })}
                    </Select>
                );
            case "multi_select":
                return (
                    <Select
                        mode="multiple"
                        placeholder={`Select ${field.label.toLowerCase()}`}
                        {...props}
                        style={{ width: "100%", ...(props.style || {}) }}
                    >
                        {(field.options || []).map((option: any) => {
                            const value = typeof option === "object" ? option.value : option;
                            const label = typeof option === "object" ? option.label : option;
                            return (
                                <Option key={value} value={value}>
                                    {label}
                                </Option>
                            );
                        })}
                    </Select>
                );
            case "boolean":
            case "switch":
                return <Switch {...props} />;
            case "date":
                return <DatePicker style={{ width: "100%" }} {...props} />;
            case "date_range":
                return <DatePicker.RangePicker style={{ width: "100%" }} {...props} />;
            case "time":
                return <TimePicker style={{ width: "100%" }} {...props} />;
            case "time_range":
                return <TimePicker.RangePicker style={{ width: "100%" }} {...props} />;
            case "rate":
                return <Rate allowHalf {...props} />;
            case "slider":
                return <Slider {...props} />;
            case "tags":
                return (
                    <Select
                        mode="tags"
                        style={{ width: "100%" }}
                        placeholder={`Add ${field.label.toLowerCase()}`}
                        {...props}
                    />
                );
            case "upload":
                return (
                    <Upload
                        fileList={fileList[field.key] || []}
                        onChange={info => {
                            setFileList(prev => ({ ...prev, [field.key]: info.fileList }));
                        }}
                        {...props}
                    >
                        <Button icon={<PlusOutlined />}>Upload</Button>
                    </Upload>
                );
            case "color":
                return <Input type="color" {...props} />;
            case "radio":
                return (
                    <Radio.Group {...props}>
                        {(field.options || []).map((option: any) => {
                            const value = typeof option === "object" ? option.value : option;
                            const label = typeof option === "object" ? option.label : option;
                            return (
                                <Radio key={value} value={value}>
                                    {label}
                                </Radio>
                            );
                        })}
                    </Radio.Group>
                );
            case "checkbox":
                return <Checkbox.Group options={field.options} {...props} />;
            default:
                return <Input placeholder={`Enter ${field.label.toLowerCase()}`} {...props} />;
        }
    };

    // Generate table columns
    const generateColumns = () => {
        const columns = fields
            .filter(field => !field.hidden && !field.hideInTable)
            .map(field => ({
                title: field.label,
                dataIndex: field.key,
                key: field.key,
                width: field.width,
                fixed: field.fixed,
                sorter: field.sortable
                    ? (a: any, b: any) => {
                          if (typeof a[field.key] === "string") {
                              return a[field.key].localeCompare(b[field.key]);
                          }
                          return a[field.key] - b[field.key];
                      }
                    : undefined,
                render: (value: any, record: any) => {
                    if (field.render) {
                        return field.render(value, record);
                    }

                    // Transform the value if needed
                    const displayValue = field.transform ? field.transform(value, record) : value;

                    switch (field.type) {
                        case "boolean":
                        case "switch":
                            return <Tag color={displayValue ? "green" : "red"}>{displayValue ? "Yes" : "No"}</Tag>;
                        case "tags":
                            if (Array.isArray(displayValue)) {
                                return (
                                    <div>
                                        {displayValue.slice(0, 3).map((tag: any) => (
                                            <Tag key={tag}>{tag}</Tag>
                                        ))}
                                        {displayValue.length > 3 && <Tag>+{displayValue.length - 3}</Tag>}
                                    </div>
                                );
                            }
                            return displayValue;
                        case "rate":
                            return <Rate disabled defaultValue={displayValue} />;
                        case "progress":
                            return <Progress percent={displayValue} size="small" />;
                        case "number":
                            if (
                                field.key.includes("price") ||
                                field.key.includes("cost") ||
                                field.key.includes("salary") ||
                                field.key.includes("budget")
                            ) {
                                return typeof displayValue === "number"
                                    ? `$${displayValue.toLocaleString()}`
                                    : displayValue;
                            }
                            return displayValue;
                        default:
                            return displayValue;
                    }
                },
            }));

        // Add actions column if any actions are enabled
        if (actions.view || actions.edit || actions.delete || actions.extraActions) {
            columns.push({
                title: "Actions",
                dataIndex: "actions",
                key: "actions",
                fixed: "right",
                width: 150,
                sorter: undefined,
                render: (_: any, record: any) => (
                    <Space>
                        {actions.view && (
                            <Tooltip title="View Details">
                                <Button
                                    type="primary"
                                    icon={<EyeOutlined />}
                                    size="small"
                                    onClick={() => handleView(record)}
                                />
                            </Tooltip>
                        )}
                        {actions.edit && (
                            <Tooltip title="Edit Record">
                                <Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)} />
                            </Tooltip>
                        )}
                        {actions.delete && (
                            <Tooltip title="Delete Record">
                                <Popconfirm
                                    title={confirmTexts.delete}
                                    onConfirm={() => handleDelete(record)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button type="primary" danger icon={<DeleteOutlined />} size="small" />
                                </Popconfirm>
                            </Tooltip>
                        )}
                        {actions.extraActions && actions.extraActions(record)}
                    </Space>
                ),
            });
        }

        return columns;
    };

    // CRUD Handlers
    const handleAdd = () => {
        setEditingRecord(null);
        form.resetFields();
        setFileList({});

        // Set default values
        const defaultValues: Record<string, any> = {};
        fields.forEach(field => {
            if (field.defaultValue !== undefined) {
                defaultValues[field.key] = field.defaultValue;
            }
        });
        form.setFieldsValue(defaultValues);

        if (activeCrudType === "modal" || activeCrudType === "drawer") {
            setIsFormVisible(true);
        } else {
            setCurrentPage("form");
        }
    };

    const handleEdit = (record: any) => {
        setEditingRecord(record);

        // Prepare form values
        const formValues = { ...record };

        // Handle special field types
        fields.forEach(field => {
            if (field.type === "upload" && record[field.key]) {
                // Convert file data to UploadFile format if needed
                const files = Array.isArray(record[field.key])
                    ? record[field.key].map((file: any) => ({
                          uid: file.id || file.uid || `-${Math.random()}`,
                          name: file.name,
                          status: "done",
                          url: file.url,
                          ...file,
                      }))
                    : [];
                setFileList(prev => ({ ...prev, [field.key]: files }));
            }
        });

        form.setFieldsValue(formValues);

        if (activeCrudType === "modal" || activeCrudType === "drawer") {
            setIsFormVisible(true);
        } else {
            setCurrentPage("form");
        }
    };

    const handleView = (record: any) => {
        setViewingRecord(record);
        onRecordView?.(record);

        if (activeCrudType === "modal" || activeCrudType === "drawer") {
            setIsViewVisible(true);
        } else {
            setCurrentPage("view");
        }
    };

    const handleDelete = async (record: any) => {
        try {
            if (onRecordDelete) {
                await onRecordDelete(record);
            } else {
                setData(data.filter(item => item.id !== record.id));
            }
            message.success(successMessages.delete);
            onDataChange?.(data.filter(item => item.id !== record.id));
        } catch (error) {
            console.error("Delete error:", error);
            message.error("Failed to delete record");
        }
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();

            // Process values before saving
            const processedValues = { ...values };

            // Handle file uploads
            Object.entries(fileList).forEach(([key, files]) => {
                processedValues[key] = files;
            });

            if (editingRecord) {
                // Update record
                const updatedRecord = { ...editingRecord, ...processedValues };

                if (onRecordUpdate) {
                    await onRecordUpdate(updatedRecord);
                } else {
                    const newData = data.map(item => (item.id === editingRecord.id ? updatedRecord : item));
                    setData(newData);
                    onDataChange?.(newData);
                }

                message.success(successMessages.update);
            } else {
                // Create new record
                const newRecord = {
                    id: Date.now().toString(),
                    ...processedValues,
                };

                if (onRecordCreate) {
                    await onRecordCreate(newRecord);
                } else {
                    const newData = [...data, newRecord];
                    setData(newData);
                    onDataChange?.(newData);
                }

                message.success(successMessages.create);
            }

            handleCancel();
        } catch (error) {
            console.error("Form submission error:", error);
            message.error("Please check the form for errors");
        }
    };

    const handleCancel = () => {
        setIsFormVisible(false);
        setIsViewVisible(false);
        setCurrentPage("list");
        setEditingRecord(null);
        setViewingRecord(null);
        form.resetFields();
        setFileList({});
    };

    const handleFilter = (values: any) => {
        setFilters(values);
    };

    const handleClearFilters = () => {
        setFilters({});
        setSearchText("");
        filterForm.resetFields();
    };

    // Render filter form
    const renderFilterForm = () => {
        if (processedFilterFields.length === 0) return null;

        return (
            <Card size="small" style={{ marginBottom: 16 }}>
                <Form form={filterForm} layout="inline" onFinish={handleFilter}>
                    <Row gutter={[16, 16]} align="middle" style={{ width: "100%" }}>
                        <Col flex="300px">
                            <Input
                                placeholder="Search..."
                                prefix={<SearchOutlined />}
                                value={searchText}
                                onChange={e => setSearchText(e.target.value)}
                                allowClear
                            />
                        </Col>

                        {processedFilterFields.map(field => {
                            if (field.type === "select" || field.type === "multi_select") {
                                return (
                                    <Col key={field.key} flex="200px">
                                        <Form.Item name={field.key} style={{ marginBottom: 0 }}>
                                            <Select
                                                mode={field.type === "multi_select" ? "multiple" : undefined}
                                                placeholder={`Filter by ${field.label}`}
                                                style={{ width: "100%" }}
                                                allowClear
                                            >
                                                {(field.options || []).map((option: any) => {
                                                    const value = typeof option === "object" ? option.value : option;
                                                    const label = typeof option === "object" ? option.label : option;
                                                    return (
                                                        <Option key={value} value={value}>
                                                            {label}
                                                        </Option>
                                                    );
                                                })}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                );
                            }

                            if (field.type === "boolean" || field.type === "switch") {
                                return (
                                    <Col key={field.key} flex="180px">
                                        <Form.Item name={field.key} style={{ marginBottom: 0 }}>
                                            <Select placeholder={`Filter by ${field.label}`} allowClear>
                                                <Option value={true}>Yes</Option>
                                                <Option value={false}>No</Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                );
                            }

                            return null;
                        })}

                        <Col>
                            <Space>
                                <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                                    Search
                                </Button>
                                <Button onClick={handleClearFilters} icon={<FilterOutlined />}>
                                    Clear
                                </Button>
                            </Space>
                        </Col>
                    </Row>
                </Form>
            </Card>
        );
    };

    // Render form
    const renderForm = () => (
        <Form form={form} layout="vertical" {...formProps}>
            <Row gutter={16}>
                {fields
                    .filter(field => !field.hidden && !field.hideInForm)
                    .map(field => (
                        <Col
                            key={field.key}
                            xs={24}
                            sm={field.type === "textarea" || field.type === "input.text_area" ? 24 : 12}
                            md={field.type === "textarea" || field.type === "input.text_area" ? 24 : 12}
                            lg={field.type === "textarea" || field.type === "input.text_area" ? 24 : 8}
                        >
                            <Form.Item
                                name={field.key}
                                label={field.label}
                                rules={[
                                    ...(field.required
                                        ? [{ required: true, message: `Please input ${field.label}!` }]
                                        : []),
                                    ...(field.rules || []),
                                ]}
                            >
                                {renderFormField(field)}
                            </Form.Item>
                        </Col>
                    ))}
            </Row>
        </Form>
    );

    // Render detailed view
    const renderDetailView = () => {
        if (!viewingRecord) return null;

        return (
            <Row gutter={[16, 16]}>
                {fields
                    .filter(field => !field.hidden)
                    .map(field => (
                        <Col key={field.key} xs={24} sm={12} md={8}>
                            <Card size="small">
                                <Text type="secondary">{field.label}</Text>
                                <div style={{ marginTop: 8 }}>
                                    {field.render ? (
                                        field.render(viewingRecord[field.key], viewingRecord)
                                    ) : field.type === "boolean" || field.type === "switch" ? (
                                        <Tag color={viewingRecord[field.key] ? "green" : "red"}>
                                            {viewingRecord[field.key] ? "Yes" : "No"}
                                        </Tag>
                                    ) : field.type === "tags" && Array.isArray(viewingRecord[field.key]) ? (
                                        <div>
                                            {viewingRecord[field.key].map((tag: any) => (
                                                <Tag key={tag}>{tag}</Tag>
                                            ))}
                                        </div>
                                    ) : field.type === "rate" ? (
                                        <Rate disabled defaultValue={viewingRecord[field.key]} />
                                    ) : field.type === "progress" ? (
                                        <Progress percent={viewingRecord[field.key]} />
                                    ) : (
                                        <Text strong>{viewingRecord[field.key]}</Text>
                                    )}
                                </div>
                            </Card>
                        </Col>
                    ))}
            </Row>
        );
    };

    // Render statistics
    const renderStatistics = () => {
        if (!statistics) return null;

        const statItems = typeof statistics === "function" ? statistics(data) : statistics;

        return (
            <Row gutter={16} style={{ marginBottom: 16 }}>
                {statItems.map(stat => (
                    <Col xs={24} sm={12} md={8} lg={6} key={stat.key}>
                        <Card size="small">
                            <div style={{ textAlign: "center" }}>
                                {stat.icon && <div style={{ marginBottom: 8 }}>{stat.icon}</div>}
                                <Title level={3} style={{ color: stat.color || "#1890ff", margin: 0 }}>
                                    {stat.value}
                                </Title>
                                <Text type="secondary">{stat.label}</Text>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
        );
    };

    // Main content renderer
    const renderContent = () => {
        if (activeCrudType === "page" && currentPage === "form") {
            return (
                <div>
                    <Card
                        title={
                            <Space>
                                {icon}
                                <span>{`${editingRecord ? "Edit" : "Add"} ${title}`}</span>
                            </Space>
                        }
                        extra={<Button onClick={handleCancel}>Back to List</Button>}
                    >
                        {renderForm()}
                        <Divider />
                        <Space>
                            <Button type="primary" onClick={handleSave}>
                                {editingRecord ? confirmTexts.update : confirmTexts.create}
                            </Button>
                            <Button onClick={handleCancel}>Cancel</Button>
                        </Space>
                    </Card>
                </div>
            );
        }

        if (activeCrudType === "page" && currentPage === "view") {
            return (
                <div>
                    <Button onClick={handleCancel} style={{ marginBottom: 16 }}>
                        Back to List
                    </Button>
                    <Card
                        title={
                            <Space>
                                {icon}
                                <span>{`${title} Details`}</span>
                            </Space>
                        }
                    >
                        {renderDetailView()}
                    </Card>
                </div>
            );
        }

        // Default list view
        return (
            <div>
                <Card
                    title={
                        <Space>
                            {icon}
                            <span>{title}</span>
                        </Space>
                    }
                    extra={
                        showToggleCrudType && (
                            <Radio.Group
                                value={activeCrudType}
                                onChange={e => setActiveCrudType(e.target.value)}
                                buttonStyle="solid"
                                size="small"
                            >
                                <Radio.Button value="modal">Modal</Radio.Button>
                                <Radio.Button value="drawer">Drawer</Radio.Button>
                                <Radio.Button value="page">Page</Radio.Button>
                            </Radio.Group>
                        )
                    }
                >
                    {renderStatistics()}
                    {renderFilterForm()}

                    <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
                        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                            Add {title}
                        </Button>

                        {rowSelection && selectedRowKeys.length > 0 && batchActions && (
                            <div>{batchActions(selectedRowKeys, selectedRows)}</div>
                        )}
                    </div>

                    <Table
                        columns={generateColumns()}
                        dataSource={processedData}
                        rowKey="id"
                        rowSelection={
                            rowSelection
                                ? {
                                      selectedRowKeys,
                                      onChange: (keys, rows) => {
                                          setSelectedRowKeys(keys);
                                          setSelectedRows(rows);
                                      },
                                  }
                                : undefined
                        }
                        locale={{ emptyText }}
                        {...tableProps}
                    />
                </Card>
            </div>
        );
    };

    return (
        <div>
            {renderContent()}

            {/* Modal Form */}
            <Modal
                title={`${editingRecord ? "Edit" : "Add"} ${title}`}
                open={activeCrudType === "modal" && isFormVisible}
                onOk={handleSave}
                onCancel={handleCancel}
                width={800}
                destroyOnClose
            >
                {renderForm()}
            </Modal>

            {/* Drawer Form */}
            <Drawer
                title={`${editingRecord ? "Edit" : "Add"} ${title}`}
                open={activeCrudType === "drawer" && isFormVisible}
                onClose={handleCancel}
                width={600}
                extra={
                    <Space>
                        <Button onClick={handleCancel}>Cancel</Button>
                        <Button type="primary" onClick={handleSave}>
                            {editingRecord ? confirmTexts.update : confirmTexts.create}
                        </Button>
                    </Space>
                }
                destroyOnClose
            >
                {renderForm()}
            </Drawer>

            {/* View Modal */}
            <Modal
                title={`${title} Details`}
                open={activeCrudType === "modal" && isViewVisible}
                onCancel={() => setIsViewVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setIsViewVisible(false)}>
                        Close
                    </Button>,
                ]}
                width={800}
            >
                {renderDetailView()}
            </Modal>

            {/* View Drawer */}
            <Drawer
                title={`${title} Details`}
                open={activeCrudType === "drawer" && isViewVisible}
                onClose={() => setIsViewVisible(false)}
                width={600}
            >
                {renderDetailView()}
            </Drawer>
        </div>
    );
};

export default DynamicCrud;
