"use client";

import { Button, Checkbox, Form, Input, message, Typography } from "antd";
import { useState } from "react";

const { Title } = Typography;

export default function LoginPage() {
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: any) => {
        const { email, password } = values;
        setLoading(true);

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error(`Invalid credentials. Status: ${response.status}`);
            }

            const { message: successMessage } = await response.json();
            message.success(successMessage);
            window.location.href = "/";
        } catch (error: any) {
            message.error(error.message || "An error occurred. Please try again.");
            console.error("Login error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                <div>
                    <Title className="text-center" level={3}>
                        Sign in to your account
                    </Title>
                </div>

                <Form className="mt-8 space-y-6" layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        label="Email address"
                        name="email"
                        rules={[
                            { required: true, message: "Please input your email!" },
                            { type: "email", message: "Please enter a valid email!" },
                        ]}
                    >
                        <Input defaultValue="john.doe@gmail.com" placeholder="Email address" />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: "Please input your password!" }]}
                    >
                        <Input.Password defaultValue="password" placeholder="Password" />
                    </Form.Item>

                    <Form.Item>
                        <div className="flex items-center justify-between">
                            <Checkbox name="remember-me">Remember me</Checkbox>
                            <a className="font-medium text-indigo-600 hover:text-indigo-500" href="#">
                                Forgot your password?
                            </a>
                        </div>
                    </Form.Item>

                    <Form.Item>
                        <Button className="w-full" htmlType="submit" loading={loading} type="primary">
                            Sign in
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}
