"use client";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import AppContainer from "@components/common/AppContainer";
import AppForm from "@components/common/AppForm";
import { FormSchema } from "@components/common/AppForm/form.type";
import { Button, message, Modal, Space, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { FC, useState } from "react";

// Define Permission interface
interface Permission {
    id: string;
    name: string;
}

export interface IPermissions {}

// Create a form schema specific for permissions
const permissionFormSchema: FormSchema = {
    fields: [
        {
            name: "name",
            label: "Permission Name",
            type: "input",
            rules: [{ required: true, message: "Please input the permission name!" }],
            placeholder: "Enter permission name",
        },
    ],
};

const Permissions: FC<IPermissions> = () => {
    // State for permissions list
    const [permissions, setPermissions] = useState<Permission[]>([{ id: "1", name: "create" }]);
    const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
    const [isFormVisible, setIsFormVisible] = useState(false);

    // CRUD operations
    const createPermission = (permission: Omit<Permission, "id">) => {
        const newPermission = {
            id: Date.now().toString(),
            ...permission,
        };
        setPermissions([...permissions, newPermission]);
        message.success("Permission created successfully");
        setIsFormVisible(false);
    };

    const updatePermission = (values: Partial<Permission>) => {
        if (!editingPermission) return;

        setPermissions(permissions.map(p => (p.id === editingPermission.id ? { ...p, ...values } : p)));
        message.success("Permission updated successfully");
        setEditingPermission(null);
        setIsFormVisible(false);
    };

    const deletePermission = (id: string) => {
        setPermissions(permissions.filter(p => p.id !== id));
        message.success("Permission deleted successfully");
    };

    // Table columns
    const columns: ColumnsType = [
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
            title: "Actions",
            key: "actions",
            width: 150,
            fixed: "right",
            render: (_, record: Permission) => (
                <Space>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => {
                            setEditingPermission(record);
                            setIsFormVisible(true);
                        }}
                        type="primary"
                    />
                    <Button danger icon={<DeleteOutlined />} onClick={() => deletePermission(record.id)} />
                </Space>
            ),
        },
    ];

    const handleFormSubmit = (values: any) => {
        if (editingPermission) {
            updatePermission(values);
        } else {
            createPermission(values);
        }
    };

    return (
        <AppContainer
            title="Permissions Management"
            extra={[
                {
                    key: 1,
                    position: 1,
                    title: "Add Permission",
                    type: "primary",
                    children: "Add Permission",
                    onClick: () => {
                        setEditingPermission(null);
                        setIsFormVisible(true);
                    },
                },
            ]}
        >
            <Modal
                title={editingPermission ? "Edit Permission" : "Add Permission"}
                open={isFormVisible}
                onCancel={() => {
                    setIsFormVisible(false);
                    setEditingPermission(null);
                }}
                footer={null}
            >
                <AppForm
                    schema={permissionFormSchema}
                    onFinish={handleFormSubmit}
                    initialValues={editingPermission || undefined}
                />
            </Modal>

            <Table dataSource={permissions} columns={columns} rowKey="id" />
        </AppContainer>
    );
};

export default Permissions;
