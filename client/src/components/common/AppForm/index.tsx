"use client";
import { Button, Form, Input, Select, Space } from "antd";
import { FC, useState } from "react";

export interface IAppForm {}

interface FieldConfig {
    name: string;
    label: string;
    type: "input" | "select";
    options?: { label: string; value: string }[];
    dependencies?: string[];
    showIf?: (values: any) => boolean;
    rules?: any[];
}

const fieldList: FieldConfig[] = [
    {
        name: "username",
        label: "Username",
        type: "input",
        rules: [{ required: true, message: "Username is required" }],
    },
    {
        name: "role",
        label: "Role",
        type: "select",
        options: [
            { label: "User", value: "user" },
            { label: "Admin", value: "admin" },
        ],
        rules: [{ required: true, message: "Role is required" }],
    },
    {
        name: "department",
        label: "Department",
        type: "select",
        options: [
            { label: "Engineering", value: "engineering" },
            { label: "HR", value: "hr" },
        ],
        dependencies: ["role"],
        showIf: values => values.role === "admin",
        rules: [{ required: true, message: "Department is required for Admin" }],
    },
    {
        name: "note",
        label: "Note",
        type: "input",
        dependencies: ["role"],
        showIf: values => values.role === "user",
    },
];

const AppForm: FC<IAppForm> = () => {
    const [form] = Form.useForm();
    const [fields, setFields] = useState<any>({});

    const onValuesChange = (changed: any, all: any) => {
        setFields(all);
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onValuesChange={onValuesChange}
            onFinish={values => {
                // handle submit
                console.log(values);
            }}
        >
            {fieldList.map(field => {
                // Handle dependencies and conditional rendering
                if (field.dependencies && field.showIf && !field.showIf(fields)) {
                    return null;
                }
                if (field.type === "input") {
                    return (
                        <Form.Item key={field.name} name={field.name} label={field.label} rules={field.rules}>
                            <Input />
                        </Form.Item>
                    );
                }
                if (field.type === "select") {
                    return (
                        <Form.Item key={field.name} name={field.name} label={field.label} rules={field.rules}>
                            <Select options={field.options} />
                        </Form.Item>
                    );
                }
                return null;
            })}
            {/* Dynamic Form.List example */}
            <Form.List name="users">
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(field => (
                            <Space key={field.key} align="baseline">
                                <Form.Item
                                    name={[field.name, "first"]}
                                    rules={[{ required: true, message: "First name required" }]}
                                >
                                    <Input placeholder="First Name" />
                                </Form.Item>
                                <Form.Item
                                    name={[field.name, "last"]}
                                    rules={[{ required: true, message: "Last name required" }]}
                                >
                                    <Input placeholder="Last Name" />
                                </Form.Item>
                                <Button onClick={() => remove(field.name)} danger>
                                    Remove
                                </Button>
                            </Space>
                        ))}
                        <Form.Item>
                            <Button type="dashed" onClick={() => add()} block>
                                Add User
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

export default AppForm;
