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
    resetState,
    setActiveCrudType,
    setApiData,
    setCurrentPage,
    setData,
    setEditingRecord,
    setError,
    setFilters,
    setFormVisible,
    setLoading,
    setMetadata,
    setSelectedRows,
    setViewVisible,
    setViewingRecord,
} from "@lib/redux/config/quickUISlice"; // Adjust import path as needed
import { AppDispatch, RootState } from "@lib/redux/store"; // Adjust import path as needed
import {
    App,
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
} from "antd";
import { TableRowSelection } from "antd/es/table/interface";
import { ColumnType } from "antd/lib/table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppForm from "../AppForm";
import { FormSchema } from "../AppForm/form.type";
import AppIcons from "../AppIcons";
import QuickUILoadingSkeleton from "./QuickUILoadingSkeleton";
import { CrudType, LoadingStates, Permission, QuickUIProps } from "./types";
const { Title, Text } = Typography;

const QuickUI = ({
    title,
    formSchema,
    crudType = "modal",
    icon,
    showFilter = true,
    onRecordFilter,
    onDataChange,
    onRecordView,
    onRecordCreate,
    onRecordUpdate,
    onRecordDelete,
    tableColumns,
    tableProps = {},
    formProps = {},
    actions = { view: true, edit: true, delete: true },
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
    showToggleCrudType = false,
    validateOnMount = false,
    preserveFormData = false,
    beforeFormSubmit,
    afterFormSubmit,
    renderExtraFormActions,
    permissions = {},
    checkPermission,
    routeConfig,
    currentAction = "list",
    currentRecordId,
    onNavigate,
}: QuickUIProps) => {
    // Component-level loading states
    const [loadingStates, setLoadingStates] = useState<LoadingStates>({
        initialLoad: true,
        dataLoad: true,
        componentReady: false,
        stylesReady: false,
    });
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

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
    } = useSelector((state: RootState) => state.quickUI);

    // Extract list and metadata from the nested structure
    const dataList = data.list;
    const metadata = data.meta;

    // Form instance
    const { message } = App.useApp();

    // Form instance
    const [form] = Form.useForm();
    const filterFormRef = useRef(form);

    // Get filters and pagination from searchParams - single source of truth
    const getParamsFromUrl = useCallback(() => {
        const urlFilters: Record<string, any> = {};
        const pageParam = searchParams.get("page");
        const pageSizeParam = searchParams.get("pageSize") || searchParams.get("limit");

        // Extract filter parameters from URL
        Array.from(searchParams.entries()).forEach(([key, value]) => {
            if (!["page", "pageSize", "limit"].includes(key) && value) {
                try {
                    urlFilters[key] = JSON.parse(decodeURIComponent(value));
                } catch {
                    urlFilters[key] = decodeURIComponent(value);
                }
            }
        });

        const urlMetadata = {
            totalItems: 0,
            itemCount: 0,
            itemsPerPage: pageSizeParam ? parseInt(pageSizeParam) : 5,
            totalPages: 0,
            currentPage: pageParam ? parseInt(pageParam) : 1,
            hasNextPage: false,
            hasPreviousPage: false,
        };

        return { urlFilters, urlMetadata };
    }, [searchParams]);

    // Always update URL and sync Redux (never read from Redux, only write to it)
    const updateURL = useCallback(
        (newFilters: Record<string, any>, newMetadata: any) => {
            const params = new URLSearchParams();

            // Add filter params
            Object.entries(newFilters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== "") {
                    const encodedValue =
                        typeof value === "object"
                            ? encodeURIComponent(JSON.stringify(value))
                            : encodeURIComponent(String(value));
                    params.set(key, encodedValue);
                }
            });

            // Always add pagination params for persistence
            params.set("page", newMetadata.currentPage.toString());
            params.set("pageSize", newMetadata.itemsPerPage.toString());

            const newUrl = `${pathname}?${params.toString()}`;
            const currentUrl = `${pathname}?${searchParams.toString()}`;

            if (newUrl !== currentUrl) {
                router.replace(newUrl, { scroll: false });
            }

            // Sync Redux state with URL params (write only)
            dispatch(setFilters(newFilters));
            dispatch(setMetadata(newMetadata));
        },
        [pathname, router, searchParams, dispatch],
    );

    // Single useEffect that triggers API call only when searchParams change
    useEffect(() => {
        if (!loadingStates.componentReady) return;

        let isMounted = true;

        const loadDataFromParams = async () => {
            const { urlFilters, urlMetadata } = getParamsFromUrl();
            const pageParam = searchParams.get("page");
            const pageSizeParam = searchParams.get("pageSize");

            // First time visit - set default params if not present
            if (!pageParam || !pageSizeParam) {
                // Set initial values in URL and Redux
                updateURL(urlFilters, urlMetadata);
                return; // Don't load data yet, let the URL update trigger the effect
            }

            // Validate page and pageSize are numbers
            if (isNaN(Number(pageParam)) || isNaN(Number(pageSizeParam))) {
                updateURL({}, { currentPage: 1, itemsPerPage: 5 });
                return;
            }

            // Always sync Redux with URL params (never use Redux values for API calls)
            dispatch(setFilters(urlFilters));
            dispatch(setMetadata(urlMetadata));

            // Set filter form values from URL params
            if (filterFormRef.current && Object.keys(urlFilters).length > 0) {
                filterFormRef.current.setFieldsValue(urlFilters);
            }

            // Load data based on current searchParams only
            try {
                setLoadingStates(prev => ({ ...prev, dataLoad: true }));
                dispatch(setLoading(true));
                const result = await onRecordFilter([], {
                    ...urlFilters,
                    _pagination: {
                        page: urlMetadata.currentPage,
                        pageSize: urlMetadata.itemsPerPage,
                    },
                });

                if (isMounted) {
                    handleFilterResult(result);
                    setLoadingStates(prev => ({
                        ...prev,
                        dataLoad: false,
                        initialLoad: false,
                    }));
                }
            } catch (error) {
                if (isMounted) {
                    console.error("Error loading data:", error);
                    dispatch(setError("Failed to load data"));
                    setLoadingStates(prev => ({
                        ...prev,
                        dataLoad: false,
                        initialLoad: false,
                    }));
                }
            } finally {
                if (isMounted) {
                    dispatch(setLoading(false));
                }
            }
        };

        loadDataFromParams();

        // Setup CRUD type
        if (crudType !== activeCrudType) {
            dispatch(setActiveCrudType(crudType));
        }

        // Cleanup
        return () => {
            isMounted = false;
            dispatch(resetState());
        };
    }, [loadingStates.componentReady, searchParams.toString(), onRecordFilter, crudType, activeCrudType, dispatch]);

    // Simplified function to handle API results
    const handleFilterResult = useCallback(
        (result: any) => {
            if (result && typeof result === "object") {
                if ("data" in result && result.data) {
                    // API response format: { data: { list: [], meta: {}, links: {} } }
                    const responseData = result.data;
                    dispatch(
                        setApiData({
                            list: responseData.list || [],
                            meta: responseData.meta || {},
                            links: responseData.links || {},
                        }),
                    );
                } else if ("list" in result && "meta" in result) {
                    // Direct API format: { list: [], meta: {}, links: {} }
                    dispatch(
                        setApiData({
                            list: result.list || [],
                            meta: result.meta || {},
                            links: result.links || {},
                        }),
                    );
                } else if (Array.isArray(result)) {
                    // Array response - set data directly
                    dispatch(setData(result));
                } else {
                    console.warn("Unknown API response format:", result);
                    dispatch(setData([]));
                }
            }
        },
        [dispatch],
    );

    // Simplified loadData function for CRUD operations - always use searchParams
    const loadData = useCallback(async () => {
        const { urlFilters, urlMetadata } = getParamsFromUrl();

        try {
            dispatch(setLoading(true));
            const result = await onRecordFilter([], {
                ...urlFilters,
                _pagination: {
                    page: urlMetadata.currentPage,
                    pageSize: urlMetadata.itemsPerPage,
                },
            });
            handleFilterResult(result);
        } catch (error) {
            console.error("Error loading data:", error);
            dispatch(setError("Failed to load data"));
        } finally {
            dispatch(setLoading(false));
        }
    }, [getParamsFromUrl, onRecordFilter, dispatch, handleFilterResult]);

    // Only keep these two essential useEffects
    useEffect(() => {
        if (onDataChange && dataList && dataList.length >= 0) {
            onDataChange(dataList);
        }
    }, [dataList?.length, onDataChange]);

    useEffect(() => {
        if (error) {
            message.error(error);
            dispatch(setError(null));
        }
    }, [error, dispatch]);

    // CSS-in-JS styles ready detection
    useEffect(() => {
        const checkStylesReady = () => {
            const antdElement = document.querySelector(".ant-btn, .ant-card, .ant-table");
            if (antdElement) {
                const computedStyles = window.getComputedStyle(antdElement);
                const hasAntStyles =
                    computedStyles.getPropertyValue("--ant-primary-color") ||
                    computedStyles.backgroundColor !== "rgba(0, 0, 0, 0)" ||
                    computedStyles.border !== "none";

                if (hasAntStyles) {
                    setLoadingStates(prev => ({ ...prev, stylesReady: true }));
                    return;
                }
            }

            setTimeout(checkStylesReady, 50);
        };

        const styleCheckTimeout = setTimeout(checkStylesReady, 100);
        return () => clearTimeout(styleCheckTimeout);
    }, []);

    // Component ready state
    useEffect(() => {
        if (loadingStates.stylesReady && formSchema) {
            setLoadingStates(prev => ({ ...prev, componentReady: true }));
        }
    }, [loadingStates.stylesReady, formSchema]);

    // Permission helper
    const hasPermission = useCallback(
        (permission: Permission): boolean => {
            if (!checkPermission || !permission) return true;
            if (Array.isArray(permission)) return permission.some(p => checkPermission(p));
            return checkPermission(permission);
        },
        [checkPermission],
    );

    // Computed permissions for UI elements
    const computedPermissions = useMemo(
        () => ({
            canView: hasPermission(permissions.view || []),
            canCreate: hasPermission(permissions.create || []),
            canEdit: hasPermission(permissions.edit || []),
            canDelete: hasPermission(permissions.delete || []),
            canFilter: hasPermission(permissions.filter || []),
            canExport: hasPermission(permissions.export || []),
        }),
        [permissions, hasPermission],
    );

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

    // Enhanced filter handling - only update URL and Redux, let useEffect handle API call
    const handleFilterSubmit = useCallback(
        async (values: any) => {
            const newFilters: Record<string, any> = {};
            Object.entries(values).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== "") {
                    newFilters[key] = value;
                }
            });

            // Get current pagination from URL (not Redux)
            const { urlMetadata } = getParamsFromUrl();

            // Reset to first page when applying filters
            const resetMetadata = {
                ...urlMetadata,
                currentPage: 1,
            };

            // Update URL and Redux
            updateURL(newFilters, resetMetadata);
        },
        [getParamsFromUrl, updateURL],
    );

    // Enhanced clear filters - only update URL and Redux, let useEffect handle API call
    const handleClearFilters = useCallback(async () => {
        if (filterFormRef.current) {
            filterFormRef.current.resetFields();
        }

        // Get current pagination from URL (not Redux)
        const { urlMetadata } = getParamsFromUrl();

        // Reset to first page when clearing filters
        const resetMetadata = {
            ...urlMetadata,
            currentPage: 1,
        };

        // Update URL and Redux
        updateURL({}, resetMetadata);
    }, [getParamsFromUrl, updateURL]);

    // Enhanced table change handler - only update URL and Redux, let useEffect handle API call
    const handleTableChange = useCallback(
        async (paginationInfo: any, filtersInfo: any, sorter: any) => {
            // Get current URL params (not Redux)
            const { urlFilters, urlMetadata } = getParamsFromUrl();

            // Handle table filters (column filters)
            const tableFilters: Record<string, any> = {};
            Object.entries(filtersInfo || {}).forEach(([key, value]) => {
                if (value && Array.isArray(value) && value.length > 0) {
                    tableFilters[key] = value.length === 1 ? value[0] : value;
                }
            });

            // Merge with existing filters from URL
            const mergedFilters = {
                ...urlFilters,
                ...tableFilters,
            };

            // Update metadata with pagination info
            const updatedMetadata = {
                ...urlMetadata,
                currentPage: paginationInfo.current || urlMetadata.currentPage,
                itemsPerPage: paginationInfo.pageSize || urlMetadata.itemsPerPage,
            };

            // Handle sorting
            if (sorter && sorter.field) {
                mergedFilters._sort = sorter.field;
                mergedFilters._order = sorter.order === "ascend" ? "asc" : "desc";
            }

            // Update URL and Redux
            updateURL(mergedFilters, updatedMetadata);
        },
        [getParamsFromUrl, updateURL],
    );

    // Enhanced page size change handler - update URL directly
    const handleShowSizeChange = useCallback(
        async (current: number, size: number) => {
            // Get current filters from URL (not Redux)
            const { urlFilters } = getParamsFromUrl();

            const updatedMetadata = {
                currentPage: current,
                itemsPerPage: size,
            };

            // Update URL and Redux
            updateURL(urlFilters, updatedMetadata);
        },
        [getParamsFromUrl, updateURL],
    );

    // Enhanced row selection - remove URL persistence if syncUrlParams is disabled
    const handleRowSelection = useCallback(
        (keys: any[], rows: any[]) => {
            dispatch(setSelectedRows({ keys, rows }));
        },
        [dispatch],
    );

    // CRUD Handlers
    const handleAdd = () => {
        if (!computedPermissions.canCreate) {
            message.warning("You do not have permission to create records");
            return;
        }
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

        allFields.forEach((field: any) => {
            if (field.defaultValue !== undefined) {
                defaultValues[field.name] = field.defaultValue;
            }
        });

        if (Object.keys(defaultValues).length > 0) {
            form.setFieldsValue(defaultValues);
        }

        if (crudType === "route") {
            navigateToRoute("create");
        } else if (activeCrudType === "page") {
            dispatch(setCurrentPage("form"));
        } else if (activeCrudType === "modal" || activeCrudType === "drawer") {
            dispatch(setFormVisible(true));
        }
    };

    const handleEdit = (record: any) => {
        if (!computedPermissions.canEdit) {
            message.warning("You do not have permission to edit records");
            return;
        }
        dispatch(setEditingRecord(record));
        form.setFieldsValue(record);

        if (crudType === "route") {
            navigateToRoute("edit", record.id);
        } else if (activeCrudType === "page") {
            dispatch(setCurrentPage("form"));
        } else if (activeCrudType === "modal" || activeCrudType === "drawer") {
            dispatch(setFormVisible(true));
        }
    };

    const handleView = (record: any) => {
        if (!computedPermissions.canView) {
            message.warning("You do not have permission to view records");
            return;
        }
        dispatch(setViewingRecord(record));
        onRecordView?.(record);

        if (crudType === "route") {
            navigateToRoute("view", record.id);
        } else if (activeCrudType === "page") {
            dispatch(setCurrentPage("view"));
        } else if (activeCrudType === "modal" || activeCrudType === "drawer") {
            dispatch(setViewVisible(true));
        }
    };

    const handleDelete = async (record: any) => {
        if (!computedPermissions.canDelete) {
            message.warning("You do not have permission to delete records");
            return;
        }
        try {
            // Execute the delete callback if provided
            if (onRecordDelete) {
                await onRecordDelete(record);
            }

            // Use loadData without parameters
            // await loadData();

            message.success(successMessages.delete);
        } catch (error) {
            console.error("Delete error:", error);
            message.error("Delete operation failed. Please try again.");
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

                    // Execute the update callback if provided
                    let result = updatedRecord;
                    if (onRecordUpdate) {
                        result = await onRecordUpdate(updatedRecord);
                    }

                    // Use loadData without parameters
                    // await loadData();

                    afterFormSubmit?.(processedValues, result);
                    message.success(successMessages.update);
                } else {
                    const newRecord = {
                        id: Date.now().toString(),
                        ...processedValues,
                    };

                    // Execute the create callback if provided
                    let result = newRecord;
                    if (onRecordCreate) {
                        result = await onRecordCreate(newRecord);
                    }

                    // Use loadData without parameters
                    // await loadData();

                    afterFormSubmit?.(processedValues, result);
                    message.success(successMessages.create);
                }

                handleCancel();
            } catch (error) {
                console.error("Form submission error:", error);
                message.error("Operation failed. Please try again.");
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
            loadData,
        ],
    );

    const handleCancel = () => {
        if (crudType === "route") {
            navigateToRoute("list");
        } else if (activeCrudType === "page") {
            dispatch(setCurrentPage("list"));
            dispatch(setEditingRecord(null));
            dispatch(setViewingRecord(null));
            if (!preserveFormData) {
                form.resetFields();
            }
        } else {
            dispatch(setFormVisible(false));
            dispatch(setViewVisible(false));
            dispatch(setEditingRecord(null));
            dispatch(setViewingRecord(null));
            if (!preserveFormData) {
                form.resetFields();
            }
        }
    };

    // Route helpers
    const getRoutePath = useCallback(
        (action: string, recordId?: string) => {
            if (!routeConfig) return "";
            const { basePath, createPath, editPath, viewPath, listPath, paramName = "id" } = routeConfig;
            switch (action) {
                case "create":
                    return createPath || `${basePath}/create`;
                case "edit":
                    return editPath
                        ? editPath.replace(`[${paramName}]`, recordId || "")
                        : `${basePath}/${recordId}/edit`;
                case "view":
                    return viewPath ? viewPath.replace(`[${paramName}]`, recordId || "") : `${basePath}/${recordId}`;
                case "list":
                default:
                    return listPath || basePath;
            }
        },
        [routeConfig],
    );

    const navigateToRoute = useCallback(
        (action: string, recordId?: string, params?: Record<string, any>) => {
            if (crudType !== "route" || !routeConfig) return;
            const path = getRoutePath(action, recordId);
            const searchParamsObj = new URLSearchParams();
            if (params) {
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) searchParamsObj.set(key, String(value));
                });
            }
            const fullPath = searchParamsObj.toString() ? `${path}?${searchParamsObj.toString()}` : path;
            if (onNavigate) onNavigate(fullPath, params);
            else router.push(fullPath);
        },
        [crudType, routeConfig, router, onNavigate, getRoutePath],
    );

    // Add missing handleCrudTypeChange function before renderContent
    const handleCrudTypeChange = (type: CrudType) => {
        dispatch(setActiveCrudType(type));
    };

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
            .filter((field: any) => !field.hideInTable)
            .map((field: any) => ({
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

        const hasAnyAction =
            (computedPermissions.canView && actions.view) ||
            (computedPermissions.canEdit && actions.edit) ||
            (computedPermissions.canDelete && actions.delete) ||
            actions.extraActions;
        if (hasAnyAction) {
            columns.push({
                title: "Actions",
                key: "actions",
                fixed: "right",
                width: 150,
                render: (_: any, record: any) => (
                    <Space>
                        {computedPermissions.canView && actions.view && (
                            <Tooltip title="View Details">
                                <Button
                                    type="primary"
                                    icon={<EyeOutlined />}
                                    size="small"
                                    onClick={() => handleView(record)}
                                />
                            </Tooltip>
                        )}
                        {computedPermissions.canEdit && actions.edit && (
                            <Tooltip title="Edit Record">
                                <Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)} />
                            </Tooltip>
                        )}
                        {computedPermissions.canDelete && actions.delete && (
                            <Tooltip title="Delete Record">
                                <Popconfirm
                                    title={confirmTexts.delete}
                                    onConfirm={() => handleDelete(record)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button type="default" danger icon={<DeleteOutlined />} size="small" />
                                </Popconfirm>
                            </Tooltip>
                        )}
                        {actions.extraActions && actions.extraActions(record, computedPermissions)}
                    </Space>
                ),
            });
        }

        return columns;
    }, [formSchema, tableColumns, actions, confirmTexts.delete, computedPermissions]);

    // Render filter form
    const renderFilterForm = () => {
        // console.log("Rendering filter form with fields:", processedFilterFields);
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
                                                onClick={handleClearFilters}
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

    // Fix renderDetailView to handle empty fieldsFromSchema
    const renderDetailView = () => {
        if (!viewingRecord) return null;

        const fieldsFromSchema: any[] = [
            ...(formSchema.fields || []),
            ...(formSchema.sections?.flatMap((s: any) => s.fields) || []),
            ...(formSchema.tabs?.flatMap((t: any) => t.fields) || []),
            ...(formSchema.steps?.flatMap((s: any) => s.fields) || []),
        ];

        // Check if we have fields to display
        if (fieldsFromSchema.length === 0) {
            return (
                <Card>
                    <div style={{ textAlign: "center", padding: 20 }}>
                        <Text type="secondary">No fields to display</Text>
                    </div>
                </Card>
            );
        }

        return (
            <Card>
                <Row gutter={[16, 16]}>
                    {fieldsFromSchema
                        .filter(field => !field.hidden) // Filter out hidden fields from detail view
                        .map((field: any) => (
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

        const statItems = typeof statistics === "function" ? statistics(dataList) : statistics;

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

    // Enhanced table rendering - always use searchParams for pagination display
    const renderTable = () => {
        // Always get current values from searchParams for display
        const currentPage = parseInt(searchParams.get("page") || "1");
        const pageSize = parseInt(searchParams.get("pageSize") || "5");

        // Enhanced row selection configuration
        const getRowSelectionConfig = (): TableRowSelection<any> | undefined => {
            if (!rowSelection) return undefined;

            const baseConfig: TableRowSelection<any> = {
                selectedRowKeys,
                onChange: handleRowSelection,
                preserveSelectedRowKeys: true,
            };

            // Handle different selection types
            if (typeof rowSelection === "object") {
                const { type = "checkbox", ...otherProps } = rowSelection;

                return {
                    ...baseConfig,
                    type: type as "checkbox" | "radio", // Explicit type assertion
                    ...otherProps,
                } as TableRowSelection<any>;
            }

            // Default to checkbox if rowSelection is just boolean true
            return {
                ...baseConfig,
                type: "checkbox" as const,
            };
        };

        return (
            <Table
                size="middle"
                columns={generatedColumns}
                dataSource={dataList}
                rowKey="id"
                rowSelection={getRowSelectionConfig()}
                loading={loading || loadingStates.dataLoad}
                pagination={{
                    size: "default",
                    current: currentPage,
                    pageSize: pageSize,
                    total: metadata.totalItems,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    hideOnSinglePage: false,
                    pageSizeOptions: ["5", "10", "20", "50", "100"],
                    totalBoundaryShowSizeChanger: 2,
                    showLessItems: true,
                    showTitle: true,
                    showPrevNextJumpers: true,
                    responsive: true,
                    showTotal: (total: number, range: [number, number]) => `${range[0]}-${range[1]} of ${total} items`,
                    onChange: handleShowSizeChange,
                    onShowSizeChange: handleShowSizeChange,
                }}
                onChange={handleTableChange}
                scroll={{ x: "max-content" }}
                {...tableProps}
            />
        );
    };

    // Main content renderer
    const renderContent = () => {
        // Route-based rendering
        if (crudType === "route") {
            if (currentAction === "create" || currentAction === "edit") {
                const recordToEdit =
                    currentAction === "edit" ? dataList.find((item: any) => item.id === currentRecordId) : null;

                return (
                    <div>
                        <Card
                            title={
                                <Flex justify="space-between" align="center">
                                    <Space size="small">
                                        {icon ? <AppIcons name={icon} /> : null}
                                        <span>{`${currentAction === "edit" ? "Edit" : "Add"} ${title}`}</span>
                                    </Space>
                                </Flex>
                            }
                            extra={<Button onClick={handleCancel}>Back to List</Button>}
                        >
                            <AppForm
                                key={`form-${recordToEdit?.id || "new"}`}
                                schema={formSchema}
                                initialValues={recordToEdit}
                                onFinish={handleFormSubmit}
                                loading={loading}
                                validateOnMount={validateOnMount}
                                preserveFormData={preserveFormData}
                                renderFooter={(form, loading) => (
                                    <Flex justify="end" style={{ marginTop: 8 }}>
                                        <Space>
                                            <Button type="primary" onClick={() => form.submit()} loading={loading}>
                                                {currentAction === "edit" ? confirmTexts.update : confirmTexts.create}
                                            </Button>
                                            <Button onClick={handleCancel}>Cancel</Button>
                                            {renderExtraFormActions &&
                                                renderExtraFormActions(form, recordToEdit, computedPermissions)}
                                        </Space>
                                    </Flex>
                                )}
                                {...formProps}
                            />
                        </Card>
                    </div>
                );
            }

            if (currentAction === "view") {
                const recordToView = dataList.find((item: any) => item.id === currentRecordId);
                return (
                    <div>
                        <Space style={{ marginBottom: 16 }}>
                            <Button onClick={handleCancel}>Back to List</Button>
                            {computedPermissions.canEdit && actions.edit && (
                                <Button
                                    type="primary"
                                    icon={<EditOutlined />}
                                    onClick={() => {
                                        navigateToRoute("edit", recordToView?.id);
                                    }}
                                >
                                    Edit
                                </Button>
                            )}
                        </Space>
                        <Card
                            title={
                                <Space>
                                    {icon ? <AppIcons name={icon} /> : null}
                                    <span>{`${title} Details`}</span>
                                </Space>
                            }
                        >
                            {renderDetailView()}
                        </Card>
                    </div>
                );
            }

            // Default: list view for route-based CRUD
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
                                <Radio.Button value="route">Route</Radio.Button>
                            </Radio.Group>
                        )
                    }
                >
                    {renderStatistics()}
                    {renderFilterForm()}

                    <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
                        {computedPermissions.canCreate && (
                            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                                Add {title}
                            </Button>
                        )}

                        {rowSelection && selectedRowKeys.length > 0 && batchActions && (
                            <div>{batchActions(selectedRowKeys, selectedRows, computedPermissions)}</div>
                        )}
                    </div>

                    {renderTable()}
                </Card>
            );
        }

        // Page-based rendering (fixed)
        if (activeCrudType === "page") {
            if (currentPage === "form") {
                return (
                    <div>
                        <Card
                            title={
                                <Flex justify="space-between" align="center">
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
                                            {renderExtraFormActions &&
                                                renderExtraFormActions(form, editingRecord, computedPermissions)}
                                        </Space>
                                    </Flex>
                                )}
                                {...formProps}
                            />
                        </Card>
                    </div>
                );
            }

            if (currentPage === "view") {
                return (
                    <div>
                        <Space style={{ marginBottom: 16 }}>
                            <Button onClick={handleCancel}>Back to List</Button>
                            {computedPermissions.canEdit && actions.edit && (
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
                                    {icon ? <AppIcons name={icon} /> : null}
                                    <span>{`${title} Details`}</span>
                                </Space>
                            }
                        >
                            {renderDetailView()}
                        </Card>
                    </div>
                );
            }

            // Default: list view for page-based CRUD
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
                                <Radio.Button value="route">Route</Radio.Button>
                            </Radio.Group>
                        )
                    }
                >
                    {renderStatistics()}
                    {renderFilterForm()}

                    <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
                        {computedPermissions.canCreate && (
                            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                                Add {title}
                            </Button>
                        )}

                        {rowSelection && selectedRowKeys.length > 0 && batchActions && (
                            <div>{batchActions(selectedRowKeys, selectedRows, computedPermissions)}</div>
                        )}
                    </div>

                    {renderTable()}
                </Card>
            );
        }

        // Default list view for modal/drawer modes
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
                            <Radio.Button value="route">Route</Radio.Button>
                        </Radio.Group>
                    )
                }
            >
                {renderStatistics()}
                {renderFilterForm()}

                <div
                    style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                    <Space>
                        {computedPermissions.canCreate && (
                            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                                Add {title}
                            </Button>
                        )}

                        {/* Quick filter controls */}
                        {Object.keys(filters).length > 0 && (
                            <Button size="small" onClick={handleClearFilters} icon={<FilterOutlined />}>
                                Clear All Filters
                            </Button>
                        )}
                    </Space>

                    {rowSelection && selectedRowKeys.length > 0 && batchActions && (
                        <div>{batchActions(selectedRowKeys, selectedRows, computedPermissions)}</div>
                    )}
                </div>

                {renderTable()}
            </Card>
        );
    };

    // Show loading skeleton during initial load
    if (loadingStates.initialLoad || !loadingStates.componentReady) {
        return <QuickUILoadingSkeleton title={title} />;
    }

    return (
        <App>
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
                destroyOnHidden
            >
                {renderDetailView()}
            </Modal>

            {/* View Drawer */}
            <Drawer
                title={`${title} Details`}
                open={activeCrudType === "drawer" && isViewVisible}
                onClose={() => dispatch(setViewVisible(false))}
                width={600}
                destroyOnHidden
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
        </App>
    );
};

export default QuickUI;
