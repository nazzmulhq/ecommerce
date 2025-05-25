"use client";

import { ReloadOutlined, SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, DatePicker, Input, Select, Space, Table, Typography } from "antd";
import { FC, useState } from "react";

const { Title } = Typography;
const { Option } = Select;

export interface IPermissions {}

const Permissions: FC<IPermissions> = () => {
    const [pageSize, setPageSize] = useState(10);

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
                <span className={status === "active" ? "text-green-500" : "text-red-500"}>{status?.toUpperCase()}</span>
            ),
        },
    ];

    // Example extra actions
    const extraActions = [
        <Button key="add" type="primary" icon={<PlusOutlined />}>
            Add Permission
        </Button>,
        <Button key="refresh" icon={<ReloadOutlined />}>
            Refresh
        </Button>,
    ];

    return (
        <Card
            title={<Title level={4} style={{ margin: 0 }}>Permissions Management</Title>}
            extra={<Space>{extraActions}</Space>}
        >
            <Space style={{ marginBottom: 16, flexWrap: "wrap" }}>
                <Input
                    allowClear
                    placeholder="Search permissions..."
                    prefix={<SearchOutlined />}
                    style={{ width: 220 }}
                />
                <DatePicker allowClear style={{ width: 180 }} format="YYYY-MM-DD" />
                <Select allowClear placeholder="Filter by status" style={{ width: 140 }}>
                    <Option value="active">Active</Option>
                    <Option value="inactive">Inactive</Option>
                </Select>
            </Space>
            <Table
                columns={columns}
                dataSource={[]}
                rowKey="id"
                pagination={{
                    showSizeChanger: true,
                    pageSize,
                    pageSizeOptions: ["5", "10", "20", "50"],
                    onShowSizeChange: (_, size) => setPageSize(size),
                }}
                rowSelection={{
                    type: "checkbox",
                }}
            />
        </Card>
    );
};

export default Permissions;
