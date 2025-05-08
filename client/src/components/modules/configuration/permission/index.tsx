"use client";

import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Card, Input, Select, Table, Typography } from "antd";
import { FC } from "react";

const { Title } = Typography;
const { Option } = Select;

export interface IPermissions {}

const Permissions: FC<IPermissions> = () => {
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
        <div className="">
            <Card>
                <div className="mb-4">
                    <Title level={3}>Permissions Management</Title>
                </div>

                <div className="mb-4 flex flex-wrap items-center gap-4">
                    <Input
                        allowClear
                        placeholder="Search permissions..."
                        prefix={<SearchOutlined />}
                        style={{ width: 250 }}
                    />

                    <Select allowClear placeholder="Filter by status" style={{ width: 150 }}>
                        <Option value="active">Active</Option>
                        <Option value="inactive">Inactive</Option>
                    </Select>

                    <Button icon={<ReloadOutlined />}>Refresh</Button>
                </div>

                <Table columns={columns} dataSource={[]} rowKey="id" />
            </Card>
        </div>
    );
};

export default Permissions;
