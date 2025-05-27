"use server";

interface PermissionFilter {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: string;
}

interface Permission {
    id: string;
    name: string;
    code: string;
    description: string;
    module: string;
    status: "active" | "inactive";
}

export async function getPermissions(filters: PermissionFilter = {}) {
    try {
        // Default values
        const page = filters.page || 1;
        const pageSize = filters.pageSize || 10;
        const search = filters.search || "";
        const status = filters.status || "";

        // You would replace this with your actual API call
        // For example:
        // const response = await fetch(`${process.env.API_URL}/permissions?page=${page}&pageSize=${pageSize}&search=${search}&status=${status}`);
        // const result = await response.json();

        // Mock data for demonstration
        const mockPermissions: Permission[] = [
            {
                id: "1",
                name: "View Users",
                code: "VIEW_USERS",
                description: "Can view users",
                module: "User",
                status: "active",
            },
            {
                id: "2",
                name: "Create Users",
                code: "CREATE_USERS",
                description: "Can create users",
                module: "User",
                status: "active",
            },
            {
                id: "3",
                name: "Edit Users",
                code: "EDIT_USERS",
                description: "Can edit users",
                module: "User",
                status: "inactive",
            },
            // Add more mock data as needed
        ];

        // Filter by search term if provided
        const filteredData = mockPermissions.filter(p => {
            const matchesSearch =
                !search ||
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.code.toLowerCase().includes(search.toLowerCase()) ||
                p.description.toLowerCase().includes(search.toLowerCase());

            const matchesStatus = !status || p.status === status;

            return matchesSearch && matchesStatus;
        });

        // Calculate pagination
        const total = filteredData.length;
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const paginatedData = filteredData.slice(start, end);

        return {
            data: paginatedData,
            total,
        };
    } catch (error) {
        console.error("Error fetching permissions:", error);
        return {
            data: [],
            total: 0,
        };
    }
}
