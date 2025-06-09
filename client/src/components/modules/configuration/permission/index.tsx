"use client";
import QuickUI from "@components/common/AppCRUDOperation";
import { FormSchema } from "@components/common/AppForm/form.type";
import { createPermission } from "@lib/actions/modules/permission/permissionActions";
import { usePathname } from "next/navigation";
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
const initialPermissions: Permission[] = Array.from({ length: 20 }, (_, i) =>
    transformApiToUI({
        key: `permission-${i + 1}`,
        id: i,
        slug: `permission-${i + 1}`,
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
);

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
            grid: {
                xs: 12,
            },
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
            grid: {
                xs: 12,
            },
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

const PermissionPage = ({ data }: any) => {
    console.log("PermissionPage data:", data);
    const [permissions, setPermissions] = useState<Permission[]>(data?.data?.list);
    const pathname = usePathname();

    // CRUD Handlers for API integration
    const handleCreate = async (record: Partial<Permission>): Promise<Permission> => {
        try {
            const data = await createPermission(record);

            return data;
        } catch (error) {
            console.error("Error creating permission:", error);
            throw new Error("Failed to create permission. Please try again.");
        }
    };

    const handleUpdate = async (record: Permission): Promise<Permission> => {
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 800));

            // Transform UI data to API format
            const apiPayload = {
                slug: record.slug,
                name: record.name,
                status: record.status === "active" ? 1 : 0,
                updated_by: 1,
                // Add other required API fields
            };

            // TODO: Replace with actual API call
            // const response = await fetch(`/api/permissions/${record.id}`, {
            //     method: 'PUT',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(apiPayload)
            // });
            // const apiData = await response.json();

            // Mock API response
            const mockApiResponse = {
                id: parseInt(record.id),
                slug: record.slug,
                name: record.name,
                message_id: record.message_id,
                status: record.status === "active" ? 1 : 0,
                created_by: record.created_by,
                updated_by: 1,
                deleted_by: record.deleted_by,
                created_at: record.createdAt,
                updated_at: new Date().toISOString(),
                deleted_at: record.deleted_at,
                deleted: record.deleted,
            };

            // Transform API response back to UI format
            const updatedPermission = transformApiToUI(mockApiResponse);

            // Update local state
            setPermissions(prev => prev.map(p => (p.id === record.id ? updatedPermission : p)));

            return updatedPermission;
        } catch (error) {
            console.error("Error updating permission:", error);
            throw new Error("Failed to update permission. Please try again.");
        }
    };

    const handleDelete = async (record: Permission): Promise<Permission> => {
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 500));

            // TODO: Replace with actual API call
            // const response = await fetch(`/api/permissions/${record.id}`, {
            //     method: 'DELETE'
            // });
            // if (!response.ok) throw new Error('Delete failed');

            // Simulate successful deletion
            console.log(`Deleting permission with ID: ${record.id}`);

            // Update local state
            setPermissions(prev => prev.filter(p => p.id !== record.id));

            return record;
        } catch (error) {
            console.error("Error deleting permission:", error);
            throw new Error("Failed to delete permission. Please try again.");
        }
    };

    // Optional: Handle filtering with API integration
    const handleFilter = async (data: Permission[], filters: Record<string, any>): Promise<Permission[]> => {
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 300));

            console.log("Applying filters:", filters);

            // TODO: Replace with actual API call
            // const queryParams = new URLSearchParams();
            // Object.entries(filters).forEach(([key, value]) => {
            //     if (value && key !== '_pagination') {
            //         queryParams.append(key, value);
            //     }
            // });
            //
            // const response = await fetch(`/api/permissions?${queryParams.toString()}`);
            // const apiData = await response.json();
            // return apiData.data.map(transformApiToUI);

            // Client-side filtering for demonstration
            let filteredData = [...data];

            Object.entries(filters).forEach(([key, value]) => {
                if (value && key !== "_pagination") {
                    filteredData = filteredData.filter(item => {
                        const itemValue = item[key as keyof Permission];
                        if (typeof value === "string" && typeof itemValue === "string") {
                            return itemValue.toLowerCase().includes(value.toLowerCase());
                        }
                        return itemValue === value;
                    });
                }
            });

            // Handle pagination if provided
            if (filters._pagination) {
                const { page, pageSize } = filters._pagination;
                const startIndex = (page - 1) * pageSize;
                const endIndex = startIndex + pageSize;
                return filteredData.slice(startIndex, endIndex);
            }

            return filteredData;
        } catch (error) {
            console.error("Error filtering permissions:", error);
            throw new Error("Failed to filter permissions. Please try again.");
        }
    };

    return (
        <div>
            <QuickUI
                title="Permission Management"
                formSchema={permissionFormSchema}
                crudType="modal"
                icon="AiOutlineSecurityScan"
                validateOnMount={false}
                preserveFormData={false}
                currentAction="list"
                initialData={permissions}
                onRecordCreate={handleCreate}
                onRecordUpdate={handleUpdate}
                onRecordDelete={handleDelete}
                onDataChange={newData => {
                    console.log("Data changed:", newData);
                    // Optional: Sync with parent component or global state
                }}
                tableProps={{
                    bordered: true,
                    size: "middle",
                    scroll: { x: 1200 },
                }}
                formProps={{
                    layout: "vertical",
                    size: "large",
                }}
                emptyText="No permissions found. Create your first permission to get started."
                showToggleCrudType={false}
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
                beforeFormSubmit={values => {
                    // Optional: Transform or validate data before submission
                    console.log("Form values before submit:", values);
                    return {
                        ...values,
                        slug: values.slug?.toLowerCase().replace(/\s+/g, "_"),
                    };
                }}
                afterFormSubmit={(values, result) => {
                    // Optional: Handle post-submission actions
                    console.log("Form submitted successfully:", { values, result });
                }}
            />
        </div>
    );
};

export default PermissionPage;
