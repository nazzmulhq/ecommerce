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
    applyFilters,
    clearFilters,
    createRecord,
    deleteRecord,
    resetState,
    setActiveCrudType,
    setCurrentPage,
    setData,
    setEditingRecord,
    setFilters,
    setFormVisible,
    setSelectedRows,
    setViewVisible,
    setViewingRecord,
    updateRecord,
} from "@lib/redux/config/quickUISlice"; // Adjust import path as needed
import { AppDispatch, RootState } from "@lib/redux/store"; // Adjust import path as needed
import { TIconName } from "@src/types/iconName";
import {
    Button,
    Card,
    Col,
    Collapse,
    Drawer,
    Flex,
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
import { ReactNode, useCallback, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppForm from "../AppForm";
import { FormSchema } from "../AppForm/form.type";
import AppIcons from "../AppIcons";
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
export interface QuickUIProps {
    // Basic configuration
    title: string;
    formSchema: FormSchema;
    crudType?: CrudType;
    initialData?: any[];
    icon?: TIconName;

    // Action handlers
    onDataChange?: (data: any[]) => void;
    onRecordView?: (record: any) => void;
    onRecordCreate?: (record: any) => Promise<any> | void;
    onRecordUpdate?: (record: any) => Promise<any> | void;
    onRecordDelete?: (record: any) => Promise<any> | void;
    onFilter?: (data: any[], filter: Record<string, any>) => Promise<any[]> | void;

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
    showFilter?: boolean;
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

    // Redux store slice name (optional - defaults to 'quickUI')
    sliceName?: string;
}

const QuickUI = ({
    title,
    formSchema,
    crudType = "modal",
    initialData = [],
    icon,
    onFilter,
    showFilter = true,
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
    sliceName = "quickUI",
}: QuickUIProps) => {
    const dispatch = useDispatch<AppDispatch>();

    // Get state from Redux store
    const {
        data,
        editingRecord,
        viewingRecord,
        selectedRowKeys,
        selectedRows,
        isFormVisible,
        isViewVisible,
        currentPage,
        filters,
        loading,
        activeCrudType,
        error,
    } = useSelector((state: RootState) => state?.[sliceName] || state.quickUI);

    // Form instance
    const [form] = Form.useForm();
    const filterFormRef = useRef(form);

    // Initialize data when component mounts or initialData changes
    useEffect(() => {
        if (initialData.length > 0) {
            dispatch(setData(initialData));
        }

        // Set initial crud type
        if (crudType !== activeCrudType) {
            dispatch(setActiveCrudType(crudType));
        }

        // Cleanup on unmount
        return () => {
            dispatch(resetState());
        };
    }, [initialData, dispatch, crudType, activeCrudType]);

    // Handle data changes callback
    useEffect(() => {
        if (onDataChange) {
            onDataChange(data);
        }
    }, [data, onDataChange]);

    // Handle errors
    useEffect(() => {
        if (error) {
            message.error(error);
        }
    }, [error]);

    // Determine if we need a filter form
    const hasFilterFields = useMemo(() => {
        if (filterFields.length > 0) return true;

        const fieldsFromSchema: any[] = [
            ...(formSchema.fields || []),
            ...(formSchema.sections?.flatMap(s => s.fields) || []),
            ...(formSchema.tabs?.flatMap(t => t.fields) || []),
            ...(formSchema.steps?.flatMap(s => s.fields) || []),
        ];

        return fieldsFromSchema.some(field => field?.filterable);
    }, [formSchema, filterFields]);

    // Process filter fields
    const processedFilterFields = useMemo(() => {
        if (filterFields.length > 0) return filterFields;

        const fieldsFromSchema: any[] = [
            ...(formSchema.fields || []),
            ...(formSchema.sections?.flatMap(s => s.fields) || []),
            ...(formSchema.tabs?.flatMap(t => t.fields) || []),
            ...(formSchema.steps?.flatMap(s => s.fields) || []),
        ];

        return fieldsFromSchema
            .filter(field => field?.filterable)
            .map(field => ({
                name: field.name,
                label: field.label,
                type: field.type,
                options: field.options,
                key: field.name,
            }))
            .slice(0, 4);
    }, [formSchema, filterFields]);

    // Generate filter schema from form schema
    const filterFormSchema = useMemo((): FormSchema => {
        const filterFields = processedFilterFields.map(field => {
            let filterField: any = {
                name: field.name || field.key,
                label: field.label,
                type: field.type === "boolean" || field.type === "switch" ? "select" : field.type,
                options: field.options,
                grid: { xs: 24, sm: 12 },
            };

            if (field.type === "boolean" || field.type === "switch") {
                filterField.options = [
                    { value: true, label: "Yes" },
                    { value: false, label: "No" },
                ];
            }

            return filterField;
        });

        return {
            layout: "vertical",
            fields: [...filterFields],
        };
    }, [processedFilterFields]);

    // Filter handling
    const handleFilterSubmit = useCallback(
        async (values: any) => {
            const newFilters: Record<string, any> = {};
            Object.entries(values).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== "") {
                    newFilters[key] = value;
                }
            });

            dispatch(setFilters(newFilters));
            dispatch(
                applyFilters({
                    filters: newFilters,
                    initialData,
                    onFilter,
                }),
            );
        },
        [dispatch, initialData, onFilter],
    );

    // Generate table columns
    const generatedColumns = useMemo<ColumnType<any>[]>(() => {
        if (tableColumns) return tableColumns;

        const fieldsFromSchema: any[] = [
            ...(formSchema.fields || []),
            ...(formSchema.sections?.flatMap(s => s.fields) || []),
            ...(formSchema.tabs?.flatMap(t => t.fields) || []),
            ...(formSchema.steps?.flatMap(s => s.fields) || []),
        ];

        const columns: any = fieldsFromSchema
            .filter(field => !field.hideInTable)
            .map(field => ({
                title: field.label,
                dataIndex: field.name,
                key: field.name,
                sorter: field.sortable ? true : false,
                render: (value: any, record: any) => {
                    if (field.render) {
                        return field.render(value, record);
                    }

                    switch (field.type) {
                        case "switch":
                        case "boolean":
                            return <Tag color={value ? "green" : "red"}>{value ? "Yes" : "No"}</Tag>;
                        case "select":
                            const option = field.options?.find((opt: any) =>
                                typeof opt === "object" ? opt.value === value : opt === value,
                            );
                            return typeof option === "object" ? option?.label : option;
                        default:
                            return value;
                    }
                },
            }));

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

    // CRUD Handlers
    const handleAdd = () => {
        dispatch(setEditingRecord(null));
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
            dispatch(setFormVisible(true));
        } else {
            dispatch(setCurrentPage("form"));
        }
    };

    const handleEdit = (record: any) => {
        dispatch(setEditingRecord(record));
        form.setFieldsValue(record);

        if (activeCrudType === "modal" || activeCrudType === "drawer") {
            dispatch(setFormVisible(true));
        } else {
            dispatch(setCurrentPage("form"));
        }
    };

    const handleView = (record: any) => {
        dispatch(setViewingRecord(record));
        onRecordView?.(record);

        if (activeCrudType === "modal" || activeCrudType === "drawer") {
            dispatch(setViewVisible(true));
        } else {
            dispatch(setCurrentPage("view"));
        }
    };

    const handleDelete = async (record: any) => {
        try {
            await dispatch(deleteRecord({ record, onRecordDelete })).unwrap();
            message.success(successMessages.delete);
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    const handleFormSubmit = useCallback(
        async (values: any) => {
            try {
                let processedValues = values;
                if (beforeFormSubmit) {
                    processedValues = await beforeFormSubmit(values);
                }

                if (editingRecord) {
                    const updatedRecord = { ...editingRecord, ...processedValues };
                    const result = await dispatch(
                        updateRecord({
                            record: updatedRecord,
                            onRecordUpdate,
                        }),
                    ).unwrap();

                    afterFormSubmit?.(processedValues, result);
                    message.success(successMessages.update);
                } else {
                    const newRecord = {
                        id: Date.now().toString(),
                        ...processedValues,
                    };

                    const result = await dispatch(
                        createRecord({
                            record: newRecord,
                            onRecordCreate,
                        }),
                    ).unwrap();

                    afterFormSubmit?.(processedValues, result);
                    message.success(successMessages.create);
                }

                handleCancel();
            } catch (error) {
                console.error("Form submission error:", error);
            }
        },
        [
            editingRecord,
            beforeFormSubmit,
            onRecordUpdate,
            onRecordCreate,
            afterFormSubmit,
            successMessages.update,
            successMessages.create,
            dispatch,
        ],
    );

    const handleCancel = () => {
        dispatch(setFormVisible(false));
        dispatch(setViewVisible(false));
        dispatch(setCurrentPage("list"));
        dispatch(setEditingRecord(null));
        dispatch(setViewingRecord(null));

        if (!preserveFormData) {
            form.resetFields();
        }
    };

    const handleClearFilters = useCallback(async () => {
        dispatch(clearFilters());

        if (filterFormRef.current) {
            filterFormRef.current.resetFields();
        }

        dispatch(
            applyFilters({
                filters: {},
                initialData,
                onFilter,
            }),
        );
    }, [dispatch, initialData, onFilter]);

    const handleRowSelection = (keys: any[], rows: any[]) => {
        dispatch(setSelectedRows({ keys, rows }));
    };

    const handleCrudTypeChange = (type: CrudType) => {
        dispatch(setActiveCrudType(type));
    };

    // Render filter form
    const renderFilterForm = () => {
        if (!showFilter || !hasFilterFields || processedFilterFields.length === 0) return null;

        const activeFilterCount = Object.keys(filters).length;

        return (
            <Collapse
                defaultActiveKey={activeFilterCount > 0 ? ["1"] : []}
                style={{ marginBottom: 16 }}
                items={[
                    {
                        key: "1",
                        label: (
                            <Flex align="center">
                                <FilterOutlined style={{ marginRight: 8 }} />
                                <span>Filter {title}</span>
                                {activeFilterCount > 0 && (
                                    <Tag color="blue" style={{ marginLeft: 8 }}>
                                        {activeFilterCount} active filter{activeFilterCount > 1 ? "s" : ""}
                                    </Tag>
                                )}
                            </Flex>
                        ),
                        children: (
                            <AppForm
                                key={`filter-form-${JSON.stringify(filters)}`}
                                schema={filterFormSchema}
                                onFinish={handleFilterSubmit}
                                initialValues={{ ...filters }}
                                onFormReady={form => {
                                    filterFormRef.current = form;
                                }}
                                renderFooter={form => (
                                    <Flex justify="end" style={{ marginTop: 8 }}>
                                        <Space>
                                            <Button
                                                type="primary"
                                                onClick={() => form.submit()}
                                                icon={<SearchOutlined />}
                                                loading={loading}
                                            >
                                                Apply Filters
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    if (filterFormRef.current) {
                                                        filterFormRef.current.resetFields();
                                                    }
                                                    handleClearFilters();
                                                }}
                                                icon={<FilterOutlined />}
                                                disabled={loading || activeFilterCount === 0}
                                            >
                                                Clear Filters
                                            </Button>
                                        </Space>
                                    </Flex>
                                )}
                            />
                        ),
                    },
                ]}
            />
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
                            <Flex justify="end">
                                <Space size="small">
                                    {icon ? <AppIcons name={icon} /> : null}
                                    <span>{`${editingRecord ? "Edit" : "Add"} ${title}`}</span>
                                </Space>
                            </Flex>
                        }
                        extra={<Button onClick={handleCancel}>Back to List</Button>}
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
                                <Flex justify="end" style={{ marginTop: 8 }}>
                                    <Space>
                                        <Button type="primary" onClick={() => form.submit()} loading={loading}>
                                            {editingRecord ? confirmTexts.update : confirmTexts.create}
                                        </Button>
                                        <Button onClick={handleCancel}>Cancel</Button>
                                        {renderExtraFormActions && renderExtraFormActions(form, editingRecord)}
                                    </Space>
                                </Flex>
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
                                    dispatch(setEditingRecord(viewingRecord));
                                    dispatch(setCurrentPage("form"));
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
                        {icon ? <AppIcons name={icon} /> : null}
                        <span>{title}</span>
                    </Space>
                }
                extra={
                    showToggleCrudType && (
                        <Radio.Group
                            value={activeCrudType}
                            onChange={e => handleCrudTypeChange(e.target.value)}
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
                    dataSource={data}
                    rowKey="id"
                    rowSelection={
                        rowSelection
                            ? {
                                  selectedRowKeys,
                                  onChange: handleRowSelection,
                              }
                            : undefined
                    }
                    locale={{ emptyText }}
                    loading={loading}
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
                destroyOnClose
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
                        <Flex justify="end" style={{ marginTop: 8 }}>
                            <Space>
                                <Button type="primary" onClick={() => form.submit()} loading={loading}>
                                    {editingRecord ? confirmTexts.update : confirmTexts.create}
                                </Button>
                                <Button onClick={handleCancel}>Cancel</Button>
                                {renderExtraFormActions && renderExtraFormActions(form, editingRecord)}
                            </Space>
                        </Flex>
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
                destroyOnClose
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
                        <Flex style={{ marginTop: 8 }}>
                            <Space>
                                <Button type="primary" onClick={() => form.submit()} loading={loading}>
                                    {editingRecord ? confirmTexts.update : confirmTexts.create}
                                </Button>
                                <Button onClick={handleCancel}>Cancel</Button>
                                {renderExtraFormActions && renderExtraFormActions(form, editingRecord)}
                            </Space>
                        </Flex>
                    )}
                    {...formProps}
                />
            </Drawer>

            {/* View Modal */}
            <Modal
                title={`${title} Details`}
                open={activeCrudType === "modal" && isViewVisible}
                onCancel={() => dispatch(setViewVisible(false))}
                footer={[
                    actions.edit && (
                        <Button
                            key="edit"
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => {
                                dispatch(setViewVisible(false));
                                dispatch(setEditingRecord(viewingRecord));
                                dispatch(setFormVisible(true));
                            }}
                        >
                            Edit
                        </Button>
                    ),
                    <Button key="close" onClick={() => dispatch(setViewVisible(false))}>
                        Close
                    </Button>,
                ].filter(Boolean)}
                width={800}
                destroyOnClose
            >
                {renderDetailView()}
            </Modal>

            {/* View Drawer */}
            <Drawer
                title={`${title} Details`}
                open={activeCrudType === "drawer" && isViewVisible}
                onClose={() => dispatch(setViewVisible(false))}
                width={600}
                destroyOnClose
                extra={
                    actions.edit ? (
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => {
                                dispatch(setViewVisible(false));
                                dispatch(setEditingRecord(viewingRecord));
                                dispatch(setFormVisible(true));
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

export default QuickUI;
