"use client";
import {
    DeleteOutlined,
    EditOutlined,
    ExportOutlined,
    LockOutlined,
    SecurityScanOutlined,
    TeamOutlined,
    UnlockOutlined,
} from "@ant-design/icons";
import QuickUI from "@components/common/AppCRUDOperation";
import { FormSchema } from "@components/common/AppForm/form.type";
import { Button, Form, message, Modal, Select, Space } from "antd";
import { useState } from "react";

// Define a type for permission records matching your API structure
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
    // API-specific fields
    message_id?: number | null;
    created_by: number;
    updated_by: number;
    deleted_by: number;
    deleted_at: string | null;
    deleted: number;
}

// Transform API data to UI format
const transformApiToUI = (apiData: any): Permission => ({
    id: String(apiData.id),
    slug: apiData.slug,
    name: apiData.name,
    description: `Permission for ${apiData.name}`,
    module: "System", // Default module
    status: apiData.status === 1 ? "active" : "inactive",
    createdAt: new Date(apiData.created_at).toISOString().split("T")[0],
    updatedAt: new Date(apiData.updated_at).toISOString().split("T")[0],
    createdBy: `User ${apiData.created_by}`,
    level: "basic" as const,
    isSystemPermission: apiData.created_by === 0, // System created permissions
    // Keep API fields
    message_id: apiData.message_id,
    created_by: apiData.created_by,
    updated_by: apiData.updated_by,
    deleted_by: apiData.deleted_by,
    deleted_at: apiData.deleted_at,
    deleted: apiData.deleted,
});

// Sample permissions data based on your API structure
const initialPermissions: Permission[] = [
    transformApiToUI({
        id: 1,
        slug: "create",
        name: "no-permission-required",
        message_id: null,
        status: 1,
        created_by: 0,
        updated_by: 1,
        deleted_by: 0,
        created_at: "2025-05-02T18:22:52.489Z",
        updated_at: "2025-05-02T18:24:18.000Z",
        deleted_at: null,
        deleted: 0,
    }),
    transformApiToUI({
        id: 2,
        slug: "read",
        name: "view-permission-required",
        message_id: null,
        status: 1,
        created_by: 1,
        updated_by: 1,
        deleted_by: 0,
        created_at: "2025-05-02T18:22:52.489Z",
        updated_at: "2025-05-02T18:24:18.000Z",
        deleted_at: null,
        deleted: 0,
    }),
    transformApiToUI({
        id: 3,
        slug: "update",
        name: "edit-permission-required",
        message_id: null,
        status: 0,
        created_by: 1,
        updated_by: 1,
        deleted_by: 0,
        created_at: "2025-05-02T18:22:52.489Z",
        updated_at: "2025-05-02T18:24:18.000Z",
        deleted_at: null,
        deleted: 0,
    }),
];

// Comprehensive form schema demonstrating all field types and configurations
const permissionFormSchema: FormSchema = {
    layout: "vertical",
    size: "middle",
    // Using tabs to organize complex forms
    fields: [
        {
            name: "id",
            label: "Permission ID",
            type: "input",
            hidden: true,
            hideInTable: true,
        },
        {
            name: "slug",
            label: "Slug",
            type: "input",
            hideInForm: true,
            filterable: true,
            rules: [
                { required: true, message: "Please enter a unique slug" },
                {
                    pattern: /^[a-z0-9_-]+$/,
                    message: "Slug must be lowercase and can contain letters, numbers, underscores, and hyphens",
                },
            ],
            placeholder: "Enter unique slug (e.g., create_user)",
        },
        {
            name: "name",
            label: "Permission Name",
            type: "input",
            filterable: true,
            rules: [{ required: true, message: "Please enter the permission name" }],
            placeholder: "Enter permission name",
            tooltip: "The name of the permission, e.g., 'Create User'",
        },
    ],
    validation: {
        validateTrigger: ["onChange", "onBlur"],
        scrollToError: true,
    },
};

const PermissionPage = () => {
    const [permissions, setPermissions] = useState<Permission[]>(initialPermissions);
    const [bulkEditModalVisible, setBulkEditModalVisible] = useState(false);
    const [bulkEditForm] = Form.useForm();

    // Simulate permission checking
    const checkPermission = (permission: string | string[]): boolean => {
        console.log("Checking permission:", permission);
        return true;
    };

    // CRUD Handlers for API integration
    const handleCreate = async (record: Partial<Permission>): Promise<Permission> => {
        console.log("Creating permission:", record);

        // Simulate API validation
        const existingSlug = permissions.find(p => p.slug === record.slug);
        if (existingSlug) {
            throw new Error("Permission slug already exists");
        }

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Transform to API format for creation
        const apiData = {
            id: Date.now(),
            slug: record.slug,
            name: record.name,
            message_id: record.message_id || null,
            status: record.status === "active" ? 1 : 0,
            created_by: 1, // Current user
            updated_by: 1,
            deleted_by: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            deleted_at: null,
            deleted: 0,
        };

        const newPermission = transformApiToUI({
            ...apiData,
            ...record,
        });

        setPermissions(prev => [...prev, newPermission]);
        return newPermission;
    };

    const handleUpdate = async (record: Permission): Promise<Permission> => {
        console.log("Updating permission:", record);

        await new Promise(resolve => setTimeout(resolve, 800));

        const updatedRecord = {
            ...record,
            updatedAt: new Date().toISOString().split("T")[0],
            updated_by: 1, // Current user
        };

        setPermissions(prev => prev.map(item => (item.id === record.id ? updatedRecord : item)));
        return updatedRecord;
    };

    const handleDelete = async (record: Permission): Promise<Permission> => {
        console.log("Deleting permission:", record);

        if (record.isSystemPermission) {
            throw new Error("Cannot delete system permissions");
        }

        await new Promise(resolve => setTimeout(resolve, 500));

        setPermissions(prev => prev.filter(item => item.id !== record.id));
        return record;
    };

    // Enhanced filtering with API data structure
    const handleFilter = async (data: Permission[], filters: Record<string, any>): Promise<any> => {
        console.log("Applying filters:", filters);

        let filteredData = [...data];

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                if (key === "_pagination") return;

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

        await new Promise(resolve => setTimeout(resolve, 300));

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
            isSystemPermission: false,
            message_id: null, // Reset for duplicated
        };

        await handleCreate(duplicated);
        message.success("Permission duplicated successfully");
    };

    return (
        <div>
            <QuickUI
                title="Permission Management"
                formSchema={permissionFormSchema}
                crudType="modal"
                icon="AiOutlineSecurityScan"
                initialData={permissions}
                onDataChange={data => {
                    console.log("Data changed:", data.length, "items");
                }}
                onRecordView={record => {
                    console.log("Viewing record:", record.name);
                    // Remove message.info as it can interfere with navigation
                }}
                onRecordCreate={handleCreate}
                onRecordUpdate={handleUpdate}
                onRecordDelete={handleDelete}
                onFilter={handleFilter}
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
                showToggleCrudType={true}
                showFilter={true}
                actions={{
                    view: true,
                    edit: true,
                    delete: true,
                }}
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
                        key: "custom",
                        label: "Custom Permissions",
                        value: data.filter(p => !p.isSystemPermission).length,
                        color: "#fa541c",
                        icon: <TeamOutlined />,
                    },
                ]}
                rowSelection={true}
                batchActions={(selectedRowKeys, selectedRows, permissions) => {
                    const hasActivePermissions = selectedRows.some(row => row.status === "active");
                    const hasInactivePermissions = selectedRows.some(row => row.status === "inactive");
                    const hasNonSystemPermissions = selectedRows.some(row => !row.isSystemPermission);

                    return (
                        <Space wrap>
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

                            {permissions?.canEdit && (
                                <Button icon={<EditOutlined />} onClick={() => handleBulkEdit(selectedRowKeys)}>
                                    Bulk Edit
                                </Button>
                            )}

                            <Button icon={<ExportOutlined />} onClick={() => handleExport(selectedRows, "csv")}>
                                Export CSV
                            </Button>

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
                validateOnMount={false}
                preserveFormData={false}
                beforeFormSubmit={async values => {
                    console.log("Before form submit:", values);
                    return {
                        ...values,
                        slug: values.slug?.toLowerCase().replace(/\s+/g, "_"),
                        updatedAt: new Date().toISOString().split("T")[0],
                    };
                }}
                afterFormSubmit={(values, result) => {
                    console.log("After form submit:", { values, result });
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
                permissions={{
                    view: "permissions.view",
                    create: "permissions.create",
                    edit: "permissions.edit",
                    delete: "permissions.delete",
                    filter: "permissions.filter",
                    export: "permissions.export",
                }}
                checkPermission={checkPermission}
                routeConfig={{
                    basePath: "/admin/permissions",
                    createPath: "/admin/permissions/create",
                    editPath: "/admin/permissions/[id]/edit",
                    viewPath: "/admin/permissions/[id]",
                    listPath: "/admin/permissions",
                    paramName: "id",
                }}
                currentAction="list"
                onNavigate={(path, params) => {
                    console.log("Navigate to:", path, params);
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
