"use client";

import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { getPermissions } from "@lib/actions/permission/permissionActions";
import { Button, Card, Input, Select, Table, Typography } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";

const { Title } = Typography;
const { Option } = Select;

interface Permission {
    id: string;
    name: string;
    code: string;
    description: string;
    module: string;
    status: "active" | "inactive";
}

interface FilterParams {
    page: number;
    pageSize: number;
    search: string;
    status: string;
}

export interface IPermissions {
    initialData?: Permission[];
    totalItems?: number;
    initialFilters?: FilterParams;
}

const Permissions: FC<IPermissions> = ({
    initialData = [],
    totalItems = 0,
    initialFilters = { page: 1, pageSize: 10, search: "", status: "" },
}) => {
    const router = useRouter();
    const pathname = usePathname();

    const [data, setData] = useState<Permission[]>(initialData);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState<FilterParams>(initialFilters);
    const [total, setTotal] = useState(totalItems);

    // Update the URL when filters change
    useEffect(() => {
        const params = new URLSearchParams();

        if (filters.page > 1) {
            params.set("page", filters.page.toString());
        }
        if (filters.pageSize !== 10) {
            params.set("pageSize", filters.pageSize.toString());
        }
        if (filters.search) {
            params.set("search", filters.search);
        }
        if (filters.status) {
            params.set("status", filters.status);
        }

        const queryString = params.toString();
        const url = queryString ? `${pathname}?${queryString}` : pathname;

        router.push(url);
    }, [filters, pathname, router]);

    // Handle table pagination change
    const handleTableChange = async (pagination: any) => {
        const newFilters = {
            ...filters,
            page: pagination.current,
            pageSize: pagination.pageSize,
        };

        setFilters(newFilters);
        await refreshData(newFilters);
    };

    // Handle search input change
    const handleSearch = (value: string) => {
        const newFilters = {
            ...filters,
            search: value,
            page: 1, // Reset to first page on new search
        };

        setFilters(newFilters);
        refreshData(newFilters);
    };

    // Handle status filter change
    const handleStatusChange = (value: string) => {
        const newFilters = {
            ...filters,
            status: value,
            page: 1, // Reset to first page on new filter
        };

        setFilters(newFilters);
        refreshData(newFilters);
    };

    // Refresh data based on filters
    const refreshData = async (filterParams = filters) => {
        setLoading(true);

        try {
            const { data: newData, total: newTotal } = await getPermissions(filterParams);
            setData(newData);
            setTotal(newTotal);
        } catch (error) {
            console.error("Failed to fetch permissions:", error);
        } finally {
            setLoading(false);
        }
    };

    // Define table columns
    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Code",
            dataIndex: "code",
            key: "code",
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Module",
            dataIndex: "module",
            key: "module",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: string) => (
                <span className={status === "active" ? "text-green-500" : "text-red-500"}>{status.toUpperCase()}</span>
            ),
        },
    ];

    return (
        <div className="p-4">
            <Card>
                <div className="mb-4">
                    <Title level={3}>Permissions Management</Title>
                </div>

                <div className="mb-4 flex flex-wrap items-center gap-4">
                    <Input
                        allowClear
                        onChange={e => handleSearch(e.target.value)}
                        placeholder="Search permissions..."
                        prefix={<SearchOutlined />}
                        style={{ width: 250 }}
                        value={filters.search}
                    />

                    <Select
                        allowClear
                        onChange={handleStatusChange}
                        placeholder="Filter by status"
                        style={{ width: 150 }}
                        value={filters.status || undefined}
                    >
                        <Option value="active">Active</Option>
                        <Option value="inactive">Inactive</Option>
                    </Select>

                    <Button icon={<ReloadOutlined />} loading={loading} onClick={() => refreshData()}>
                        Refresh
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={data}
                    loading={loading}
                    onChange={handleTableChange}
                    pagination={{
                        current: filters.page,
                        pageSize: filters.pageSize,
                        total,
                        showSizeChanger: true,
                        pageSizeOptions: ["10", "20", "50", "100"],
                        showTotal: total => `Total ${total} items`,
                    }}
                    rowKey="id"
                />
            </Card>
        </div>
    );
};

export default Permissions;
