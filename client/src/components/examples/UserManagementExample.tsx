"use client";

import { MailOutlined, ShieldCheckOutlined, UserOutlined } from "@ant-design/icons";
import QuickUI from "@components/common/AppCRUDOperation";
import { Button, Space, Tag } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const UserManagementExample = () => {
    const router = useRouter();
    const pathname = usePathname();

    // Extract current action and record ID from URL
    const pathSegments = pathname.split("/").filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1];
    const secondLastSegment = pathSegments[pathSegments.length - 2];

    let currentAction: "list" | "create" | "edit" | "view" = "list";
    let currentRecordId: string | undefined;

    if (lastSegment === "create") {
        currentAction = "create";
    } else if (lastSegment === "edit") {
        currentAction = "edit";
        currentRecordId = secondLastSegment;
    } else if (pathSegments.includes("users") && lastSegment !== "users" && lastSegment !== "create") {
        currentAction = "view";
        currentRecordId = lastSegment;
    }

    // Example user data
    const [users, setUsers] = useState([
        {
            id: "1",
            name: "John Doe",
            email: "john@example.com",
            role: "admin",
            department: "IT",
            active: true,
            createdAt: "2023-01-15",
            phone: "+1-555-0123",
        },
        {
            id: "2",
            name: "Jane Smith",
            email: "jane@example.com",
            role: "user",
            department: "Marketing",
            active: true,
            createdAt: "2023-02-20",
            phone: "+1-555-0124",
        },
        {
            id: "3",
            name: "Bob Wilson",
            email: "bob@example.com",
            role: "moderator",
            department: "Support",
            active: false,
            createdAt: "2023-03-10",
            phone: "+1-555-0125",
        },
    ]);

    // Example user permissions (in real app, this would come from auth context)
    const userPermissions = ["users.view", "users.create", "users.edit", "users.delete", "users.filter"];

    const checkPermission = (permission: string | string[]): boolean => {
        if (Array.isArray(permission)) {
            return permission.some(p => userPermissions.includes(p));
        }
        return userPermissions.includes(permission);
    };

    // Form schema for user management
    const userFormSchema = {
        layout: "vertical",
        sections: [
            {
                title: "Basic Information",
                fields: [
                    {
                        name: "name",
                        label: "Full Name",
                        type: "text",
                        required: true,
                        grid: { xs: 24, sm: 12 },
                        rules: [{ required: true, message: "Please enter full name" }],
                        placeholder: "Enter user's full name",
                    },
                    {
                        name: "email",
                        label: "Email Address",
                        type: "email",
                        required: true,
                        grid: { xs: 24, sm: 12 },
                        rules: [
                            { required: true, message: "Please enter email" },
                            { type: "email", message: "Please enter valid email" },
                        ],
                        placeholder: "Enter email address",
                    },
                    {
                        name: "phone",
                        label: "Phone Number",
                        type: "text",
                        grid: { xs: 24, sm: 12 },
                        placeholder: "Enter phone number",
                    },
                    {
                        name: "role",
                        label: "User Role",
                        type: "select",
                        required: true,
                        grid: { xs: 24, sm: 12 },
                        options: [
                            { value: "admin", label: "Administrator" },
                            { value: "user", label: "Regular User" },
                            { value: "moderator", label: "Moderator" },
                        ],
                        filterable: true,
                        sortable: true,
                    },
                ],
            },
            {
                title: "Additional Details",
                fields: [
                    {
                        name: "department",
                        label: "Department",
                        type: "select",
                        grid: { xs: 24, sm: 12 },
                        options: [
                            { value: "IT", label: "Information Technology" },
                            { value: "Marketing", label: "Marketing" },
                            { value: "Sales", label: "Sales" },
                            { value: "Support", label: "Customer Support" },
                            { value: "HR", label: "Human Resources" },
                        ],
                        filterable: true,
                    },
                    {
                        name: "active",
                        label: "Account Status",
                        type: "switch",
                        defaultValue: true,
                        grid: { xs: 24, sm: 12 },
                        filterable: true,
                        render: (value: boolean) => (
                            <Tag color={value ? "green" : "red"}>{value ? "Active" : "Inactive"}</Tag>
                        ),
                    },
                ],
            },
        ],
    };

    // Statistics for dashboard
    const userStatistics = [
        {
            key: "total",
            label: "Total Users",
            value: users.length,
            color: "#1890ff",
            icon: <UserOutlined style={{ fontSize: 24 }} />,
        },
        {
            key: "active",
            label: "Active Users",
            value: users.filter(u => u.active).length,
            color: "#52c41a",
            icon: <ShieldCheckOutlined style={{ fontSize: 24 }} />,
        },
        {
            key: "admins",
            label: "Administrators",
            value: users.filter(u => u.role === "admin").length,
            color: "#722ed1",
            icon: <MailOutlined style={{ fontSize: 24 }} />,
        },
        {
            key: "inactive",
            label: "Inactive Users",
            value: users.filter(u => !u.active).length,
            color: "#ff4d4f",
            icon: <UserOutlined style={{ fontSize: 24 }} />,
        },
    ];

    // CRUD handlers
    const handleCreateUser = async (userData: any) => {
        console.log("Creating user:", userData);
        const newUser = {
            ...userData,
            id: Date.now().toString(),
            createdAt: new Date().toISOString().split("T")[0],
        };
        setUsers(prev => [...prev, newUser]);
        return newUser;
    };

    const handleUpdateUser = async (userData: any) => {
        console.log("Updating user:", userData);
        setUsers(prev => prev.map(user => (user.id === userData.id ? { ...user, ...userData } : user)));
        return userData;
    };

    const handleDeleteUser = async (userData: any) => {
        console.log("Deleting user:", userData);
        setUsers(prev => prev.filter(user => user.id !== userData.id));
    };

    const handleFilterUsers = async (data: any[], filters: Record<string, any>) => {
        console.log("Filtering users:", filters);
        let filteredData = [...data];

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                if (key === "name" || key === "email") {
                    // Text search
                    filteredData = filteredData.filter(user => user[key]?.toLowerCase().includes(value.toLowerCase()));
                } else {
                    // Exact match
                    filteredData = filteredData.filter(user => user[key] === value);
                }
            }
        });

        return filteredData;
    };

    return (
        <QuickUI
            title="User Management"
            formSchema={userFormSchema}
            crudType="route"
            initialData={users}
            icon="user"
            // Route configuration for Next.js 15 App Router
            routeConfig={{
                basePath: "/dashboard/users",
                createPath: "/dashboard/users/create",
                editPath: "/dashboard/users/[id]/edit",
                viewPath: "/dashboard/users/[id]",
                listPath: "/dashboard/users",
                paramName: "id",
            }}
            // Current route context
            currentAction={currentAction}
            currentRecordId={currentRecordId}
            // Permission system
            permissions={{
                view: "users.view",
                create: "users.create",
                edit: "users.edit",
                delete: "users.delete",
                filter: "users.filter",
            }}
            checkPermission={checkPermission}
            // Custom navigation handler (optional)
            onNavigate={(path, params) => {
                console.log("Navigating to:", path, params);
                router.push(path);
            }}
            // CRUD handlers
            onRecordCreate={handleCreateUser}
            onRecordUpdate={handleUpdateUser}
            onRecordDelete={handleDeleteUser}
            onFilter={handleFilterUsers}
            onRecordView={record => {
                console.log("Viewing user:", record);
            }}
            // UI customization
            actions={{
                view: true,
                edit: true,
                delete: true,
                extraActions: (record, permissions) =>
                    [
                        permissions?.canEdit && (
                            <Button
                                key="reset-password"
                                size="small"
                                onClick={() => {
                                    console.log("Reset password for:", record.name);
                                    // Handle password reset
                                }}
                            >
                                Reset Password
                            </Button>
                        ),
                        permissions?.canView && record.role === "admin" && (
                            <Button
                                key="view-audit"
                                size="small"
                                type="link"
                                onClick={() => {
                                    console.log("View audit log for:", record.name);
                                    // Handle audit log viewing
                                }}
                            >
                                Audit Log
                            </Button>
                        ),
                    ].filter(Boolean),
            }}
            // Batch actions for selected rows
            batchActions={(selectedKeys, selectedRows, permissions) => (
                <Space>
                    {permissions?.canEdit && (
                        <Button
                            type="primary"
                            onClick={() => {
                                console.log("Bulk edit users:", selectedKeys);
                                // Handle bulk edit
                            }}
                        >
                            Bulk Edit ({selectedKeys.length})
                        </Button>
                    )}
                    {permissions?.canDelete && (
                        <Button
                            danger
                            onClick={() => {
                                console.log("Bulk delete users:", selectedKeys);
                                // Handle bulk delete with confirmation
                            }}
                        >
                            Delete Selected ({selectedKeys.length})
                        </Button>
                    )}
                    <Button
                        onClick={() => {
                            console.log("Export selected users:", selectedKeys);
                            // Handle export
                        }}
                    >
                        Export Selected
                    </Button>
                </Space>
            )}
            // Statistics
            statistics={userStatistics}
            // Additional features
            showFilter={true}
            rowSelection={true}
            showToggleCrudType={true}
            // Custom messages
            confirmTexts={{
                delete: "Are you sure you want to delete this user? This action cannot be undone.",
                create: "Create User",
                update: "Update User",
            }}
            successMessages={{
                create: "User created successfully! Welcome email has been sent.",
                update: "User information updated successfully!",
                delete: "User has been deleted successfully.",
            }}
            // Form configuration
            validateOnMount={true}
            preserveFormData={false}
            // Custom form actions
            renderExtraFormActions={(form, editingRecord, permissions) => (
                <Space>
                    {editingRecord && permissions?.canEdit && (
                        <Button
                            onClick={() => {
                                console.log("Send welcome email to:", editingRecord.email);
                                // Handle send welcome email
                            }}
                        >
                            Send Welcome Email
                        </Button>
                    )}
                    {!editingRecord && (
                        <Button
                            onClick={() => {
                                // Pre-fill form with template data
                                form.setFieldsValue({
                                    role: "user",
                                    department: "IT",
                                    active: true,
                                });
                            }}
                        >
                            Use Template
                        </Button>
                    )}
                </Space>
            )}
            // Data change handler
            onDataChange={newData => {
                console.log("Data changed:", newData.length, "users");
            }}
            // Form submit handlers
            beforeFormSubmit={async values => {
                console.log("Before form submit:", values);
                // Add timestamps or modify data before submission
                return {
                    ...values,
                    updatedAt: new Date().toISOString().split("T")[0],
                };
            }}
            afterFormSubmit={(values, result) => {
                console.log("After form submit:", values, result);
                // Handle post-submission actions like logging, notifications, etc.
            }}
        />
    );
};

export default UserManagementExample;
