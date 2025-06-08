"use client";
import QuickUI from "@components/common/AppCRUDOperation";
import { FormSchema } from "@components/common/AppForm/form.type";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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

const PermissionPage = () => {
    const [permissions, setPermissions] = useState<Permission[]>(initialPermissions);

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

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
            />
        </div>
    );
};

export default PermissionPage;
