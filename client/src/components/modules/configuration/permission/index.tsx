"use client";
import { FormSchema } from "@components/common/AppForm/form.type";
import QuickUI from "@components/common/QuickUI";
import { Button, Space } from "antd";
import { useState } from "react";

// Define a type for permission records
interface Permission {
    id: string;
    slug?: string;
    status?: boolean;
    name: string;
}

// Sample permissions data
const initialPermissions: Permission[] = [
    { id: "1", name: "create", slug: "create_permission", status: true },
    { id: "2", name: "read", slug: "read_permission", status: true },
    { id: "3", name: "update", slug: "update_permission", status: true },
    { id: "4", name: "delete", slug: "delete_permission", status: true },
    { id: "5", name: "manage_users", slug: "manage_users_permission", status: true },
];

// Define form schema using AppForm's schema format
const permissionFormSchema: FormSchema = {
    layout: "vertical",
    size: "middle",
    fields: [
        {
            name: "id",
            label: "ID",
            type: "input",
            required: true,
            hidden: true,
        },
        {
            name: "slug",
            label: "Permission Slug",
            type: "input",
            required: true,
            placeholder: "Enter permission slug",
            grid: { xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24 },
            filterable: true,
            hidden: true,
        },
        {
            name: "name",
            label: "Permission Name",
            type: "input",
            required: true,
            placeholder: "Enter permission name",
            grid: { xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24 },
            filterable: true,
        },
    ],
    validation: {
        validateTrigger: ["onChange", "onBlur"],
        scrollToError: true,
    },
};

const PermissionPage = () => {
    const [permissions, setPermissions] = useState<Permission[]>(initialPermissions);

    // Handle API calls (simulated)
    const handleCreate = async (record: Permission): Promise<Permission> => {
        console.log("Creating permission:", record);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        const newData = [...permissions, record];
        setPermissions(newData);
        return record;
    };

    const handleUpdate = async (record: Permission): Promise<Permission> => {
        console.log("Updating permission:", record);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        const newData = permissions.map(item => (item.id === record.id ? record : item));
        setPermissions(newData);
        return record;
    };

    const handleDelete = async (record: Permission): Promise<Permission> => {
        console.log("Deleting permission:", record);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        const newData = permissions.filter(item => item.id !== record.id);
        setPermissions(newData);
        return record;
    };

    // filter data based on filter form
    const filterData = async (data: Permission[], filter: Partial<Permission>): Promise<Permission[]> => {
        console.log({
            data,
            filter,
        });
        return data.filter(item => {
            return Object.keys(filter).every(key => {
                if (key === "name" && filter.name) {
                    return item.name.toLowerCase().includes(filter.name.toLowerCase());
                }
                if (key === "slug" && filter.slug) {
                    return item.slug?.toLowerCase().includes(filter.slug.toLowerCase());
                }
                return true;
            });
        });
    };

    return (
        <QuickUI
            title="Permissions"
            formSchema={permissionFormSchema}
            crudType="modal"
            icon="AiOutlineTeam"
            initialData={permissions}
            onRecordCreate={handleCreate}
            onRecordUpdate={handleUpdate}
            onRecordDelete={handleDelete}
            onFilter={filterData}
            showToggleCrudType={false}
            // statistics={[
            //     { key: "total", label: "Total Permissions", value: permissions.length, color: "#1890ff" },
            //     {
            //         key: "active",
            //         label: "Active Permissions",
            //         value: permissions.filter(p => p.isActive).length,
            //         color: "#52c41a",
            //     },
            // ]}
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
            batchActions={(selectedRowKeys: string[], selectedRows: Permission[]) => {
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
                            danger
                            onClick={() => {
                                // Handle batch deactivation
                                const updatedPermissions = permissions.map(permission => {
                                    if (selectedRowKeys.includes(permission.id)) {
                                        return { ...permission, isActive: false };
                                    }
                                    return permission;
                                });
                                setPermissions(updatedPermissions);
                            }}
                        >
                            Deactivate Selected
                        </Button>
                    </Space>
                );
            }}
        />
    );
};

export default PermissionPage;
