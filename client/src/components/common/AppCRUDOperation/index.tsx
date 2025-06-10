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
    createRecord,
    deleteRecord,
    resetState,
    setActiveCrudType,
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
    updateRecord,
} from "@lib/redux/config/quickUISlice"; // Adjust import path as needed
import { AppDispatch, RootState } from "@lib/redux/store"; // Adjust import path as needed
import { TIconName } from "@src/types/iconName";
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
    message,
} from "antd";
import { ColumnType } from "antd/lib/table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ReactNode, useCallback, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppForm from "../AppForm";
import { FormSchema } from "../AppForm/form.type";
import AppIcons from "../AppIcons";
const { Title, Text } = Typography;

// Permission types and route config
export type Permission = string | string[];
export interface PermissionConfig {
    view?: Permission;
    create?: Permission;
    edit?: Permission;
    delete?: Permission;
    filter?: Permission;
    export?: Permission;
    [key: string]: Permission | undefined;
}
export type PermissionChecker = (permission: Permission) => boolean;
export type CrudType = "modal" | "drawer" | "page" | "route";
export interface RouteConfig {
    basePath: string;
    createPath?: string;
    editPath?: string;
    viewPath?: string;
    listPath?: string;
    paramName?: string;
    queryParams?: Record<string, string>;
}

// Statistics item type
export type StatItem = {
    key: string;
    label: string;
    value: number | string;
    color?: string;
    icon?: ReactNode;
};

// CRUD props combining AppForm and DynamicCrud capabilities
export interface QuickUIProps {
    // Basic configuration
    title: string;
    formSchema: FormSchema;
    crudType?: CrudType;
    initialData?:
        | {
              list: any[];
              meta?: {
                  totalItems?: number;
                  itemCount?: number;
                  itemsPerPage?: number;
                  totalPages?: number;
                  currentPage?: number;
                  hasNextPage?: boolean;
                  hasPreviousPage?: boolean;
              };
          }
        | any[]; // Support both new and legacy format
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
        extraActions?: (record: any, permissions?: { [key: string]: boolean }) => ReactNode[];
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
    batchActions?: (selectedRowKeys: any[], selectedRows: any[], permissions?: { [key: string]: boolean }) => ReactNode;
    emptyText?: string;
    showToggleCrudType?: boolean;

    // Advanced form configuration
    validateOnMount?: boolean;
    preserveFormData?: boolean;
    beforeFormSubmit?: (values: any) => any | Promise<any>;
    afterFormSubmit?: (values: any, result: any) => void;
    renderExtraFormActions?: (
        form: any,
        editingRecord: any | null,
        permissions?: { [key: string]: boolean },
    ) => ReactNode;

    // Permissions
    permissions?: PermissionConfig;
    checkPermission?: PermissionChecker;
    routeConfig?: RouteConfig;
    currentAction?: string;
    currentRecordId?: string;
    onNavigate?: (path: string, params?: Record<string, any>) => void;
}

const QuickUI = ({
    title,
    formSchema,
    crudType = "modal",
    initialData = {
        list: [],
        meta: {
            totalItems: 0,
            itemCount: 0,
            itemsPerPage: 10,
            totalPages: 0,
            currentPage: 1,
            hasNextPage: false,
            hasPreviousPage: false,
        },
    },
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
    permissions = {},
    checkPermission,
    routeConfig,
    currentAction = "list",
    currentRecordId,
    onNavigate,
}: QuickUIProps) => {
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
    const [form] = Form.useForm();
    const filterFormRef = useRef(form);

    // Normalize initialData to ensure consistent structure
    const normalizedInitialData = useMemo(() => {
        if (!initialData) {
            return {
                list: [],
                meta: {
                    totalItems: 0,
                    itemCount: 0,
                    itemsPerPage: 10,
                    totalPages: 0,
                    currentPage: 1,
                    hasNextPage: false,
                    hasPreviousPage: false,
                },
            };
        }

        // Handle legacy array format
        if (Array.isArray(initialData)) {
            return {
                list: initialData,
                meta: {
                    totalItems: initialData.length,
                    itemCount: initialData.length,
                    itemsPerPage: 10,
                    totalPages: Math.ceil(initialData.length / 10),
                    currentPage: 1,
                    hasNextPage: initialData.length > 10,
                    hasPreviousPage: false,
                },
            };
        }

        // Handle new object format
        return {
            list: initialData.list || [],
            meta: {
                totalItems: initialData.meta?.totalItems || initialData.list?.length || 0,
                itemCount: initialData.meta?.itemCount || initialData.list?.length || 0,
                itemsPerPage: initialData.meta?.itemsPerPage || 10,
                totalPages:
                    initialData.meta?.totalPages ||
                    Math.ceil((initialData.list?.length || 0) / (initialData.meta?.itemsPerPage || 10)),
                currentPage: initialData.meta?.currentPage || 1,
                hasNextPage: initialData.meta?.hasNextPage || false,
                hasPreviousPage: initialData.meta?.hasPreviousPage || false,
            },
        };
    }, [initialData]);

    // Helper function to calculate pagination metadata
    const calculatePaginationMetadata = useCallback((totalItems: number, currentPage: number, itemsPerPage: number) => {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        return {
            totalItems,
            itemCount: Math.min(totalItems - startIndex, itemsPerPage),
            itemsPerPage,
            totalPages,
            currentPage,
            hasNextPage: currentPage < totalPages,
            hasPreviousPage: currentPage > 1,
            startIndex,
            endIndex,
        };
    }, []);

    // Helper function to apply client-side filtering
    const applyClientSideFilters = useCallback((data: any[], filters: Record<string, any>) => {
        let filteredData = [...data];

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                filteredData = filteredData.filter(record => {
                    const recordValue = record[key];
                    if (typeof value === "string" && typeof recordValue === "string") {
                        return recordValue.toLowerCase().includes(value.toLowerCase());
                    }
                    return recordValue === value;
                });
            }
        });

        return filteredData;
    }, []);

    // Helper function to handle pagination and set data
    const setPaginatedData = useCallback(
        (data: any[], currentPage: number, itemsPerPage: number) => {
            const paginationMeta = calculatePaginationMetadata(data.length, currentPage, itemsPerPage);
            const paginatedData = data.slice(paginationMeta.startIndex, paginationMeta.endIndex);

            dispatch(setData(paginatedData));
            dispatch(
                setMetadata({
                    totalItems: paginationMeta.totalItems,
                    itemCount: paginationMeta.itemCount,
                    itemsPerPage: paginationMeta.itemsPerPage,
                    totalPages: paginationMeta.totalPages,
                    currentPage: paginationMeta.currentPage,
                    hasNextPage: paginationMeta.hasNextPage,
                    hasPreviousPage: paginationMeta.hasPreviousPage,
                }),
            );
        },
        [calculatePaginationMetadata, dispatch],
    );

    // Helper function to handle onFilter results
    const handleFilterResult = useCallback(
        (result: any, currentMetadata: any) => {
            if (result && typeof result === "object") {
                if ("data" in result && result.data) {
                    // API response format: { data: { list: [], meta: {} } }
                    const { list, meta } = result.data as any;
                    dispatch(setData(list || []));
                    if (meta) {
                        dispatch(
                            setMetadata({
                                totalItems: meta.totalItems || 0,
                                itemCount: meta.itemCount || 0,
                                itemsPerPage: meta.itemsPerPage || currentMetadata.itemsPerPage,
                                totalPages: meta.totalPages || 1,
                                currentPage: meta.currentPage || currentMetadata.currentPage,
                                hasNextPage: meta.hasNextPage || false,
                                hasPreviousPage: meta.hasPreviousPage || false,
                            }),
                        );
                    }
                } else if (Array.isArray(result)) {
                    // Array response - apply pagination
                    setPaginatedData(result, currentMetadata.currentPage, currentMetadata.itemsPerPage);
                }
            }
        },
        [dispatch, setPaginatedData],
    );

    // Initialize from URL parameters on mount
    useEffect(() => {
        const urlFilters: Record<string, any> = {};
        const pageParam = searchParams.get("page");
        const pageSizeParam = searchParams.get("pageSize");

        // Extract filter parameters from URL (excluding pagination)
        Array.from(searchParams.entries()).forEach(([key, value]) => {
            if (!["page", "pageSize"].includes(key) && value) {
                try {
                    // Try to parse JSON for complex values
                    urlFilters[key] = JSON.parse(decodeURIComponent(value));
                } catch {
                    // Fall back to string value
                    urlFilters[key] = decodeURIComponent(value);
                }
            }
        });

        // Set filters (without pagination)
        dispatch(setFilters(urlFilters));

        // Set metadata with URL pagination or defaults from normalizedInitialData
        const initialMetadata = {
            ...normalizedInitialData.meta,
            currentPage: pageParam ? parseInt(pageParam) : normalizedInitialData.meta.currentPage,
            itemsPerPage: pageSizeParam ? parseInt(pageSizeParam) : normalizedInitialData.meta.itemsPerPage,
        };
        dispatch(setMetadata(initialMetadata));

        // Set filter form values
        if (filterFormRef.current && Object.keys(urlFilters).length > 0) {
            filterFormRef.current.setFieldsValue(urlFilters);
        }
    }, [searchParams.toString(), dispatch]); // Only depend on searchParams string to prevent loops

    // Optimized data initialization - separate from URL initialization
    const initializeData = useCallback(async () => {
        const currentFilters = filters;
        const currentMetadata = metadata;

        if (onFilter) {
            try {
                const filterResult = onFilter(normalizedInitialData.list, {
                    ...currentFilters,
                    _pagination: {
                        page: currentMetadata.currentPage,
                        pageSize: currentMetadata.itemsPerPage,
                    },
                });

                // Handle both Promise and non-Promise returns
                if (filterResult && typeof filterResult.then === "function") {
                    try {
                        const result = await filterResult;
                        handleFilterResult(result, currentMetadata);
                    } catch (error) {
                        console.error("Error loading initial data:", error);
                        dispatch(setError("Failed to load data"));
                    }
                } else {
                    // Handle synchronous return or void
                    const result = filterResult as any[] | undefined;
                    if (result && Array.isArray(result)) {
                        setPaginatedData(result, currentMetadata.currentPage, currentMetadata.itemsPerPage);
                    } else {
                        // If onFilter returns void, use normalizedInitialData
                        setPaginatedData(
                            normalizedInitialData.list,
                            currentMetadata.currentPage,
                            currentMetadata.itemsPerPage,
                        );
                    }
                }
            } catch (error) {
                console.error("Error in onFilter:", error);
                dispatch(setError("Failed to load data"));
            }
        } else {
            // Client-side data handling
            const filteredData = applyClientSideFilters(normalizedInitialData.list, currentFilters);
            setPaginatedData(filteredData, currentMetadata.currentPage, currentMetadata.itemsPerPage);
        }
    }, [onFilter, normalizedInitialData.list, handleFilterResult, setPaginatedData, applyClientSideFilters, dispatch]); // Remove filters and metadata from dependencies to prevent loops

    // Separate effect for initial data loading - only run once or when initialData changes
    useEffect(() => {
        let isMounted = true;

        const loadInitialData = async () => {
            if (normalizedInitialData.list.length > 0) {
                // Use current state values instead of dependencies
                const currentFilters = filters;
                const currentMetadata = metadata;

                if (onFilter) {
                    try {
                        const filterResult = onFilter(normalizedInitialData.list, {
                            ...currentFilters,
                            _pagination: {
                                page: currentMetadata.currentPage,
                                pageSize: currentMetadata.itemsPerPage,
                            },
                        });

                        if (filterResult && typeof filterResult.then === "function") {
                            try {
                                const result = await filterResult;
                                if (isMounted) {
                                    handleFilterResult(result, currentMetadata);
                                }
                            } catch (error) {
                                if (isMounted) {
                                    console.error("Error loading initial data:", error);
                                    dispatch(setError("Failed to load data"));
                                }
                            }
                        } else {
                            const result = filterResult as any[] | undefined;
                            if (isMounted) {
                                if (result && Array.isArray(result)) {
                                    setPaginatedData(result, currentMetadata.currentPage, currentMetadata.itemsPerPage);
                                } else {
                                    setPaginatedData(
                                        normalizedInitialData.list,
                                        currentMetadata.currentPage,
                                        currentMetadata.itemsPerPage,
                                    );
                                }
                            }
                        }
                    } catch (error) {
                        if (isMounted) {
                            console.error("Error in onFilter:", error);
                            dispatch(setError("Failed to load data"));
                        }
                    }
                } else {
                    // Client-side data handling
                    const filteredData = applyClientSideFilters(normalizedInitialData.list, currentFilters);
                    if (isMounted) {
                        setPaginatedData(filteredData, currentMetadata.currentPage, currentMetadata.itemsPerPage);
                    }
                }
            } else {
                // Set initial empty state with proper metadata
                if (isMounted) {
                    dispatch(setData([]));
                    dispatch(setMetadata(normalizedInitialData.meta));
                }
            }
        };

        loadInitialData();

        return () => {
            isMounted = false;
        };
    }, [JSON.stringify(normalizedInitialData)]); // Only depend on serialized initialData to prevent loops

    // Separate effect for CRUD type initialization
    useEffect(() => {
        if (crudType !== activeCrudType) {
            dispatch(setActiveCrudType(crudType));
        }

        // Cleanup on unmount
        return () => {
            dispatch(resetState());
        };
    }, [crudType, activeCrudType, dispatch]);

    // Update URL when filters change - always update for persistence
    const updateURL = useCallback(
        (newFilters: Record<string, any> = filters, newMetadata = metadata) => {
            const params = new URLSearchParams();

            // Add filter params (excluding pagination)
            Object.entries(newFilters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== "") {
                    const encodedValue =
                        typeof value === "object"
                            ? encodeURIComponent(JSON.stringify(value))
                            : encodeURIComponent(String(value));
                    params.set(key, encodedValue);
                }
            });

            // Add pagination params from metadata
            if (newMetadata.currentPage) {
                params.set("page", newMetadata.currentPage.toString());
            }
            if (newMetadata.itemsPerPage) {
                params.set("pageSize", newMetadata.itemsPerPage.toString());
            }

            const newUrl = `${pathname}?${params.toString()}`;
            const currentUrl = `${pathname}?${searchParams.toString()}`;

            // Always update URL if it has changed for filter and pagination persistence
            if (newUrl !== currentUrl) {
                router.replace(newUrl);
            }
        },
        [filters, metadata, pathname, router, searchParams],
    );

    // Enhanced data loading with pagination support (optimized)
    const loadData = useCallback(
        async (currentFilters: any = filters, currentMetadata = metadata) => {
            if (onFilter) {
                try {
                    dispatch(setLoading(true));

                    // Call onFilter with pagination info
                    const result = await onFilter(normalizedInitialData.list, {
                        ...currentFilters,
                        _pagination: {
                            page: currentMetadata.currentPage,
                            pageSize: currentMetadata.itemsPerPage,
                        },
                    });

                    // Handle API response structure using the helper
                    handleFilterResult(result, currentMetadata);
                } catch (error) {
                    console.error("Error loading data:", error);
                    dispatch(setError("Failed to load data"));
                } finally {
                    dispatch(setLoading(false));
                }
            } else {
                // Client-side filtering and pagination
                const filteredData = applyClientSideFilters(normalizedInitialData.list, currentFilters);
                setPaginatedData(filteredData, currentMetadata.currentPage, currentMetadata.itemsPerPage);

                // Only update URL if not in initial load
                const updatedMetadata = {
                    ...currentMetadata,
                    totalItems: filteredData.length,
                    itemCount: Math.min(
                        filteredData.length - (currentMetadata.currentPage - 1) * currentMetadata.itemsPerPage,
                        currentMetadata.itemsPerPage,
                    ),
                    totalPages: Math.ceil(filteredData.length / currentMetadata.itemsPerPage),
                    hasNextPage:
                        currentMetadata.currentPage < Math.ceil(filteredData.length / currentMetadata.itemsPerPage),
                    hasPreviousPage: currentMetadata.currentPage > 1,
                };

                // Prevent URL update loops by checking if we're actually changing filters
                if (
                    JSON.stringify(currentFilters) !== JSON.stringify(filters) ||
                    currentMetadata.currentPage !== metadata.currentPage ||
                    currentMetadata.itemsPerPage !== metadata.itemsPerPage
                ) {
                    updateURL(currentFilters, updatedMetadata);
                }
            }
        },
        [
            normalizedInitialData.list,
            onFilter,
            dispatch,
            handleFilterResult,
            applyClientSideFilters,
            setPaginatedData,
            updateURL,
            filters,
            metadata,
        ],
    );

    // Handle data changes callback
    useEffect(() => {
        if (onDataChange) {
            onDataChange(dataList);
        }
    }, [dataList, onDataChange]);

    // Handle errors
    useEffect(() => {
        if (error) {
            message.error(error);
        }
    }, [error]);

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

    // Enhanced filter handling with pagination reset
    const handleFilterSubmit = useCallback(
        async (values: any) => {
            const newFilters: Record<string, any> = {};
            Object.entries(values).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== "") {
                    newFilters[key] = value;
                }
            });

            // Reset to first page when applying filters
            const resetMetadata = {
                ...metadata,
                currentPage: 1,
            };

            dispatch(setFilters(newFilters));
            dispatch(setMetadata(resetMetadata));
            await loadData(newFilters, resetMetadata);
        },
        [metadata, loadData, dispatch],
    );

    // Enhanced clear filters
    const handleClearFilters = useCallback(async () => {
        if (filterFormRef.current) {
            filterFormRef.current.resetFields();
        }

        // Reset to first page when clearing filters
        const resetMetadata = {
            ...metadata,
            currentPage: 1,
        };

        dispatch(setFilters({}));
        dispatch(setMetadata(resetMetadata));
        await loadData({}, resetMetadata);
    }, [metadata, loadData, dispatch]);

    // Enhanced table change handler
    const handleTableChange = useCallback(
        async (paginationInfo: any, filtersInfo: any, sorter: any) => {
            // Handle table filters (column filters)
            const tableFilters: Record<string, any> = {};
            Object.entries(filtersInfo || {}).forEach(([key, value]) => {
                if (value && Array.isArray(value) && value.length > 0) {
                    tableFilters[key] = value.length === 1 ? value[0] : value;
                }
            });

            // Merge with existing filters
            const mergedFilters = {
                ...filters,
                ...tableFilters,
            };

            // Update metadata with pagination info
            const updatedMetadata = {
                ...metadata,
                currentPage: paginationInfo.current || metadata.currentPage,
                itemsPerPage: paginationInfo.pageSize || metadata.itemsPerPage,
            };

            if (Object.keys(tableFilters).length > 0) {
                dispatch(setFilters(mergedFilters));
            }

            dispatch(setMetadata(updatedMetadata));

            // Handle sorting
            if (sorter && sorter.field) {
                const sortFilters = {
                    ...mergedFilters,
                    _sort: sorter.field,
                    _order: sorter.order === "ascend" ? "asc" : "desc",
                };
                await loadData(sortFilters, updatedMetadata);
            } else {
                await loadData(mergedFilters, updatedMetadata);
            }
        },
        [filters, metadata, dispatch, loadData],
    );

    // Enhanced page size change handler
    const handleShowSizeChange = useCallback(
        async (current: number, size: number) => {
            const updatedMetadata = {
                ...metadata,
                currentPage: current,
                itemsPerPage: size,
            };

            dispatch(setMetadata(updatedMetadata));
            await loadData(filters, updatedMetadata);
        },
        [filters, metadata, loadData, dispatch],
    );

    // Enhanced row selection with persistence
    const handleRowSelection = useCallback(
        (keys: any[], rows: any[]) => {
            dispatch(setSelectedRows({ keys, rows }));

            // Update URL with selected items for persistence (optional)
            if (keys.length > 0) {
                const url = new URL(window.location.href);
                url.searchParams.set("selected", keys.join(","));
                window.history.replaceState({}, "", url.toString());
            } else {
                const url = new URL(window.location.href);
                url.searchParams.delete("selected");
                window.history.replaceState({}, "", url.toString());
            }
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
            await dispatch(deleteRecord({ record, onRecordDelete })).unwrap();

            // Update metadata after successful delete
            const updatedMetadata = {
                ...metadata,
                totalItems: Math.max(0, metadata.totalItems - 1),
                itemCount: Math.max(0, metadata.itemCount - 1),
                totalPages: Math.ceil(Math.max(0, metadata.totalItems - 1) / metadata.itemsPerPage),
                hasNextPage:
                    metadata.currentPage < Math.ceil(Math.max(0, metadata.totalItems - 1) / metadata.itemsPerPage),
                hasPreviousPage: metadata.currentPage > 1,
            };

            // If current page has no items after delete and it's not the first page, go to previous page
            if (updatedMetadata.itemCount === 0 && metadata.currentPage > 1) {
                updatedMetadata.currentPage = metadata.currentPage - 1;
                updatedMetadata.hasPreviousPage = updatedMetadata.currentPage > 1;
            }

            dispatch(setMetadata(updatedMetadata));

            // Reload data to reflect the changes
            await loadData(filters, updatedMetadata);

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
                                    <Button type="primary" danger icon={<DeleteOutlined />} size="small" />
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

    // Enhanced table rendering with improved pagination
    const renderTable = () => (
        <Table
            columns={generatedColumns}
            dataSource={dataList}
            rowKey="id"
            rowSelection={
                rowSelection
                    ? {
                          selectedRowKeys,
                          onChange: handleRowSelection,
                          preserveSelectedRowKeys: true,
                      }
                    : undefined
            }
            locale={{ emptyText }}
            loading={loading}
            pagination={{
                current: metadata.currentPage,
                pageSize: metadata.itemsPerPage,
                total: metadata.totalItems,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total: number, range: [number, number]) => `${range[0]}-${range[1]} of ${total} items`,
                onChange: async (page, pageSize) => {
                    const updatedMetadata = {
                        ...metadata,
                        currentPage: page,
                        itemsPerPage: pageSize || metadata.itemsPerPage,
                    };

                    dispatch(setMetadata(updatedMetadata));
                    await loadData(filters, updatedMetadata);
                },
                onShowSizeChange: handleShowSizeChange,
            }}
            onChange={handleTableChange}
            scroll={{ x: "max-content" }}
            {...tableProps}
        />
    );

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
