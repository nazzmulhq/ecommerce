"use client";
import QuickUI from "@components/common/AppCRUDOperation";
import { FormSchema } from "@components/common/AppForm/form.type";
import { getCookie } from "@lib/actions";
import { useSearchParams } from "next/navigation";

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
            hideInForm: true,
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

const PermissionPage = ({
    data,
    searchParams: initialSearchParams,
}: {
    data: any;
    searchParams?: Record<string, string>;
}) => {
    const searchParams = useSearchParams();
    console.log("PermissionPage data:", data);
    console.log("Initial search params:", initialSearchParams);

    // Extract current search parameters (prioritize client-side for real-time updates)
    const getCurrentFilters = () => {
        const filters: Record<string, any> = {};

        // Use client-side searchParams for real-time updates
        Array.from(searchParams.entries()).forEach(([key, value]) => {
            if (!["page", "limit", "pageSize"].includes(key) && value) {
                try {
                    filters[key] = JSON.parse(decodeURIComponent(value));
                } catch {
                    filters[key] = decodeURIComponent(value);
                }
            }
        });

        return filters;
    };

    const getCurrentPagination = () => {
        // Use client-side searchParams for real-time updates
        const page = searchParams.get("page");
        const limit = searchParams.get("limit") || searchParams.get("pageSize");

        return {
            page: page ? parseInt(page) : 1,
            pageSize: limit ? parseInt(limit) : 10,
        };
    };

    // CRUD Handlers for API integration
    const handleCreate = async (record: Partial<Permission>): Promise<Permission> => {
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/permissions`;
            const token = await getCookie("token");

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(record),
            });

            const apiData = await response.json();
            return apiData.data;
        } catch (error) {
            console.error("Error creating permission:", error);
            throw new Error("Failed to create permission. Please try again.");
        }
    };

    const handleUpdate = async (record: Permission): Promise<Permission> => {
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/permissions/${record.id}`;
            const token = await getCookie("token");

            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(record),
            });

            const apiData = await response.json();
            return apiData.data;
        } catch (error) {
            console.error("Error updating permission:", error);
            throw new Error("Failed to update permission. Please try again.");
        }
    };

    const handleDelete = async (record: Permission): Promise<Permission> => {
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/permissions/${record.id}`;
            const token = await getCookie("token");

            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Delete failed");
            }

            return record;
        } catch (error) {
            console.error("Error deleting permission:", error);
            throw new Error("Failed to delete permission. Please try again.");
        }
    };

    // Enhanced filter handler that uses current URL state
    const handleFilter = async (data: Permission[], filters: Record<string, any>): Promise<any> => {
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/permissions`;
            const token = await getCookie("token");

            // Build query parameters
            const queryParams = new URLSearchParams();

            // Add pagination from filters or use current URL state
            if (filters._pagination) {
                queryParams.append("page", filters._pagination.page.toString());
                queryParams.append("limit", filters._pagination.pageSize.toString());
            } else {
                // Use current URL state for pagination
                const currentPagination = getCurrentPagination();
                queryParams.append("page", currentPagination.page.toString());
                queryParams.append("limit", currentPagination.pageSize.toString());
            }

            // Add other filters (exclude pagination)
            Object.entries(filters).forEach(([key, value]) => {
                if (value && key !== "_pagination") {
                    queryParams.append(key, value.toString());
                }
            });

            // Also include current URL filters that aren't overridden
            const currentFilters = getCurrentFilters();
            Object.entries(currentFilters).forEach(([key, value]) => {
                if (!queryParams.has(key) && value) {
                    queryParams.append(key, value.toString());
                }
            });

            console.log("API Query:", `${url}?${queryParams.toString()}`);

            const response = await fetch(`${url}?${queryParams.toString()}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const apiResponse = await response.json();
            console.log("API Response:", apiResponse);

            // Return the full API response structure so QuickUI can handle it properly
            return {
                data: {
                    list: apiResponse.data?.list || apiResponse.data || [],
                    meta: apiResponse.data?.meta ||
                        apiResponse.meta || {
                            totalItems: apiResponse.data?.length || apiResponse.meta?.totalItems || 0,
                            itemCount: apiResponse.data?.length || apiResponse.meta?.itemCount || 0,
                            itemsPerPage: apiResponse.meta?.itemsPerPage || 5,
                            totalPages: apiResponse.meta?.totalPages || 1,
                            currentPage: apiResponse.meta?.currentPage || 1,
                            hasNextPage: apiResponse.meta?.hasNextPage || false,
                            hasPreviousPage: apiResponse.meta?.hasPreviousPage || false,
                        },
                    links: apiResponse.data?.links || apiResponse.links || {},
                },
            };
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
                initialData={data.data}
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
