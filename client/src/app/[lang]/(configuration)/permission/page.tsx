"use client";

import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table, Tag } from "antd";
import { FC, useEffect, useState } from "react";

export interface IPage {}

interface Permission {
    id: number;
    name: string;
    description: string;
    module: string;
    createdAt: string;
    status: "active" | "inactive";
}

const Page: FC<IPage> = () => {
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchText, setSearchText] = useState<string>("");

    // Mock data - replace with actual API call
    useEffect(() => {
        // Simulating API call
        setTimeout(() => {
            const mockPermissions = [
                {
                    id: 1,
                    name: "user.create",
                    description: "Can create new users",
                    module: "User Management",
                    createdAt: "2023-05-15",
                    status: "active" as const,
                },
                {
                    id: 2,
                    name: "user.view",
                    description: "Can view user details",
                    module: "User Management",
                    createdAt: "2023-05-15",
                    status: "active" as const,
                },
                {
                    id: 3,
                    name: "user.update",
                    description: "Can update user information",
                    module: "User Management",
                    createdAt: "2023-05-15",
                    status: "active" as const,
                },
                {
                    id: 4,
                    name: "product.create",
                    description: "Can create new products",
                    module: "Product Management",
                    createdAt: "2023-05-16",
                    status: "active" as const,
                },
                {
                    id: 5,
                    name: "product.delete",
                    description: "Can delete products",
                    module: "Product Management",
                    createdAt: "2023-05-16",
                    status: "inactive" as const,
                },
            ];

            setPermissions(mockPermissions);
            setLoading(false);
        }, 1000);
    }, []);

    const filteredPermissions = permissions.filter(
        permission =>
            permission.name.toLowerCase().includes(searchText.toLowerCase()) ||
            permission.description.toLowerCase().includes(searchText.toLowerCase()) ||
            permission.module.toLowerCase().includes(searchText.toLowerCase()),
    );

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Permission Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
        },

        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: string) => <Tag color={status === "active" ? "green" : "red"}>{status.toUpperCase()}</Tag>,
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            key: "createdAt",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: Permission) => (
                <Space size="middle">
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => console.log("Edit permission", record.id)}
                        size="small"
                        type="primary"
                    >
                        Edit
                    </Button>
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => console.log("Delete permission", record.id)}
                        size="small"
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <main className="p-2">
            <div className="flex justify-between mb-4">
                <Input
                    onChange={e => setSearchText(e.target.value)}
                    placeholder="Search permissions"
                    prefix={<SearchOutlined />}
                    style={{ width: 300 }}
                    value={searchText}
                />
                <Button icon={<PlusOutlined />} onClick={() => console.log("Add new permission")} type="primary">
                    Add Permission
                </Button>
            </div>
            <Table
                bordered
                columns={columns}
                dataSource={filteredPermissions}
                loading={loading}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    pageSizeOptions: ["10", "20", "50"],
                    showTotal: total => `Total ${total} permissions`,
                }}
                rowKey="id"
            />
        </main>
    );
};

export default Page;
