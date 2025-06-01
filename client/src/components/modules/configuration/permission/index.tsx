"use client";
import { FormSchema } from "@components/common/AppForm/form.type";
import Crud from "@components/common/Crud";
import { Button, Space } from "antd";
import { useState } from "react";

// Sample permissions data
const initialPermissions = [
    { id: "1", name: "create", description: "Can create resources", module: "products", isActive: true },
    { id: "2", name: "read", description: "Can read resources", module: "products", isActive: true },
    { id: "3", name: "update", description: "Can update resources", module: "products", isActive: true },
    { id: "4", name: "delete", description: "Can delete resources", module: "products", isActive: false },
    { id: "5", name: "manage_users", description: "Can manage users", module: "users", isActive: true },
];

// Define form schema using AppForm's schema format
const permissionFormSchema: FormSchema = {
    layout: "vertical",
    size: "middle",
    sections: [
        {
            title: "Basic Information",
            fields: [
                {
                    name: "name",
                    label: "Permission Name",
                    type: "input",
                    rules: [{ required: true, message: "Please input permission name!" }],
                    grid: { xs: 24, sm: 12 },
                    filterable: true,
                },
                {
                    name: "module",
                    label: "Module",
                    type: "select",
                    options: [
                        { value: "products", label: "Products" },
                        { value: "orders", label: "Orders" },
                        { value: "users", label: "Users" },
                        { value: "settings", label: "Settings" },
                    ],
                    rules: [{ required: true, message: "Please select a module!" }],
                    grid: { xs: 24, sm: 12 },
                    filterable: true,
                },
            ],
        },
        {
            title: "Additional Settings",
            fields: [
                {
                    name: "description",
                    label: "Description",
                    type: "input.text_area",
                    grid: { xs: 24 },
                    filterable: false,
                },
                {
                    name: "isActive",
                    label: "Active",
                    type: "switch",
                    rules: [{ required: true }],
                    grid: { xs: 24, sm: 12 },
                    filterable: true,
                    defaultValue: true,
                },
            ],
        },
    ],
    validation: {
        validateTrigger: ["onChange", "onBlur"],
        scrollToError: true,
    },
};

const PermissionPage = () => {
    const [permissions, setPermissions] = useState(initialPermissions);

    // Handle API calls (simulated)
    const handleCreate = async record => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        const newData = [...permissions, record];
        setPermissions(newData);
        return record;
    };

    const handleUpdate = async record => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        const newData = permissions.map(item => (item.id === record.id ? record : item));
        setPermissions(newData);
        return record;
    };

    const handleDelete = async record => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        const newData = permissions.filter(item => item.id !== record.id);
        setPermissions(newData);
        return record;
    };

    return (
        <Crud
            title="Permissions"
            formSchema={permissionFormSchema}
            crudType="drawer"
            icon="AiOutlineTeam"
            initialData={permissions}
            onRecordCreate={handleCreate}
            onRecordUpdate={handleUpdate}
            onRecordDelete={handleDelete}
            showToggleCrudType={true}
            statistics={[
                { key: "total", label: "Total Permissions", value: permissions.length, color: "#1890ff" },
                {
                    key: "active",
                    label: "Active Permissions",
                    value: permissions.filter(p => p.isActive).length,
                    color: "#52c41a",
                },
            ]}
            successMessages={{
                create: "Permission created successfully",
                update: "Permission updated successfully",
                delete: "Permission deleted successfully",
            }}
            tableProps={{
                bordered: true,
                size: "middle",
                pagination: { pageSize: 5 },
            }}
            rowSelection
            batchActions={(selectedRowKeys: any[], selectedRows: any[]) => {
                return (
                    <Space size="small">
                        <Button
                            type="primary"
                            onClick={() => {
                                // Handle batch activation logic
                                const updatedPermissions = permissions.map(permission => {
                                    if (selectedRowKeys.includes(permission.id)) {
                                        return { ...permission, isActive: true };
                                    }
                                    return permission;
                                });
                                setPermissions(updatedPermissions);
                            }}
                        >
                            Activate Selected
                        </Button>
                        <Button
                            type="primary"
                            onClick={() => {
                                // Handle batch activation logic
                                const updatedPermissions = permissions.map(permission => {
                                    if (selectedRowKeys.includes(permission.id)) {
                                        return { ...permission, isActive: true };
                                    }
                                    return permission;
                                });
                                setPermissions(updatedPermissions);
                            }}
                        >
                            Activate Selected
                        </Button>
                    </Space>
                );
            }}
        />
    );
};

export default PermissionPage;
