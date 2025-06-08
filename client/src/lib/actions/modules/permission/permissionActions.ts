"use server";

import { getCookie } from "@lib/actions";

interface PermissionFilter {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: string;
}

export async function fetchPermissions(filters: PermissionFilter = {}) {
    try {
        // Build query parameters from filters object
        const queryParams = new URLSearchParams(filters as Record<string, string>);
        const queryString = queryParams.toString();
        const url = `${process.env.NEXT_PUBLIC_API_URL}/permissions`;

        // Get the token from cookies
        const token = getCookie("token");

        // You would replace this with your actual API call
        // For example:
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            // Include query parameters in the request
            body: JSON.stringify(filters),
        });
        const result = await response.json();

        return result;
    } catch (error) {
        console.error("Error fetching permissions:", error);
        return {
            data: [],
            total: 0,
        };
    }
}

export async function createPermission(permissionData: any) {
    try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/permissions`;
        const token = getCookie("token");

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

        return await response.json();
    } catch (error) {
        console.error("Error creating permission:", error);
        throw error;
    }
}

export async function updatePermission(permissionId: number, permissionData: any) {
    try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/permissions/${permissionId}`;
        const token = getCookie("token");

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

        return await response.json();
    } catch (error) {
        console.error("Error updating permission:", error);
        throw error;
    }
}

export async function deletePermission(permissionId: number) {
    try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/permissions/${permissionId}`;
        const token = getCookie("token");

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

        return await response.json();
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
