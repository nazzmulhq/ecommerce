"use client";
import {
    CopyOutlined,
    DeleteOutlined,
    EditOutlined,
    ExportOutlined,
    LockOutlined,
    SecurityScanOutlined,
    TeamOutlined,
    UnlockOutlined,
    UserOutlined,
} from "@ant-design/icons";
import QuickUI from "@components/common/AppCRUDOperation";
import { FormSchema } from "@components/common/AppForm/form.type";
import { Button, Form, message, Modal, Select, Space, Tag } from "antd";
import { useState } from "react";

// Define a type for permission records
interface Permission {
    id: string;
    slug: string;
    name: string;
    description?: string;
    module: string;
    status: "active" | "inactive" | "pending";
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    permissions?: string[];
    level: "basic" | "advanced" | "admin";
    isSystemPermission: boolean;
}

// Sample permissions data with comprehensive fields
const initialPermissions: Permission[] = [
    {
        id: "1",
        name: "Create Users",
        slug: "users.create",
        description: "Allows creating new user accounts",
        module: "User Management",
        status: "active",
        createdAt: "2024-01-01",
        updatedAt: "2024-01-15",
        createdBy: "admin",
        level: "basic",
        isSystemPermission: false,
    },
    {
        id: "2",
        name: "View Users",
        slug: "users.view",
        description: "Allows viewing user information",
        module: "User Management",
        status: "active",
        createdAt: "2024-01-01",
        updatedAt: "2024-01-10",
        createdBy: "admin",
        level: "basic",
        isSystemPermission: true,
    },
    {
        id: "3",
        name: "Edit Users",
        slug: "users.edit",
        description: "Allows editing user information",
        module: "User Management",
        status: "active",
        createdAt: "2024-01-02",
        updatedAt: "2024-01-12",
        createdBy: "admin",
        level: "advanced",
        isSystemPermission: false,
    },
    {
        id: "4",
        name: "Delete Users",
        slug: "users.delete",
        description: "Allows deleting user accounts",
        module: "User Management",
        status: "inactive",
        createdAt: "2024-01-03",
        updatedAt: "2024-01-14",
        createdBy: "admin",
        level: "admin",
        isSystemPermission: false,
    },
    {
        id: "5",
        name: "Manage Roles",
        slug: "roles.manage",
        description: "Full access to role management",
        module: "Role Management",
        status: "active",
        createdAt: "2024-01-05",
        updatedAt: "2024-01-20",
        createdBy: "superadmin",
        level: "admin",
        isSystemPermission: true,
    },
    // Add more sample data...
    ...Array.from({ length: 15 }, (_, i) => ({
        id: `${i + 6}`,
        name: `Permission ${i + 6}`,
        slug: `module${Math.floor(i / 3)}.permission${i + 6}`,
        description: `Description for permission ${i + 6}`,
        module: ["User Management", "Role Management", "System", "Reports", "Settings"][Math.floor(i / 3)],
        status: ["active", "inactive", "pending"][i % 3] as "active" | "inactive" | "pending",
        createdAt: `2024-01-${String(i + 10).padStart(2, "0")}`,
        updatedAt: `2024-01-${String(i + 15).padStart(2, "0")}`,
        createdBy: ["admin", "superadmin", "manager"][i % 3],
        level: ["basic", "advanced", "admin"][i % 3] as "basic" | "advanced" | "admin",
        isSystemPermission: i % 4 === 0,
    })),
];

// Comprehensive form schema demonstrating all field types and configurations
const permissionFormSchema: FormSchema = {
    layout: "vertical",
    size: "middle",
    // Using tabs to organize complex forms
    tabs: [
        {
            key: "basic",
            title: "Basic Information",
            icon: "InfoCircleOutlined",
            fields: [
                {
                    name: "id",
                    label: "ID",
                    type: "text",
                    hidden: true, // Hidden fields won't show in table or form
                },
                {
                    name: "name",
                    label: "Permission Name",
                    type: "text",
                    required: true,
                    placeholder: "Enter permission name",
                    grid: { xs: 24, sm: 12 },
                    filterable: true, // Will appear in filter form
                    // Will be sortable in table
                    rules: [
                        { required: true, message: "Permission name is required" },
                        { min: 3, message: "Name must be at least 3 characters" },
                        { max: 100, message: "Name cannot exceed 100 characters" },
                    ],
                },
                {
                    name: "slug",
                    label: "Permission Slug",
                    type: "text",
                    required: true,
                    placeholder: "e.g., users.create",
                    grid: { xs: 24, sm: 12 },
                    filterable: true,

                    rules: [
                        { required: true, message: "Slug is required" },
                        {
                            pattern: /^[a-z0-9._-]+$/,
                            message: "Slug can only contain lowercase letters, numbers, dots, hyphens and underscores",
                        },
                    ],
                },
                {
                    name: "description",
                    label: "Description",
                    type: "input.text_area",
                    placeholder: "Describe what this permission allows",
                    grid: { xs: 24 },
                    props: {
                        rows: 3,
                        maxLength: 500,
                        showCount: true,
                    },
                },
                {
                    name: "module",
                    label: "Module",
                    type: "select",
                    required: true,
                    filterable: true,

                    grid: { xs: 24, sm: 12 },
                    options: [
                        { value: "User Management", label: "User Management" },
                        { value: "Role Management", label: "Role Management" },
                        { value: "System", label: "System" },
                        { value: "Reports", label: "Reports" },
                        { value: "Settings", label: "Settings" },
                    ],
                    props: {
                        showSearch: true,
                        allowClear: true,
                        placeholder: "Select module",
                    },
                },
                {
                    name: "level",
                    label: "Permission Level",
                    type: "radio",
                    required: true,
                    filterable: true,
                    grid: { xs: 24, sm: 12 },
                    options: [
                        { value: "basic", label: "Basic" },
                        { value: "advanced", label: "Advanced" },
                        { value: "admin", label: "Admin" },
                    ],
                    defaultValue: "basic",
                },
            ],
        },
        {
            key: "settings",
            title: "Settings",
            icon: "SettingOutlined",
            fields: [
                {
                    name: "status",
                    label: "Status",
                    type: "select",
                    required: true,
                    filterable: true,

                    grid: { xs: 24, sm: 12 },
                    options: [
                        { value: "active", label: "Active" },
                        { value: "inactive", label: "Inactive" },
                        { value: "pending", label: "Pending" },
                    ],
                    defaultValue: "active",
                    render: (value: any) => {
                        const colors = { active: "green", inactive: "red", pending: "orange" };
                        return <Tag color={colors[value as keyof typeof colors]}>{value?.toUpperCase()}</Tag>;
                    },
                },
                {
                    name: "isSystemPermission",
                    label: "System Permission",
                    type: "switch",
                    grid: { xs: 24, sm: 12 },
                    defaultValue: false,
                    props: {
                        checkedChildren: "Yes",
                        unCheckedChildren: "No",
                    },
                    render: (value: any) => (
                        <Tag color={value ? "blue" : "default"} icon={value ? <LockOutlined /> : <UnlockOutlined />}>
                            {value ? "System" : "Custom"}
                        </Tag>
                    ),
                },
                {
                    name: "createdBy",
                    label: "Created By",
                    type: "select",
                    disabled: true, // Non-editable field
                    grid: { xs: 24, sm: 12 },
                    filterable: true,
                    options: [
                        { value: "admin", label: "Admin" },
                        { value: "superadmin", label: "Super Admin" },
                        { value: "manager", label: "Manager" },
                    ],
                },
                {
                    name: "createdAt",
                    label: "Created Date",
                    type: "date_picker",
                    disabled: true,
                    grid: { xs: 24, sm: 12 },
                    props: {
                        format: "YYYY-MM-DD",
                    },
                },
            ],
        },
    ],
    validation: {
        validateTrigger: ["onChange", "onBlur"],
        scrollToError: true,
    },
};

// Custom table columns demonstrating advanced rendering
const customTableColumns = [
    {
        title: "Permission Details",
        dataIndex: "name",
        key: "name",
        sorter: true,
        width: 300,
        render: (text: string, record: Permission) => (
            <div>
                <div style={{ fontWeight: "bold", fontSize: "14px" }}>{text}</div>
                <div style={{ color: "#666", fontSize: "12px" }}>{record.slug}</div>
                {record.description && (
                    <div style={{ color: "#999", fontSize: "11px", marginTop: 2 }}>
                        {record.description.length > 50
                            ? `${record.description.substring(0, 50)}...`
                            : record.description}
                    </div>
                )}
            </div>
        ),
    },
    {
        title: "Module",
        dataIndex: "module",
        key: "module",
        sorter: true,
        filters: [
            { text: "User Management", value: "User Management" },
            { text: "Role Management", value: "Role Management" },
            { text: "System", value: "System" },
            { text: "Reports", value: "Reports" },
            { text: "Settings", value: "Settings" },
        ],
        render: (module: string) => <Tag color="blue">{module}</Tag>,
    },
    {
        title: "Level",
        dataIndex: "level",
        key: "level",
        sorter: true,
        filters: [
            { text: "Basic", value: "basic" },
            { text: "Advanced", value: "advanced" },
            { text: "Admin", value: "admin" },
        ],
        render: (level: string) => {
            const colors = { basic: "green", advanced: "orange", admin: "red" };
            const icons = { basic: <UserOutlined />, advanced: <TeamOutlined />, admin: <SecurityScanOutlined /> };
            return (
                <Tag color={colors[level as keyof typeof colors]} icon={icons[level as keyof typeof icons]}>
                    {level?.toUpperCase()}
                </Tag>
            );
        },
    },
    {
        title: "Status",
        dataIndex: "status",
        key: "status",
        sorter: true,
        filters: [
            { text: "Active", value: "active" },
            { text: "Inactive", value: "inactive" },
            { text: "Pending", value: "pending" },
        ],
        render: (status: string) => {
            const colors = { active: "green", inactive: "red", pending: "orange" };
            return <Tag color={colors[status as keyof typeof colors]}>{status?.toUpperCase()}</Tag>;
        },
    },
    {
        title: "Type",
        dataIndex: "isSystemPermission",
        key: "isSystemPermission",
        filters: [
            { text: "System", value: true },
            { text: "Custom", value: false },
        ],
        render: (isSystem: boolean) => (
            <Tag color={isSystem ? "blue" : "default"} icon={isSystem ? <LockOutlined /> : <UnlockOutlined />}>
                {isSystem ? "System" : "Custom"}
            </Tag>
        ),
    },
    {
        title: "Created",
        dataIndex: "createdAt",
        key: "createdAt",
        sorter: true,
        render: (date: string, record: Permission) => (
            <div>
                <div>{date}</div>
                <div style={{ fontSize: "11px", color: "#666" }}>by {record.createdBy}</div>
            </div>
        ),
    },
];

const PermissionPage = () => {
    const [permissions, setPermissions] = useState<Permission[]>(initialPermissions);
    const [bulkEditModalVisible, setBulkEditModalVisible] = useState(false);
    const [bulkEditForm] = Form.useForm();

    // Simulate permission checking
    const checkPermission = (permission: string | string[]): boolean => {
        console.log("Checking permission:", permission);
        // For demo purposes, assume all permissions are granted
        return true;
    };

    // CRUD Handlers with detailed API simulation
    const handleCreate = async (record: Partial<Permission>): Promise<Permission> => {
        console.log("Creating permission:", record);

        // Simulate API validation
        const existingSlug = permissions.find(p => p.slug === record.slug);
        if (existingSlug) {
            throw new Error("Permission slug already exists");
        }

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const newPermission: Permission = {
            ...record,
            id: Date.now().toString(),
            createdAt: new Date().toISOString().split("T")[0],
            updatedAt: new Date().toISOString().split("T")[0],
            createdBy: "current-user",
        } as Permission;

        setPermissions(prev => [...prev, newPermission]);
        return newPermission;
    };

    const handleUpdate = async (record: Permission): Promise<Permission> => {
        console.log("Updating permission:", record);

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const updatedPermission = {
            ...record,
            updatedAt: new Date().toISOString().split("T")[0],
        };

        setPermissions(prev => prev.map(item => (item.id === record.id ? updatedPermission : item)));
        return updatedPermission;
    };

    const handleDelete = async (record: Permission): Promise<Permission> => {
        console.log("Deleting permission:", record);

        // Simulate API validation
        if (record.isSystemPermission) {
            throw new Error("Cannot delete system permissions");
        }

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));

        setPermissions(prev => prev.filter(item => item.id !== record.id));
        return record;
    };

    // Advanced filtering with server-side simulation
    const handleFilter = async (data: Permission[], filters: Record<string, any>): Promise<any> => {
        console.log("Applying filters:", filters);

        // Simulate server-side filtering with pagination
        let filteredData = [...data];

        // Apply filters
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                if (key === "_pagination") return; // Skip pagination meta

                filteredData = filteredData.filter(item => {
                    const itemValue = item[key as keyof Permission];

                    if (typeof value === "string" && typeof itemValue === "string") {
                        return itemValue.toLowerCase().includes(value.toLowerCase());
                    }
                    return itemValue === value;
                });
            }
        });

        // Handle pagination
        const pagination = filters._pagination || { page: 1, pageSize: 10 };
        const startIndex = (pagination.page - 1) * pagination.pageSize;
        const endIndex = startIndex + pagination.pageSize;

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));

        // Return paginated response format
        return {
            data: filteredData.slice(startIndex, endIndex),
            total: filteredData.length,
            current: pagination.page,
            pageSize: pagination.pageSize,
        };
    };

    // Bulk operations
    const handleBulkStatusUpdate = async (selectedKeys: string[], status: string) => {
        console.log("Bulk status update:", selectedKeys, status);

        await new Promise(resolve => setTimeout(resolve, 1000));

        setPermissions(prev =>
            prev.map(permission =>
                selectedKeys.includes(permission.id)
                    ? {
                          ...permission,
                          status: status as Permission["status"],
                          updatedAt: new Date().toISOString().split("T")[0],
                      }
                    : permission,
            ),
        );

        message.success(`${selectedKeys.length} permissions updated to ${status}`);
    };

    const handleBulkEdit = (selectedKeys: string[]) => {
        setBulkEditModalVisible(true);
        // Pre-fill form with common values from selected items
        const selectedItems = permissions.filter(p => selectedKeys.includes(p.id));
        const commonModule = selectedItems.every(item => item.module === selectedItems[0].module)
            ? selectedItems[0].module
            : undefined;

        bulkEditForm.setFieldsValue({
            module: commonModule,
        });
    };

    const handleBulkEditSubmit = async (values: any) => {
        // Get currently selected rows (you'd need to track this in real implementation)
        const selectedKeys = ["1", "2"]; // Example

        await new Promise(resolve => setTimeout(resolve, 1000));

        setPermissions(prev =>
            prev.map(permission =>
                selectedKeys.includes(permission.id)
                    ? {
                          ...permission,
                          ...values,
                          updatedAt: new Date().toISOString().split("T")[0],
                      }
                    : permission,
            ),
        );

        setBulkEditModalVisible(false);
        bulkEditForm.resetFields();
        message.success(`${selectedKeys.length} permissions updated`);
    };

    const handleExport = (selectedRows: Permission[], format: string) => {
        console.log("Exporting data:", selectedRows, format);

        // Simulate export functionality
        const dataToExport = selectedRows.map(row => ({
            Name: row.name,
            Slug: row.slug,
            Module: row.module,
            Status: row.status,
            Level: row.level,
            Created: row.createdAt,
        }));

        if (format === "csv") {
            // Simple CSV generation for demo
            const csv = [
                Object.keys(dataToExport[0]).join(","),
                ...dataToExport.map(row => Object.values(row).join(",")),
            ].join("\n");

            const blob = new Blob([csv], { type: "text/csv" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `permissions-${new Date().toISOString().split("T")[0]}.csv`;
            a.click();
        }

        message.success(`Exported ${selectedRows.length} records as ${format.toUpperCase()}`);
    };

    const duplicatePermission = async (record: Permission) => {
        const duplicated: Partial<Permission> = {
            ...record,
            name: `${record.name} (Copy)`,
            slug: `${record.slug}_copy_${Date.now()}`,
            isSystemPermission: false, // Duplicates are always custom
        };

        await handleCreate(duplicated);
        message.success("Permission duplicated successfully");
    };

    return (
        <div style={{ padding: "24px" }}>
            <QuickUI
                // === BASIC CONFIGURATION ===
                title="Permission Management"
                formSchema={permissionFormSchema}
                crudType="modal" // Options: "modal" | "drawer" | "page" | "route"
                icon="AiOutlineSecurityScan"
                initialData={permissions}
                // === DATA MANAGEMENT ===
                onDataChange={data => {
                    console.log("Data changed:", data.length, "items");
                }}
                onRecordView={record => {
                    console.log("Viewing record:", record.name);
                    message.info(`Viewing permission: ${record.name}`);
                }}
                onRecordCreate={handleCreate}
                onRecordUpdate={handleUpdate}
                onRecordDelete={handleDelete}
                onFilter={handleFilter}
                // === UI CUSTOMIZATION ===
                tableColumns={customTableColumns}
                tableProps={{
                    bordered: true,
                    size: "middle",
                    scroll: { x: 1200 },
                    pagination: {
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total: any, range: any) => `${range[0]}-${range[1]} of ${total} permissions`,
                    },
                }}
                formProps={{
                    layout: "vertical",
                    size: "large",
                }}
                emptyText="No permissions found. Create your first permission to get started."
                showToggleCrudType={true} // Allow switching between modal/drawer/page modes
                showFilter={true}
                // === ACTIONS CONFIGURATION ===
                actions={{
                    view: true,
                    edit: true,
                    delete: true,
                    extraActions: (record, permissions) => {
                        const actions = [];

                        // Duplicate action for all records
                        actions.push(
                            <Button
                                key="duplicate"
                                size="small"
                                icon={<CopyOutlined />}
                                onClick={() => duplicatePermission(record)}
                                disabled={!permissions?.canCreate}
                                title="Duplicate Permission"
                            >
                                Duplicate
                            </Button>,
                        );

                        // Status toggle for non-system permissions
                        if (!record.isSystemPermission) {
                            const isActive = record.status === "active";
                            actions.push(
                                <Button
                                    key="toggle-status"
                                    size="small"
                                    type={isActive ? "default" : "primary"}
                                    icon={isActive ? <LockOutlined /> : <UnlockOutlined />}
                                    onClick={async () => {
                                        const newStatus = isActive ? "inactive" : "active";
                                        await handleUpdate({ ...record, status: newStatus });
                                        message.success(
                                            `Permission ${newStatus === "active" ? "activated" : "deactivated"}`,
                                        );
                                    }}
                                    disabled={!permissions?.canEdit}
                                >
                                    {isActive ? "Deactivate" : "Activate"}
                                </Button>,
                            );
                        }

                        return actions;
                    },
                }}
                // === FILTERING ===
                filterFields={[
                    { name: "name", label: "Name", type: "text" },
                    {
                        name: "module",
                        label: "Module",
                        type: "select",
                        options: [
                            { value: "User Management", label: "User Management" },
                            { value: "Role Management", label: "Role Management" },
                            { value: "System", label: "System" },
                        ],
                    },
                    {
                        name: "status",
                        label: "Status",
                        type: "select",
                        options: [
                            { value: "active", label: "Active" },
                            { value: "inactive", label: "Inactive" },
                            { value: "pending", label: "Pending" },
                        ],
                    },
                    {
                        name: "level",
                        label: "Level",
                        type: "select",
                        options: [
                            { value: "basic", label: "Basic" },
                            { value: "advanced", label: "Advanced" },
                            { value: "admin", label: "Admin" },
                        ],
                    },
                ]}
                // === MESSAGES ===
                confirmTexts={{
                    delete: "Are you sure you want to delete this permission? This action cannot be undone.",
                    create: "Create Permission",
                    update: "Update Permission",
                }}
                successMessages={{
                    create: "Permission created successfully!",
                    update: "Permission updated successfully!",
                    delete: "Permission deleted successfully!",
                }}
                // === STATISTICS ===
                statistics={data => [
                    {
                        key: "total",
                        label: "Total Permissions",
                        value: data.length,
                        color: "#1890ff",
                        icon: <SecurityScanOutlined />,
                    },
                    {
                        key: "active",
                        label: "Active Permissions",
                        value: data.filter(p => p.status === "active").length,
                        color: "#52c41a",
                        icon: <UnlockOutlined />,
                    },
                    {
                        key: "system",
                        label: "System Permissions",
                        value: data.filter(p => p.isSystemPermission).length,
                        color: "#722ed1",
                        icon: <LockOutlined />,
                    },
                    {
                        key: "admin-level",
                        label: "Admin Level",
                        value: data.filter(p => p.level === "admin").length,
                        color: "#fa541c",
                        icon: <TeamOutlined />,
                    },
                ]}
                // === BATCH ACTIONS ===
                rowSelection={true}
                batchActions={(selectedRowKeys, selectedRows, permissions) => {
                    const hasActivePermissions = selectedRows.some(row => row.status === "active");
                    const hasInactivePermissions = selectedRows.some(row => row.status === "inactive");
                    const hasNonSystemPermissions = selectedRows.some(row => !row.isSystemPermission);

                    return (
                        <Space wrap>
                            {/* Status Actions */}
                            {permissions?.canEdit && hasInactivePermissions && (
                                <Button
                                    type="primary"
                                    icon={<UnlockOutlined />}
                                    onClick={() => handleBulkStatusUpdate(selectedRowKeys, "active")}
                                >
                                    Activate Selected ({selectedRowKeys.length})
                                </Button>
                            )}

                            {permissions?.canEdit && hasActivePermissions && (
                                <Button
                                    icon={<LockOutlined />}
                                    onClick={() => handleBulkStatusUpdate(selectedRowKeys, "inactive")}
                                >
                                    Deactivate Selected ({selectedRowKeys.length})
                                </Button>
                            )}

                            {/* Bulk Edit */}
                            {permissions?.canEdit && (
                                <Button icon={<EditOutlined />} onClick={() => handleBulkEdit(selectedRowKeys)}>
                                    Bulk Edit
                                </Button>
                            )}

                            {/* Export Actions */}
                            <Button icon={<ExportOutlined />} onClick={() => handleExport(selectedRows, "csv")}>
                                Export CSV
                            </Button>

                            {/* Delete Action (only for non-system permissions) */}
                            {permissions?.canDelete && hasNonSystemPermissions && (
                                <Button
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={async () => {
                                        const nonSystemRows = selectedRows.filter(row => !row.isSystemPermission);
                                        for (const row of nonSystemRows) {
                                            await handleDelete(row);
                                        }
                                        message.success(`${nonSystemRows.length} permissions deleted`);
                                    }}
                                >
                                    Delete Non-System ({selectedRows.filter(row => !row.isSystemPermission).length})
                                </Button>
                            )}
                        </Space>
                    );
                }}
                // === ADVANCED FORM CONFIGURATION ===
                validateOnMount={false}
                preserveFormData={false}
                beforeFormSubmit={async values => {
                    console.log("Before form submit:", values);

                    // Transform data before submission
                    return {
                        ...values,
                        slug: values.slug?.toLowerCase().replace(/\s+/g, "_"),
                        updatedAt: new Date().toISOString().split("T")[0],
                    };
                }}
                afterFormSubmit={(values, result) => {
                    console.log("After form submit:", { values, result });
                    // Could trigger additional actions like audit logging
                }}
                renderExtraFormActions={(form, editingRecord, permissions) => (
                    <Space>
                        {editingRecord && !editingRecord.isSystemPermission && (
                            <Button
                                onClick={() => duplicatePermission(editingRecord)}
                                disabled={!permissions?.canCreate}
                            >
                                Save & Duplicate
                            </Button>
                        )}
                        {editingRecord && (
                            <Button type="link" onClick={() => console.log("View audit log")}>
                                View History
                            </Button>
                        )}
                    </Space>
                )}
                // === PERMISSIONS ===
                permissions={{
                    view: "permissions.view",
                    create: "permissions.create",
                    edit: "permissions.edit",
                    delete: "permissions.delete",
                    filter: "permissions.filter",
                    export: "permissions.export",
                }}
                checkPermission={checkPermission}
                // === ROUTE CONFIGURATION (for route-based CRUD) ===
                routeConfig={{
                    basePath: "/admin/permissions",
                    createPath: "/admin/permissions/create",
                    editPath: "/admin/permissions/[id]/edit",
                    viewPath: "/admin/permissions/[id]",
                    listPath: "/admin/permissions",
                    paramName: "id",
                }}
                currentAction="list" // For route-based: "list" | "create" | "edit" | "view"
                // currentRecordId="1" // For route-based edit/view
                onNavigate={(path, params) => {
                    console.log("Navigate to:", path, params);
                    // Custom navigation logic
                }}
            />

            {/* Bulk Edit Modal */}
            <Modal
                title="Bulk Edit Permissions"
                open={bulkEditModalVisible}
                onCancel={() => setBulkEditModalVisible(false)}
                onOk={() => bulkEditForm.submit()}
                width={600}
            >
                <Form form={bulkEditForm} layout="vertical" onFinish={handleBulkEditSubmit}>
                    <Form.Item name="module" label="Module">
                        <Select placeholder="Select module (leave empty to keep current values)" allowClear>
                            <Select.Option value="User Management">User Management</Select.Option>
                            <Select.Option value="Role Management">Role Management</Select.Option>
                            <Select.Option value="System">System</Select.Option>
                            <Select.Option value="Reports">Reports</Select.Option>
                            <Select.Option value="Settings">Settings</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="status" label="Status">
                        <Select placeholder="Select status (leave empty to keep current values)" allowClear>
                            <Select.Option value="active">Active</Select.Option>
                            <Select.Option value="inactive">Inactive</Select.Option>
                            <Select.Option value="pending">Pending</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="level" label="Permission Level">
                        <Select placeholder="Select level (leave empty to keep current values)" allowClear>
                            <Select.Option value="basic">Basic</Select.Option>
                            <Select.Option value="advanced">Advanced</Select.Option>
                            <Select.Option value="admin">Admin</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default PermissionPage;
