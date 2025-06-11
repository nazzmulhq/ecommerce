"use server";

import { Permission } from "@components/modules/configuration/permission";
import { getCookie } from "@lib/actions";
import { revalidateTag } from "next/cache";

interface PermissionFilter {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: string;
    _revalidate?: boolean;
}

export async function fetchPermissions(filters: PermissionFilter = {}) {
    try {
        // Build query parameters from filters object
        const { _revalidate, ...filterParams } = filters;
        const queryParams = new URLSearchParams(filterParams as Record<string, string>);
        const queryString = queryParams.toString();
        const url = `${process.env.NEXT_PUBLIC_API_URL}/permissions?${queryString}`;

        // Get the token from cookies
        const token = await getCookie("token");

        // Revalidate cache if requested
        if (_revalidate) {
            revalidateTag("permissions");
        }

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            next: {
                tags: ["permissions"],
                revalidate: _revalidate ? 0 : 60, // Force fresh data if revalidating
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error fetching permissions:", error);
        return {
            data: {
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
                links: {},
            },
        };
    }
}

export async function createPermission(permissionData: any) {
    try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/permissions`;
        const token = await getCookie("token");

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(permissionData),
        });

        if (!response.ok) {
            throw new Error("Failed to create permission");
        }

        const result = await response.json();

        // Revalidate permissions cache
        revalidateTag("permissions");

        return result;
    } catch (error) {
        console.error("Error creating permission:", error);
        throw error;
    }
}

export async function updatePermission(permissionData: Permission) {
    try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/permissions/${permissionData.id}`;
        const token = await getCookie("token");

        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(permissionData),
        });

        if (!response.ok) {
            throw new Error("Failed to update permission");
        }

        const result = await response.json();

        // Revalidate permissions cache
        revalidateTag("permissions");

        return result;
    } catch (error) {
        console.error("Error updating permission:", error);
        throw error;
    }
}

export async function deletePermission(permissionId: string) {
    try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/permissions/${permissionId}`;
        const token = await getCookie("token");

        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to delete permission");
        }

        const result = await response.json();

        // Revalidate permissions cache
        revalidateTag("permissions");

        return result;
    } catch (error) {
        console.error("Error deleting permission:", error);
        throw error;
    }
}

export async function fetchPermissionById(permissionId: number) {
    try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/permissions/${permissionId}`;
        const token = getCookie("token");

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch permission");
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching permission by ID:", error);
        throw error;
    }
}
