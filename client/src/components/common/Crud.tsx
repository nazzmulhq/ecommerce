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
    Col,
    Drawer,
    Form,
    Modal,
    Popconfirm,
    Radio,
    Row,
    Space,
    Table,
    Tag,
    Tooltip,
    Typography,
    message,
} from "antd";
import { ColumnType } from "antd/lib/table";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import AppForm from "./AppForm";
import { FormSchema } from "./AppForm/form.type";

const { Title, Text } = Typography;

// Statistics item type
export type StatItem = {
    key: string;
    label: string;
    value: number | string;
    color?: string;
    icon?: ReactNode;
};

// CRUD UI type
export type CrudType = "modal" | "drawer" | "page";

// CRUD props combining AppForm and DynamicCrud capabilities
export interface CrudProps {
    // Basic configuration
    title: string;
    formSchema: FormSchema;
    crudType?: CrudType;
    initialData?: any[];
    icon?: ReactNode;

    // Action handlers
    onDataChange?: (data: any[]) => void;
    onRecordView?: (record: any) => void;
    onRecordCreate?: (record: any) => Promise<any> | void;
    onRecordUpdate?: (record: any) => Promise<any> | void;
    onRecordDelete?: (record: any) => Promise<any> | void;

    // UI customization
    tableColumns?: any[];
    tableProps?: any;
    formProps?: any;
    actions?: {
        view?: boolean;
        edit?: boolean;
        delete?: boolean;
        extraActions?: (record: any) => ReactNode[];
    };

    // Filtering and searching
    searchFields?: string[];
    filterFields?: any[];

    // Messages and confirmations
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

    // Additional features
    statistics?: StatItem[] | ((data: any[]) => StatItem[]);
    rowSelection?: boolean;
    batchActions?: (selectedRowKeys: any[], selectedRows: any[]) => ReactNode;
    emptyText?: string;
    showToggleCrudType?: boolean;

    // Advanced form configuration
    validateOnMount?: boolean;
    preserveFormData?: boolean;
    beforeFormSubmit?: (values: any) => any | Promise<any>;
    afterFormSubmit?: (values: any, result: any) => void;
    renderExtraFormActions?: (form: any, editingRecord: any | null) => ReactNode;
}

const Crud = ({
    title,
    formSchema,
    crudType = "modal",
    initialData = [],
    icon,
    onDataChange,
    onRecordView,
    onRecordCreate,
    onRecordUpdate,
    onRecordDelete,
    tableColumns,
    tableProps = {},
    formProps = {},
    actions = { view: true, edit: true, delete: true },
    searchFields = [],
    filterFields = [],
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
    statistics,
    rowSelection = false,
    batchActions,
    emptyText = "No data found",
    showToggleCrudType = false,
    validateOnMount = false,
    preserveFormData = false,
    beforeFormSubmit,
    afterFormSubmit,
    renderExtraFormActions,
}: CrudProps) => {
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
    const [loading, setLoading] = useState<boolean>(false);
    const [activeCrudType, setActiveCrudType] = useState<CrudType>(crudType);

    // Only create form instances when they will be used
    const [form] = Form.useForm();

    // Update internal data when initialData changes
    useEffect(() => {
        setData(initialData);
    }, [initialData]);

    // Determine if we need a filter form
    const hasFilterFields = useMemo(() => {
        if (filterFields.length > 0) return true;

        const fieldsFromSchema: any[] = [
            ...(formSchema.fields || []),
            ...(formSchema.sections?.flatMap(s => s.fields) || []),
            ...(formSchema.tabs?.flatMap(t => t.fields) || []),
            ...(formSchema.steps?.flatMap(s => s.fields) || []),
        ];

        return fieldsFromSchema.some(
            field => field.filterable || field.type === "select" || field.type === "switch" || field.type === "boolean",
        );
    }, [formSchema, filterFields]);

    // Process filter fields - enhanced to extract more information from formSchema
    const processedFilterFields = useMemo(() => {
        if (filterFields.length > 0) return filterFields;

        // Extract from formSchema if not provided
        const fieldsFromSchema: any[] = [
            ...(formSchema.fields || []),
            ...(formSchema.sections?.flatMap(s => s.fields) || []),
            ...(formSchema.tabs?.flatMap(t => t.fields) || []),
            ...(formSchema.steps?.flatMap(s => s.fields) || []),
        ];

        // Map to the correct format for filtering
        return fieldsFromSchema
            .filter(
                field =>
                    field.filterable || field.type === "select" || field.type === "switch" || field.type === "boolean",
            )
            .map(field => ({
                name: field.name,
                label: field.label,
                type: field.type,
                options: field.options,
                key: field.name, // For compatibility
            }))
            .slice(0, 4); // Limit to 4 fields for filter UI
    }, [formSchema, filterFields]);

    // Generate search fields if not provided
    const processedSearchFields = useMemo(() => {
        if (searchFields.length > 0) return searchFields;

        // Extract from formSchema if not provided
        const fieldsFromSchema: any[] = [
            ...(formSchema.fields || []),
            ...(formSchema.sections?.flatMap(s => s.fields) || []),
            ...(formSchema.tabs?.flatMap(t => t.fields) || []),
            ...(formSchema.steps?.flatMap(s => s.fields) || []),
        ];

        return fieldsFromSchema
            .filter(field => field.searchable || field.type === "input" || field.type === "input.search")
            .map(field => field.name);
    }, [formSchema, searchFields]);

    // Generate filter schema from form schema
    const filterFormSchema = useMemo((): FormSchema => {
        const filterFields = processedFilterFields.map(field => {
            // Convert the field to AppForm field format
            let filterField: any = {
                name: field.name || field.key,
                label: field.label,
                type: field.type === "boolean" || field.type === "switch" ? "select" : field.type,
                options: field.options,
                grid: { xs: 24, sm: 12 },
            };

            // For boolean/switch fields, provide yes/no options
            if (field.type === "boolean" || field.type === "switch") {
                filterField.options = [
                    { value: true, label: "Yes" },
                    { value: false, label: "No" },
                ];
            }

            return filterField;
        });

        // Add a search field at the beginning
        const searchField = {
            name: "_search",
            label: "Search",
            type: "input.search",
            placeholder: "Search...",
            grid: { xs: 24, sm: 24 },
        };

        return {
            layout: "vertical",
            fields: [searchField, ...filterFields],
        };
    }, [processedFilterFields]);

    // Handle filter form submission
    const handleFilterSubmit = useCallback((values: any) => {
        // Extract search text
        const searchValue = values._search;
        if (searchValue !== undefined) {
            setSearchText(searchValue);
            delete values._search; // Remove from filter values
        }

        // Apply remaining filters
        const newFilters = { ...values };

        // Remove empty filters
        Object.keys(newFilters).forEach(key => {
            if (
                newFilters[key] === undefined ||
                newFilters[key] === null ||
                newFilters[key] === "" ||
                (Array.isArray(newFilters[key]) && newFilters[key].length === 0)
            ) {
                delete newFilters[key];
            }
        });

        setFilters(newFilters);
    }, []);

    const generatedColumns = useMemo<ColumnType<any>[]>(() => {
        if (tableColumns) return tableColumns;

        // Extract fields from formSchema
        const fieldsFromSchema: any[] = [
            ...(formSchema.fields || []),
            ...(formSchema.sections?.flatMap(s => s.fields) || []),
            ...(formSchema.tabs?.flatMap(t => t.fields) || []),
            ...(formSchema.steps?.flatMap(s => s.fields) || []),
        ];

        // Generate basic columns from fields
        const columns: any = fieldsFromSchema
            .filter(field => !field.hidden && !field.hideInTable)
            .map(field => ({
                title: field.label,
                dataIndex: field.name,
                key: field.name,
                sorter: field.sortable ? true : false,
                render: (value: any, record: any) => {
                    if (field.render) {
                        return field.render(value, record);
                    }

                    // Handle different field types
                    switch (field.type) {
                        case "switch":
                        case "boolean":
                            return <Tag color={value ? "green" : "red"}>{value ? "Yes" : "No"}</Tag>;
                        case "select":
                            // Find label for select option
                            const option = field.options?.find((opt: any) =>
                                typeof opt === "object" ? opt.value === value : opt === value,
                            );
                            return typeof option === "object" ? option?.label : option;
                        default:
                            return value;
                    }
                },
            }));

        // Add actions column if any actions are enabled
        if (actions.view || actions.edit || actions.delete || actions.extraActions) {
            columns.push({
                title: "Actions",
                key: "actions",
                fixed: "right",
                width: 150,
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
    }, [formSchema, tableColumns, actions, confirmTexts.delete]);

    // Filtered and sorted data
    const processedData = useMemo(() => {
        let result = [...data];

        // Apply search
        if (searchText.trim()) {
            const searchLower = searchText.toLowerCase();
            result = result.filter(record => {
                return processedSearchFields.some(field => {
                    const value = record[field];
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
    }, [data, searchText, filters, processedSearchFields]);

    // CRUD Handlers
    const handleAdd = () => {
        setEditingRecord(null);
        form.resetFields();

        // Set default values from schema
        const defaultValues: Record<string, any> = {};
        const allFields: any[] = [
            ...(formSchema.fields || []),
            ...(formSchema.sections?.flatMap(s => s.fields) || []),
            ...(formSchema.tabs?.flatMap(t => t.fields) || []),
            ...(formSchema.steps?.flatMap(s => s.fields) || []),
        ];

        allFields.forEach(field => {
            if (field.defaultValue !== undefined) {
                defaultValues[field.name] = field.defaultValue;
            }
        });

        if (Object.keys(defaultValues).length > 0) {
            form.setFieldsValue(defaultValues);
        }

        if (activeCrudType === "modal" || activeCrudType === "drawer") {
            setIsFormVisible(true);
        } else {
            setCurrentPage("form");
        }
    };

    const handleEdit = (record: any) => {
        setEditingRecord(record);
        form.setFieldsValue(record);

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
            setLoading(true);

            if (onRecordDelete) {
                await onRecordDelete(record);
            } else {
                const newData = data.filter(item => item.id !== record.id);
                setData(newData);
                onDataChange?.(newData);
            }

            message.success(successMessages.delete);
        } catch (error) {
            console.error("Delete error:", error);
            message.error("Failed to delete record");
        } finally {
            setLoading(false);
        }
    };

    // Ensure we have proper memoization of callbacks
    const handleFormSubmit = useCallback(
        async (values: any) => {
            try {
                setLoading(true);

                // Process values before submission if needed
                let processedValues = values;
                if (beforeFormSubmit) {
                    processedValues = await beforeFormSubmit(values);
                }

                if (editingRecord) {
                    // Update record
                    const updatedRecord = { ...editingRecord, ...processedValues };

                    if (onRecordUpdate) {
                        const result = await onRecordUpdate(updatedRecord);
                        afterFormSubmit?.(processedValues, result);
                    } else {
                        const newData = data.map(item => (item.id === editingRecord.id ? updatedRecord : item));
                        setData(newData);
                        onDataChange?.(newData);
                        afterFormSubmit?.(processedValues, updatedRecord);
                    }

                    message.success(successMessages.update);
                } else {
                    // Create new record
                    const newRecord = {
                        id: Date.now().toString(),
                        ...processedValues,
                    };

                    if (onRecordCreate) {
                        const result = await onRecordCreate(newRecord);
                        afterFormSubmit?.(processedValues, result);
                    } else {
                        const newData = [...data, newRecord];
                        setData(newData);
                        onDataChange?.(newData);
                        afterFormSubmit?.(processedValues, newRecord);
                    }

                    message.success(successMessages.create);
                }

                handleCancel();
            } catch (error) {
                console.error("Form submission error:", error);
                message.error("Please check the form for errors");
            } finally {
                setLoading(false);
            }
        },
        [
            editingRecord,
            data,
            beforeFormSubmit,
            onRecordUpdate,
            onRecordCreate,
            onDataChange,
            afterFormSubmit,
            successMessages.update,
            successMessages.create,
        ],
    );

    const handleCancel = () => {
        setIsFormVisible(false);
        setIsViewVisible(false);
        setCurrentPage("list");
        setEditingRecord(null);
        setViewingRecord(null);
        if (!preserveFormData) {
            form.resetFields();
        }
    };

    const handleClearFilters = () => {
        setFilters({});
        setSearchText("");
        // filterForm.resetFields(); // No need to reset filterForm as we're using AppForm directly
    };

    // Render filter form using AppForm
    const renderFilterForm = () => {
        if (!hasFilterFields || processedFilterFields.length === 0) return null;

        return (
            <Card size="small" style={{ marginBottom: 16 }}>
                <AppForm
                    schema={filterFormSchema}
                    onFinish={handleFilterSubmit}
                    initialValues={{ _search: searchText, ...filters }}
                    renderFooter={form => (
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            <Space>
                                <Button type="primary" onClick={() => form.submit()} icon={<SearchOutlined />}>
                                    Apply Filters
                                </Button>
                                <Button
                                    onClick={() => {
                                        form.resetFields();
                                        handleClearFilters();
                                    }}
                                    icon={<FilterOutlined />}
                                >
                                    Clear
                                </Button>
                            </Space>
                        </div>
                    )}
                />
            </Card>
        );
    };

    // Render detailed view
    const renderDetailView = () => {
        if (!viewingRecord) return null;

        const fieldsFromSchema: any[] = [
            ...(formSchema.fields || []),
            ...(formSchema.sections?.flatMap(s => s.fields) || []),
            ...(formSchema.tabs?.flatMap(t => t.fields) || []),
            ...(formSchema.steps?.flatMap(s => s.fields) || []),
        ];

        return (
            <Card>
                <Row gutter={[16, 16]}>
                    {fieldsFromSchema.map(field => (
                        <Col key={field.name} xs={24} sm={12}>
                            <Card size="small" title={field.label}>
                                {field.render ? (
                                    field.render(viewingRecord[field.name], viewingRecord)
                                ) : field.type === "switch" || field.type === "boolean" ? (
                                    <Tag color={viewingRecord[field.name] ? "green" : "red"}>
                                        {viewingRecord[field.name] ? "Yes" : "No"}
                                    </Tag>
                                ) : (
                                    <div>{viewingRecord[field.name]}</div>
                                )}
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Card>
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
                        <AppForm
                            key={`form-${editingRecord?.id || "new"}`} // Add this key to force re-render on record change
                            schema={formSchema}
                            initialValues={editingRecord}
                            onFinish={handleFormSubmit} // Changed from handleFormFinish to handleFormSubmit
                            loading={loading}
                            validateOnMount={validateOnMount}
                            preserveFormData={preserveFormData}
                            renderFooter={(form, loading) => (
                                <div>
                                    <Space>
                                        <Button type="primary" onClick={() => form.submit()} loading={loading}>
                                            {editingRecord ? confirmTexts.update : confirmTexts.create}
                                        </Button>
                                        <Button onClick={handleCancel}>Cancel</Button>
                                        {renderExtraFormActions && renderExtraFormActions(form, editingRecord)}
                                    </Space>
                                </div>
                            )}
                            {...formProps}
                        />
                    </Card>
                </div>
            );
        }

        if (activeCrudType === "page" && currentPage === "view") {
            return (
                <div>
                    <Space style={{ marginBottom: 16 }}>
                        <Button onClick={handleCancel}>Back to List</Button>
                        {actions.edit && (
                            <Button
                                type="primary"
                                icon={<EditOutlined />}
                                onClick={() => {
                                    setEditingRecord(viewingRecord);
                                    setCurrentPage("form");
                                }}
                            >
                                Edit
                            </Button>
                        )}
                    </Space>

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
                    columns={generatedColumns}
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
        );
    };

    return (
        <div>
            {renderContent()}

            {/* Modal Form */}
            <Modal
                title={`${editingRecord ? "Edit" : "Add"} ${title}`}
                open={activeCrudType === "modal" && isFormVisible}
                onCancel={handleCancel}
                width={800}
                footer={null}
                destroyOnHidden
            >
                <AppForm
                    key={`form-${editingRecord?.id || "new"}`}
                    schema={formSchema}
                    initialValues={editingRecord}
                    onFinish={handleFormSubmit}
                    loading={loading}
                    validateOnMount={validateOnMount}
                    preserveFormData={preserveFormData}
                    renderFooter={(form, loading) => (
                        <div>
                            <Space>
                                <Button type="primary" onClick={() => form.submit()} loading={loading}>
                                    {editingRecord ? confirmTexts.update : confirmTexts.create}
                                </Button>
                                <Button onClick={handleCancel}>Cancel</Button>
                                {renderExtraFormActions && renderExtraFormActions(form, editingRecord)}
                            </Space>
                        </div>
                    )}
                    {...formProps}
                />
            </Modal>

            {/* Drawer Form */}
            <Drawer
                title={`${editingRecord ? "Edit" : "Add"} ${title}`}
                open={activeCrudType === "drawer" && isFormVisible}
                onClose={handleCancel}
                width={600}
                destroyOnHidden
            >
                <AppForm
                    key={`form-${editingRecord?.id || "new"}`}
                    schema={formSchema}
                    initialValues={editingRecord}
                    onFinish={handleFormSubmit}
                    loading={loading}
                    validateOnMount={validateOnMount}
                    preserveFormData={preserveFormData}
                    renderFooter={(form, loading) => (
                        <div>
                            <Space>
                                <Button type="primary" onClick={() => form.submit()} loading={loading}>
                                    {editingRecord ? confirmTexts.update : confirmTexts.create}
                                </Button>
                                <Button onClick={handleCancel}>Cancel</Button>
                                {renderExtraFormActions && renderExtraFormActions(form, editingRecord)}
                            </Space>
                        </div>
                    )}
                    {...formProps}
                />
            </Drawer>

            {/* View Modal */}
            <Modal
                title={`${title} Details`}
                open={activeCrudType === "modal" && isViewVisible}
                onCancel={() => setIsViewVisible(false)}
                footer={[
                    actions.edit && (
                        <Button
                            key="edit"
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => {
                                setIsViewVisible(false);
                                setEditingRecord(viewingRecord);
                                setIsFormVisible(true);
                            }}
                        >
                            Edit
                        </Button>
                    ),
                    <Button key="close" onClick={() => setIsViewVisible(false)}>
                        Close
                    </Button>,
                ].filter(Boolean)}
                width={800}
                destroyOnHidden
            >
                {renderDetailView()}
            </Modal>

            {/* View Drawer */}
            <Drawer
                title={`${title} Details`}
                open={activeCrudType === "drawer" && isViewVisible}
                onClose={() => setIsViewVisible(false)}
                width={600}
                destroyOnHidden
                extra={
                    actions.edit ? (
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => {
                                setIsViewVisible(false);
                                setEditingRecord(viewingRecord);
                                setIsFormVisible(true);
                            }}
                        >
                            Edit
                        </Button>
                    ) : undefined
                }
            >
                {renderDetailView()}
            </Drawer>
        </div>
    );
};

export default Crud;
