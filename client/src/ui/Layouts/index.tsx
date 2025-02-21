"use client";
import {
    AppstoreOutlined,
    ArrowLeftOutlined,
    BarChartOutlined,
    CloudOutlined,
    ShopOutlined,
    TeamOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Breadcrumb, Button, Layout, Menu, theme, Typography } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const { Header, Content, Footer, Sider } = Layout;

const siderStyle: React.CSSProperties = {
    overflow: "auto",
    height: "100vh",
    position: "sticky",
    insetInlineStart: 0,
    top: 0,
    bottom: 0,
    scrollbarWidth: "thin",
    scrollbarGutter: "stable",
};

const items: MenuProps["items"] = [
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
    BarChartOutlined,
    CloudOutlined,
    AppstoreOutlined,
    TeamOutlined,
    ShopOutlined,
].map((icon, index) => ({
    key: String(index + 1),
    icon: React.createElement(icon),
    label: `nav ${index + 1}`,
}));

interface ILayoutsProps {
    children: React.ReactNode;
}

const Layouts: React.FC<ILayoutsProps> = ({ children }) => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const pathname = usePathname();
    const pathSnippets = pathname.split("/");
    const breadcrumbItems = pathSnippets.map((path, index, total) => {
        const url = `${pathSnippets.slice(0, index + 1).join("/")}`;
        let title: string | React.ReactNode = path;
        if (index === 0) {
            title = (
                <Link className="capitalize" href="/">
                    Home
                </Link>
            );
        } else if (index === total.length - 1) {
            title = path.replace(/-/g, " ");
        } else {
            title = (
                <Link className="capitalize" href={url}>
                    {path}
                </Link>
            );
        }
        return {
            key: String(index + 1),
            title: title,
        };
    });

    return (
        <Layout>
            <Header
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "white",
                }}
            >
                <Typography.Title level={3} style={{ color: "black", margin: 0 }}>
                    MyApp
                </Typography.Title>
                <Menu defaultSelectedKeys={["2"]} items={items} mode="horizontal" theme="light" />
            </Header>
            <Layout hasSider>
                <Sider style={siderStyle}>
                    <div className="demo-logo-vertical bg-accent" />
                    <Menu defaultSelectedKeys={["4"]} items={items} mode="inline" theme="dark" />
                </Sider>
                <Layout>
                    <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
                        <div className="flex justify-between items-center mb-5">
                            <Breadcrumb items={breadcrumbItems} />
                            <Button icon={<ArrowLeftOutlined />} type="default">
                                back
                            </Button>
                        </div>

                        <main
                            style={{
                                padding: 24,
                                textAlign: "center",
                                background: colorBgContainer,
                                borderRadius: borderRadiusLG,
                            }}
                        >
                            {children}
                        </main>
                    </Content>
                    <Footer style={{ textAlign: "center" }}>
                        Ant Design ©{new Date().getFullYear()} Created by Ant UED
                    </Footer>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default Layouts;
